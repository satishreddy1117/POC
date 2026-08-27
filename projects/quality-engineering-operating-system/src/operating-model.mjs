export const roles = Object.freeze({
  product: 'Product',
  engineering: 'Engineering',
  quality: 'Quality Engineering',
  platform: 'Platform',
  release: 'Release Group'
});

export const responsibilityMatrix = Object.freeze([
  { concern: 'Business risk and priority', accountable: roles.product, consulted: [roles.quality, roles.engineering] },
  { concern: 'Unit and component quality', accountable: roles.engineering, consulted: [roles.quality] },
  { concern: 'Risk model and test strategy', accountable: roles.quality, consulted: [roles.product, roles.engineering] },
  { concern: 'Environment, data, and observability', accountable: roles.platform, consulted: [roles.quality, roles.engineering] },
  { concern: 'Release recommendation', accountable: roles.release, consulted: [roles.product, roles.quality, roles.engineering] }
]);

const requiredPlanFields = ['releaseId', 'riskLevel', 'criticalJourneys', 'evidence', 'waivers'];

export function validateQualityPlan(plan = {}) {
  const errors = [];
  for (const field of requiredPlanFields) {
    if (plan[field] === undefined) errors.push(`Missing quality-plan field: ${field}.`);
  }
  if (!['low', 'medium', 'high', 'critical'].includes(plan.riskLevel)) errors.push('riskLevel must be low, medium, high, or critical.');
  if (!Array.isArray(plan.criticalJourneys) || plan.criticalJourneys.length === 0) errors.push('At least one critical journey is required.');
  if (!plan.evidence || typeof plan.evidence !== 'object') errors.push('evidence must be an object.');
  if (!Array.isArray(plan.waivers)) errors.push('waivers must be an array.');
  return { valid: errors.length === 0, errors };
}

export function createDecisionMatrix() {
  return responsibilityMatrix.map(row => ({ ...row, decisionRule: `The accountable role owns the decision for ${row.concern.toLowerCase()}.` }));
}

export function assessWaivers(waivers = [], now = new Date()) {
  return waivers.map(waiver => {
    const expiry = new Date(waiver.expiresAt);
    const expired = Number.isNaN(expiry.valueOf()) || expiry <= now;
    return { ...waiver, status: expired ? 'expired' : 'active' };
  });
}
