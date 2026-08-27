export class HttpError extends Error {
  constructor(status, message = `HTTP ${status}`, details = {}) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.details = details;
  }
}

const defaultRetryableStatuses = new Set([408, 425, 429, 500, 502, 503, 504]);

export function isRetryable(error, statuses = defaultRetryableStatuses) {
  return Boolean(error && statuses.has(Number(error.status)));
}

export function backoffDelay(attempt, schedule = [100, 300, 1000, 3000, 10000]) {
  const index = Math.max(0, Math.min(Math.trunc(attempt) - 1, schedule.length - 1));
  return schedule[index];
}

export function retryDecision({ error, attempt, maxAttempts = 3, statuses } = {}) {
  if (!isRetryable(error, statuses)) return { action: 'dead-letter', delayMs: 0, reason: 'non-retryable-error' };
  if (attempt >= maxAttempts) return { action: 'dead-letter', delayMs: 0, reason: 'retry-budget-exhausted' };
  return { action: 'retry', delayMs: backoffDelay(attempt), reason: 'retryable-error' };
}
