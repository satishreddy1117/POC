const levelMultiplier = {
  low: 0.25,
  medium: 0.55,
  high: 0.85,
  critical: 1
};

const areaWeight = {
  ui: 8,
  api: 16,
  data: 18,
  authentication: 20,
  payments: 20,
  integration: 16,
  reporting: 10,
  configuration: 9
};

function normalizedLevel(value, fallback = 'medium') {
  return levelMultiplier[value] ? value : fallback;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function scoreChange(change = {}) {
  const factors = [];
  const criticality = normalizedLevel(change.businessCriticality, 'medium');
  factors.push({
    name: 'business criticality',
    value: criticality,
    contribution: 30 * levelMultiplier[criticality]
  });

  const sensitivity = normalizedLevel(change.dataSensitivity, 'medium');
  factors.push({
    name: 'data sensitivity',
    value: sensitivity,
    contribution: 20 * levelMultiplier[sensitivity]
  });

  const blastRadius = normalizedLevel(change.blastRadius, 'medium');
  factors.push({
    name: 'blast radius',
    value: blastRadius,
    contribution: 20 * levelMultiplier[blastRadius]
  });

  const areas = Array.isArray(change.changeAreas) ? change.changeAreas : [];
  const areaContribution = areas.reduce((total, area) => total + (areaWeight[area] ?? 6), 0);
  factors.push({
    name: 'change surface',
    value: areas.length ? areas.join(', ') : 'unspecified',
    contribution: clamp(areaContribution, 0, 30)
  });

  if (change.externalDependency === true) {
    factors.push({ name: 'external dependency', value: 'yes', contribution: 8 });
  }
  if (change.userJourneyImpact === true) {
    factors.push({ name: 'critical journey impact', value: 'yes', contribution: 8 });
  }

  const rawScore = factors.reduce((total, factor) => total + factor.contribution, 0);
  const score = Math.round(clamp(rawScore, 0, 100));
  const band = score >= 80 ? 'critical' : score >= 60 ? 'high' : score >= 35 ? 'medium' : 'low';
  return { score, band, factors };
}

export function selectTestPortfolio(change = {}) {
  const risk = scoreChange(change);
  const suites = new Set(['unit', 'api-contract']);

  if (risk.score >= 35) suites.add('component');
  if (risk.score >= 50) suites.add('integration');
  if (risk.score >= 60) suites.add('data-integrity');
  if (risk.score >= 70) suites.add('security-smoke');
  if (risk.score >= 75) suites.add('critical-journeys');
  if (risk.score >= 80) suites.add('resilience');
  if (risk.score >= 85) suites.add('performance-smoke');
  if (change.accessibilityImpact === true || risk.score >= 60) suites.add('accessibility');

  return {
    risk,
    suites: [...suites],
    rationale: `Risk band ${risk.band} selected ${suites.size} suites using the configured policy.`
  };
}
