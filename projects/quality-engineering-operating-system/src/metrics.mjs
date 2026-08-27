function ratio(numerator, denominator) {
  return denominator > 0 ? numerator / denominator : 0;
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}

export function calculateQualityMetrics(input = {}) {
  const planned = Number(input.plannedTests) || 0;
  const automated = Number(input.automatedTests) || 0;
  const executed = Number(input.executedTests) || 0;
  const passed = Number(input.passedTests) || 0;
  const escaped = Number(input.defects?.escaped) || 0;
  const totalDefects = Number(input.defects?.total) || 0;
  const requiredEvidence = Number(input.evidence?.required) || 0;
  const completeEvidence = Number(input.evidence?.complete) || 0;

  const automationRate = ratio(automated, planned);
  const executionRate = ratio(executed, planned);
  const passRate = ratio(passed, executed);
  const escapedDefectRate = ratio(escaped, totalDefects);
  const evidenceCompleteness = ratio(completeEvidence, requiredEvidence);
  const score = round(Math.max(0, Math.min(1,
    automationRate * 0.2 +
    executionRate * 0.2 +
    passRate * 0.25 +
    (1 - escapedDefectRate) * 0.2 +
    evidenceCompleteness * 0.15
  )));

  return {
    automationRate: round(automationRate),
    executionRate: round(executionRate),
    passRate: round(passRate),
    escapedDefectRate: round(escapedDefectRate),
    evidenceCompleteness: round(evidenceCompleteness),
    qualityIndex: score,
    qualityIndexPercent: Math.round(score * 1000) / 10
  };
}

export function metricNarrative(metrics) {
  const trend = metrics.qualityIndex >= 0.9 ? 'strong' : metrics.qualityIndex >= 0.75 ? 'watch' : 'needs attention';
  return `The quality index is ${metrics.qualityIndexPercent}%, indicating ${trend} release evidence.`;
}
