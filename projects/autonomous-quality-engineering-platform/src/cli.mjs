import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { selectTestPortfolio } from './risk-engine.mjs';
import { evaluateQualityGate } from './quality-gate.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const change = JSON.parse(await fs.readFile(path.join(projectRoot, 'examples/change-request.json'), 'utf8'));
const results = JSON.parse(await fs.readFile(path.join(projectRoot, 'examples/test-results.json'), 'utf8'));
const selection = selectTestPortfolio(change);
const gate = evaluateQualityGate(results);

console.log(JSON.stringify({
  change: { id: change.id, title: change.title },
  risk: selection.risk,
  selectedSuites: selection.suites,
  gate
}, null, 2));
