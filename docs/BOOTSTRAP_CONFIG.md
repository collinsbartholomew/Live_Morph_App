# Backend-driven bootstrap (product-id dispatch)

## One route family

| Path | Same handler |
|------|----------------|
| `GET /api/v1/bootstrap` | `bootstrap_handler` |

The API is mounted under the single `/api/v1` scope — there is no root-level
`/bootstrap` alias.

## Dispatch

```
ProductId::from_request(req)
  ├── livemorph  → bootstrap_for_livemorph()
  └── secondary → bootstrap_for_secondary()
```

Identity: `X-Frontend-Id` / `X-Client-Product` / `?product=`

The secondary slot's wire id is whatever `SECONDARY_PRODUCT_ID` is set to
(default `secondary`).

## Shared blocks

`shared_endpoints`, `shared_credits`, `shared_payments`, `shared_decart`, `shared_ui`

Product functions **add** catalog/OTP (LM) or keys/plans/streaming (secondary)
endpoint maps and feature flags.

## Clients

Must send product header and apply `endpoints.*` from the response; do not hardcode WS paths.
