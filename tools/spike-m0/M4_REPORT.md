# M4 Report — End-to-End Validation

**Date:** 2026-09-03  
**Verdict:** ✅ GO — signaling chain fully operational

## Test Setup
- Backend: `livemorph-backend` on `:3874`, MongoDB on `:27017`
- Test user: `59bd5c9d-befc-4e31-903f-da65a3004070` (liveescape, 200 credits)
- Python spike harness: `gst_recv_spike.py` (sendrecv, VP8, 640x480 test-pattern)
- WS endpoint: `ws://127.0.0.1:3874/v1/realtime?token=<jwt>&model=lucy-2.5&product=liveescape`

## Result Log (full trace)
```
[20:02:18] WS connected
[20:02:18] pipeline PLAYING (sendrecv test-pattern 640x480/24 VP8)
[20:02:18] on-negotiation-needed -> create-offer
[20:02:18] local offer set (664 bytes)
[20:02:18] ws=> offer
[20:02:18] ws=> ice-candidate (x18 candidates: host + srflx)
[20:02:20] ws<= answer (VP8/90000, sendrecv, sha-256/384/512 fingerprints)
[20:02:20] remote answer applied
[20:02:20] ICE state: checking
[20:02:20] peer conn state: connecting
[20:02:20] ICE state: COMPLETED
[20:02:20] peer conn state: CONNECTED   ← DTLS+SRTP established
[20:02:20] ws=> set_image (reference face, post-answer)
[20:02:20] ws<= session_id 221853bd-...
[20:02:21] ws<= set_image_ack  success=True
[20:02:22] ws<= prompt_ack  success=True
[20:02:25] ws<= generation_started
```

## What Works (proven)
1. **Signaling:** WS connect → offer → answer → ICE candidates — all flow correctly through the proxy
2. **SDP negotiation:** webrtcbin creates VP8 offer; Decart answers with VP8/sendrecv + proper fingerprints
3. **ICE:** host + srflx candidates exchanged; ICE reaches COMPLETED state
4. **DTLS+SRTP:** peer connection state reaches CONNECTED (encrypted media channel established)
5. **set_image:** reference face sent post-answer, acknowledged success
6. **prompt:** style prompt sent, acknowledged success
7. **generation_started:** Decart begins AI morph generation

## Known Limitation
- `frames_decoded=0`: Decart budget exhausted mid-session (`"platform Decart budget exhausted"`), so media generation stopped before decode could be tested. The decode pipeline architecture is correct but untested due to billing constraint.
- **Action required:** Top up Decart account to test full media decode path.

## Key Artifacts
- `tools/spike-m0/out/gst_offer.sdp` — GStreamer VP8 offer (664 bytes)
- `tools/spike-m0/out/gst_answer.sdp` — Decart answer (1205 bytes, VP8 sendrecv)

## Architecture Summary (final)
```
┌─────────────────────────────────────────────────────┐
│  C++ App (LiveEscape / LiveMorph)                    │
│                                                      │
│  GstRtcPeer (GStreamer webrtcbin)                    │
│    ├─ appsrc → vp8enc → rtpvp8pay → webrtcbin.sink  │
│    ├─ webrtcbin.src → decodebin → appsink → QVideoSink │
│    └─ ICE/DTLS/SRTP managed by webrtcbin             │
│                                                      │
│  DecartSignalingClient (QWebSocket)                  │
│    ├─ sendOffer / sendIceCandidate                   │
│    ├─ answerReceived / remoteIceCandidate            │
│    └─ sendPrompt / sendReferenceImageBase64          │
│                                                      │
│  StreamController / SessionManager                   │
│    └─ wires GstRtcPeer ↔ DecartSignalingClient       │
└────────────────────┬────────────────────────────────┘
                     │ WS (JSON)
┌────────────────────▼────────────────────────────────┐
│  Backend Proxy (Rust/actix) :3874                    │
│    └─ Transparent SDP/ICE forwarder                  │
└────────────────────┬────────────────────────────────┘
                     │ WS (JSON)
┌────────────────────▼────────────────────────────────┐
│  Decart AI (api3.decart.ai)                          │
│    └─ VP8 decode → AI morph → VP8 encode → send      │
└─────────────────────────────────────────────────────┘
```
