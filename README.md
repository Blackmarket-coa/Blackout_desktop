# Blackout desktop

Blackout desktop is a Tauri wrapper for the web client hosted in the `cinny/` submodule.

## Integration status

Desktop-level wiring present in this repository:
- Submodule source points to `Blackmarket-coa/blackout`.
- Tauri metadata is branded for Blackout.
- `config.json` includes backend + steganography runtime keys.

For full completion plan and DoD, see [`docs/FULL_PARITY_PLAN.md`](docs/FULL_PARITY_PLAN.md).

## Runtime configuration

`config.json` defines:
- `blackout.backendBaseUrl` (default `http://localhost:8000`)
- `blackout.backendWsUrl` (default `ws://localhost:8000/ws`)
- `blackout.steganography.*` options

## Local setup
Blackout desktop is a Tauri wrapper for the web client hosted in the `cinny/` submodule. This repository is now configured to use the Blackout web client fork and to target the Blackout backend stack.

## Current integration status

This repository now includes the desktop-level wiring required for Blackout:

- Submodule source switched to `Blackmarket-coa/blackout`.
- Desktop/app branding switched from Cinny to Blackout.
- Default client configuration includes Blackout backend endpoints.
- Config schema includes a `blackout.steganography` section for stego-capable frontend builds.

The end-to-end feature set (including steganography UX) is implemented in the frontend submodule and backend API; this wrapper repo only hosts desktop packaging/runtime configuration.

## Backend compatibility

The default client config points to:

- API base URL: `http://localhost:8000`
- WebSocket URL: `ws://localhost:8000/ws`

Update `config.json` if your `Blackout_server` deployment runs on a different host/port.

```bash
git clone --recursive <this-repo>
cd Blackout_desktop
npm ci
git submodule sync --recursive
git submodule update --init --recursive
```

### Prerequisites

Install Rust, Node.js, and Tauri prerequisites as documented by Tauri.

### Setup

```bash
git clone --recursive <this-repo>
cd Blackout_desktop
npm ci
```

If the `cinny` submodule is empty, initialize it:

```bash
git submodule sync --recursive
git submodule update --init --recursive
```

### Run in development

```bash
npm run tauri dev
```

## Validation commands

```bash
npm run validate:config
npm run smoke:backend
npm run smoke:stego
```

Optional env overrides for smoke tests:
- `BLACKOUT_BACKEND_BASE_URL`
- `BLACKOUT_BACKEND_WS_URL`
- `BLACKOUT_STEGO_ENCODE_PATH` (default `/api/stego/encode`)
- `BLACKOUT_STEGO_DECODE_PATH` (default `/api/stego/decode`)

## Build

```bash
npm run tauri build
```

## Release runbook (short)

1. Update/pin tested `cinny` submodule commit.
2. Run validation commands above.
3. Build release artifacts.
4. Verify artifact names are `Blackout_*`.
5. Publish release and updater metadata.
