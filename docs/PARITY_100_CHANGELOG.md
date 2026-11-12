# 100% UI/UX/Functionality parity pass — changelog

Date: 2026-08-16

## Closed gaps vs original Electron MorphMe

### Payments
- **USDT / crypto** restored via NOWPayments (original used NOWPayments-style flow).
- Backend: create invoice, status poll, auto-provision on `finished`.
- Client: Buy Credits drawer USDT tab, address/amount/status panel, 5s poll, copy address.

### Stream / Virtual camera
- StreamServer: **pause** (hold TCP server, stop frames) / **resume** (original Electron behavior).
- **Virtual camera mode** on the same MJPEG server (original “VCam” was MJPEG stream mode, not a kernel driver).
- Settings: Start/Stop OBS stream, Pause/Resume, Start/Stop virtual camera, live URL + client count.

### Recording
- Settings: orphan list with **Recover** / **Dismiss**, list recent recordings.

### System integration
- **Deep links**: `App.handleDeepLink` + argv protocol URLs (`livemorph://…`, payment callbacks).
- **OS notifications**: `App.showOsNotification` via system tray.
- Clipboard helper for crypto addresses.

### Docs
- `GAPS_CLOSED.md`, `FUNCTIONAL_PARITY.md`, `UI_PARITY_ANALYSIS.md`, `BUILD_AND_GAP_ANALYSIS.md`, `PRODUCTION_READY.md` updated.

## Intentional product differences (not bugs)

| Item | Reason |
|------|--------|
| No Google OAuth / Supabase | Product: backend email OTP only |
| No kernel virtual-camera driver | Original also used MJPEG helper; OBS Browser Source is the supported path |
| Secrets stay on server | Security improvement vs client-held Decart keys |
| Morph via Qt WebEngine | Same product intent as browser WebRTC; requires WebEngine package |

## Operator checklist for production

1. Backend `.env`: JWT, Mongo, SMTP, `DECART_API_KEY`, `PAYSTACK_*`, optional `NOWPAYMENTS_API_KEY`
2. Production flags: `ALLOW_MANUAL_PAYMENTS=false`, `ALLOW_CREDITS_ADJUST=false`, `LOG_OTP_CODES=false`
3. Qt **with WebEngine** + packaging scripts + code sign
4. E2E: OTP → Buy credits (Paystack and/or USDT) → morph → credit drain → record → OBS stream URL

## Production-proof pass (follow-up)

- **Critical:** Payment webhooks moved to **public** route scope (Paystack + NOWPayments IPN cannot send JWT)
- NOWPayments IPN handler provisions credits on `finished`/`confirmed`
- Qt **Widgets** linked for system tray OS notifications
- StreamServer `virtualCameraActive` Q_PROPERTY; Backend VC API bridges to local MJPEG
- Update Settings: download button when `update_available`
- PaymentInFlightBanner: crypto mode + auto-recheck
- StatusBar: OBS/VCAM/paused indicator
- Production boot: SMTP / NOWPayments informational warnings
- Security tests: crypto status classification + provider aliases
- Version strings aligned to **1.6.0**

## Google OAuth + Virtual camera helpers

### Google OAuth
- Backend: `GET /auth/oauth/google/start|callback|status`
- Config: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`
- Desktop: Continue with Google button, browser flow, `livemorph://oauth/callback` deep link → JWT
- User model: `google_sub` for account linking

### Virtual camera
- `VirtualCameraHelper`: MJPEG (all OS) + optional Linux **v4l2loopback** frame push
- OBS Virtual Camera / Browser Source remains the supported Windows/macOS path
- No Decart/Paystack secrets in the desktop binary (security invariant)

### Secrets policy (unchanged)
API keys for Decart, Paystack, NOWPayments, Google **client secret** stay on the server only.
