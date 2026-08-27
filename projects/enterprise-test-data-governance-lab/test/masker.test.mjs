import test from 'node:test';
import assert from 'node:assert/strict';
import { maskRecord, maskValue } from '../src/masker.mjs';

test('masks common sensitive values while preserving useful shape', () => {
  assert.equal(maskValue('email', 'alex@example.test'), 'a***@example.test');
  assert.equal(maskValue('phone', '555-010-1234'), '********1234');
  assert.equal(maskValue('accountNumber', 'TEST-1234'), 'TE*****34');
});

test('masks a record without mutating the source', () => {
  const original = { fullName: 'Alex Example', email: 'alex@example.test', nested: { value: 1 } };
  const masked = maskRecord(original);
  assert.notEqual(masked, original);
  assert.equal(original.email, 'alex@example.test');
  assert.notEqual(masked.email, original.email);
  assert.deepEqual(masked.nested, original.nested);
});
