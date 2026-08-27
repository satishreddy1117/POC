import test from 'node:test';
import assert from 'node:assert/strict';
import { buildTraceability, findCoverageGaps } from '../src/traceability.mjs';

test('maps generated tests to their source requirement', () => {
  const result = buildTraceability([{ id: 'REQ-1', uncertain: false }], [{ id: 'REQ-1-POS', sourceRequirement: 'REQ-1' }]);
  assert.deepEqual(result, [{ requirementId: 'REQ-1', testCaseIds: ['REQ-1-POS'], coverage: 'covered', reviewRequired: false }]);
});

test('returns review and coverage gaps', () => {
  const result = findCoverageGaps([
    { requirementId: 'REQ-1', coverage: 'gap', reviewRequired: false },
    { requirementId: 'REQ-2', coverage: 'covered', reviewRequired: true }
  ]);
  assert.deepEqual(result.map(item => item.requirementId), ['REQ-1', 'REQ-2']);
});
