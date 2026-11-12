# Production go-live checklist

## 1. Backend environment
- [ ] `RUST_ENV=production`
- [ ] `JWT_SECRET` ≥ 32 random bytes
- [ ] `MONGODB_URI` points at managed cluster (auth + TLS)
- [ ] `PUBLIC_BASE_URL` is public HTTPS origin
- [ ] `SMTP_*` verified (OTP delivery)
- [ ] `DECART_API_KEY` set
- [ ] `PAYSTACK_SECRET_KEY` + `PAYSTACK_WEBHOOK_SECRET`
- [ ] Optional: `NOWPAYMENTS_API_KEY` + IPN URL
- [ ] Optional: `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` + redirect URI
- [ ] `ALLOW_MANUAL_PAYMENTS=false`
- [ ] `ALLOW_CREDITS_ADJUST=false`
- [ ] `LOG_OTP_CODES=false`
- [ ] `CORS_ORIGINS` empty (desktop-only) or explicit list

## 2. Webhooks (must be public, no JWT)
- Paystack → `POST {PUBLIC_BASE_URL}/api/v1/payments/webhook/paystack`
- NOWPayments → `POST {PUBLIC_BASE_URL}/api/v1/payments/webhook/nowpayments`
- Google OAuth redirect → `{PUBLIC_BASE_URL}/api/v1/auth/oauth/google/callback`

## 3. Desktop packaging
- [ ] Qt **WebEngine** linked and deployed (`windeployqt` / `macdeployqt` / linuxdeploy)
- [ ] Code-sign Windows / macOS binaries
- [ ] Register `livemorph://` protocol (deploy scripts do this)
- [ ] Default API base URL points at production HTTPS API

## 4. Smoke tests
- [ ] `/api/v1/health` → mongo ok, provider flags match config
- [ ] OTP sign-in (email arrives, code works)
- [ ] Google OAuth (if enabled): ticket exchange → signed in
- [ ] Buy credits: Paystack checkout + webhook credit
- [ ] Optional crypto invoice + IPN
- [ ] Start morph: camera → WebEngine → Decart, credits debit
- [ ] Stop on zero credits
- [ ] OBS captures MJPEG stream (`http://127.0.0.1:<port>/`)
- [ ] Local recording starts/stops, orphans recoverable
- [ ] Deep link `livemorph://oauth/callback?ticket=…`
- [ ] App quit stops session, stream, VCam cleanly

## 5. Ops
- [ ] Process manager (systemd / Docker) with restart policy
- [ ] Log aggregation + alert on `status: degraded`
- [ ] Mongo indexes created on boot (`ensure_indexes`)
- [ ] Backup policy for `users`, `credit_ledger`, `payment_orders`
- [ ] Rate limits exercised under load

## 6. Security invariants
- Desktop binary must **not** contain Decart / Paystack / NOWPayments / Google client secret
- JWTs never placed in OAuth redirect URLs (ticket exchange only)
- Payment webhooks never behind JWT middleware
