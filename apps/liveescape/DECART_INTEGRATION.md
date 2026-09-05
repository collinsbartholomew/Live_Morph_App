# Decart integration — Live Escape desktop

## Data path

```
Qt DecartSignalingClient  ──WS──►  Rust /v1/realtime  ──WS──►  Decart api3
Qt DecartWebPeer (optional) ──WS──►  Rust /v1/realtime  ──WS──►  Decart api3
Qt ◄──── WebRTC media ────► Decart   (never through Rust)
```

## Build modes

| Mode | What you get |
|------|----------------|
| **No WebEngine** | Local camera + signaling HUD + connect/credits/freeze all work. AI *pixels* not shown. |
| **With WebEngine** (`SS_HAS_WEBENGINE`) | `DecartWebPeer` loads `qrc:/decart_peer.html`, runs WebRTC, shows AI output on stage. |

CMake auto-detects `Qt6::WebEngineQuick` and defines `SS_HAS_WEBENGINE`.

```bash
# Ensure WebEngine kit is installed, then:
cmake -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build -j
```

## Connect sequence

1. `POST /streaming/session-start` (license + credits check)
2. `StreamController` sets `signalingUrl` = `ws(s)://api/…/v1/realtime?user_id&access_key&model`
3. C++ `DecartSignalingClient` opens proxy WS (generation events / prompts)
4. If WebEngine linked, `DecartWebPeer` loads HTML peer with same `ws` URL
5. HTML peer: getUserMedia → RTCPeerConnection → offer → answer/ICE via proxy
6. Remote track → `<video>` → stage
7. STOP / force_disconnect → tear down peer + `POST /streaming/end`

## Prompt / background

- QML prompt field → `Stream.applyPrompt()` → `DecartSignalingClient::sendPrompt`
- Background presets → `POST /streaming/background-select` + optional prompt

## Files

| File | Role |
|------|------|
| `src/core/DecartSignalingClient.*` | C++ WS client for proxy |
| `src/core/DecartWebPeer.*` | Optional WebEngine host |
| `resources/decart_peer.html` | Browser WebRTC peer |
| `qml/components/DecartViewport.qml` | Stage: camera + peer + freeze + HUD |

## Production notes

- Never ship `DECART_API_KEY` to the client — only the Rust proxy holds it
- WS idle timeout ≥ 1h on `/v1/realtime`
- Chromium flag set: `--autoplay-policy=no-user-gesture-required`
