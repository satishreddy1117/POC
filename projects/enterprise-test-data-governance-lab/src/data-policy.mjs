const sensitiveFieldNames = ['name', 'email', 'phone', 'address', 'account', 'token', 'password', 'secret'];
const disallowedEmailDomains = ['gmail.com', 'yahoo.com', 'hotmail.com'];

export function findSensitiveFields(value, prefix = '') {
  const findings = [];
  if (!value || typeof value !== 'object') return findings;
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    const normalizedKey = key.toLowerCase();
    if (sensitiveFieldNames.some(token => normalizedKey.includes(token))) findings.push(path);
    if (child && typeof child === 'object') findings.push(...findSensitiveFields(child, path));
  }
  return [...new Set(findings)];
}

export function validateDataset(dataset = [], policy = {}) {
  const errors = [];
  if (policy.syntheticOnly !== true) errors.push('syntheticOnly must be true.');
  if (!['dev', 'test', 'qa'].includes(policy.environment)) errors.push('environment must be dev, test, or qa.');
  if (!Number.isFinite(policy.retentionDays) || policy.retentionDays < 1 || policy.retentionDays > 90) errors.push('retentionDays must be between 1 and 90.');
  if (!Array.isArray(dataset)) errors.push('dataset must be an array.');

  const records = Array.isArray(dataset) ? dataset : [];
  records.forEach((record, index) => {
    if (record.source !== 'synthetic-generator') errors.push(`Record ${index} is not marked as synthetic.`);
    if (typeof record.email === 'string') {
      const domain = record.email.split('@')[1];
      if (domain !== 'example.test' || disallowedEmailDomains.includes(domain)) errors.push(`Record ${index} contains a non-reserved email domain.`);
    }
  });
  return { valid: errors.length === 0, errors, sensitiveFieldPaths: records.flatMap(findSensitiveFields) };
}

export function enforcePolicy(dataset, policy) {
  const result = validateDataset(dataset, policy);
  if (!result.valid) throw new Error(`Test-data policy failed: ${result.errors.join(' ')}`);
  return result;
}
