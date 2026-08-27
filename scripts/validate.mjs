import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projectsRoot = path.join(root, 'projects');
const requiredProjects = [
  'autonomous-quality-engineering-platform',
  'enterprise-api-integration-quality-lab',
  'quality-engineering-operating-system',
  'release-confidence-control-center',
  'performance-and-observability-lab',
  'ai-assisted-test-design-framework',
  'enterprise-test-data-governance-lab',
  'quality-leadership-playbook'
];

const forbiddenTokens = [
  'ExpressToll',
  'E-470',
  'TCSData',
  'TCSP-',
  'GAS vendor',
  'production customer'
];

async function exists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function collectFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (['node_modules', '.git', 'coverage'].includes(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectFiles(fullPath));
    else files.push(fullPath);
  }
  return files;
}

const errors = [];
for (const project of requiredProjects) {
  const projectRoot = path.join(projectsRoot, project);
  for (const required of ['README.md', 'src', 'test']) {
    if (!await exists(path.join(projectRoot, required))) {
      errors.push(`${project}: missing ${required}`);
    }
  }
}

const files = await collectFiles(root);
for (const file of files) {
  if (file === path.join(root, 'scripts/validate.mjs')) continue;
  if (!/\.(md|mjs|json|yml|yaml|js|html|css)$/.test(file)) continue;
  const content = await fs.readFile(file, 'utf8');
  for (const token of forbiddenTokens) {
    if (content.includes(token)) errors.push(`${path.relative(root, file)}: forbidden token ${token}`);
  }
}

if (errors.length) {
  console.error('Portfolio validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Portfolio validation passed: ${requiredProjects.length} projects, ${files.length} files scanned.`);
}
