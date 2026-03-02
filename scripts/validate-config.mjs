import { readFileSync } from 'node:fs';

const config = JSON.parse(readFileSync(new URL('../config.json', import.meta.url), 'utf8'));

const errors = [];

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;

if (!Number.isInteger(config.defaultHomeserver) || config.defaultHomeserver < 0) {
  errors.push('defaultHomeserver must be a non-negative integer.');
}

if (!Array.isArray(config.homeserverList) || config.homeserverList.length === 0) {
  errors.push('homeserverList must be a non-empty array.');
}

const blackout = config.blackout;
if (!blackout || typeof blackout !== 'object') {
  errors.push('blackout object is required.');
} else {
  if (!isNonEmptyString(blackout.backendBaseUrl)) {
    errors.push('blackout.backendBaseUrl must be a non-empty string.');
  }
  if (!isNonEmptyString(blackout.backendWsUrl)) {
    errors.push('blackout.backendWsUrl must be a non-empty string.');
  }

  let baseUrl;
  let wsUrl;
  try {
    baseUrl = new URL(blackout.backendBaseUrl);
    if (!['http:', 'https:'].includes(baseUrl.protocol)) {
      errors.push('blackout.backendBaseUrl must use http or https scheme.');
    }
  } catch {
    errors.push('blackout.backendBaseUrl must be a valid URL.');
  }

  try {
    wsUrl = new URL(blackout.backendWsUrl);
    if (!['ws:', 'wss:'].includes(wsUrl.protocol)) {
      errors.push('blackout.backendWsUrl must use ws or wss scheme.');
    }
  } catch {
    errors.push('blackout.backendWsUrl must be a valid URL.');
  }

  const stego = blackout.steganography;
  if (!stego || typeof stego !== 'object') {
    errors.push('blackout.steganography object is required.');
  } else {
    if (typeof stego.enabled !== 'boolean') {
      errors.push('blackout.steganography.enabled must be boolean.');
    }
    if (!['png', 'webp'].includes(stego.defaultCarrierFormat)) {
      errors.push('blackout.steganography.defaultCarrierFormat must be png or webp.');
    }
    if (!Number.isInteger(stego.maxEmbedPayloadKB) || stego.maxEmbedPayloadKB <= 0) {
      errors.push('blackout.steganography.maxEmbedPayloadKB must be a positive integer.');
    }
    if (typeof stego.autoDecodeOnDownload !== 'boolean') {
      errors.push('blackout.steganography.autoDecodeOnDownload must be boolean.');
    }
  }
}

if (errors.length) {
  console.error('Configuration validation failed:');
  errors.forEach((error, index) => console.error(`${index + 1}. ${error}`));
  process.exit(1);
}

console.log('config.json schema is valid.');
