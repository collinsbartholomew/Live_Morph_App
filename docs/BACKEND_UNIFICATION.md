# Backend unification — LiveMorph + Live Escape

**Stacks:** LiveMorph = **Actix-web** `/api/v1/*` · Live Escape = **Axum** root paths  
**Goal:** One deployable API where endpoints merge **only** when behavior is the same (or can be unified); uniqueness preserved for product-specific flows.  
**Payments:** **One** Paystack merchant / one webhook pipeline; orders tagged by `product`.

---

## 1. Framework reality

| | LiveMorph | Live Escape |
|--|-----------|-------------|
| HTTP | actix-web 4 | axum |
| Port (dev) | 3001 | 8881 (+ WS 8882) |
| Mongo DB name | `livemorph` | `liveescape` |
| JWT issuer | `livemorph` | `liveescape` |
| Auth style | OTP (+ optional Google, password register exists) | Email/password signup + login + **access keys** |
| Credits model | Packs (spark/…) + per-second burn | **Plans** (starter/pro/…) + burn + starter-pack/activation/upgrade |
| Extra rails | Paystack, NOWPayments | Paystack, NOWPayments, **Flutterwave**, manual crypto |
| Product features | Catalog characters, MJPEG/OBS, recording stubs | Engine keys, referral, creator payouts, feature flags, tiers |

**Recommendation:** Host **one Actix (or one Axum) process** with **two route trees** + **shared services** (Paystack, SMTP, Decart proxy, JWT helpers). Do **not** force a single auth UX or a single credit product model.

---

## 2. Endpoint merge matrix

### MERGE (same job → one implementation)

| Concern | LiveMorph | Live Escape | Unified approach |
|---------|-----------|-------------|------------------|
| Health | `GET /api/v1/health` | `GET /health` | One handler; **both paths** as aliases |
| JWT refresh/logout patterns | `/auth/refresh`, `/logout`, `/logout_all` | `/auth/logout`, `/auth/logout-all` | Shared token store; dual path names |
| Me / profile | `POST /auth/me` | (via credits/user) | Shared user public view |
| Credits balance | `GET /credits/balance` | `GET /credits` | One balance read; dual paths |
| Credit burn | realtime proxy deduct | `POST /credits/burn` | Shared ledger `spend()` |
| Paystack webhook | `/api/v1/payments/webhook/paystack` | `/webhooks/paystack` | **One** verifier + fulfill; **both URLs** |
| Paystack callback page | `/api/v1/payments/callback/paystack` | `/pay/callback` | One HTML handler; both paths |
| NOWPayments IPN | `/payments/webhook/nowpayments` | `/webhooks/nowpayments` | One IPN handler; both paths |
| Decart realtime WS | `/api/v1/realtime` | `/v1/realtime` | One proxy; both paths (auth query differs → normalize) |
| ICE servers | `/webrtc/ice-servers` | (TURN in settings) | Shared TURN env |

### KEEP UNIQUE (do not force-merge)

| Live Escape only | Why unique |
|------------------|------------|
| `/keys/validate`, `/keys/dev-issue`, `/keys/lookup` | Access-key product model |
| `/starter-pack/*`, `/activation/*`, `/upgrade/*`, `/renew`, `/activate` | Plan commerce, not LM packs |
| `/referral/*`, `/creator/payout-details` | Creator program |
| `/settings/plans`, `platform-settings`, `payment-gateway`, `engine-key*` | LE platform config |
| `/public/feature-flags`, version/check | LE client gates |
| `/streaming/*` session + backgrounds | LE streaming domain |
| `/ws` balance push | LE realtime UX |
| Flutterwave webhooks + `*-pay-flutterwave` | Extra rail (optional module) |
| Admin `/admin/*` | LE ops |

| LiveMorph only | Why unique |
|----------------|------------|
| `/auth/otp/*`, Google OAuth ticket | Passwordless desktop UX |
| `/payments/packages`, `/payments/orders*` | Pack checkout |
| `/catalog` | Character library |
| `/stream/*`, `/vc/*`, `/recording/*` | Desktop intent (mostly local) |

### Auth — parallel, not mashed

| | LiveMorph | Live Escape |
|--|-----------|-------------|
| Primary | OTP email code | Password signup/login |
| Optional | Google OAuth (own client id) | Password reset |
| Extra | — | Device/access **keys** |

**Env:** separate OAuth clients if both use Google:

