function percentage(value) {
  return Math.round(value * 1000) / 10;
}

export function summarizeResults(results = {}) {
  const tests = Array.isArray(results.tests) ? results.tests : [];
  const total = tests.length;
  const passed = tests.filter(test => test.status === 'passed').length;
  const failed = tests.filter(test => test.status === 'failed').length;
  const blocked = tests.filter(test => test.status === 'blocked').length;
  const skipped = tests.filter(test => test.status === 'skipped').length;
  const flaky = tests.filter(test => test.flaky === true).length;
  const criticalFailures = tests.filter(test => test.status === 'failed' && test.severity === 'critical').length;
  const durationMs = tests.reduce((sum, test) => sum + (Number(test.durationMs) || 0), 0);

  return {
    total,
    passed,
    failed,
    blocked,
    skipped,
    flaky,
    criticalFailures,
    passRate: total ? passed / total : 0,
    flakyRate: total ? flaky / total : 0,
    durationMs,
    coverage: Number(results.coverage) || 0
  };
}

export function evaluateQualityGate(results = {}, policy = {}) {
  const summary = summarizeResults(results);
  const rules = {
    minimumPassRate: policy.minimumPassRate ?? 0.95,
    minimumCoverage: policy.minimumCoverage ?? 0.85,
    maximumFlakyRate: policy.maximumFlakyRate ?? 0.05,
    maximumDurationMs: policy.maximumDurationMs ?? 120000
  };
  const checks = [
    {
      id: 'critical-failures',
      passed: summary.criticalFailures === 0,
      actual: summary.criticalFailures,
      expected: '0',
      message: 'No critical test may fail.'
    },
    {
      id: 'pass-rate',
      passed: summary.passRate >= rules.minimumPassRate,
      actual: percentage(summary.passRate),
      expected: `>= ${percentage(rules.minimumPassRate)}%`,
      message: 'The selected portfolio must meet the minimum pass rate.'
    },
    {
      id: 'coverage',
      passed: summary.coverage >= rules.minimumCoverage,
      actual: percentage(summary.coverage),
      expected: `>= ${percentage(rules.minimumCoverage)}%`,
      message: 'Required code or requirement coverage must be present.'
    },
    {
      id: 'flaky-rate',
      passed: summary.flakyRate <= rules.maximumFlakyRate,
      actual: percentage(summary.flakyRate),
      expected: `<= ${percentage(rules.maximumFlakyRate)}%`,
      message: 'Flaky results must remain below the accepted threshold.'
    },
    {
      id: 'duration',
      passed: summary.durationMs <= rules.maximumDurationMs,
      actual: `${summary.durationMs}ms`,
      expected: `<= ${rules.maximumDurationMs}ms`,
      message: 'The selected suite must complete within the feedback budget.'
    }
  ];
  const failedRules = checks.filter(check => !check.passed);
  const decision = failedRules.length ? 'HOLD' : 'PASS';
  return {
    decision,
    summary,
    policy: rules,
    checks,
    reasons: failedRules.map(rule => `${rule.message} Actual ${rule.actual}; expected ${rule.expected}.`),
    nextActions: decision === 'PASS'
      ? ['Publish evidence with the release candidate.', 'Continue post-deployment monitoring.']
      : ['Resolve failed rules or record an approved, time-bound waiver.', 'Re-run the selected portfolio before release.']
  };
}
