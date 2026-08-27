export function buildTraceability(requirements = [], testCases = []) {
  return requirements.map(requirement => {
    const linked = testCases.filter(testCase => testCase.sourceRequirement === requirement.id);
    return {
      requirementId: requirement.id,
      testCaseIds: linked.map(testCase => testCase.id),
      coverage: linked.length ? 'covered' : 'gap',
      reviewRequired: linked.some(testCase => testCase.reviewRequired) || requirement.uncertain
    };
  });
}

export function findCoverageGaps(traceability = []) {
  return traceability.filter(item => item.coverage === 'gap' || item.reviewRequired);
}
