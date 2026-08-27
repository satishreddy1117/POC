# Quality Engineering Operating System

A reusable governance model for aligning product, engineering, QA, platform, and business risk decisions.

## What it contains

- a responsibility model that separates quality ownership from test execution;
- a release-readiness metric calculator;
- a quality-plan validator;
- generic strategy, risk-review, and readiness templates.

## Run it

```bash
npm run qe:operating-system
node --test projects/quality-engineering-operating-system/test
```

## Operating model

| Concern | Accountable role | Evidence |
| --- | --- | --- |
| Product risk | Product | Accepted business risk and priority |
| Technical quality | Engineering | Unit, component, and code-quality evidence |
| Test strategy | Quality engineering | Risk model, coverage, and residual risk |
| Environment and data | Platform | Stable environment, synthetic data, observability |
| Release decision | Release group | Gate result, waivers, owners, expiry |

The model keeps accountability visible without turning QA into the sole owner of product quality.
