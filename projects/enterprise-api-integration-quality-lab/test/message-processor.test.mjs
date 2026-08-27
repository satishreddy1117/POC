import test from 'node:test';
import assert from 'node:assert/strict';
import { MessageProcessor } from '../src/message-processor.mjs';
import { HttpError } from '../src/retry-policy.mjs';

function message(key = 'key-1') {
  return {
    eventId: `event-${key}`,
    idempotencyKey: key,
    eventType: 'profile.updated',
    emittedAt: '2026-01-15T10:00:00.000Z',
    payload: { entityId: 'entity-1', email: 'a@example.test' }
  };
}

test('retries a temporary failure and completes once', () => {
  let calls = 0;
  const processor = new MessageProcessor({
    handler: () => {
      calls += 1;
      if (calls < 3) throw new HttpError(503);
      return { status: 200 };
    }
  });
  const result = processor.process(message());
  assert.deepEqual(result, { status: 'completed', downstreamStatus: 200, attempts: 3 });
  assert.equal(calls, 3);
});

test('does not repeat a completed idempotent message', () => {
  let calls = 0;
  const processor = new MessageProcessor({ handler: () => { calls += 1; return { status: 201 }; } });
  const first = processor.process(message('same-key'));
  const second = processor.process(message('same-key'));
  assert.equal(first.status, 'completed');
  assert.equal(second.status, 'duplicate');
  assert.equal(calls, 1);
});

test('dead-letters a permanent error without retrying', () => {
  let calls = 0;
  const processor = new MessageProcessor({ handler: () => { calls += 1; throw new HttpError(400); } });
  const result = processor.process(message('bad-key'));
  assert.equal(result.status, 'dead-lettered');
  assert.equal(result.reason, 'non-retryable-error');
  assert.equal(calls, 1);
  assert.equal(processor.deadLetters.length, 1);
});

test('rejects invalid messages before the downstream handler runs', () => {
  let calls = 0;
  const processor = new MessageProcessor({ handler: () => { calls += 1; return { status: 200 }; } });
  const result = processor.process({ eventId: 'bad', idempotencyKey: 'bad', eventType: 'profile.updated', payload: {} });
  assert.equal(result.status, 'rejected');
  assert.equal(calls, 0);
  assert.equal(processor.deadLetters.length, 1);
});
