# Performance and Observability Lab

A provider-neutral performance analysis toolkit that converts a workload model and structured telemetry into measurable service-level conclusions.

## Capabilities

- estimate request volume from target rate and duration;
- generate a deterministic arrival plan for smoke or load tests;
- calculate p50, p95, and p99 latency;
- evaluate latency and error-rate objectives;
- aggregate structured events by component;
- identify likely bottlenecks using latency, error, and saturation signals.

## Run it

```bash
npm run performance:lab
node --test projects/performance-and-observability-lab/test
```

The `k6/steady-load.js` file is an optional runner script for teams that already use k6. The core analysis remains runnable with Node.js alone.
