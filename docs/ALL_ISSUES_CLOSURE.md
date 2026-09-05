# Full issue closure pass (2026-08-29)

This documents the third hardening pass aiming to close remaining audit items.

## Critical / High closed this pass
- Removed deep-link acceptance of `access_token` / `refresh_token` query params
- `decartApiKey` Q_PROPERTY always returns empty (keys server-side only)
- Profile email/userId + export JSON moved to SecureStore
- OTP failed-attempt TOCTOU closed via conditional `$inc` with `$lt` max
- Webhooks fail closed when secret missing (all environments)
- LiveEscape password reset fully wired (hashed token, SMTP, consume-once)
- `le_keys_dev_issue` requires admin secret + non-production
- `le_credits_add` atomic `$inc` + ledger (prior)
- Credit burn/adjust atomic (prior)
- Refund requires `ALLOW_CREDITS_ADJUST` always
- Support/creator endpoints require auth and do not echo body
- Provider error messages sanitized (Paystack/Google)
- Admin panel UI requires licensed session

## Medium / Low closed this pass
- CSP + Cache-Control no-store + Permissions-Policy headers
- Logout rejects short refresh tokens
- StreamServer JPEG backpressure (skip slow clients)
- WebSocket reconnect exponential backoff
- Recording elapsed timer single instance + stop on end
- LE signup/login email uses shared `validate_email`
- Access key generation uses `OsRng`
- User::spend rounds to 4dp and clamps negatives (f64 drift mitigation)
- LiveEscape openExternal scheme allowlist (prior)
- HTTPS force non-loopback (prior)

## Intentionally limited / residual risk
- **Full integer millicredit ledger**: would require DB migration + API versioning; 4dp rounding is the interim mitigation
- **libsecret/Keychain on Linux**: still v3 machine-bound store + 0600 files; true OS keyring needs packaging deps
- **`createQmlObject` for optional WebEngine**: still used so builds without WebEngine load; URL scheme gated and off-the-record
- **Demo auth under QT_DEBUG only**: remains for local UI work without backend
- **E2E / load tests**: not in-tree; unit suite remains the automated gate
- **Argon2id vs bcrypt comment**: bcrypt remains the implementation (secure; comment may lag)

## Verification checklist for operators
1. Set strong `JWT_SECRET`, `ADMIN_SECRET`, Paystack + NOWPayments secrets
2. `RUST_ENV=production` + `ALLOW_CREDITS_ADJUST=false`
3. SMTP for OTP and password reset
4. Desktop builds: Release (no QT_DEBUG demo path)
5. Never ship client with Decart/Paystack secrets
