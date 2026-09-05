# Shared frontend/backend features — implemented

## Backend

| Feature | Endpoint / behavior |
|---------|---------------------|
| JWT refresh (LM + LE DBs) | `POST /api/v1/auth/refresh` checks both token stores |
| Credits ledger shapes | `total` + `credits` + balances + `product` |
| Decart realtime | `/api/v1/realtime` and `/v1/realtime` (product query for user DB) |
| **Balance WebSocket** | `GET /ws` and `/api/v1/ws?token=&product=` |
| Version / update | `/api/v1/update/check`, `/api/v1/version/check` (+ force/notes) |
| Support tickets | `POST /api/v1/support/tickets` (+ LE `/support/tickets`) |
| Paystack core | Existing dual webhook paths + product on orders |

### Balance WS message shape

```json
{
  "type": "balance_update",
  "product": "livemorph|liveescape",
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

## Live Escape Qt

- Default API `:3001`, product headers, Bearer JWT  
- `refreshSession()` → `/api/v1/auth/refresh`  
- `connectBalanceSocket()` → `/ws?product=liveescape`  
- AppController applies `balance_update` via `applyCreditsMap`

## Optional modules (available, not forced into LE UI)

- OBS / MJPEG (LiveMorph VirtualCameraHelper)  
- Local recording (LiveMorph RecordingManager)  
- i18n pipeline (LiveMorph Linguist catalogs)
