import test from 'node:test';
import assert from 'node:assert/strict';
import { buildQualitySnapshot, snapshotNarrative } from '../src/quality-dashboard.mjs';

test('builds a green snapshot when metrics meet targets', () => {
  const result = buildQualitySnapshot({ passRate: 98, automationRate: 90, evidenceCompleteness: 100, escapedDefects: 0 });
  assert.equal(result.overall, 'green');
});

test('escalates a red snapshot for weak evidence', () => {
  const result = buildQualitySnapshot({ passRate: 70, automationRate: 40, evidenceCompleteness: 60, escapedDefects: 4 });
  assert.equal(result.overall, 'red');
  assert.match(snapshotNarrative(result), /immediate decision/);
});
