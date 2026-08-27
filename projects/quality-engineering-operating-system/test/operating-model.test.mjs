import test from 'node:test';
import assert from 'node:assert/strict';
import { assessWaivers, createDecisionMatrix, validateQualityPlan } from '../src/operating-model.mjs';

test('validates a complete quality plan', () => {
  const result = validateQualityPlan({
    releaseId: 'REL-1',
    riskLevel: 'medium',
    criticalJourneys: ['checkout'],
    evidence: { api: true },
    waivers: []
  });
  assert.deepEqual(result, { valid: true, errors: [] });
});

test('reports missing and invalid quality-plan inputs', () => {
  const result = validateQualityPlan({ riskLevel: 'unknown', waivers: 'none' });
  assert.equal(result.valid, false);
  assert.ok(result.errors.length >= 4);
});

test('marks expired waivers so they cannot silently remain active', () => {
  const result = assessWaivers([
    { id: 'old', expiresAt: '2026-01-01T00:00:00Z' },
    { id: 'new', expiresAt: '2026-02-01T00:00:00Z' }
  ], new Date('2026-01-20T00:00:00Z'));
  assert.deepEqual(result.map(item => item.status), ['expired', 'active']);
});

test('exposes accountable owners for each quality concern', () => {
  const matrix = createDecisionMatrix();
  assert.ok(matrix.length >= 5);
  assert.ok(matrix.every(row => row.accountable && row.decisionRule));
});
