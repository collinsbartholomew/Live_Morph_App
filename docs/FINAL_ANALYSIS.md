# LiveMorph C++/Rust port — final production analysis

**Date:** 2026-08-16  
**Goal:** 100% UI/UX/functionality parity with the original Electron app + production readiness.

## Architecture

```
┌──────────────────────────────┐         JWT + HTTPS          ┌─────────────────────────────┐
│  Qt6 QML Desktop             │ ───────────────────────────► │  Rust Actix API             │
│  AuthManager / SessionMgr    │                              │  Auth · Credits · Catalog   │
│  MorphBridge + WebEngine     │ ◄──── WS signaling proxy ─── │  Decart WS proxy (key here) │
│  StreamServer MJPEG          │                              │  Paystack / NOWPayments     │
│  VirtualCameraHelper         │                              │  Google OAuth tickets       │
│  SecureStore tokens          │                              │  MongoDB ledger             │
└──────────────────────────────┘                              └─────────────────────────────┘
```

## Parity matrix (vs original Electron)

| Feature | Original | Port | Notes |
|---------|----------|------|-------|
| Email OTP / password auth | ✓ | ✓ | Rate limits + lockout |
| Google OAuth | ✓ | ✓ | One-time ticket exchange |
| Character catalog / presets | ✓ | ✓ | Backend + local presets |
| Live morph (WebRTC) | ✓ | ✓ | WebEngine + signaling proxy |
| Prompt / restyle | ✓ | ✓ | Via MorphBridge |
| Credits + Paystack | ✓ | ✓ | Webhook HMAC verified |
| Crypto / USDT (NOWPayments) | ✓ | ✓ | IPN + desktop invoice panel |
| Recording | ✓ | ✓ | Local camera + orphan recover |
| MJPEG virtual cam / OBS | ✓ | ✓ | Pause/resume; Linux v4l2loopback optional |
| Deep links `livemorph://` | ✓ | ✓ | OAuth + general handler |
| Updates | electron-updater | ✓ | Check / download / install UX |
| OS notifications | ✓ | ✓ | Tray path |
| Secrets in client | Partial risk | **None** | Intentional improvement |

## Intentional non-goals (by design)

1. **Kernel VCam driver** — same as original helper path: MJPEG + OBS / v4l2loopback.
2. **Secrets in desktop binary** — all provider keys stay on the server.
3. **Electron runtime** — fully replaced by Qt6.

## Hardening completed

- Public webhooks (no JWT) with signature verification  
- OAuth tickets (no JWTs in redirect URLs)  
- HTTP status + transfer timeouts on all client network paths  
- Signaling auto-reconnect with backoff  
- Camera hotplug, stream port fallback  
- URL scheme allow-lists (checkout / openExternal / API base)  
- Production boot guards (JWT length, Decart key, flags)  
- Mongo indexes (email, google_sub, payment_ref, oauth TTL)  
- Single-flight token refresh; SecureStore; aboutToQuit cleanup  
- Docker + compose for API + Mongo  
- Unit tests: webhook HMAC, email validation, credit math, public-route contract  

## Residual operator risks (cannot be coded away)

1. Configure real `.env` secrets and production flags  
2. Google Cloud OAuth client + redirect URI + desktop protocol registration  
3. Build Qt with **WebEngine**; code-sign desktop binaries  
4. TLS termination (reverse proxy) in front of API  
5. Live E2E against Paystack / NOWPayments / Decart  

## Build & run (summary)

```bash
# API
cd backend && cp .env.example .env   # fill secrets
docker compose up -d                # or: cargo run --release

# Desktop (Linux example)
cd LiveMorphQt && ./build.sh
./packaging/deploy-linux.sh
```

## Verdict

The port is **functionally at parity** for supported paths and **stricter** than the original on secret handling. It is **production-capable** once operator checklist items are completed and live E2E is green.
