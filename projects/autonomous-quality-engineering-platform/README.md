# Autonomous Quality Engineering Platform

A deterministic quality decision engine that selects test depth from change risk and evaluates release evidence against explainable rules.

## Why it matters

Large suites are expensive to run indiscriminately. This project demonstrates a transparent control loop:

1. classify the change;
2. calculate a bounded risk score;
3. select the smallest safe test portfolio;
4. evaluate test evidence;
5. return a release recommendation with reasons and next actions.

## Run it

From the repository root:

```bash
npm run quality:gate
node --test projects/autonomous-quality-engineering-platform/test
```

## Inputs

`examples/change-request.json` contains a fictional change request. `examples/test-results.json` contains synthetic execution evidence. Neither represents a real system.

## Design decisions

- scores are bounded from 0 to 100;
- missing risk attributes use conservative defaults;
- critical failures always block the release;
- a decision includes the exact rules that passed or failed;
- the selection engine is independent from a particular test runner.

## Extension points

- replace the JSON adapter with Jira, GitHub, or a work-management API;
- map selected suite names to Playwright, API, contract, or performance commands;
- persist decisions for trend analysis;
- add a human waiver workflow with expiry and accountable ownership.
