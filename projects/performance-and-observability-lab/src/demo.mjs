import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyzeLatency, buildArrivalPlan, estimateRequests } from './load-model.mjs';
import { aggregateEvents, findBottlenecks } from './observability.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fixture = JSON.parse(await fs.readFile(path.join(projectRoot, 'examples/telemetry.json'), 'utf8'));
const workload = { targetRps: 12, durationSeconds: 30 };
const observations = fixture.events.map(event => ({ durationMs: event.durationMs, statusCode: event.statusCode }));

console.log(JSON.stringify({
  workload: { ...workload, estimatedRequests: estimateRequests(workload), sampleArrivalPlan: buildArrivalPlan({ ...workload, targetRps: 2 }).slice(0, 3) },
  latency: analyzeLatency(observations, { p95Ms: 900, maximumErrorRate: 0.02 }),
  components: aggregateEvents(fixture.events),
  bottlenecks: findBottlenecks(fixture.events, { p95Ms: 900, errorRate: 0.02, saturation: 0.8 })
}, null, 2));
