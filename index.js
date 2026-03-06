#!/usr/bin/env node

const http = require('node:http');

const port = Number.parseInt(process.env.PORT ?? '3000', 10);

const server = http.createServer((req, res) => {
  if (req.url === '/healthz') {
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ status: 'ok', service: 'blackout-desktop-wrapper' }));
    return;
  }

  res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
  res.end('Blackout desktop is a Tauri app wrapper and is not meant to run as a Node web server.');
});

server.listen(port, '0.0.0.0', () => {
  console.log(`[blackout-desktop] Fallback runtime listening on :${port}`);
});
