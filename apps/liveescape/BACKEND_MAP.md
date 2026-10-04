# Qt Frontend ↔ Rust Backend Map (implemented)

## Connection

| Item | Value |
|------|--------|
| Default HTTP | `http://localhost:3874` |
| Default WS | `ws://localhost:8882` |
| Override | env `LIVEESCAPE_API_URL` |
| Boot | `GET /settings/api-endpoint` → may replace base URL |
| Cookie | `QNetworkCookieJar` (stores `le_session`) |
| LicenseAuth | headers `x-access-key`, `x-user-id`, `x-device-id` |

## Auth

| Qt | Backend |
|----|---------|
| `ApiClient::login` | `POST /auth/login` body `{email,password,device_id}` |
| `ApiClient::registerUser` | `POST /auth/signup` body `{name,email,password,device_id,accepted_terms,phone?,referral_code?}` |
| `ApiClient::logout` | `POST /auth/logout` |
| `ApiClient::logoutAll` | `POST /auth/logout-all` |
| `ApiClient::validateKey` | `POST /keys/validate` + LicenseAuth |

## Credits

| Qt | Backend |
|----|---------|
| `fetchCredits` | `GET /credits` LicenseAuth → `{total,used,remaining,plan?}` |
| `burnCredits` | `POST /credits/burn` |
| `fetchCreditBurnRate` | `GET /settings/credit-burn-rate` |
| WS `balance_update` | live credit sync |

## Streaming

| Qt | Backend |
|----|---------|
| `startStreamingSession` | `POST /streaming/session-start` |
| `endStreamingSession` | `POST /streaming/end` |
| `fetchBackgroundPresets` | `GET /streaming/background-presets` |
| `selectBackground` | `POST /streaming/background-select` |
| `fetchEngineKey` | `GET /settings/engine-key` |
| `rotateEngineKey` | `POST /settings/engine-key/next` |
| `fetchStreamingAvailability` | `GET /settings/streaming-availability` |

## Payments

| Qt | Backend |
|----|---------|
| `starterPackPay` | `/starter-pack/pay`, `pay-flutterwave`, `pay-crypto` |
| `activationPay` | `/activation/pay*` |
| `upgradePay` | `/upgrade/pay*` |
| `purchaseCredits` | `/credits/purchase` |
| `starterPackStatus` | `GET /starter-pack/status?email=` |

## WebSocket (`WebSocketClient`)

`ws://host:8882/ws?user_id=&access_key=`

| type | Handler |
|------|---------|
| `balance_update` | `SessionManager::applyCreditsMap` |
| `force_disconnect` | `StreamController::disconnectEngine` |
| `storage_reset` | clear session + `boot()` |
| `force_logout` | `logout()` |
| `dashboard_notification` | Notification modal |

Reconnect: 2500ms.

## Platform

| Qt | Backend |
|----|---------|
| `fetchPlans` | `GET /settings/plans` |
| `fetchPlatformSettings` | `GET /settings/platform-settings` |
| `fetchPaymentGateway` | `GET /settings/payment-gateway` |
| `fetchFeatureFlags` | `GET /public/feature-flags` |
| `fetchDashboardMaintenance` | `GET /settings/dashboard-maintenance` |
| `checkVersion` | `POST /version/check` platform=`linux\|windows\|macos` |

## Feature matrix (backend tiers)

- `starter`: face only
- `creator`: + background_change, creator_program, referral_earnings
- `pro` (+premium/elite packs): + live_setup_call, priority_support

Device ID pattern: `SS-XXXX-XXXX-XXXX` (MachineIdProvider) ✓

## Extra routes (full parity)

| Qt | Backend |
|----|---------|
| `requestPasswordReset` | `POST /auth/password-reset-request` |
| `resolveApiEndpoint` | `GET /settings/api-endpoint` |
| dashboard notification | `GET /settings/dashboard-notification` |
| `starterPackPay` etc. | `POST /starter-pack/pay*` , `GET /starter-pack/status`, `POST /starter-pack/confirm-crypto` |
| `activationPay` | `POST /activation/pay*` , `POST /activation/confirm-crypto` |
| `upgradePay` | `POST /upgrade/pay*` |
| `getReferralCode` | `GET /referral/my-code` |
| `attachReferral` | `POST /referral/attach` |
| payout details | `GET/POST /creator/payout-details` |
| support | `POST /support/tickets` |

All payment inits return `{order_id, provider, status, authorization_url|checkout_url, amount, credits}`.
In development, `/credits/purchase` provisions instantly; hosted gateways return redirect URLs.

## Security / admin parity (original Electron)

| Qt / flow | Backend |
|-----------|---------|
| WS `storage_reset` | clears session + LockScreen |
| WS `force_logout` | clears session + LockScreen |
| (optional poll) | `GET /public/logout-token` |
| (optional poll) | `GET /public/storage-reset-token` |
| `lookupKey` | `POST /keys/lookup` |
| `addCredits` | `POST /credits/add` |
| `completePasswordReset` | `POST /auth/password-reset` |
| renew / activate | `POST /renew`, `POST /activate` |
| admin engine | `GET /admin/engine-key` (proxy mode only) |
| NowPayments status | `GET /activation/nowpayments-status` |

## Admin (provider)

| UI | Backend |
|----|---------|
| Ctrl+Shift+A → AdminModal | — |
| Save engine key | `POST /admin/engine-key` body `{admin_secret, engine_key}` |
| Override credits | `POST /credits/add` body `{admin_secret, user_email, set_total}` |

`ADMIN_SECRET` env must match. Invalid secret → 403.
