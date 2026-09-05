# Production-proof verification

Last verified in-repo: 2026-08-25

## Backend
| Check | Status |
|-------|--------|
| Payment webhooks on **public** scope (no JWT) | Pass |
| Paystack HMAC required when secret set; refused unsigned in production | Pass |
| OTP exact length + invalidate prior codes + atomic consume | Pass |
| OAuth ticket exchange (no JWT in URL) | Pass |
| JWT secret ≥32 chars required in production | Pass |
| DECART_API_KEY required in production | Pass |
| ALLOW_MANUAL_PAYMENTS / ALLOW_CREDITS_ADJUST false required in production | Pass |
| LOG_OTP_CODES must be false in production (hard fail) | Pass |
| CORS allows identity headers; empty origins deny browser CORS in prod | Pass |
| Rate-limit responses: Retry-After + no-store | Pass |
| Mongo indexes: email, google_sub, payment_ref, oauth TTL | Pass |
| Credit settle claim race (paid → provisioning) | Pass |

## Desktop (Qt)
| Check | Status |
|-------|--------|
| No Decart/Paystack/NOWPayments/Google secrets in client | Pass |
| Identity headers on AuthManager + BackendClient | Pass |
| Stable DeviceIdentity + license device binding | Pass |
| OTP UI length bound to Auth.otpCodeLength / server code_length | Pass |
| Camera starts only after authentication | Pass |
| Camera/stream/session stopped on quit and sign-out | Pass |
| WebEngine absence warned | Pass |
| Offline API banner + reachability ping | Pass |
| Stream: no clients → no encode; ~30 FPS; downscale | Pass |
| Toast stack dismiss by id | Pass |

## Operator must still do
1. Real `.env` with production values and HTTPS `PUBLIC_BASE_URL`
2. SMTP for OTP delivery
3. Register webhook URLs at Paystack / NOWPayments
4. Build with Qt WebEngine; code-sign; register `livemorph://`
5. Live E2E: OTP → pay → morph → record → OBS

## Explicit non-goals
- Kernel VCam driver (MJPEG/OBS path only)
- Provider secrets inside the desktop binary
