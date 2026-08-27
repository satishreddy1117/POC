const actionWords = ['create', 'update', 'delete', 'view', 'search', 'submit', 'approve', 'reject', 'validate', 'send', 'receive', 'retry', 'authenticate'];
const riskWords = {
  authentication: ['login', 'authenticate', 'token', 'session', 'permission', 'role'],
  dataIntegrity: ['persist', 'save', 'update', 'duplicate', 'database', 'record'],
  integration: ['api', 'service', 'queue', 'webhook', 'external', 'dependency'],
  performance: ['volume', 'concurrent', 'latency', 'throughput', 'within'],
  accessibility: ['keyboard', 'screen reader', 'accessible', 'contrast', 'focus']
};

function words(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter(Boolean);
}

export function parseRequirement(requirement = {}) {
  const text = String(requirement.text ?? '');
  const lowerWords = words(text);
  const actions = actionWords.filter(action => lowerWords.includes(action));
  const risks = Object.entries(riskWords)
    .filter(([, hints]) => hints.some(hint => lowerWords.includes(hint)))
    .map(([risk]) => risk);
  const actors = [...text.matchAll(/(?:as|when)\s+(?:a|an|the)?\s*([a-z][a-z -]{2,30})/gi)].map(match => match[1].trim());
  const conditions = [...text.matchAll(/\b(if|when|unless|only if|provided that)\b([^.!?]*)/gi)].map(match => `${match[1]}${match[2]}`.trim());
  const uncertain = !actions.length || !text.includes('so that');
  return {
    id: requirement.id ?? 'REQ-UNKNOWN',
    text,
    actors: [...new Set(actors)],
    actions: [...new Set(actions)],
    conditions,
    risks: [...new Set(risks)],
    uncertain
  };
}
