import test from 'node:test';
import assert from 'node:assert/strict';
import { validateMessage } from '../src/contracts.mjs';

const validMessage = {
  eventId: 'evt-1',
  idempotencyKey: 'key-1',
  eventType: 'profile.updated',
  emittedAt: '2026-01-15T10:00:00.000Z',
  payload: { entityId: 'entity-1', email: 'a@example.test' }
};

test('accepts a valid envelope and event payload', () => {
  assert.deepEqual(validateMessage(validMessage), { valid: true, errors: [] });
});

test('reports missing envelope and payload fields', () => {
  const result = validateMessage({ ...validMessage, eventId: '', payload: {} });
  assert.equal(result.valid, false);
  assert.ok(result.errors.some(error => error.includes('eventId')));
  assert.ok(result.errors.some(error => error.includes('entityId')));
});

test('rejects invalid timestamps and payload types', () => {
  const result = validateMessage({ ...validMessage, emittedAt: 'not-a-date', payload: [] });
  assert.equal(result.valid, false);
  assert.ok(result.errors.length >= 2);
});
