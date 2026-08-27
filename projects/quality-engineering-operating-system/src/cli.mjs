import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assessWaivers, createDecisionMatrix, validateQualityPlan } from './operating-model.mjs';
import { calculateQualityMetrics, metricNarrative } from './metrics.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const plan = JSON.parse(await fs.readFile(path.join(projectRoot, 'examples/quality-plan.json'), 'utf8'));
const metricInput = JSON.parse(await fs.readFile(path.join(projectRoot, 'examples/metrics.json'), 'utf8'));
const metrics = calculateQualityMetrics(metricInput);

console.log(JSON.stringify({
  planValidation: validateQualityPlan(plan),
  activeWaivers: assessWaivers(plan.waivers, new Date('2026-01-20T00:00:00Z')),
  decisionMatrix: createDecisionMatrix(),
  metrics,
  narrative: metricNarrative(metrics)
}, null, 2));
