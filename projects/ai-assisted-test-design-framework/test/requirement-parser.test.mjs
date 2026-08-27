import test from 'node:test';
import assert from 'node:assert/strict';
import { parseRequirement } from '../src/requirement-parser.mjs';

test('extracts actions, actors, conditions, and risk hints', () => {
  const result = parseRequirement({ id: 'REQ-1', text: 'As an administrator, update a record so that it is persisted. If the token expires, reject the request.' });
  assert.equal(result.id, 'REQ-1');
  assert.ok(result.actions.includes('update'));
  assert.ok(result.actors.length >= 1);
  assert.ok(result.conditions.length >= 1);
  assert.ok(result.risks.includes('authentication'));
  assert.ok(result.risks.includes('dataIntegrity'));
});

test('flags ambiguous requirements for review', () => {
  const result = parseRequirement({ id: 'REQ-2', text: 'The system should be better.' });
  assert.equal(result.uncertain, true);
});
