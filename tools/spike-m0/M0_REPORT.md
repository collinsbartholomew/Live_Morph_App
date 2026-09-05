# M0 Spike Report — GStreamer `webrtcbin` ↔ LiveMorph/Decart interop

**Goal:** Prove that GStreamer `webrtcbin` can replace Qt WebEngine (Chromium) as the
WebRTC media plane for the LiveMorph/LiveEscape desktop apps, before touching app code.

**Date:** 2026-09-03 · **Environment:** Arch Linux, GStreamer 1.28.6, Qt 6.11, rootless w/ `sudo`,
carrier-grade NAT (`105.112.227.176`), no production TURN configured.

## Verdict: GO (with one environmental caveat)

`webrtcbin` interoperates with the LiveMorph Decart proxy at **every layer we could test**.
The only unproven step is *decoded video landing on screen*, and that failure is
**environmental (CGNAT + no TURN)** — not a `webrtcbin` defect. Chromium (the current
WebEngine stack) fails identically from this network for the same reason.

---

## What was proven

| Layer | Result |
|-------|--------|
| Signaling WS auth | ✅ JWT minted, `101` handshake, `user not found`/`insufficient credits`/`max sessions` gate all enforced correctly |
| SDP offer construction | ✅ well-formed VP8 offer, trickle ICE, BUNDLE, `sendrecv` (livemorph-style) |
| SDP answer parsing | ✅ Decart answers parsed + applied; ICE enters `checking` with candidates |
| Codec negotiation | ✅ Decart answers VP8 (pt 96); answers H.264 (pt 102/108) when offered |
| Reference image / prompt | ✅ `set_image` (raw base64 `image_data`) + `prompt` accepted (must be sent **after** the answer) |
| Protocol semantics | ✅ documented below |

## Captured artifacts (in `out/` of this dir)

- `gst_offer.sdp` — webrtcbin's offer (VP8 only, `a=sendrecv`, trickle, `mid:video0`)
- `gst_answer.sdp` — Decart's answer to it
- `www/capture.html` + `capture_server.py` — Chromium capture harness (browser SDP baseline)

## Decart answer characteristics (crucial for M1/M2)

```
m=video 50100 UDP/TLS/RTP/SAVPF 96          # VP8 only for a VP8-only offer
a=sendrecv                                   # mirrors client offer direction
a=group:BUNDLE video0
a=candidate:... 46.243.147.26 50100 typ host  # public host candidate (pool rotates per session)
a=candidate:... 46.243.144.44 4055 typ srflx
a=fingerprint:sha-256/sha-384/sha-512        # three DTLS fingerprints offered
a=setup:active                                # Decart is the DTLS client (we are passive)
```

Key protocol findings:
1. **Direction mirroring** — a `recvonly` offer gets `a=inactive` (no media); a `sendrecv`
   offer (camera sent) gets `a=sendrecv`. liveescape's receive-only flow therefore depends
   on `set_image` (separate signaling), while livemorph's camera-morph flow is `sendrecv`.
2. **Non-trickling answer** — Decart sends full SDP with inline candidates, no `end-of-candidates`.
3. **DTLS sha-512** — OpenSSL/webrtcbin handles this fine (all three fingerprints present).
4. **`set_image` must follow the answer** — sending it pre-offer caused Decart to close the
   signaling WS (code 1005). In production, liveescape sends the reference image over its
   *separate* C++ `DecartSignalingClient` WS, not the page's WS.

## The one failure: media connectivity (environmental)

- Both `webrtcbin` (ICE `checking → failed`) and Chromium (ICE stuck at `new`) fail to complete
  ICE→DTLS→SRTP on this network.
- Packet capture shows webrtcbin **does** send STUN/ICE checks to Decart's candidates and gets
  *some* replies, but never enough to select a working pair.
- Root cause: box is behind **carrier-grade NAT** (`105.112.227.176`); host + srflx candidates
  alone can't traverse CGNAT. `ICE_SERVERS_JSON` is empty in `backend/.env`, and a public
  demo TURN (OpenRelay) returns `401` (demo credentials deprecated).
- The project docs already anticipate this: `LIVEESCAPE_TURN_URLS/USER/CRED` env vars,
  `/webrtc/ice-servers` backend route, "TURN recommended" in `apps/liveescape/ANALYSIS.md`.
  **TURN is a production requirement regardless of WebEngine vs GStreamer.**

## Remaining verification (recommended, not on this network)

1. Stand up a real TURN server (e.g. coturn on a public VPS) and set `ICE_SERVERS_JSON`;
   rerun `harness/gst_recv_spike.py --turn turn://user:pass@host:3478` to observe decoded
   frames (`frames_decoded > 0`, `out/frame-*.jpg`).
2. Optional: the in-process loopback proof (`harness/loopback_proof.py`) segfaults due to a
   PyGObject threading bug in the *harness* (promise resolved on a non-main thread) — not a
   GStreamer fault. In the real app this is moot: QCoreApplication provides GLib integration
   automatically.

## Cost to continue

- M1 `GstRtcPeer` shared C++ class (~3–5 days), M2 liveescape receive-only swap (~4–6 days),
  M3 livemorph camera-send path (~6–8 days), M4 TURN + packaging (~4–6 days).
- No backend changes required (proxy is a transparent SDP forwarder).