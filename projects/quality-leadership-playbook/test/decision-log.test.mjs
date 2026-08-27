import test from 'node:test';
import assert from 'node:assert/strict';
import { openActions, reviewDecisions, validateDecision } from '../src/decision-log.mjs';

const entry = {
  id: 'DEC-1', decision: 'Use the selected test portfolio', context: 'Risk is high.', owner: 'Quality',
  decidedAt: '2026-01-01T00:00:00Z', reviewBy: '2026-02-01T00:00:00Z', actions: [{ description: 'Review', status: 'open' }]
};

test('validates decision records', () => {
  assert.deepEqual(validateDecision(entry), { valid: true, errors: [] });
});

test('flags invalid and due decisions', () => {
  const result = reviewDecisions([{ ...entry, reviewBy: '2026-01-01T00:00:00Z' }, { id: 'bad' }], new Date('2026-01-20T00:00:00Z'));
  assert.equal(result[0].reviewStatus, 'due');
  assert.equal(result[1].reviewStatus, 'invalid');
});

test('returns only incomplete actions', () => {
  assert.deepEqual(openActions([{ id: 'DEC-1', actions: [{ status: 'complete' }, { status: 'open', description: 'Follow up' }] }]), [{ decisionId: 'DEC-1', status: 'open', description: 'Follow up' }]);
});
