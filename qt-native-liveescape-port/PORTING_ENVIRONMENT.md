# PORTING ENVIRONMENT

Verified on this machine (all commands executed, none assumed):

## OS
- Arch Linux, kernel 6.x, Hyprland 0.56.2 (Wayland compositor) + Xwayland
- Qt GUI apps run via `QT_QPA_PLATFORM=xcb` (native Wayland crash observed on this system)

## Toolchain
| Component | Version | Verified via |
|---|---|---|
| Compiler | g++ (GCC) 16.2.1 20260810 | `g++ --version` |
| C++ standard | C++20 (project default), C++23 capable | GCC 16 |
| CMake | 4.4.3 | `cmake --version` |
| Ninja | 1.13.2 | `ninja --version` |
| Make | GNU Make 4.4.1 | `make --version` |

## Qt (chosen: system Qt 6.11.2)
| Package | Version | Notes |
|---|---|---|
| qt6-base | 6.11.2-3 | Core/Gui/Widgets/Network |
| qt6-declarative | 6.11.2-1 | Quick/QuickControls2/QML — the UI layer |
| qt6-multimedia | 6.11.2-3 | Camera/recording (ffmpeg backend n9.0.1) |
| qt6-websockets | 6.11.2-1 | Balance/realtime WS |

- `qmake` on PATH is **Qt 5.15.19** — IGNORED; the project uses CMake exclusively.
- QML tools available: `qml`, `qmllint`, `qmlscene` (basic 1.0 linter; type-checking done via qmlcachegen in the build).
- No Qt WebEngine installed — irrelevant, WebEngine is forbidden by the porting rules anyway.

## Fonts (bundled in `resources/fonts/`)
- Rajdhani Regular/Medium/SemiBold/Bold (Google Fonts, OFL) — the reference app's UI font (`--font: 'Rajdhani'`).
- JetBrains Mono Variable (OFL) — the reference app's mono font (`--mono: 'JetBrains Mono'`).
- Also installed system-wide at `~/.local/share/fonts/liveescape/` (with `fc-cache`) so the reference-rendering chromium picks them up.

## Local services (the app's client-side network targets)
- Rust/Actix backend at `http://127.0.0.1:3874` (product rails: livemorph + liveescape, Google OAuth enabled) — runs as systemd user unit `liveescape-backend2.service`.
- MongoDB 7 at `127.0.0.1:27017` (backend dependency).
- **No internet access.** The reference app's production defaults are unreachable; all reference captures are made against the local backend via a seeded chromium profile.

## Reference rendering harness (proven on this machine)
- Patched offline copy of the Electron app at `~/.cache/le-ref/` (Google Fonts/Paystack/Flutterwave remote scripts stripped; fonts resolve locally).
- Seed page sets `localStorage`: `ss_api_url`, `ss_api_active_url`, `ss_api_endpoint_config` → `http://127.0.0.1:3874`, plus `ss_consent_v1`.
- Chromium app-mode window via `systemd-run --user` (needs `DISPLAY`/`HOME`/`XDG_*` env; plain unit env lacks them), floated via `hyprctl`, captured with `grim` and cropped with ImageMagick (`magick`).
- `/tmp` is aggressively wiped on this machine — all artifacts live under `~/.cache/` or the repo.

## Build commands (documented once CMake exists)
```
cmake -S . -B build -G Ninja -DCMAKE_BUILD_TYPE=Debug
cmake --build build
./build/smokescreen-qt          # QT_QPA_PLATFORM=xcb on this machine
```

## Known environment quirks affecting the port
1. VDPAU warning on launch (`libvdpau_nvidia.so` missing) — harmless; muted GPU path works.
2. Qt singletons cannot use the `Screen` attached property — viewport width must be pushed from the `ApplicationWindow` (established in the predecessor project).
3. Headless chromium `--screenshot` renders a blank compositor frame for this app — only real GUI-window captures via `grim` are valid references.
