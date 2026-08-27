const defaultWeights = {
  functional: 0.3,
  integration: 0.2,
  security: 0.2,
  performance: 0.1,
  observability: 0.1,
  data: 0.1
};

function signalScore(signal = {}) {
  if (signal.status === 'pass') return 1;
  if (signal.status === 'warn') return 0.65;
  return 0;
}

export function scoreRelease(release = {}, weights = defaultWeights) {
  const signals = release.signals ?? {};
  const checks = Object.entries(weights).map(([name, weight]) => {
    const signal = signals[name] ?? { status: 'fail', note: 'No evidence supplied.' };
    return {
      name,
      status: signal.status ?? 'fail',
      weight,
      score: signalScore(signal),
      note: signal.note ?? ''
    };
  });
  const weightedScore = checks.reduce((sum, check) => sum + check.weight * check.score, 0);
  const criticalFailures = checks.filter(check => ['functional', 'security'].includes(check.name) && check.status === 'fail');
  const failedChecks = checks.filter(check => check.status === 'fail');
  const decision = criticalFailures.length || weightedScore < 0.8 ? 'HOLD' : 'PASS';
  const recommendation = decision === 'PASS'
    ? 'Release with standard post-deployment monitoring.'
    : criticalFailures.length
      ? 'Resolve critical evidence gaps before release.'
      : 'Review failed or warning signals and record residual risk before release.';

  return {
    releaseId: release.releaseId ?? 'unknown',
    name: release.name ?? 'Unnamed release',
    decision,
    score: Math.round(weightedScore * 1000) / 1000,
    scorePercent: Math.round(weightedScore * 1000) / 10,
    checks,
    failedChecks,
    criticalFailures,
    recommendation,
    generatedAt: new Date().toISOString()
  };
}

export function summarizeReleases(releases = []) {
  return releases.map(release => scoreRelease(release));
}
