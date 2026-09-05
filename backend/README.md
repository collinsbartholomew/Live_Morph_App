# LiveMorph Backend

Production Rust API: **auth · MongoDB · credits/tokens · Paystack · Decart WS signaling proxy**.

**Build status:** `cargo check` passes on rustc 1.97 (warnings only, no errors).

## Economic model (what you described)

```
User pays $20 for a pack (e.g. 3000 platform tokens)
        │
        ▼
Paystack charges the user → money settles in YOUR Paystack merchant account
        │
        ▼
Backend verifies payment (Paystack API)
        │
        ▼
Backend provisions platform tokens onto the user ledger (Mongo)
        │
        ▼
User starts morph → Decart WebRTC session
        │
        ▼
Each generation_tick debits tokens at CREDITS_PER_SECOND
        │
        ▼
Balance hits 0 → backend force-closes the signaling session
        │
        ▼
User must buy another pack to continue
```

- **User-facing “tokens”** = internal Mongo ledger (`credit_balance` + `bonus_balance`).
- **Decart** is billed from **your** `DECART_API_KEY` platform account on real generation time.
- You keep the margin between pack price and Decart cost.
- No third-party auth (no Supabase). Auth is JWT + OTP/password in this service only.

## Quick start

```bash
cp .env.example .env
# Required: MONGODB_URI, JWT_SECRET, DECART_API_KEY
# Payments:  PAYSTACK_SECRET_KEY (and optional CALLBACK_URL)

# MongoDB must be reachable
cargo run --release   # 127.0.0.1:3874
```

## Payment API

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/v1/payments/packages` | JWT | List packs (Basic/Starter/Mid/Pro) |
| POST | `/api/v1/payments/orders` | JWT | Create order → Paystack `authorization_url` |
| POST | `/api/v1/payments/orders/verify` | JWT | Verify + **provision tokens** |
| GET | `/api/v1/payments/orders/{id}` | JWT | Order status |
| POST | `/api/v1/payments/webhook/paystack` | — | Optional server webhook |

**Desktop flow**

1. Qt: `POST /payments/orders` `{ "package_key": "mid", "provider": "paystack" }`
2. Open `authorization_url` in system browser (`Backend.openExternal`)
3. User pays on Paystack
4. Qt polls / calls `POST /payments/orders/verify` `{ "order_id": "..." }`
5. On success: tokens on balance; morph allowed until depleted

**Dev without Paystack:** `provider: "manual"` on create + verify marks paid and provisions (local testing only).

## Decart realtime

```
GET WS /api/v1/realtime?token=<access_jwt>&model=lucy-2.1
```

Proxy pumps offer/answer/ICE/prompt/set_image. Media is WebRTC direct Qt ↔ Decart.  
Billing: `generation_tick` → debit ledger; insufficient → error + close.

## Env

Every variable is documented in `.env.example`.
