# Unified endpoints + frontend product ID

## Client identity

Every request should identify the app:

| Mechanism | Value |
|-----------|--------|
| Header **`X-Frontend-Id`** | `livemorph` or the secondary product id |
| Header **`X-Client-Product`** | same (alias) |
| Query `?product=` / `?frontend_id=` | same |
| Body `product` / `frontend_id` | where JSON body exists |

LiveMorph Qt sends `X-Frontend-Id: livemorph` on all HTTP calls. The **secondary**
slot answers to `secondary` by default; the backend's `SECONDARY_PRODUCT_ID` env var
changes that wire id (clients then send the configured value instead). An unknown
product id falls back to `livemorph`.

There is **no path heuristic** — product identity comes from headers/query only
(`backend/src/product.rs`).

## Same capability → same route family

Everything lives under the single `/api/v1` scope; there are no product-named paths.

| Capability | LiveMorph UI | Secondary slot | Unified backend |
|------------|--------------|----------------|-----------------|
| Health | `/api/v1/health` | same | one handler, both DBs pinged |
| Sign-in | OTP + optional Google | Password signup/login | shared handlers, product-scoped user store |
| Credits read | balance + ledger | `GET /credits/balance` | same ledger, product-scoped collection |
| Credits burn | session meter | explicit burn | `POST /credits/burn` |
| Buy money | packs → orders | plans / starter / activation | **one Paystack**; `product` on the order |
| Webhooks | `/api/v1/payments/webhook/*` | same | **same functions** |
| Decart realtime WS | `/api/v1/realtime` | same | **same WS handler** |
| Catalog / characters | Workshop catalog | — | LM only |
| License keys | — | `POST /keys/validate` | secondary slot only |
| Balance push WS | — | `/api/v1/ws` | product-scoped balance channel |
| OBS / MJPEG | local StreamServer | streaming session APIs | different layers |

## Branching rule

```text
one route → ProductId::from_request(req)
  ├── livemorph → packs, OTP-oriented responses, catalog
  └── secondary → plan/key fields, secondary response shapes
```

Uniqueness stays in **payload** (`product`, `plan`, `access_key`) and in the
secondary-only routes (`/keys/*`, `/starter-pack/*`, `/activation/*`, `/upgrade/*`),
not in a second Paystack or a second Decart key.

## Data isolation

Each slot owns a Mongo database:

| Slot | Env |
|------|-----|
| LiveMorph | `MONGODB_DB` (default `livemorph`) |
| Secondary | `MONGODB_DB_SECONDARY` (defaults to `SECONDARY_PRODUCT_ID`) |

`Config::validate()` rejects the two pointing at the same database.

## Frontend similarity (high level)

**Similar**
- JWT session, credits, Decart morph session, Paystack checkout, settings shell, camera/stream start/stop ideas

**Different**
- LM: character catalog, OBS helper, OTP, pack SKUs
- Secondary: access keys, starter/activation/upgrade, Flutterwave, referral/creator, balance `/ws`

## Next

1. The next desktop client sets `SECONDARY_PRODUCT_ID` (and optionally
   `MONGODB_DB_SECONDARY`) — no Rust change is needed to claim the slot.
2. Port any remaining secondary commerce onto shared `POST /payments/orders` with `kind` + `product`.
3. Optional: multiplex balance events on same WS as realtime with message `type`.
