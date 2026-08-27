import { validateMessage } from './contracts.mjs';
import { retryDecision } from './retry-policy.mjs';

export class IdempotencyStore {
  #records = new Map();

  has(key) {
    return this.#records.has(key);
  }

  get(key) {
    return this.#records.get(key);
  }

  set(key, value) {
    this.#records.set(key, value);
  }

  get size() {
    return this.#records.size;
  }
}

export class MessageProcessor {
  constructor({ handler, maxAttempts = 3, idempotencyStore = new IdempotencyStore() } = {}) {
    this.handler = handler ?? (() => ({ status: 202 }));
    this.maxAttempts = maxAttempts;
    this.idempotencyStore = idempotencyStore;
    this.deadLetters = [];
  }

  process(message) {
    const validation = validateMessage(message);
    if (!validation.valid) {
      const outcome = { status: 'rejected', reason: 'contract-invalid', errors: validation.errors, attempts: 0 };
      this.deadLetters.push({ message, outcome });
      return outcome;
    }

    if (this.idempotencyStore.has(message.idempotencyKey)) {
      return { status: 'duplicate', original: this.idempotencyStore.get(message.idempotencyKey), attempts: 0 };
    }

    for (let attempt = 1; attempt <= this.maxAttempts; attempt += 1) {
      try {
        const response = this.handler(message, attempt);
        const status = Number(response?.status ?? 200);
        if (status >= 200 && status < 300) {
          const outcome = { status: 'completed', downstreamStatus: status, attempts: attempt };
          this.idempotencyStore.set(message.idempotencyKey, outcome);
          return outcome;
        }
        const error = new Error(`Downstream returned HTTP ${status}`);
        error.status = status;
        const decision = retryDecision({ error, attempt, maxAttempts: this.maxAttempts });
        if (decision.action === 'retry') continue;
        return this.#deadLetter(message, decision, attempt);
      } catch (error) {
        const decision = retryDecision({ error, attempt, maxAttempts: this.maxAttempts });
        if (decision.action === 'retry') continue;
        return this.#deadLetter(message, decision, attempt);
      }
    }
    return this.#deadLetter(message, { reason: 'retry-budget-exhausted' }, this.maxAttempts);
  }

  #deadLetter(message, decision, attempts) {
    const outcome = { status: 'dead-lettered', reason: decision.reason, attempts };
    this.deadLetters.push({ message, outcome });
    return outcome;
  }
}
