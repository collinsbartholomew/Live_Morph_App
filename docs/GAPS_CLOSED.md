# LiveMorph 1.6.0 — Gap closure & production status

## Parity with original Electron app

| Area | Status |
|------|--------|
| Email OTP auth | Done |
| Password auth | Done |
| Google OAuth | Done (ticket exchange, no JWT in URL) |
| Catalog / presets / custom characters | Done |
| Morph via Decart (server proxy) | Done (WebEngine WebRTC) |
| Credits + Paystack | Done |
| Crypto (NOWPayments / USDT) | Done |
| MJPEG virtual camera / OBS | Done |
| Local recording + orphan recovery | Done |
| Deep links `livemorph://` | Done |
| Updates (download + install UX) | Done |
| Tray / notifications | Done |
| Settings (API URL, model, stream) | Done |

## Intentional non-goals (unchanged)

- **Secrets in desktop binary** — rejected for security
- **Kernel VCam drivers** — optional Linux v4l2loopback; MJPEG primary (same as original)

## Production hardening summary

- Public payment webhooks + signature verification
- OAuth one-time tickets + TTL indexes
- HTTP timeouts, status-aware client, offline detection
- Signaling reconnect with backoff
- Camera hotplug, stream port fallback
- Scheme validation (API URL, openExternal, checkout)
- Single-flight token refresh
- Clean shutdown (session / record / VCam / stream)
- Boot guards for production flags and partial OAuth config

## Operator next steps

Follow `PRODUCTION_CHECKLIST.md` with real credentials and E2E smoke tests.
