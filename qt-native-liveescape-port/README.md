# Smoke Screen — Native Qt 6 Port

A native Qt 6 (QML + modern C++) port of the Electron/HTML "Smoke Screen"
client (`LIVE-ESCAPE-BUNDLED/app/dashboard.html`, 13,887 lines), built to
**visual, behavioral and interaction parity** with the browser original.

Not a web wrapper: no Qt WebEngine, no embedded HTML, no JS runtime.

## Build

```bash
cmake -S . -B build -G Ninja -DCMAKE_BUILD_TYPE=Debug
cmake --build build
```

Requirements (verified in this environment): GCC ≥ 13 (uses C++20),
CMake ≥ 3.22, Qt 6.8+ (developed against system **Qt 6.11.2**: base,
declarative, quickcontrols2, network, multimedia, websockets),
GStreamer 1.28 dev (for the shared `common/gstpeer` WebRTC pipeline).

## Run

```bash
# Against the local backend:
SMOKE_API_URL=http://127.0.0.1:3874 ./build/bin/smokescreen-qt
```

On this machine (Hyprland/Wayland) run with `QT_QPA_PLATFORM=xcb`.

## Visual regression workflow

`tools/visual_compare.sh` captures the Qt app and the Electron reference at
matched window sizes and probes element alignment pixel-by-pixel:

```bash
tools/visual_compare.sh both     # launch both, capture, probe
tools/visual_compare.sh probe    # probe from existing captures
```

Captures land in `~/.cache/le-shots/`. The Electron reference runs from a
patched offline copy (`~/.cache/le-ref/`, remote font/script links stripped)
with a seeded chromium profile (`SMOKE_API_URL` equivalent via localStorage).

Set `SMOKE_NO_MAXIMIZE=1` to keep a fixed capture window (`StaysOnTop` so
captures are pure window pixels).

## Layout

```
src/core/        reused, verified C++ core (ApiClient, AppController,
                 SessionManager, StreamController, DecartSignalingClient,
                 WebSocketClient, UpdateChecker, SecureStore,
                 MachineIdProvider) — talks to the same backend as the
                 predecessor port, proven end-to-end.
qml/theme/       Theme.qml — exact CSS :root tokens
qml/screens/     Preloader, Auth, (Access Gate, Dashboard … in porting order)
qml/modals/      task list: consent, plan gate, pay, account, …
resources/fonts/ Rajdhani ×4 + JetBrains Mono (reference typography)
tools/           visual_compare.sh
reference/       captured reference screenshots per state
tests/           qml/ + cpp/ test scaffolding
```

## Docs

- `PORTING_ENVIRONMENT.md` — verified toolchain and environment quirks
- `PORTING_ANALYSIS.md` — full UI/CSS/JS/network specification
- `PORTING_STATUS.md` — live progress + pixel-alignment evidence
- `ARCHITECTURE.md` — C++/QML boundary and navigation design
