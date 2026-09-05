# Platform backend settled (Actix) — dual product

**Stack:** LiveMorph Actix host  
**DBs:** `MONGODB_DB=livemorph` · `MONGODB_DB_LIVEESCAPE=liveescape`  
**Identity:** `X-Frontend-Id: livemorph | liveescape`

## Priority (LM patterns kept)

- OTP + Google under `/api/v1/auth/*` (LiveMorph)
- Pack orders + ledger under `/api/v1/payments/*` and `/api/v1/credits/*`
- Production gates (JWT, Decart, no demo top-up)
- Server-side Decart WS: `/api/v1/realtime` and `/v1/realtime`

## Live Escape (isolated DB, same process)

SmokeScreen paths on this process: auth signup/login, credits, keys, settings, streaming, starter-pack, activation, upgrade, referral, creator, support.

Paystack-first; Flutterwave/crypto stubs point back to Paystack for now.

## Shared

- Paystack + NOWPayments webhooks (dual URLs, same handlers)
- One Paystack merchant, one Decart key

## Frontend next

- LiveMorph: `X-Frontend-Id: livemorph` (done)
- SmokeScreen: point at same host + `X-Frontend-Id: liveescape`
