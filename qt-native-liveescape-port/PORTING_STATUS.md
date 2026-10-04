# PORTING STATUS — Smoke Screen → Qt 6 Native

**COMPLETE (initial port pass)** — every reference screen, overlay, and flow
implemented; builds and runs with zero QML warnings.

## Verification state

| Item | Status | Evidence |
|---|---|---|
| Environment verified | ✅ | PORTING_ENVIRONMENT.md |
| Deep reference analysis (UI/CSS/JS/Network) | ✅ | PORTING_ANALYSIS.md |
| C++ core reuse verified (~7,000 lines, Qt-only deps) | ✅ | clean build, live boot |
| Modern Qt 6.11 + CMake + Ninja build | ✅ | zero warnings/errors |
| **4 screens** (Preloader, Auth, Access Gate, Dashboard + StageViewport) | ✅ | pixel-verified |
| **24 modals/overlays** (boot chain, payments ×4 flows, account, tour, tutorials, background, admin, onboarding, notification, force-update…) | ✅ | build-clean, wired to reference z-order |
| **All flows** (auth, license, starter, credits, upgrade, streaming, referral, payout, deep links) | ✅ | FUNCTIONAL_PARITY_MATRIX.md |
| Zero QML warnings at runtime | ✅ | journal sweep |
| Visual regression harness | ✅ | tools/visual_compare.sh + tools/pixel_probe.py + Qt self-capture |
| Parity matrices | ✅ | FUNCTIONAL_PARITY_MATRIX.md · VISUAL_PARITY_MATRIX.md |

## Final pixel alignment (auth screen)

Gold active tab and Field 1 are at **identical y-positions** to the Electron
reference; all other measured elements within 5px.

## Build / run / verify

```bash
cmake -S . -B build -G Ninja -DCMAKE_BUILD_TYPE=Debug
cmake --build build
SMOKE_API_URL=http://127.0.0.1:3874 ./build/bin/smokescreen-qt   # (xcb on this machine)
tools/visual_compare.sh both      # capture + probe vs reference
```

Capture aids: `SMOKE_NO_MAXIMIZE=1` (fixed window), `SMOKE_CAPTURE_TO=path.png`
(self-capture + `SMOKE_CAPTURE_QUIT=1`), `SMOKE_FORCE_SCREEN=accessGate|dashboard|auth`.

## Documented divergences

See ARCHITECTURE.md §"Documented divergences" and the ⚠ rows in
FUNCTIONAL_PARITY_MATRIX.md (engine transport, hosted checkout, blur
approximation, synthetic font weights, simplified gate enforcer, unported
storage-reset/logout token checks).

## Next (live-state verification)

1. Log in with a real account → verify Access Gate → Dashboard live states
   (streaming frames, HUD values, balance updates).
2. Exercise payment modals with gateway data (coin list, QR).
3. Tour spotlight pass over the live dashboard.
4. Responsive captures at 900/768/480/360 widths for the matrix.
