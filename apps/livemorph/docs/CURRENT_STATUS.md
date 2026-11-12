# LiveMorph Qt 1.6.0 — completed client status

## Architecture (final)

```
Auth OTP + JWT  →  credit gate
Start Morph     →  WebRtcSignalingClient  WS  →  Rust proxy (:3874)
                                                   (holds Decart key + billing)
Stage WebEngine →  morph.js WebRTC media via MorphBridge
```

No Decart API key in the desktop app. No native WebRtcPeer path.

## Build (verified)

- Qt 6.7.3 + Multimedia + WebSockets + WebChannel
- WebEngine optional (full morph needs it at package time)
- `cmake -B build -DCMAKE_PREFIX_PATH=$Qt6_DIR && cmake --build build -j`
- Offscreen smoke: process starts, QML singletons resolve, exit 0

## Included

- Auth OTP, dashboard chrome, workshop, settings/buy drawers
- Spotlight tour, help, what’s new, tooltips, notifications
- Session lifecycle, credit burn, recording + orphans
- Optional local MJPEG StreamServer for OBS
- Packaging helpers under `packaging/`

## Out of scope / server-side

- Rust API implementation (auth, credits, Decart proxy)
- Full native VCam driver
- Installer-grade auto-update UI
- Automated unit tests (none in tree)

## Run

```bash
# Backend required for auth/morph
./bin/LiveMorph
```
