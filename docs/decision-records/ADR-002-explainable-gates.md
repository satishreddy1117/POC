# ADR-002: Make quality gates explainable

## Status

Accepted

## Decision

Every release recommendation contains the input signals, failed rules, severity, and recommended action.

## Rationale

An opaque pass/fail flag is not useful for engineering or organizational decisions. Explainability makes waivers, follow-up actions, and trend reviews possible.

## Consequences

- Gate calculations return structured evidence.
- The dashboard can render the same decision that the CLI produces.
- A reviewer can challenge a rule without reverse-engineering UI behavior.
