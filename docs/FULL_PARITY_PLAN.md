# Blackout Desktop Full-Parity Plan

## Scope
Deliver full parity of `Blackout_desktop` with:
- Frontend: `Blackmarket-coa/blackout`
- Backend: `Blackmarket-coa/Blackout_server`

This repository is a Tauri wrapper + frontend submodule.

## Gap Audit Checklist

| Area | Current | Gap | Done when |
|---|---|---|---|
| Submodule source | URL points to blackout | Submodule commit not pinned to tested release in this repo history | Desktop repo references an explicit tested submodule commit and release notes include SHA |
| Config contract | `config.json` contains blackout + stego keys | No automated contract enforcement | `npm run validate:config` passes locally and in CI |
| Backend compatibility | Base URL + WS defaults set | No executable backend smoke checks | `npm run smoke:backend` passes against running Blackout_server |
| Stego E2E | Config keys exist | No roundtrip test proving encode/decode flow | `npm run smoke:stego` passes against backend stego endpoints |
| Branding/release | Core Tauri metadata switched | CI release artifact naming partially legacy | Release workflow artifacts are `Blackout_*` |
| Runbook | Basic README setup exists | No operator-grade test/release checklist | Docs include setup/env/test/release/rollback procedures |

## Definition of Done (DoD)
1. Submodule commit is pinned and documented per release.
2. Config schema validation is automated and CI-enforced.
3. Backend smoke checks cover Matrix versions, health, websocket connectivity.
4. Stego roundtrip test verifies encode/decode success and payload integrity.
5. Release artifacts and app metadata are consistently branded Blackout.
6. Documentation includes exact local run/test/release sequence and rollback.

## AI Prompts for Completion

### Prompt 1: Frontend pinning
```text
Pin the `cinny` submodule to a tested `Blackmarket-coa/blackout` commit.
Update docs to include the exact SHA and rationale.
Commit only submodule pointer + docs.
```

### Prompt 2: Config contract
```text
Validate desktop config against frontend expectations.
If key names differ, update loader or config accordingly.
Keep backward compatibility if possible.
Add/update tests for schema handling.
```

### Prompt 3: Backend compatibility
```text
Run backend compatibility checks against Blackout_server.
Ensure login bootstrap, Matrix versions, health, websocket, and media paths work.
Patch integration issues and add smoke tests.
```

### Prompt 4: Stego completion
```text
Implement/verify steganography end-to-end:
encode -> send -> receive -> decode -> mismatch/failure behavior.
Add tests for payload limits and disabled-mode fallback.
```

### Prompt 5: Release hardening
```text
Audit release workflows and rename all remaining Cinny artifacts to Blackout.
Verify produced filenames, upload paths, and updater metadata are consistent.
```

### Prompt 6: Final validation
```text
Run full validation:
- npm run validate:config
- npm run smoke:backend (against running backend)
- npm run smoke:stego (against running backend)
- cargo check (or tauri build in CI)
Publish a risk + rollback section in PR summary.
```

## Risks
- Backend endpoint paths may differ by deployment (`/health`, stego API paths).
- Local environment may miss Linux GUI system dependencies for Tauri build.
- Network policy can prevent pulling the submodule remote in CI/local.

## Rollback
1. Revert integration commit(s).
2. Restore prior submodule pointer and config keys.
3. Re-run `npm run validate:config` and build checks.
