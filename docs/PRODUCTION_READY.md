# LiveMorph — production readiness (client + backend)

Credentials (JWT_SECRET, DECART_API_KEY, PAYSTACK_*, Mongo, SMTP) are **not** baked in.
Copy `backend/.env.example` → `backend/.env` and fill values on your machine.

## Stack

| Piece | Path | Role |
|-------|------|------|
| Desktop | `LiveMorphQt/` | UI, camera, Stage WebRTC, inline Paystack WebEngine, JWT to API |
| API | `backend/` | Auth, credits, Paystack, NOWPayments (USDT), Decart WS proxy, catalog |

## Inline Paystack (WebEngine)

1. User selects pack → `POST /api/v1/payments/orders`
2. API returns `authorization_url` (Paystack hosted page)
3. **CheckoutSheet** loads that URL in embedded **WebEngine** (same capability as morph Stage)
4. On callback URL / `reference=` detection → `verifyPaymentOrder` → balance refresh
5. Without WebEngine build → system browser fallback + Recheck

No payment secrets in the Qt binary. No Decart key in the Qt binary.

## Run (your machine)

```bash
# Backend
cd backend && cp .env.example .env   # fill secrets
cargo run --release

# Desktop (with WebEngine)
cd LiveMorphQt
cmake -B build -DCMAKE_PREFIX_PATH=$Qt6_DIR
cmake --build build -j
./build/bin/LiveMorph
```

## Production gates

- [ ] `RUST_ENV=production` with strong `JWT_SECRET`, real `DECART_API_KEY`, `PAYSTACK_SECRET_KEY`
- [ ] `ALLOW_MANUAL_PAYMENTS=false`, `ALLOW_CREDITS_ADJUST=false`, `LOG_OTP_CODES=false`
- [ ] SMTP for OTP delivery
- [ ] Qt build **with** WebEngine + deploy scripts
- [ ] Code-sign installers
- [ ] Paystack webhook URL pointed at `/api/v1/payments/webhook/paystack`

## Google OAuth

Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` in backend `.env`.
Auth screen shows **Continue with Google** when `/auth/oauth/google/status` reports enabled.
Register OS protocol `livemorph://` for the desktop return deep link.

## Crypto (USDT)

Set `NOWPAYMENTS_API_KEY` (and optional IPN URL) in `backend/.env`.
Client: Buy Credits → USDT tab → invoice address + amount + status poll → auto-provision.

## Explicit non-goals in the desktop app

- Holding Decart or Paystack **secret** keys
- Authoritative credit ledger
- System virtual-camera kernel drivers
