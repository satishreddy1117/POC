# Portfolio map

The projects are intentionally separated by capability while sharing the same engineering conventions.

| Capability | Project | Evidence a reviewer can inspect |
| --- | --- | --- |
| Risk-based automation | autonomous-quality-engineering-platform | Explainable risk score and gate decision |
| Distributed integration quality | enterprise-api-integration-quality-lab | Contract validator, retry policy, idempotency store, DLQ |
| Governance | quality-engineering-operating-system | Decision ownership and measurable operating metrics |
| Release management | release-confidence-control-center | HTTP API, browser dashboard, release recommendation |
| Performance | performance-and-observability-lab | Workload model, percentile analysis, bottleneck detection |
| AI-enabled analysis | ai-assisted-test-design-framework | Deterministic requirement parser and test generator |
| Data quality | enterprise-test-data-governance-lab | Masking, synthetic data, policy enforcement |
| Leadership communication | quality-leadership-playbook | Reusable strategy, risk, and release templates |

## Review path

1. Start with the root README to understand the quality architecture.
2. Run `npm test` and `npm run validate` to see the engineering guardrails.
3. Open the flagship project's README and run its decision CLI.
4. Start the control-center dashboard for a visual release decision.
5. Review the playbook templates to see how technical evidence becomes an executive decision.
