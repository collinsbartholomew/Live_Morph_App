# Security model

## Trust boundaries
| Layer | Holds secrets? | Role |
|-------|----------------|------|
| Qt desktop | **No** third-party API keys | JWT in OS secure storage; talks to backend only |
| Rust API | Yes (Decart, Paystack, NOWPayments, Google client secret, JWT) | Auth, ledger, webhooks, Decart WS proxy |
| MongoDB | User data, hashed OTP/refresh, payment orders | Private network only |

## Hard rules
1. Never ship `DECART_API_KEY`, Paystack, NOWPayments, or Google **client secret** in the desktop binary.
2. Payment webhooks are **public** routes but **signature-verified** (Paystack HMAC-SHA512; NOWPayments IPN secret when set).
3. Google OAuth returns a **one-time ticket** (5 min TTL); desktop exchanges it for JWTs — tokens are not put in browser history URLs.
4. Production boot refuses `JWT_SECRET` &lt; 32 chars and missing `DECART_API_KEY`.
5. Desktop `openExternal` / checkout only allow `http(s)`, `livemorph`, `mailto`.

## Token storage
- Access + refresh tokens: platform secure storage (DPAPI / Keychain / encrypted file fallback).
- Legacy plaintext QSettings keys are migrated once then deleted.

## Reporting
Treat this repository as proprietary. Coordinate security issues with the platform operators.
