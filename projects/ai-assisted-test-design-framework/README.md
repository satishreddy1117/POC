# AI-Assisted Test Design Framework

A deterministic, model-ready test design framework. It decomposes plain-language requirements into actors, actions, conditions, risks, and traceable test cases.

The default implementation uses transparent rules so it runs without an external AI service or API key. A model adapter can be added later, but generated suggestions remain subject to human review.

## Run it

```bash
npm run test-design
node --test projects/ai-assisted-test-design-framework/test
```

## Design flow

```text
Requirement -> Parsed intent -> Risk hints -> Test ideas -> Traceability -> Review
```

Generated cases include positive, negative, boundary, authorization, resilience, and observability coverage when the requirement indicates those risks.

## Responsible-use guardrails

- generated cases are suggestions, not approval;
- every case retains the source requirement identifier;
- uncertain parsing is flagged for review;
- no sensitive data is sent to an external model by this implementation;
- reviewers can inspect the deterministic reason for every generated test.
