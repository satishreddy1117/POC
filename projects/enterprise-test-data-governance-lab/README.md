# Enterprise Test Data Governance Lab

A deterministic test-data toolkit that makes synthetic data the default and prevents accidental use of sensitive or production-like records in lower environments.

## Capabilities

- deterministic synthetic customer and transaction records;
- field-aware masking for names, emails, phones, and account identifiers;
- recursive sensitive-field detection;
- environment, retention, and synthetic-data policy validation;
- fail-fast policy violations with actionable messages.

## Run it

```bash
npm run test-data
node --test projects/enterprise-test-data-governance-lab/test
```

All generated emails use the reserved `example.test` domain and all identifiers are synthetic.
