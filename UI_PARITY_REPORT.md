# UI/UX Parity Report — Electron vs Qt (CLOSED)

> **Status: Resolved.** Remaining gaps from this report were closed in the
> backend-unification + frontend-parity pass. See `docs/PARITY_MATRIX.md` for
> the current per-screen matrix and intentional divergences.

## Previously open items → resolution
1. **Copy sync** English-only source code (`qsTr`) → runtime i18n via shared
   `I18nManager` (`apps/common/i18n/`). Online translation (curl → Chrome dict
   API) + persistent JSON cache. LE: 267 strings / 31 contexts. LM: 351 strings
   / 34 contexts. 20 languages supported.
2. **Streaming unavailable banner binding** → LiveMorph `PlatformSettings`
   singleton registered (qmldir + CMake) and driven by
   `BackendClient::fetchStreamingAvailability`; LiveEscape banner + connect guard active.
3. **PlatformSettings singleton registration** → done (`qml/qmldir`, `CMakeLists.txt`).
4. **Flutterwave visibility + flow** → fully restored (backend service +
   `FLUTTERWAVE_PUBLIC_KEY`, PayModal + AccessGate buttons, `-flutterwave` order paths).
5. **LiveEscape downloads screen** → registered in `Main.qml` loader + CMake,
   wired to `/api/v1/downloads/list`.
6. **LiveMorph onboarding** → 8 steps (Electron parity), credits/top-up step added.
7. **LiveEscape tour** → 13 steps, stale copy fixed (FACE SWAP, native renderer).
8. **Burn-rate copy vs code** → unified on backend `credit-burn-rate` (2.0/s).

## Backend unification (no single liveescape.rs)
- Single `/api/v1` namespace; product identity via `X-Frontend-Id` / `X-Client-Product`.
- One route per movement; no `/liveescape/*` or `/livemorph/*` paths.
- Unified order engine + Flutterwave + endpoint reconciliation (`/auth/signup`,
  `/auth/logout-all`, `/credits/*`, `/downloads/list`, `/characters/mine`, `/api/v1/public/*`).

## Verification
- Backend: `cargo check` clean; `cargo test` PASS (34 total); `cargo clippy` PASS.
- Qt apps: full CMake builds PASS; qmllint clean.
- Integration tests: PASS 73/73; endpoint smoke: PASS 36/36.
- i18n: LM 351/351 strings, LE 267/267 strings — 100% translation rate.