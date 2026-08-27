function numeric(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function estimateRequests({ targetRps = 1, durationSeconds = 1 } = {}) {
  return Math.max(0, Math.round(numeric(targetRps) * numeric(durationSeconds)));
}

export function buildArrivalPlan({ targetRps = 1, durationSeconds = 1, startAt = '2026-01-15T10:00:00.000Z' } = {}) {
  const rps = Math.max(0.01, numeric(targetRps, 1));
  const total = estimateRequests({ targetRps: rps, durationSeconds });
  const start = Date.parse(startAt);
  return Array.from({ length: total }, (_, index) => ({
    sequence: index + 1,
    scheduledAt: new Date(start + (index / rps) * 1000).toISOString()
  }));
}

export function percentile(values = [], percentileRank = 0.95) {
  const sorted = values.map(Number).filter(Number.isFinite).sort((a, b) => a - b);
  if (!sorted.length) return 0;
  const index = Math.min(sorted.length - 1, Math.ceil(percentileRank * sorted.length) - 1);
  return sorted[Math.max(0, index)];
}

export function analyzeLatency(observations = [], objectives = {}) {
  const durations = observations.map(item => Number(item.durationMs)).filter(Number.isFinite);
  const errors = observations.filter(item => item.status === 'error' || Number(item.statusCode) >= 500).length;
  const errorRate = observations.length ? errors / observations.length : 0;
  const result = {
    count: observations.length,
    p50Ms: percentile(durations, 0.5),
    p95Ms: percentile(durations, 0.95),
    p99Ms: percentile(durations, 0.99),
    errorRate,
    objective: {
      p95Ms: objectives.p95Ms ?? 1000,
      maximumErrorRate: objectives.maximumErrorRate ?? 0.01
    }
  };
  result.pass = result.p95Ms <= result.objective.p95Ms && result.errorRate <= result.objective.maximumErrorRate;
  return result;
}
