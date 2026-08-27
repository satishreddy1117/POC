import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSyntheticRecords } from '../src/synthetic-data.mjs';

test('generates deterministic reserved-domain records', () => {
  const first = generateSyntheticRecords({ count: 3, seed: 7 });
  const second = generateSyntheticRecords({ count: 3, seed: 7 });
  assert.deepEqual(first, second);
  assert.equal(first.length, 3);
  assert.ok(first.every(record => record.email.endsWith('@example.test')));
  assert.ok(first.every(record => record.source === 'synthetic-generator'));
});

test('supports an empty dataset', () => {
  assert.deepEqual(generateSyntheticRecords({ count: 0 }), []);
});
