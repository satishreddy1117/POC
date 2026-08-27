export function createMeetingBrief({ title, decision, evidence = [], risks = [], asks = [], audience = [] } = {}) {
  return {
    title: title ?? 'Quality decision brief',
    decision: decision ?? 'Decision required',
    audience,
    evidence: evidence.map(item => ({ label: item.label, status: item.status ?? 'informational', detail: item.detail ?? '' })),
    risks: risks.map(risk => ({ statement: risk.statement, owner: risk.owner ?? 'Unassigned', treatment: risk.treatment ?? 'Review required' })),
    asks: asks.map(ask => ({ question: ask.question, owner: ask.owner ?? 'Unassigned', due: ask.due ?? 'Not set' })),
    generatedAt: new Date().toISOString()
  };
}

export function briefAsMarkdown(brief) {
  const lines = [`# ${brief.title}`, '', `**Decision:** ${brief.decision}`, '', '## Audience', ...brief.audience.map(item => `- ${item}`), '', '## Evidence', '| Signal | Status | Detail |', '| --- | --- | --- |'];
  for (const item of brief.evidence) lines.push(`| ${item.label} | ${item.status} | ${item.detail} |`);
  lines.push('', '## Risks', '| Risk | Owner | Treatment |', '| --- | --- | --- |');
  for (const risk of brief.risks) lines.push(`| ${risk.statement} | ${risk.owner} | ${risk.treatment} |`);
  lines.push('', '## Decisions and asks', '| Question | Owner | Due |', '| --- | --- | --- |');
  for (const ask of brief.asks) lines.push(`| ${ask.question} | ${ask.owner} | ${ask.due} |`);
  return `${lines.join('\n')}\n`;
}
