# Enterprise API Integration Quality Lab

A fictional message-driven integration lab that makes common distributed-system failure modes executable and observable.

## Capabilities

- envelope and payload contract validation;
- retry classification with bounded attempts;
- deterministic backoff schedules;
- idempotency protection for duplicate messages;
- dead-letter capture for permanent failures;
- structured outcomes suitable for dashboards and audit trails.

## Run it

```bash
npm run api:lab
node --test projects/enterprise-api-integration-quality-lab/test
```

## Failure model

The processor distinguishes between:

- invalid messages, which are rejected without a downstream call;
- successful responses, which are completed and recorded;
- retryable responses, which are retried within the configured budget;
- permanent failures or exhausted retries, which are sent to a dead-letter collection;
- duplicate idempotency keys, which return the original result without repeating side effects.

The code is deliberately provider-neutral. A real adapter could connect this policy to HTTP, a queue, or a database without changing the decision logic.
