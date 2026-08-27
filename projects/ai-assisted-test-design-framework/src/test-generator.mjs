import { parseRequirement } from './requirement-parser.mjs';

const riskCaseMap = {
  authentication: {
    type: 'authorization',
    title: 'Reject unauthenticated or unauthorized access',
    objective: 'Confirm access control protects the requested capability.'
  },
  dataIntegrity: {
    type: 'data-integrity',
    title: 'Persist the result exactly once',
    objective: 'Confirm the stored state matches the accepted request and duplicate delivery is safe.'
  },
  integration: {
    type: 'resilience',
    title: 'Handle a dependency failure predictably',
    objective: 'Confirm retry, timeout, and failure routing preserve an honest outcome.'
  },
  performance: {
    type: 'performance',
    title: 'Meet the response objective at expected volume',
    objective: 'Confirm latency and error objectives hold under the stated workload.'
  },
  accessibility: {
    type: 'accessibility',
    title: 'Complete the journey with accessible interaction',
    objective: 'Confirm keyboard, focus, semantics, and announcement behavior.'
  }
};

export function generateTestCases(requirement = {}) {
  const parsed = requirement.actions ? requirement : parseRequirement(requirement);
  const cases = [
    {
      id: `${parsed.id}-POS-001`,
      type: 'positive',
      priority: 'P1',
      title: 'Complete the stated outcome with valid input',
      objective: `Confirm the requirement outcome for ${parsed.actions.join(', ') || 'the requested action'}.`,
      sourceRequirement: parsed.id
    },
    {
      id: `${parsed.id}-NEG-001`,
      type: 'negative',
      priority: 'P1',
      title: 'Reject invalid or incomplete input',
      objective: 'Confirm validation returns a useful error and does not create an unintended side effect.',
      sourceRequirement: parsed.id
    },
    {
      id: `${parsed.id}-BND-001`,
      type: 'boundary',
      priority: 'P2',
      title: 'Verify minimum, maximum, and empty boundaries',
      objective: 'Confirm boundary values are handled consistently at the API and user-interface layers.',
      sourceRequirement: parsed.id
    }
  ];

  for (const risk of parsed.risks) {
    const riskCase = riskCaseMap[risk];
    if (!riskCase) continue;
    cases.push({
      id: `${parsed.id}-${riskCase.type.toUpperCase()}-001`,
      ...riskCase,
      priority: ['authentication', 'dataIntegrity', 'integration'].includes(risk) ? 'P1' : 'P2',
      sourceRequirement: parsed.id
    });
  }
  if (parsed.uncertain) {
    cases.push({
      id: `${parsed.id}-REVIEW-001`,
      type: 'review',
      priority: 'P1',
      title: 'Clarify ambiguous requirement language',
      objective: 'Resolve missing actor, action, condition, or outcome before finalizing coverage.',
      sourceRequirement: parsed.id,
      reviewRequired: true
    });
  }
  return cases;
}
