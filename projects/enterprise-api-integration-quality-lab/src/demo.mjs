import { MessageProcessor } from './message-processor.mjs';
import { HttpError } from './retry-policy.mjs';

let calls = 0;
const processor = new MessageProcessor({
  maxAttempts: 3,
  handler: (message) => {
    calls += 1;
    if (message.eventType === 'profile.updated' && calls < 3) throw new HttpError(503, 'Temporary dependency outage');
    return { status: 202 };
  }
});

const message = {
  eventId: 'evt-1001',
  idempotencyKey: 'profile-1001-v2',
  eventType: 'profile.updated',
  emittedAt: '2026-01-15T10:00:00.000Z',
  payload: { entityId: 'entity-1001', email: 'alex@example.test' }
};

const first = processor.process(message);
const duplicate = processor.process(message);
const invalid = processor.process({ ...message, idempotencyKey: 'invalid-1001', payload: {} });

console.log(JSON.stringify({ first, duplicate, invalid, downstreamCalls: calls, deadLetters: processor.deadLetters.length }, null, 2));
