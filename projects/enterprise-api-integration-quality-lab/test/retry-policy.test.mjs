import test from 'node:test';
import assert from 'node:assert/strict';
import { backoffDelay, HttpError, isRetryable, retryDecision } from '../src/retry-policy.mjs';

test('classifies temporary HTTP failures as retryable', () => {
  assert.equal(isRetryable(new HttpError(503)), true);
  assert.equal(isRetryable(new HttpError(400)), false);
});

test('uses a bounded deterministic backoff schedule', () => {
  assert.equal(backoffDelay(1), 100);
  assert.equal(backoffDelay(3), 1000);
  assert.equal(backoffDelay(99), 10000);
});

test('stops retrying after the configured budget', () => {
  const result = retryDecision({ error: new HttpError(503), attempt: 3, maxAttempts: 3 });
  assert.deepEqual(result, { action: 'dead-letter', delayMs: 0, reason: 'retry-budget-exhausted' });
});
