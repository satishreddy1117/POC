import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreRelease, summarizeReleases } from '../src/release-score.mjs';

const passing = {
  releaseId: 'REL-1',
  name: 'Example release',
  signals: {
    functional: { status: 'pass' }, integration: { status: 'pass' }, security: { status: 'pass' },
    performance: { status: 'pass' }, observability: { status: 'pass' }, data: { status: 'pass' }
  }
};

test('passes a release when weighted evidence is strong', () => {
  const result = scoreRelease(passing);
  assert.equal(result.decision, 'PASS');
  assert.equal(result.scorePercent, 100);
  assert.equal(result.failedChecks.length, 0);
});

test('holds a release for a critical functional failure', () => {
  const result = scoreRelease({ ...passing, signals: { ...passing.signals, functional: { status: 'fail', note: 'journey failed' } } });
  assert.equal(result.decision, 'HOLD');
  assert.equal(result.criticalFailures.length, 1);
  assert.match(result.recommendation, /critical/);
});

test('holds a low-scoring release even without a critical failure', () => {
  const result = scoreRelease({
    ...passing,
    signals: {
      functional: { status: 'pass' }, integration: { status: 'fail' }, security: { status: 'pass' },
      performance: { status: 'fail' }, observability: { status: 'warn' }, data: { status: 'fail' }
    }
  });
  assert.equal(result.decision, 'HOLD');
  assert.ok(result.score < 0.8);
});

test('summarizes multiple releases with independent decisions', () => {
  const result = summarizeReleases([passing, { ...passing, releaseId: 'REL-2', signals: {} }]);
  assert.deepEqual(result.map(item => item.releaseId), ['REL-1', 'REL-2']);
  assert.deepEqual(result.map(item => item.decision), ['PASS', 'HOLD']);
});
