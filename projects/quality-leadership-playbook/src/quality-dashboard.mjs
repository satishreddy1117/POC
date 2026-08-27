function statusFor(value, good, watch) {
  if (value >= good) return 'green';
  if (value >= watch) return 'amber';
  return 'red';
}

export function buildQualitySnapshot(metrics = {}) {
  const snapshot = [
    { id: 'pass-rate', label: 'Pass rate', value: metrics.passRate ?? 0, unit: '%', status: statusFor(metrics.passRate ?? 0, 95, 85) },
    { id: 'automation-rate', label: 'Automation rate', value: metrics.automationRate ?? 0, unit: '%', status: statusFor(metrics.automationRate ?? 0, 80, 60) },
    { id: 'evidence-completeness', label: 'Evidence completeness', value: metrics.evidenceCompleteness ?? 0, unit: '%', status: statusFor(metrics.evidenceCompleteness ?? 0, 95, 80) },
    { id: 'escaped-defects', label: 'Escaped defects', value: metrics.escapedDefects ?? 0, unit: 'count', status: (metrics.escapedDefects ?? 0) === 0 ? 'green' : (metrics.escapedDefects ?? 0) <= 2 ? 'amber' : 'red' }
  ];
  const red = snapshot.filter(item => item.status === 'red').length;
  const amber = snapshot.filter(item => item.status === 'amber').length;
  return { overall: red ? 'red' : amber ? 'amber' : 'green', metrics: snapshot };
}

export function snapshotNarrative(snapshot) {
  const label = snapshot.overall === 'green' ? 'healthy' : snapshot.overall === 'amber' ? 'requires attention' : 'requires an immediate decision';
  return `The quality snapshot is ${label}; ${snapshot.metrics.filter(item => item.status !== 'green').length} metric(s) need review.`;
}
