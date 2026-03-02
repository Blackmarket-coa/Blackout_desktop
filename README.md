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

```bash
git clone --recursive <this-repo>
cd Blackout_desktop
npm ci
git submodule sync --recursive
git submodule update --init --recursive
```

## Development

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
