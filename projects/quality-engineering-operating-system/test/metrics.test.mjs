import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateQualityMetrics, metricNarrative } from '../src/metrics.mjs';

test('calculates normalized quality metrics', () => {
  const result = calculateQualityMetrics({
    plannedTests: 10,
    automatedTests: 8,
    executedTests: 10,
    passedTests: 9,
    defects: { escaped: 1, total: 5 },
    evidence: { required: 4, complete: 4 }
  });
  assert.equal(result.automationRate, 0.8);
  assert.equal(result.passRate, 0.9);
  assert.equal(result.evidenceCompleteness, 1);
  assert.ok(result.qualityIndex > 0 && result.qualityIndex < 1);
});

test('handles zero denominators without returning NaN', () => {
  const result = calculateQualityMetrics({});
  assert.ok(Object.values(result).every(value => Number.isFinite(value)));
});

test('creates a decision-oriented narrative', () => {
  const narrative = metricNarrative({ qualityIndex: 0.92, qualityIndexPercent: 92 });
  assert.match(narrative, /strong/);
});
