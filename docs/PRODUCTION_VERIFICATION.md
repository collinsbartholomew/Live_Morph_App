# Production verification status

## What was verified in-repo (static)

| Area | Status |
|------|--------|
| Bootstrap product-id dispatch (`bootstrap_for_livemorph` / `liveescape`) | Implemented |
| Dual path `/api/v1/bootstrap` + `/bootstrap` same handler | Implemented |
| PaymentOrder.product field + create_order | Fixed (was compile-break) |
| Dual Mongo + LE routes + device activation | Implemented |
| JWT refresh both DBs | Implemented |
| Balance WS + config_update | Implemented |
| Production gates in main (JWT, Decart, manual pay, adjust) | Present |
| LM/LE clients fetchBootstrap + apply endpoints | Wired |
| Qt 6.8 both apps | CMake pins |
| Device key field `key`/`access_key` | Fixed |

## What you must run locally (this sandbox cannot)

```bash
rustup default 1.85.0   # or newer
cd port/backend
cp .env.production.template .env   # fill secrets
# start MongoDB
cargo build --release && cargo run --release

bash scripts/endpoint_smoke.sh
# expect PASS on health, bootstrap, register, credits, LE signup, etc.
```

## Production env

Use `backend/.env.production.template`:

- `RUST_ENV=production`
- `PUBLIC_BASE_URL=https://api…` (drives bootstrap WS URLs)
- Strong `JWT_SECRET` (≥32)
- `DECART_API_KEY`, Paystack live keys, SMTP
- `ALLOW_MANUAL_PAYMENTS=false`, `ALLOW_CREDITS_ADJUST=false`
- `MONGODB_DB` + `MONGODB_DB_LIVEESCAPE`
- Bump `CONFIG_REVISION` when changing rates/flags so clients re-bootstrap

## Residual risks (honest)

1. Full `cargo`/`cmake` not executed in this environment (old Rust / no Qt kit).
2. Paystack/Decart live E2E needs real keys + public webhook URL.
3. Flutterwave remains intentionally stubbed on unified host (Paystack-first).
4. Clients need a seed API host once; after bootstrap, server URLs win.

## Frontends

| Client | Seed | Bootstrap | Auth | Critical paths |
|--------|------|-----------|------|----------------|
| LiveMorph | ConfigManager apiBaseUrl | fetchBootstrap | JWT + refresh | Stage needs WebEngine |
| Live Escape | 127.0.0.1:3001 or env | fetchBootstrap | JWT + keys | Activation device bind |
