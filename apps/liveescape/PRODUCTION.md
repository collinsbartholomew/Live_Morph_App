# Production deployment

## Required env (`RUST_ENV=production`)

| Variable | Rule |
|----------|------|
| `JWT_SECRET` | ≥32 chars, not `change-me` |
| `DECART_API_KEY` | Real key |
| `ADMIN_SECRET` | Non-default |
| `PUBLIC_BASE_URL` | `https://api.yourdomain.com` |
| `MONGODB_URI` | Managed Mongo |
| `CORS_ORIGINS` | Comma-separated allowed origins |

Optional: Paystack / Flutterwave / NOWPayments / SMTP / crypto wallet — see `.env.example`.

## Hardening in this build

- Production refuses weak JWT / missing Decart / default admin secret
- `/keys/dev-issue` returns 403 in production
- CORS origin allow-list (no `*` in production)
- Per-IP rate limit (~120 req/min)
- 2 MB request body limit
- Paystack webhook HMAC verification
- In-app WebEngine checkout (no forced external browser)

## Reverse proxy

Terminate TLS at nginx/Caddy; proxy to `HOST:PORT`.  
WebSocket: `/v1/realtime` and balance `/ws` (second port or path-proxied).

## Desktop client

```bash
cmake -B build -DCMAKE_BUILD_TYPE=Release   # WebEngine recommended
cmake --build build -j
export LIVEESCAPE_API_URL=https://api.yourdomain.com
./build/bin/LiveEscape
```

Payments open in **PayModal** (native Qt forms + system browser fallback). Crypto payments use **CryptoProofModal**.

## Payment → Decart → user credits

Flow:

1. User pays (Paystack / Flutterwave / NOWPayments / crypto) via in-app WebEngine or crypto form.
2. Provider webhook (or crypto verify) marks order **paid**.
3. `fulfill_paid_order`:
   - Computes `decart_usd` for the plan (platform cost to reserve).
   - Calls optional `DECART_BILLING_API_URL` if set (enterprise purchase).
   - Debits **platform float** (`DECART_PLATFORM_FLOAT_USD` / `POST /admin/decart-float`).
   - Writes `decart_ledger` entry.
   - Credits user `credits_total`, sets plan, ensures access key.
   - Marks order **provisioned**.

Decart bills your **platform API key** on realtime usage. Keep the platform float ≥ reserved costs after each Decart dashboard top-up:

```bash
curl -X POST "$API/admin/decart-float" \
  -H 'Content-Type: application/json' \
  -d '{"admin_secret":"...","amount_usd":100,"note":"dashboard topup"}'
```
