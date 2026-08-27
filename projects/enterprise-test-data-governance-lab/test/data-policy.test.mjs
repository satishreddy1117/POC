import test from 'node:test';
import assert from 'node:assert/strict';
import { enforcePolicy, findSensitiveFields, validateDataset } from '../src/data-policy.mjs';

const good = [{ recordId: 'SYN-1', source: 'synthetic-generator', email: 'a@example.test', address: { city: 'Demo' } }];

test('accepts synthetic test data within policy', () => {
  const result = validateDataset(good, { syntheticOnly: true, environment: 'qa', retentionDays: 30 });
  assert.equal(result.valid, true);
  assert.ok(result.sensitiveFieldPaths.includes('email'));
});

test('rejects non-synthetic records and invalid retention', () => {
  const result = validateDataset([{ source: 'imported', email: 'person@gmail.com' }], { syntheticOnly: true, environment: 'prod', retentionDays: 365 });
  assert.equal(result.valid, false);
  assert.ok(result.errors.length >= 3);
});

test('enforcePolicy throws an actionable error', () => {
  assert.throws(() => enforcePolicy([{ source: 'unknown' }], { syntheticOnly: true, environment: 'test', retentionDays: 30 }), /Test-data policy failed/);
});

test('finds nested sensitive fields', () => {
  assert.deepEqual(findSensitiveFields({ profile: { phone: '555' } }), ['profile.phone']);
});
