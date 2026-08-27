# Portfolio architecture

```mermaid
flowchart TD
  R[Requirement] --> K[Risk classification]
  K --> S[Test selection]
  S --> E[Automated evidence]
  E --> G[Quality gate]
  G --> D[Release decision]
  E --> O[Observability]
  O --> D
  D --> L[Leadership communication]
```

The implementation keeps the decision path explicit:

- domain functions return structured evidence rather than writing directly to a UI;
- CLIs provide deterministic, reviewable examples;
- the dashboard consumes the same release-decision model;
- tests cover happy paths, boundary conditions, failure modes, and duplicate events;
- synthetic fixtures are checked into the repository so examples are reproducible.
