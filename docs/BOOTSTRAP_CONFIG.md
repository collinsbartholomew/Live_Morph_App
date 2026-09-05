# Backend-driven bootstrap (product-id dispatch)

## One route family

| Path | Same handler |
|------|----------------|
| `GET /api/v1/bootstrap` | `bootstrap_handler` |
| `GET /bootstrap` | `bootstrap_handler` |

## Dispatch

```
ProductId::from_request(req)
  ├── livemorph  → bootstrap_for_livemorph()
  └── liveescape → bootstrap_for_liveescape()
```

Identity: `X-Frontend-Id` / `X-Client-Product` / `?product=`

## Shared blocks

`shared_endpoints`, `shared_credits`, `shared_payments`, `shared_decart`, `shared_ui`

Product functions **add** catalog/OTP (LM) or keys/plans/streaming (LE) endpoint maps and feature flags.

## Clients

Must send product header and apply `endpoints.*` from the response; do not hardcode WS paths.
