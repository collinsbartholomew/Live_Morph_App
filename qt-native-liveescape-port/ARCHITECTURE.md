# ARCHITECTURE — Smoke Screen Qt 6 Port

## Principles

- **C++ owns state, services, networking, streaming.** QML owns presentation,
  layout, animation, interaction. No substantial logic in QML JS.
- The C++ core is a **verified reuse** of the predecessor LiveEscape port's
  classes (7,000 lines, function-proven against the same backend). It is
  treated as a library under `src/core/`; the QML layer is entirely new and
  fidelity-driven.
- Single source of truth: `AppController` (context property `App`) drives
  screen routing, modals, toasts, and flow state; QML binds to it.

## C++ layer (`src/core/`)

| Class | Responsibility |
|---|---|
| `ApiClient` | HTTP to the platform backend (auth, license, credits, payments, streaming, settings), endpoint discovery, WS URL derivation |
| `SessionManager` | persisted session: user, tokens, license key, credits, plan, settings mirror |
| `AppController` | application state machine: screen routing, modals, toasts, flows (auth/gate/payments/first-run), i18n routing |
| `StreamController` | streaming lifecycle: connect/pause/resume/stop, recording, freeze, snapshots, virtual camera, theatre mode, background presets, burn reporting |
| `DecartSignalingClient` | engine signaling over the backend WS proxy (offer/ICE/prompt/image) |
| `WebSocketClient` | platform realtime channel (balance, force-disconnect, notifications) |
| `UpdateChecker` | version check + forced-update download state |
| `SecureStore` | key-value persistence (OS-backed when available) |
| `MachineIdProvider` | `SS-XXXX-XXXX-XXXX(-XXXX)` device ID (parity with the Electron main-process machine ID) |

Shared native libs (unchanged, via `apps/common/`): `gstpeer` (GStreamer
WebRTC peer), `streamserver` (MJPEG/OBS server), `i18n`.

## QML layer (`qml/`, module URI `SmokeScreen`)

- `Main.qml` — `ApplicationWindow` (1200×800 → maximized; capture mode via
  `SMOKE_NO_MAXIMIZE`), screen-state `Loader` router keyed on `App.screen`.
- `theme/Theme.qml` — singleton, exact `:root` tokens from the reference CSS.
- `screens/` — one file per reference screen: Preloader, Auth, AccessGate,
  Dashboard, Maintenance.
- `modals/` — one file per reference overlay, z-order mirrored from the
  reference z-index map (0 → 100000).
- `components/` — reusable exact-CSS controls (buttons, fields, toggles,
  pills, plan tiles, crypto panel, toast host…).

## Navigation

`App.screen` (C++) × `Loader` (QML). Overlays are QML Items layered by `z`
matching the reference map; visibility is driven by `App.*` properties.
Boot sequence parity lives in `AppController::boot()` (endpoint resolution →
maintenance → session/license → gates), matching the reference `bootApp()`.

## Documented divergences (non-equivalents)

1. Engine transport: native WebRTC via `gstpeer` + backend WS signaling
   proxy instead of the browser `@decartai/sdk` (same model `lucy-2.5`);
2. Paystack/Flutterwave: external-browser checkout instead of embedded JS
   widgets (same server-side verification endpoints);
3. `backdrop-filter` blur: not available in Qt Quick — overlays use the
   reference's `rgba(4,4,10,.97)` backdrop (visually near-identical);
4. Synthetic font weights 800/900 → real Rajdhani Bold (700).
