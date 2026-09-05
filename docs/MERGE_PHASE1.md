# Backend merge phase 1 — Live Escape on LiveMorph (Actix) stack

**Host:** LiveMorph Actix-web (`livemorph-backend`)  
**Date:** 2026-08-18

## Done (safe joins)

| Area | LiveMorph path | Live Escape path | Notes |
|------|----------------|------------------|-------|
| Health | `GET /api/v1/health` | `GET /health` | Shared Mongo ping; platform banner |
| Paystack webhook | `POST /api/v1/payments/webhook/paystack` | `POST /webhooks/paystack` | **Same handler**, one merchant |
| NOWPayments IPN | `POST /api/v1/payments/webhook/nowpayments` | `POST /webhooks/nowpayments` | Same handler |
| Pay callback | `GET /api/v1/payments/callback/paystack` | `GET /pay/callback` | Same handler |
| Credits balance | `GET /api/v1/credits/balance` | `GET /credits` | Same ledger |
| Credits burn | `POST /api/v1/credits/burn` | `POST /credits/burn` | Shared spend + ledger |
| Password auth | `POST /api/v1/auth/register|login` | `POST /auth/signup|login` | Shared users; LE sets `product=liveescape` |
| Logout | `/api/v1/auth/logout*` | `/auth/logout`, `/auth/logout-all` | Shared refresh token store |

## Unique (distinct endpoints / fields)

| Feature | Path / identifier |
|---------|-------------------|
| OTP / Google | `/api/v1/auth/otp/*`, `/api/v1/auth/oauth/google/*` (LM only) |
| Access keys | `POST /keys/validate`, `POST /keys/dev-issue` + `User.access_key` / `plan` |
| Product tag | `User.product` = `livemorph` \| `liveescape` |
| Pack orders | `/api/v1/payments/orders*` (LM) |
| Feature flags / version | `GET /public/feature-flags`, `POST /version/check` (LE stubs) |

## Not yet ported (next phases)

- Starter-pack / activation / upgrade / renew commerce  
- Flutterwave webhooks  
- Streaming session + backgrounds  
- Settings (plans, engine-key, platform-settings)  
- Referral, creator payouts, support tickets  
- Admin engine-key / decart-float  
- Balance WS `/ws`  
- Alias `/v1/realtime` → existing Decart proxy  

## Files touched

- `src/models/user.rs` — `product`, `access_key`, `plan`, `device_id`  
- `src/models/access_key.rs` — new  
- `src/db/mod.rs` — `access_keys()`  
- `src/routes/payments.rs` — `configure_webhook_aliases`  
- `src/routes/credits.rs` — `POST /credits/burn`  
- `src/routes/liveescape.rs` — **new** LE-compatible tree  
- `src/main.rs` — mount root LE + webhook aliases  
- `src/routes/auth.rs` — `store_refresh` public  

## Client impact

- SmokeScreen can point at the **same host** as LiveMorph for health, auth signup/login, credits, keys, Paystack webhooks.  
- Paystack dashboard: one webhook URL is enough; both path aliases work.  
