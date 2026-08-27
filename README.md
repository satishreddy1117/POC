

This repository demonstrates how to turn quality strategy into repeatable engineering controls:

- risk-based test selection and release gates
- API contract, retry, idempotency, and dead-letter validation
- quality operating models and measurable release readiness
- a release confidence dashboard
- performance workload modeling and observability analysis
- deterministic AI-assisted test design
- synthetic data, masking, and test-data governance
- reusable leadership playbooks and decision templates



## Portfolio map

| Project | Demonstrates | Entry point |
| --- | --- | --- |
| [Autonomous Quality Engineering Platform](projects/autonomous-quality-engineering-platform) | Risk scoring, test selection, quality gates | `npm run quality:gate` |
| [Enterprise API Integration Quality Lab](projects/enterprise-api-integration-quality-lab) | Contracts, retries, idempotency, DLQ behavior | `npm run api:lab` |
| [Quality Engineering Operating System](projects/quality-engineering-operating-system) | Governance, ownership, metrics, release review | `npm run qe:operating-system` |
| [Release Confidence Control Center](projects/release-confidence-control-center) | Release decision API and dashboard | `npm run control-center` |
| [Performance and Observability Lab](projects/performance-and-observability-lab) | Load models, percentile analysis, bottleneck signals | `npm run performance:lab` |
| [AI-Assisted Test Design Framework](projects/ai-assisted-test-design-framework) | Requirement decomposition and traceability | `npm run test-design` |
| [Enterprise Test Data Governance Lab](projects/enterprise-test-data-governance-lab) | Synthetic data, masking, policy checks | `npm run test-data` |
| [Quality Leadership Playbook](projects/quality-leadership-playbook) | Decision records, risk reviews, go/no-go evidence | `npm run leadership:playbook` |

## Quick start

Requires Node.js 20 or newer.

```bash
npm install
npm test
npm run validate
npm run demo
```

Start the interactive release dashboard:

```bash
npm run control-center
```

Then open `http://localhost:4173`.

## Engineering principles

1. Quality is a system property, not a final test phase.
2. Risk determines test depth and release evidence.
3. Lower-layer checks provide fast feedback; UI checks prove critical journeys.
4. Every automated decision remains explainable and reviewable.
5. Test data is synthetic by default and governed by policy.
6. A failed downstream dependency must never look like a successful business outcome.
7. Quality metrics support decisions; they do not replace judgment.

## Repository standards

- `node --test` runs the automated unit and integration tests.
- `scripts/validate.mjs` checks required project structure, JSON fixtures, and generic-content rules.
- `.github/workflows/quality.yml` runs validation on every push and pull request.
- Every project contains a focused README, runnable source, examples, and tests.

## License

MIT
