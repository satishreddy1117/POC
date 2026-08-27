import { percentile } from './load-model.mjs';

export function aggregateEvents(events = []) {
  const groups = new Map();
  for (const event of events) {
    const component = event.component ?? 'unknown';
    if (!groups.has(component)) groups.set(component, []);
    groups.get(component).push(event);
  }
  return [...groups.entries()].map(([component, items]) => {
    const durations = items.map(item => Number(item.durationMs)).filter(Number.isFinite);
    const errors = items.filter(item => item.status === 'error' || Number(item.statusCode) >= 500).length;
    const saturationValues = items.map(item => Number(item.saturation)).filter(Number.isFinite);
    return {
      component,
      count: items.length,
      p95Ms: percentile(durations, 0.95),
      errorRate: items.length ? errors / items.length : 0,
      maxSaturation: saturationValues.length ? Math.max(...saturationValues) : 0
    };
  });
}

export function findBottlenecks(events = [], thresholds = {}) {
  const limits = {
    p95Ms: thresholds.p95Ms ?? 1000,
    errorRate: thresholds.errorRate ?? 0.02,
    saturation: thresholds.saturation ?? 0.8
  };
  return aggregateEvents(events)
    .map(summary => ({
      ...summary,
      signals: [
        summary.p95Ms > limits.p95Ms ? `p95 latency ${summary.p95Ms}ms exceeds ${limits.p95Ms}ms` : null,
        summary.errorRate > limits.errorRate ? `error rate ${(summary.errorRate * 100).toFixed(1)}% exceeds ${(limits.errorRate * 100).toFixed(1)}%` : null,
        summary.maxSaturation > limits.saturation ? `saturation ${(summary.maxSaturation * 100).toFixed(1)}% exceeds ${(limits.saturation * 100).toFixed(1)}%` : null
      ].filter(Boolean)
    }))
    .filter(summary => summary.signals.length > 0);
}
