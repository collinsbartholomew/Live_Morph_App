# LiveMorph — production readiness

**Versions:** desktop **1.7.0** · API **1.7.1**  
**Last hardened:** 2026-08-17

---

## 1. What “production ready” means here

| Layer | Ready when |
|-------|------------|
| **API** | `RUST_ENV=production`, strong `JWT_SECRET`, real `DECART_API_KEY`, Mongo, SMTP, Paystack secrets, webhooks reachable over HTTPS |
| **Desktop** | Qt **WebEngine** packaged, connects to your API URL, i18n `.qm` present, OBS optional for external apps only |
| **Ops** | Demo top-ups off, manual payments off, no OTP logging, TLS on the public host |

---

## 2. Required environment (API)

```bash
RUST_ENV=production
HOST=0.0.0.0
PORT=3874
PUBLIC_BASE_URL=https://api.yourdomain.com

MONGODB_URI=mongodb+srv://...
JWT_SECRET=<openssl rand -base64 48>   # ≥ 32 chars

DECART_API_KEY=dct_...
DECART_SIGNALING_URL=wss://api3.decart.ai/v1/stream
DECART_DEFAULT_MODEL=lucy-2.5

SMTP_HOST=...
SMTP_PORT=587
SMTP_USERNAME=...
SMTP_PASSWORD=...
SMTP_FROM=noreply@yourdomain.com
SMTP_STARTTLS=true

PAYSTACK_SECRET_KEY=sk_live_...
PAYSTACK_PUBLIC_KEY=pk_live_...
PAYSTACK_WEBHOOK_SECRET=   # or same as secret key
PAYSTACK_CALLBACK_URL=https://api.yourdomain.com/api/v1/payments/callback/paystack
PAYSTACK_CURRENCY=NGN

ALLOW_MANUAL_PAYMENTS=false
ALLOW_CREDITS_ADJUST=false
LOG_OTP_CODES=false
```

Optional:

```bash
NOWPAYMENTS_API_KEY=...          # enables USDT tab in desktop
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://api.yourdomain.com/api/v1/auth/oauth/google/callback
```

Startup **refuses** production boot if:

- `JWT_SECRET` &lt; 32 chars  
- placeholder / empty `DECART_API_KEY`  
- `ALLOW_MANUAL_PAYMENTS=true`  
- `ALLOW_CREDITS_ADJUST=true`  

---

## 3. Paystack dashboard

| Field | Value |
|-------|--------|
| Callback | `{PUBLIC_BASE_URL}/api/v1/payments/callback/paystack` |
| Webhook | `{PUBLIC_BASE_URL}/api/v1/payments/webhook/paystack` |

Credits unlock from **webhook** and/or desktop **verify/poll**. HMAC is required when a Paystack secret is set; production without secrets logs a warning.

---

## 4. Desktop production checklist

- [ ] Build with **Qt 6.8+** and **WebEngine** (`LIVEMORPH_WITH_WEBENGINE`)
- [ ] `qt_add_translations` / ship `i18n/*.qm`
- [ ] Point client at production API base URL (Config / settings)
- [ ] Smoke: OTP login → catalog → start session → buy credits (test mode first)
- [ ] OBS path only if users need Zoom/Teams webcam (optional)

Morph **does not require OBS**. OBS is only for system virtual camera.

---

## 5. Hardening applied in this pass

1. Fixed startup validation brace bug (Google/NOWPayments checks)
2. `/payments/packages` returns `{ packages, providers, currency }` — crypto only listed if NOWPayments configured
3. Create-order rejects `nowpayments` when API key missing
4. Desktop `Backend.paymentProviders` + Buy Credits hides USDT when not offered
5. Existing gates: demo adjust, manual payments, JWT/Decart production bailouts

---

## 6. Intentionally out of scope (still OK)

| Item | Status |
|------|--------|
| Kernel VCam driver | Use **OBS Virtual Camera** |
| Secrets in desktop binary | Server-only |
| Electron-class auto-update | Implement with your CDN + version API when ready |

---

## 7. Smoke test script

```bash
# API
curl -s https://api.yourdomain.com/api/v1/health
# OTP request (expect 200)
# Paystack initialize via app
# Complete test charge → webhook 200 → balance increases
```

Desktop: sign-in → Start LiveMorph with camera → credits decrement while active.

---

## 8. Deploy one-liner (example)

```bash
cd backend && cargo build --release
# set env from secrets manager, then:
./target/release/livemorph-backend
```

Desktop: CMake Release + windeployqt/macdeployqt/linuxdeploy including WebEngine.
