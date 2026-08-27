import test from 'node:test';
import assert from 'node:assert/strict';
import { scoreChange, selectTestPortfolio } from '../src/risk-engine.mjs';

test('scores a high-surface change and keeps the score bounded', () => {
  const result = scoreChange({
    businessCriticality: 'critical',
    dataSensitivity: 'critical',
    blastRadius: 'critical',
    changeAreas: ['api', 'data', 'authentication', 'payments'],
    externalDependency: true,
    userJourneyImpact: true
  });
  assert.equal(result.band, 'critical');
  assert.ok(result.score <= 100);
  assert.ok(result.score >= 80);
});

test('uses conservative defaults for missing fields', () => {
  const result = scoreChange({});
  assert.equal(result.band, 'medium');
  assert.ok(result.factors.some(factor => factor.name === 'business criticality'));
});

test('selects deeper suites as risk increases', () => {
  const low = selectTestPortfolio({ businessCriticality: 'low', dataSensitivity: 'low', blastRadius: 'low' });
  const high = selectTestPortfolio({
    businessCriticality: 'critical',
    dataSensitivity: 'high',
    blastRadius: 'critical',
    changeAreas: ['api', 'data', 'authentication'],
    externalDependency: true,
    userJourneyImpact: true
  });
  assert.ok(high.suites.length > low.suites.length);
  assert.ok(high.suites.includes('resilience'));
});
