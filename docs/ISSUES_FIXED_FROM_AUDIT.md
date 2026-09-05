# Audit closure status (2026-08-27)

## Closed

### Backend
| ID | Fix |
|----|-----|
| B1 | Single `debit_decart_budget` per charge tick |
| B2 | NOWPayments IPN HMAC (`NOWPAYMENTS_IPN_SECRET` / `x-nowpayments-sig`) |
| B3 | OAuth tickets: user_id only; JWT on exchange |
| B5 | OTP failed attempts use `$inc` (atomic) |
| B6/B8 | `le_credits_add` always needs admin secret; positive capped amount |
| B7 | `keys/lookup` requires auth; returns only found/active |
| B11 | `/auth/export` returns real ledger + sessions (capped) |
| B10 | Paystack HMAC already constant-time fold compare |

### LiveMorph
| ID | Fix |
|----|-----|
| F1 | WebSocket opens with `Authorization: Bearer` (no JWT in query) |
| F2 | Linux SecureStore: stretched key + `v3` prefix + file mode 0600 |
| F3 | Non-loopback API URLs upgraded to `https://` |
| F4 | Camera frames marshalled via `Qt::QueuedConnection` |
| F5/F14 | Version 1.8.0 aligned |
| F7 | `Camera.currentDeviceName` instead of missing `deviceLabel` |
| F8 | `overlayTopPad` / `overlayBottomPad` defined on StageFrame |
| F9 | OTP length driven by `Auth.otpCodeLength` |

### LiveEscape
| ID | Fix |
|----|-----|
| L1 | ApiClient members declared |
| L2 | WebSocketClient 4-arg connect |
| L4 | Balance + control WS use Bearer header |
| L5 | Theme properties filled |
| L6 | `payFlutterwaveEnabled` / `payCryptoEnabled` Q_PROPERTY |
| L7 | `reachable` + `ping()` |
| L8 | `Mjpeg` context alias → Stream |
| L9 | Tour ends at step 5 (not 13) |
| L10 | `applyPrompt` calls `DecartSignalingClient::sendPrompt` |
| L17 | SecureStore in CMake + synced implementation |

### Docker / CI
| ID | Fix |
|----|-----|
| D1 | `.gitignore` blocks `.env` |
| D2 | Mongo bound to 127.0.0.1 |
| D3 | Root CI runs `cargo test` |
| D6 | Dockerfile no longer swallows `cargo build` errors |

## Remaining (explicitly deferred)
| Item | Reason |
|------|--------|
| Full libsecret / Keychain parity on Linux | Needs system library + packaging hooks; v3 store is interim hardening |
| Integration/E2E test suite | Requires live Mongo + Decart; unit suite remains |
| Docker base image digest pins | Operator policy / registry-specific |
| `cargo fmt` full tree | Non-functional; run locally before PR |
| B12 password-reset no-op for LiveEscape | Product decision if email reset is in scope |


## Second-pass audit (2026-08-29)

| Priority | Fix |
|----------|-----|
| Credit double-spend | Atomic `$expr` + `$inc` on `/credits/burn`, `/credits/adjust`, `le_credits_burn` |
| Admin secret timing | `constant_time_eq` for admin secret |
| is_active | OTP, Google OAuth, LE login |
| JWT in balance WS | LiveMorph AuthManager uses Bearer header |
| LE tokens in QSettings | Session/access key via SecureStore + migrate |
| OAuth ticket JWT at rest | Re-applied user_id-only tickets |
| Checkout createQmlObject | URL scheme gate; offTheRecord; no remote local access |
| LE HTTPS | Non-loopback forced to https |
| openExternal | http/https/mailto only |
| le_credits_add | `$inc` + ledger audit entry |
