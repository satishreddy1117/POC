import { createServer } from 'node:http';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { scoreRelease, summarizeReleases } from './release-score.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = path.join(projectRoot, 'public');
const releasesPath = path.join(projectRoot, 'examples/releases.json');

async function loadReleases() {
  return JSON.parse(await fs.readFile(releasesPath, 'utf8'));
}

function sendJson(response, status, value) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(value));
}

async function serveStatic(response, pathname) {
  const requested = pathname === '/' ? '/index.html' : pathname;
  const filePath = path.resolve(publicRoot, `.${requested}`);
  if (!filePath.startsWith(publicRoot)) return sendJson(response, 403, { error: 'Forbidden' });
  try {
    const body = await fs.readFile(filePath);
    const contentType = filePath.endsWith('.css') ? 'text/css' : filePath.endsWith('.js') ? 'text/javascript' : 'text/html';
    response.writeHead(200, { 'content-type': `${contentType}; charset=utf-8` });
    response.end(body);
  } catch {
    sendJson(response, 404, { error: 'Not found' });
  }
}

export function createControlCenter({ port = Number(process.env.PORT) || 4173, releases = null } = {}) {
  const server = createServer(async (request, response) => {
    const url = new URL(request.url, `http://${request.headers.host ?? 'localhost'}`);
    const data = releases ?? await loadReleases();
    if (request.method === 'GET' && url.pathname === '/health') return sendJson(response, 200, { status: 'ok', service: 'release-confidence-control-center' });
    if (request.method === 'GET' && url.pathname === '/api/releases') return sendJson(response, 200, { releases: summarizeReleases(data) });
    const match = url.pathname.match(/^\/api\/releases\/([^/]+)\/decision$/);
    if (request.method === 'GET' && match) {
      const release = data.find(item => item.releaseId === decodeURIComponent(match[1]));
      return release ? sendJson(response, 200, scoreRelease(release)) : sendJson(response, 404, { error: 'Release not found' });
    }
    return serveStatic(response, url.pathname);
  });

  return {
    server,
    start() {
      return new Promise(resolve => server.listen(port, resolve));
    },
    stop() {
      return new Promise(resolve => server.close(resolve));
    },
    port
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const app = createControlCenter();
  await app.start();
  console.log(`Release Confidence Control Center running at http://localhost:${app.port}`);
}
