# Production analysis — LiveMorph Platform (2026-08-26)

## Architecture
| Layer | Role |
|-------|------|
| `backend/` | Single Actix API; product via `X-Frontend-Id` / `X-Client-Product` (`livemorph` \| `liveescape`) |
| `apps/livemorph/` | Qt6 morph studio (WebEngine stage, MJPEG, credits) |
| `apps/liveescape/` | Qt6 face-swap studio (reference face, Decart, plans/keys) |

## Verification this run
| Check | Result |
|-------|--------|
| `cargo check` (Rust 1.88) | **PASS** (0 errors, warnings only) |
| Security hardening tests | **15/15 PASS** |
| LiveMorph QML static | **PASS** |
| LiveEscape QML static | **PASS** |
| Qt desktop link | Not run (no Qt6 in CI host) |

## Bugs fixed this pass
1. Paystack metadata `platform` was hardcoded `livemorph` — now uses order product / `"liveescape"` on LE routes
2. LiveEscape `X-Device-Id` header casing normalized
3. LiveEscape tour step limit C++ (13 → 5) aligned with TourOverlay
4. LiveEscape API `reachable` + offline banner + panel collapse

## Production gates (backend boot)
- JWT secret ≥32 in production
- DECART_API_KEY required in production
- ALLOW_MANUAL_PAYMENTS / ALLOW_CREDITS_ADJUST must be false
- LOG_OTP_CODES must be false
- Public payment webhooks (no JWT)
- Dual Mongo DBs: livemorph + liveescape

## Operator checklist
1. `RUST_ENV=production` + real secrets + SMTP + HTTPS PUBLIC_BASE_URL
2. Register Paystack/NOWPayments webhooks
3. Build both apps with Qt6 WebEngine where required
4. E2E per product: auth → pay → live session

## Non-goals
- Kernel VCam (MJPEG/OBS path)
- Secrets in desktop binaries
