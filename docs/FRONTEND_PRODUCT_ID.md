# Unified endpoints + frontend product ID

## Client identity

Every request should identify the app:

| Mechanism | Value |
|-----------|--------|
| Header **`X-Frontend-Id`** | `livemorph` or `liveescape` |
| Header **`X-Client-Product`** | same (alias) |
| Query `?product=` / `?frontend_id=` | same |
| Body `product` / `frontend_id` | where JSON body exists |
| Path heuristic | `/keys`, `/starter-pack`, `/auth/signup`, `/ws` → liveescape |

LiveMorph Qt now sends `X-Frontend-Id: livemorph` on all HTTP calls.

## Same capability → same route family

| Capability | LiveMorph UI | Live Escape UI | Unified backend |
|------------|--------------|----------------|-----------------|
| Health | `/api/v1/health` | `/health` | same handler |
| Sign-in | OTP + optional Google | Password signup/login | shared users; path/OTP differs |
| Credits read | balance + ledger | `GET /credits` | same ledger; response includes both shapes |
| Credits burn | session meter | explicit burn | `POST …/credits/burn` |
| Buy money | packs → orders | plans / starter / activation | **one Paystack**; `product` on order |
| Webhooks | `/api/v1/payments/webhook/*` | `/webhooks/*` | **same functions** |
| Decart realtime WS | `/api/v1/realtime` | `/v1/realtime` | **same WS handler** |
| Catalog / characters | Workshop catalog | — | LM only |
| License keys | — | keys validate | LE only |
| Balance push WS | — | `/ws` | LE (to be shared channel later) |
| OBS / MJPEG | local StreamServer | streaming session APIs | different layers |

## Branching rule

```text
one route → ProductId::from_request(req)
  ├── livemorph → packs, OTP-oriented responses, catalog
  └── liveescape → plan/key fields, LE response shapes
```

Uniqueness stays in **payload** (`product`, `plan`, `access_key`) and **LE-only routes**, not in a second Paystack or second Decart key.

## Frontend similarity (high level)

**Similar**
- JWT session, credits, Decart morph session, Paystack checkout, settings shell, camera/stream start/stop ideas

**Different**
- LM: character catalog, OBS helper, OTP, pack SKUs  
- LE: access keys, starter/activation/upgrade, Flutterwave, referral/creator, balance `/ws`

## Next

1. SmokeScreen `ApiClient` should set `X-Frontend-Id: liveescape`  
2. Port remaining LE commerce onto shared `POST /payments/orders` with `kind` + `product`  
3. Optional: multiplex balance events on same WS as realtime with message `type`
