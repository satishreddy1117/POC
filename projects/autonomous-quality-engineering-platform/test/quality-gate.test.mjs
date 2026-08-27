import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateQualityGate, summarizeResults } from '../src/quality-gate.mjs';

test('passes complete evidence that meets the policy', () => {
  const result = evaluateQualityGate({
    coverage: 0.92,
    tests: [
      { status: 'passed', severity: 'critical', durationMs: 100 },
      { status: 'passed', severity: 'major', durationMs: 100 }
    ]
  });
  assert.equal(result.decision, 'PASS');
  assert.equal(result.reasons.length, 0);
});

test('holds a release when a critical test fails', () => {
  const result = evaluateQualityGate({
    coverage: 0.99,
    tests: [
      { status: 'failed', severity: 'critical', durationMs: 100 },
      { status: 'passed', severity: 'major', durationMs: 100 }
    ]
  });
  assert.equal(result.decision, 'HOLD');
  assert.ok(result.checks.find(check => check.id === 'critical-failures' && !check.passed));
});

test('summarizes flaky, blocked, and skipped results separately', () => {
  const summary = summarizeResults({
    coverage: 0.5,
    tests: [
      { status: 'passed', flaky: true, durationMs: 10 },
      { status: 'blocked', durationMs: 20 },
      { status: 'skipped', durationMs: 30 }
    ]
  });
  assert.deepEqual({ total: summary.total, flaky: summary.flaky, blocked: summary.blocked, skipped: summary.skipped }, {
    total: 3,
    flaky: 1,
    blocked: 1,
    skipped: 1
  });
});
