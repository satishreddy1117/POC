import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseRequirement } from './requirement-parser.mjs';
import { generateTestCases } from './test-generator.mjs';
import { buildTraceability, findCoverageGaps } from './traceability.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requirements = JSON.parse(await fs.readFile(path.join(projectRoot, 'examples/requirements.json'), 'utf8'));
const parsed = requirements.map(parseRequirement);
const testCases = parsed.flatMap(generateTestCases);
const traceability = buildTraceability(parsed, testCases);

console.log(JSON.stringify({ parsed, testCases, traceability, reviewQueue: findCoverageGaps(traceability) }, null, 2));
