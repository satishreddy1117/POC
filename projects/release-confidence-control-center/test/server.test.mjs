import test from 'node:test';
import assert from 'node:assert/strict';
import { createControlCenter } from '../src/server.mjs';

test('serves health and release decision endpoints', async () => {
  const app = createControlCenter({ port: 0, releases: [{ releaseId: 'REL-1', name: 'Test release', signals: { functional: { status: 'pass' }, security: { status: 'pass' } } }] });
  await app.start();
  const address = app.server.address();
  const base = `http://127.0.0.1:${address.port}`;
  const health = await fetch(`${base}/health`).then(response => response.json());
  const decision = await fetch(`${base}/api/releases/REL-1/decision`).then(response => response.json());
  await app.stop();
  assert.equal(health.status, 'ok');
  assert.equal(decision.releaseId, 'REL-1');
});
