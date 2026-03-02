import { readFileSync } from 'node:fs';

const config = JSON.parse(readFileSync(new URL('../config.json', import.meta.url), 'utf8'));
const baseUrl = process.env.BLACKOUT_BACKEND_BASE_URL ?? config.blackout?.backendBaseUrl;
const wsUrl = process.env.BLACKOUT_BACKEND_WS_URL ?? config.blackout?.backendWsUrl;

if (!baseUrl || !wsUrl) {
  console.error('Missing backend URLs. Set BLACKOUT_BACKEND_BASE_URL/BLACKOUT_BACKEND_WS_URL or configure config.json blackout object.');
  process.exit(1);
}

const checks = [
  { name: 'Matrix versions', path: '/_matrix/client/versions' },
  { name: 'Backend health', path: '/health' },
];

let failed = false;

for (const check of checks) {
  try {
    const res = await fetch(new URL(check.path, baseUrl));
    if (!res.ok) {
      failed = true;
      console.error(`${check.name} failed: HTTP ${res.status}`);
      continue;
    }
    console.log(`${check.name} ok (${res.status})`);
  } catch (error) {
    failed = true;
    console.error(`${check.name} failed: ${error.message}`);
  }
}

try {
  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timed out waiting for websocket open')), 6000);
    ws.addEventListener('open', () => {
      clearTimeout(timeout);
      resolve();
    });
    ws.addEventListener('error', (event) => {
      clearTimeout(timeout);
      reject(new Error(`Websocket connection failed: ${event.message ?? 'unknown error'}`));
    });
  });
  ws.close();
  console.log('Websocket connectivity ok');
} catch (error) {
  failed = true;
  console.error(error.message);
}

if (failed) process.exit(1);