```env
# LiveMorph Google
LM_GOOGLE_CLIENT_ID=
LM_GOOGLE_CLIENT_SECRET=
LM_GOOGLE_REDIRECT_URI=

# Live Escape Google (if ever added) or keep password-only
LE_GOOGLE_CLIENT_ID=
LE_GOOGLE_CLIENT_SECRET=
```

Or single Google app with two redirect URIs — still **two redirect env keys** for clarity.

JWT: either  
- **one** `JWT_SECRET` + `iss` claim = `livemorph` | `liveescape`, or  
- `LM_JWT_SECRET` / `LE_JWT_SECRET` if full isolation required.

### Payments — one rail, tagged uniqueness

```env
# SHARED (one merchant)
PAYSTACK_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=
PAYSTACK_WEBHOOK_SECRET=
PAYSTACK_CURRENCY=NGN

NOWPAYMENTS_API_KEY=
NOWPAYMENTS_IPN_SECRET=

# OPTIONAL LE-only
FLUTTERWAVE_SECRET_KEY=
FLUTTERWAVE_PUBLIC_KEY=
FLUTTERWAVE_SECRET_HASH=
```

Order document always includes:

```json
{ "product": "livemorph" | "liveescape", "kind": "pack" | "plan" | "starter_pack" | "activation" | "upgrade", ... }
```

Fulfillment switches on `product` + `kind` (credits pack vs plan credits vs activation flag).

### Data isolation

| Approach | Use when |
|----------|----------|
| **Two Mongo DBs** on one cluster (`livemorph`, `liveescape`) | Strongest isolation (recommended default) |
| One DB + `product` field on every collection | Simpler ops, careful queries |

Shared Paystack webhook looks up order in **both** DBs or unified `orders` collection with `product`.

---

## 3. Target URL map (single process)

```
Shared:
  GET  /health
  GET  /api/v1/health          → same handler
  POST /webhooks/paystack
  POST /api/v1/payments/webhook/paystack  → same
  GET  /pay/callback
  GET  /api/v1/payments/callback/paystack → same
  WS   /api/v1/realtime  and  /v1/realtime

LiveMorph tree (unchanged clients):
  /api/v1/auth/*  /api/v1/credits/*  /api/v1/payments/orders*
  /api/v1/catalog  /api/v1/stream/*  …

Live Escape tree (unchanged SmokeScreen clients):
  /auth/signup  /auth/login  /keys/*  /credits  /credits/burn
  /starter-pack/*  /activation/*  /upgrade/*  /settings/*  /ws  …
```

---

## 4. Implementation issues found (both)

### LiveMorph
- Intent-only `/stream` `/recording` on server (fine if documented)
- Packages/providers soft-gate (good)
- Production bailouts for demo adjust (good)

### Live Escape
- Many pay entrypoints (starter/activation/upgrade × paystack/flutterwave/crypto) → **high duplication risk**; should share one `initialize_payment(product, kind, meta)` 
- `/credits/add` must stay admin-gated in production
- Long-lived JWT default (604800s) vs LM 900s — **keep product-specific TTL envs**
- `ADMIN_SECRET` required in prod (good)
- Framework split (Axum vs Actix) is the main combine cost

### Cross-cutting
- Do not share refresh tokens across products without `iss`/`aud` checks  
- Webhook URL in Paystack dashboard: prefer **one** canonical path; alias the other  

---

## 5. Phased combine plan

1. **Shared crate** `platform_pay` + `platform_mail` + `platform_jwt` (extract from either tree)  
2. **Single binary** mounts LM routes + LE routes (port LE handlers to Actix **or** LM to Axum — pick one framework)  
3. **Alias** health + Paystack/NOWPayments webhooks  
4. **Env** file: shared Paystack/Decart/SMTP; unique JWT issuer, DB name, OAuth, Flutterwave  
5. **Do not** merge starter-pack into LM packs or OTP into LE password without client changes  

---

## 6. Env template (combined)

See `UNIFIED.env.example` beside this file.

---

## 7. Verdict

| Merge? | Items |
|--------|--------|
| **Yes** | Health, Paystack webhook/callback, NOWPayments IPN, credit ledger primitives, Decart WS proxy, optional ICE |
| **No** | LE keys/plans/starter/activation/referral/creator; LM OTP/catalog/OBS intent APIs |
| **Payments** | **One** Paystack (+ optional shared NOWPayments); Flutterwave stays LE-only module |
| **OAuth/JWT/DB** | Unique keys / issuers / DB names where isolation matters |

Full mechanical port of `extra.rs` (~36KB) into Actix is the bulk of the remaining engineering; this document is the contract so uniqueness is not lost while shared rails are not duplicated.
