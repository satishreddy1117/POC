const requiredFields = ['id', 'decision', 'context', 'owner', 'decidedAt', 'reviewBy'];

export function validateDecision(entry = {}) {
  const errors = requiredFields
    .filter(field => entry[field] === undefined || entry[field] === null || entry[field] === '')
    .map(field => `Missing decision field: ${field}.`);
  if (entry.reviewBy && Number.isNaN(Date.parse(entry.reviewBy))) errors.push('reviewBy must be a valid date.');
  if (entry.decidedAt && Number.isNaN(Date.parse(entry.decidedAt))) errors.push('decidedAt must be a valid date.');
  return { valid: errors.length === 0, errors };
}

export function reviewDecisions(entries = [], now = new Date()) {
  return entries.map(entry => {
    const validation = validateDecision(entry);
    const reviewDate = new Date(entry.reviewBy);
    const reviewStatus = !validation.valid ? 'invalid' : reviewDate <= now ? 'due' : 'current';
    return { ...entry, validation, reviewStatus };
  });
}

export function openActions(entries = []) {
  return entries.flatMap(entry => (entry.actions ?? []).map(action => ({ decisionId: entry.id, ...action })))
    .filter(action => action.status !== 'complete');
}
