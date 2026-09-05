# Decart media — proxy + Stage WebEngine

## Product architecture (matches original)

```
Desktop app                          Your Rust API (:3001)              Decart
───────────                          ────────────────────              ──────
Auth OTP ──────────────────────────► JWT / session
Credits balance ◄─────────────────── ledger / burn
                                     holds DECART_API_KEY
Start Morph
  ├─ credit gate (local + server)
  ├─ WebRtcSignalingClient ──WS────► /api/v1/realtime?token=JWT&model=
  │                                   └─ proxies signaling ───────────► Decart WS
  └─ Stage WebEngine (morph.js)
       RTCPeerConnection ◄── SDP/ICE via MorphBridge / QWebChannel ──► (via proxy)
       getUserMedia + remote track = morph video
```

- **No Decart API key in the desktop client.** Auth, credits, and Decart credentials live on the backend.
- **WS is session-scoped** — opened when morph starts, closed when it stops (not a permanent connection).
- **Media** is browser WebRTC inside Stage only (bundled Qt WebEngine).

## Removed (orphaned)

- Native `WebRtcPeer` + `VideoCodec` (libdatachannel stub path)
- Direct `DecartClient` WebSocket with client-side API key

## Build

```bash
cmake -B build -DCMAKE_PREFIX_PATH=/path/to/Qt   # needs WebEngine + WebChannel
cmake --build build -j
```

Without WebEngine, Stage shows local camera only.
