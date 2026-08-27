import test from 'node:test';
import assert from 'node:assert/strict';
import { aggregateEvents, findBottlenecks } from '../src/observability.mjs';

const events = [
  { component: 'fast', durationMs: 100, statusCode: 200, saturation: 0.4 },
  { component: 'slow', durationMs: 1000, statusCode: 200, saturation: 0.9 },
  { component: 'slow', durationMs: 1200, statusCode: 503, saturation: 0.95 }
];

test('aggregates telemetry by component', () => {
  const result = aggregateEvents(events);
  assert.deepEqual(result.map(item => item.component), ['fast', 'slow']);
  assert.equal(result.find(item => item.component === 'slow').count, 2);
});

test('identifies latency, error, and saturation signals', () => {
  const result = findBottlenecks(events, { p95Ms: 900, errorRate: 0.1, saturation: 0.8 });
  assert.equal(result.length, 1);
  assert.equal(result[0].component, 'slow');
  assert.equal(result[0].signals.length, 3);
});

test('returns no bottleneck for healthy telemetry', () => {
  const result = findBottlenecks([{ component: 'healthy', durationMs: 100, statusCode: 200, saturation: 0.2 }]);
  assert.deepEqual(result, []);
});
