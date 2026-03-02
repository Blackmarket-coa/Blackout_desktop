import { readFileSync } from 'node:fs';

const config = JSON.parse(readFileSync(new URL('../config.json', import.meta.url), 'utf8'));

async function run() {
  const baseUrl = process.env.BLACKOUT_BACKEND_BASE_URL ?? config.blackout?.backendBaseUrl;
  const encodePath = process.env.BLACKOUT_STEGO_ENCODE_PATH ?? '/api/stego/encode';
  const decodePath = process.env.BLACKOUT_STEGO_DECODE_PATH ?? '/api/stego/decode';

  if (!baseUrl) {
    throw new Error('Missing BLACKOUT_BACKEND_BASE_URL and config.blackout.backendBaseUrl.');
  }

  const payload = Buffer.from('blackout-stego-smoke');
  const carrier = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO7+v7UAAAAASUVORK5CYII=', 'base64');

  const encodeResponse = await fetch(new URL(encodePath, baseUrl), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      payloadBase64: payload.toString('base64'),
      carrierBase64: carrier.toString('base64'),
      format: config.blackout?.steganography?.defaultCarrierFormat ?? 'png',
    }),
  });

  if (!encodeResponse.ok) {
    throw new Error(`Encode failed: HTTP ${encodeResponse.status}`);
  }

  const encodeJson = await encodeResponse.json();
  if (!encodeJson.imageBase64) {
    throw new Error('Encode failed: missing imageBase64 in response');
  }

  const decodeResponse = await fetch(new URL(decodePath, baseUrl), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ imageBase64: encodeJson.imageBase64 }),
  });

  if (!decodeResponse.ok) {
    throw new Error(`Decode failed: HTTP ${decodeResponse.status}`);
  }

  const decodeJson = await decodeResponse.json();
  if (!decodeJson.payloadBase64) {
    throw new Error('Decode failed: missing payloadBase64 in response');
  }

  const decoded = Buffer.from(decodeJson.payloadBase64, 'base64').toString('utf8');
  if (decoded !== 'blackout-stego-smoke') {
    throw new Error(`Decode mismatch: expected blackout-stego-smoke, got ${decoded}`);
  }

  console.log('Steganography roundtrip smoke test passed');
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
