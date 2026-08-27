import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeLatency, buildArrivalPlan, estimateRequests, percentile } from '../src/load-model.mjs';

test('estimates request volume from rate and duration', () => {
  assert.equal(estimateRequests({ targetRps: 12, durationSeconds: 30 }), 360);
});

test('builds a deterministic arrival plan', () => {
  const result = buildArrivalPlan({ targetRps: 2, durationSeconds: 2 });
  assert.equal(result.length, 4);
  assert.equal(result[1].scheduledAt, '2026-01-15T10:00:00.500Z');
});

test('calculates percentiles and evaluates an objective', () => {
  assert.equal(percentile([10, 20, 30, 40], 0.95), 40);
  const result = analyzeLatency([
    { durationMs: 100, statusCode: 200 },
    { durationMs: 200, statusCode: 200 },
    { durationMs: 900, statusCode: 200 }
  ], { p95Ms: 1000, maximumErrorRate: 0.01 });
  assert.equal(result.pass, true);
  assert.equal(result.errorRate, 0);
});

test('fails an objective when errors exceed the limit', () => {
  const result = analyzeLatency([{ durationMs: 10, status: 'error' }, { durationMs: 10, statusCode: 200 }], { p95Ms: 100, maximumErrorRate: 0.01 });
  assert.equal(result.pass, false);
});
