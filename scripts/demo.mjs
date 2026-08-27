import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const demos = [
  ['quality gate', 'projects/autonomous-quality-engineering-platform/src/cli.mjs'],
  ['API lab', 'projects/enterprise-api-integration-quality-lab/src/demo.mjs'],
  ['operating system', 'projects/quality-engineering-operating-system/src/cli.mjs'],
  ['performance lab', 'projects/performance-and-observability-lab/src/demo.mjs'],
  ['test design', 'projects/ai-assisted-test-design-framework/src/cli.mjs'],
  ['test data', 'projects/enterprise-test-data-governance-lab/src/cli.mjs'],
  ['leadership playbook', 'projects/quality-leadership-playbook/src/demo.mjs']
];

for (const [name, script] of demos) {
  console.log(`\n=== ${name} ===`);
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(root, script)], { stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`${name} exited with ${code}`)));
  });
}
