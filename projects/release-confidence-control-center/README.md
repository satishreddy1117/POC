# Release Confidence Control Center

A small, dependency-free release decision service with a browser dashboard. It turns quality signals into a consistent recommendation while keeping the underlying evidence visible.

## Run it

```bash
npm run control-center
```

Open `http://localhost:4173`.

Run its tests:

```bash
node --test projects/release-confidence-control-center/test
```

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | Service health |
| GET | `/api/releases` | Release summaries and decisions |
| GET | `/api/releases/:id/decision` | Explainable decision for one release |

The dashboard is intentionally simple: the important demonstration is the shared decision model used by both the API and the UI.
