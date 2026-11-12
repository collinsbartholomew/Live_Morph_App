# Shared frontend/backend features — implemented

## Backend

| Feature | Endpoint / behavior |
|---------|---------------------|
| JWT refresh (LM + secondary DBs) | `POST /api/v1/auth/refresh` checks both token stores |
| Credits ledger shapes | `total` + `credits` + balances + `product` |
| Decart realtime | `/api/v1/realtime` (product query for user DB) |
| **Balance WebSocket** | `GET /api/v1/ws?token=&product=` |
| Version / update | `/api/v1/update/check`, `/api/v1/version/check` (+ force/notes) |
| Support tickets | `POST /api/v1/support/tickets` |
| Paystack core | Existing dual webhook paths + product on orders |

### Balance WS message shape

```json
{
  "type": "balance_update",
  "product": "livemorph|secondary",
  "user_id": "...",
  "credit_balance": 0,
  "bonus_balance": 0,
  "total": 0,
  "credits": 0,
  "plan": null
}
```

```json
{ "type": "force_disconnect", "product": "...", "user_id": "...", "reason": "credits_depleted" }
```

## LiveMorph Qt

- Product headers on HTTP  
- `AuthManager::connectBalanceSocket()` after token set  
- Refresh timer (existing LM style)

## Secondary slot (no client shipped yet)

- Point at the same host, send the product header, use a Bearer JWT
- `refreshSession()` → `/api/v1/auth/refresh`
- `connectBalanceSocket()` → `/api/v1/ws?product=<SECONDARY_PRODUCT_ID>`
- AppController applies `balance_update` via `applyCreditsMap`

## Optional modules (available, not forced into the secondary client)

- OBS / MJPEG (LiveMorph VirtualCameraHelper)  
- Local recording (LiveMorph RecordingManager)  
- i18n pipeline (LiveMorph Linguist catalogs)
