import test from 'node:test';
import assert from 'node:assert/strict';
import { generateTestCases } from '../src/test-generator.mjs';

test('generates core and risk-specific test cases', () => {
  const cases = generateTestCases({
    id: 'REQ-1',
    text: 'As a user, update a record so that it is persisted through an external API.',
    actions: ['update'],
    risks: ['dataIntegrity', 'integration'],
    uncertain: false
  });
  assert.ok(cases.some(item => item.type === 'positive'));
  assert.ok(cases.some(item => item.type === 'data-integrity'));
  assert.ok(cases.some(item => item.type === 'resilience'));
  assert.ok(cases.every(item => item.sourceRequirement === 'REQ-1'));
});

test('adds a review case when parser uncertainty is present', () => {
  const cases = generateTestCases({ id: 'REQ-2', text: 'The system should change.', actions: [], risks: [], uncertain: true });
  assert.ok(cases.some(item => item.reviewRequired === true));
});
