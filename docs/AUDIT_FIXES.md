# Audit & fixes (backend + both frontends)

## Backend fixes
- Dual Mongo (`livemorph` / `liveescape`) retained; LE routes use `*_le` collections
- Refresh token hash unified via `hash_token` for LM + LE stores
- `POST /api/v1/auth/refresh` checks both token stores and user DBs
- Balance WS `/ws` + `/api/v1/ws` with `product` + `user_id` in all messages
- Realtime Decart proxy resolves user from product-specific DB
- Shared version/support under `/api/v1`

## LiveMorph Qt fixes
- `AuthManager` balance WS uses `setError` (no missing `errorOccurred` signal)
- Product headers + `/ws?product=livemorph`
- WebSockets already linked in CMake

## Live Escape Qt fixes
- Default API `http://127.0.0.1:3001`
- `X-Frontend-Id: liveescape`, Bearer JWT + refresh
- `applyCreditsMap` understands unified `credits` / `credit_balance` shapes
- Balance: `ApiClient::connectBalanceSocket` + `WebSocketClient` JWT query for `/ws`
- `SS_HAS_WEBSOCKETS` compile definitions in CMake; guarded QWebSocket includes
- WS base URL same host/port as HTTP (unified)

## Not fully verifiable in this environment
- `cargo check` blocked by host Cargo 1.75 vs edition2024 crates (use Rust ≥ 1.83 locally)
- Full Qt rebuild needs local Qt 6.5+ / 6.8 with WebEngine (LM) and WebSockets

## Theme / orientation
- No forced orientation changes in this pass; both remain desktop window apps
- Shared backend does not affect QML theme tokens (LM Colors/Theme; LE keeps its own)
