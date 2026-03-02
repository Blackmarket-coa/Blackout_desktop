# Blackout desktop

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

## Local development

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

### Build desktop package

```bash
npm run tauri build
```
