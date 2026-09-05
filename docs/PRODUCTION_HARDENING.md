# Production hardening fixes (this pass)

## Critical bugs fixed
1. **Realtime WS URL** — client now connects to `ws(s)://host/api/v1/realtime` (was bare host).
2. **Double billing** — with live signaling, client no longer burns credits locally; server `generation_tick` is source of truth; UI refreshes profile ~5s.
3. **Debit order** — user credits first, then Decart platform budget (no silent budget drain without user debit).
4. **Provision race** — atomic `paid → provisioning → provisioned` so webhook + verify cannot double-credit.
5. **Decart upstream URL** — API key and model query-encoded.
6. **Paystack verify** — amount + currency must match order.
7. **Checkout 3DS** — WebEngine allows new windows / loads 3DS in-sheet.
8. **Session stop** — refreshes profile from server after morph.

## Economics (unchanged, enforced)
User → Paystack (full) → verify → fund Decart budget → credit user → morph debits both.

## Still operator duties
- Fund Decart platform account (pay-as-you-go)
- Set secrets in `.env`
- Package Qt with WebEngine + code-sign


## Webhooks must be public
Paystack and NOWPayments call the API without a user JWT.
Routes live on the **public** `/api/v1` scope:
- `POST /payments/webhook/paystack`
- `POST /payments/webhook/nowpayments`

Paystack signatures verified when `PAYSTACK_WEBHOOK_SECRET` or secret key is set.
Production refuses Paystack webhook if no secret is configured.

## Crypto
`NOWPAYMENTS_API_KEY` enables USDT. IPN optional but recommended for faster provision.


## OAuth production notes (2026-08-16)
- Callback returns HTML + one-time **ticket** (not raw JWTs in the URL)
- Desktop redeems via `POST /auth/oauth/google/exchange`
- Ticket TTL 5 minutes, single use (`oauth_tickets` collection + TTL index)
- CSRF state in `oauth_states` with TTL
- Unique partial index on `users.google_sub`
- Register `livemorph://` protocol via deploy scripts


## Client reliability pass
- BackendClient: HTTP status checks on GET/POST, transfer timeouts, offline detection, trailing-slash base URL normalize
- WebRtcSignalingClient: exponential backoff reconnect; SessionManager treats reconnect notices as non-fatal
- Auth: re-probe Google OAuth when backend becomes reachable; refresh failure clears session
- Recording: refuse start if output folder cannot be created
- Catalog/packages: tolerate array or wrapped JSON; status-aware errors
- CreditService: retry verify when provision race returns conflict
- Health ping every 15s keeps reachable flag honest


## Edge-case pass (media / security)
- MorphBridge ignores empty SDP/ICE/prompt; start only when pageReady
- Camera hotplug: switch or stop when device list changes
- StreamServer tries alternate ports if preferred is busy
- SecureStore ignores empty keys
- JWT middleware trims bearer token; rejects empty token
- Config API URL: force http(s), strip trailing slash
- CheckoutSheet + openExternal: block non-http(s)/livemorph/mailto schemes
- Auth refresh: single-flight; clear in-flight on sign-out
- aboutToQuit: stop session, recording, VCam, stream server


## API identity (frontend ↔ backend)
- Every HTTP call sends: `X-Frontend-Id: livemorph`, `X-Client-Product: livemorph`, `X-Device-Id`, `X-App-Version`, User-Agent
- AuthManager and BackendClient share the same identity header set
- Stable device id from `QSysInfo::machineUniqueId` or persisted UUID (`DeviceIdentity`)
- OTP verify / password login bind `device_id` on the user record
- License activation (`liveescape` keys) requires matching `X-Device-Id` / body `device_id`
- Balance + realtime WS query: `product`, `frontend_id`, `device_id`, `token`


## UX + performance (latest)
- Offline API banner + Retry on main window when Backend.reachable is false
- Space starts/stops morph on dashboard; Escape closes settings/buy drawers
- MJPEG stream: skip work with no clients; ~30 FPS cap; downscale >720p; JPEG q=72
- CORS production allows X-Frontend-Id / X-Device-Id / X-App-Version headers
- Rate-limit responses include Retry-After: 60 and Cache-Control: no-store
