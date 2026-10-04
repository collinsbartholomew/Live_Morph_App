# Production analysis — LiveMorph Platform (2026-09-10)

## Architecture — fully unified backend
One Actix API serving **both** products. There is **no** `liveescape.rs` / `livemorph.rs`
product file and **no** product-named route scope. The only distinction between
frontends is the request header (`X-Frontend-Id` / `X-Client-Product`), exactly like
every other request on the platform.

| Layer | Role |
|-------|------|
| `backend/` | Single Actix API; single `/api/v1` route tree; product selected by header |
| `apps/livemorph/` | LiveMorph Qt6 client (`X-Frontend-Id: livemorph`) |
| `apps/liveescape/` | LiveEscape Qt6 client (`X-Frontend-Id: liveescape`) |

### Route namespace
Every route is registered **once** under `/api/v1`. Root-level aliases
(`/keys/validate`, `/settings/plans`, `/auth/signup`, `/webhooks/*`, `/v1/realtime`,
`/ws`, `/bootstrap`) have been **removed**. Both Qt clients now call `/api/v1/...`
exclusively (including `/api/v1/ws` and `/api/v1/realtime` WebSockets).

### Product differentiation contract
- `X-Frontend-Id` / `X-Client-Product` header → `ProductId` (`livemorph` | `liveescape`).
- Query `?product=` / `?frontend_id=` for WebSocket connect (URL-decoded).
- Data isolation remains **two Mongo DBs** (`MONGODB_DB`, `MONGODB_DB_LIVEESCAPE`),
  selected per-request by product via shared helpers (`user_store`, `ledger_store`,
  `orders_coll`).

### Key fixes shipped this pass
1. **LiveEscape user provisioning (critical)** — auth `register`/`login`/`otp_verify`/
   password-reset are product-aware and create/lookup users in the correct product DB.
   Previously no path ever wrote `users_le`, so every LE license/activation/session
   flow 404ed ("user not found").
2. **LE order `created_at` type bug (critical)** — orders are now written with
   `bson::DateTime` via the unified order engine; webhook decode (`find_order_any_db`)
   no longer 500s.
3. **Unified order engine** (`services/orders.rs`) — one `create_plan_order`
   (product × kind × provider) with a single plan catalog (`services/plans.rs`),
   eliminating the triplicated plan tables and the divergent NGN conversion.
   Flutterwave mapped to the unified rail; crypto/nowpayments real; dev-mode fallback.
4. **`keys/validate` ownership-before-claim** — read-only checks now run before any
   mutation; added `/keys/status` + real `/keys/lookup` for boot reconciliation.
5. **Product-aware everywhere** — credits/burn/ledger/balance, streaming session,
   settings, referral, creator payouts, auth refresh/logout/logout_all/delete/export,
   refund, metrics.
6. **Real implementations replacing stubs** — referral codes/earnings, creator payout
   persistence, `public/*` token directives, support tickets (single handler),
   password reset endpoints (were missing entirely), downloads list, streaming
   availability (operator/env driven).
7. **Webhook secret fallback** fixed (empty `PAYSTACK_WEBHOOK_SECRET` no longer
   fail-closes on every webhook).
8. **Login rate limit** now honors `AUTH_MAX_ATTEMPTS`/`AUTH_LOCKOUT_SECS` (was hardcoded 5/60).

### Additional unification pass (2026-09-07)
1. **`POST /payments/orders` writes to the product-correct order collection** (LE orders
   no longer land in the LM DB) — one order engine, one isolation rule.
2. **`GET /settings/engine-key` no longer leaks `DECART_API_KEY`**; it now requires a
   signed-in user and only reports proxy availability. `engine-key/next` likewise.
3. **OTP challenges and password-reset tokens are product-scoped** (an LE-header OTP
   verify can never consume an LM challenge; reset tokens are bound to the issuing
   product).
4. **Google OAuth is locked to LiveMorph** (an LE client can no longer mint an LM
   account through it).
5. **Both WebSockets share product resolution** (`X-Frontend-Id` header → `?product=` →
   default) — `/api/v1/realtime` previously ignored the header.
6. **`/activation/nowpayments-status/{id}` is JWT-gated.**
7. **Access keys expose real `expires_at` + `expired` flags** on validate/lookup/status
   (annual 365-day licenses; the LE expiry modal consumes them).
8. **Support tickets persist** to a product-scoped `support_tickets` collection.
9. **Manual credit keys implemented**: admin `POST /credits/keys/issue` (secret-gated,
   product-bound) + `POST /credits/add {credit_key}` atomic one-time redemption with a
   reuse guard (409) and ledger entry.
10. **Upgrade pricing is discounted** (reference `UPGRADE_TARGETS`): starter→creator
    $50, starter→pro $100, creator→pro $40; upgrade orders promote the user's plan and
    bound access key; starter-pack orders tag the account (`starter_pack: true`).
11. **Crypto proof artifacts persisted** on the order (`proof_path`/`proof_image`) for
    manual review; crypto confirm endpoints accept and store them.

### Frontends (2026-09-07 pass)
- **LiveEscape Qt**:
  - Critical: `DecartViewport` now binds the AI stage to the GStreamer sink via
    `VideoOutput.source` (the previous `videoOutput` assignment is a no-op property —
    the AI output never rendered). The single most impactful parity bug.
  - Critical: 401 → token refresh now **re-issues the failed request** (was a silent hang).
  - `DownloadsScreen` layout fixed (`ColumnLayout`/`RowLayout` — list was 0×0).
  - Crypto proof now actually submits the picked image; fresh users send `email` on
    activation payments (set on login/register, not only after licensing).
  - Single balance socket: the redundant `ApiClient` socket is gone; `WebSocketClient`
    is the one connection and now also handles `config_update`/`hello` → bootstrap refetch.
  - Parity flows: real **upgrade gate** (discounted targets + strike-through pricing),
    **stream-consent modal** on first Connect, **low-credit bar** (500 CR, dismissible),
    **credits-exhausted lock** with BUY MORE CREDITS, **manual credit-key redemption** in
    the pay modal, Telegram/Email contact rows, **creator payout form** in Account,
    **license-expiry row**, **60s announcement polling**, generic force-disconnect copy.
  - **Access Gate now shows the annual activation plans** (Starter $20/300cr, Creator
    $75/500cr, Pro $120/2000cr) via a new unified `GET /api/v1/settings/activation-plans`
    endpoint — previously it incorrectly displayed the credit top-up plans.
  - **First-run sequencing matches the reference**: consent → welcome → 13-step tour →
    free-credits popup (free credits are deferred until onboarding completes, so modals
    never overlap).
  - **STYLE / FACE SWAP mode toggle added** (reference Mode segmented control). STYLE
    connects with a prompt only (no face); FACE SWAP uploads a reference face. The old
    flow forced a face upload even for prompt-driven style sessions. Post-answer the
    engine now receives the prompt in STYLE mode (previously nothing was sent without
    a face).
  - **Plan-gate cards are complete** — the unified `/settings/plans` payload now carries
    `timeLabel` + `features` (reference copy: "~42 min", "Priority Support", etc.), and
    the offline fallback matches.
  - **401 handling hardened in LiveMorph Qt** — any backend request hitting a 401 now
    triggers a token refresh (the proactive-refresh architecture keeps tokens fresh;
    this recovers an expired session mid-use).
  - Dead code removed: premature MediaRecorder MP4 report, `onLiveChanged` no-op handler,
    orphaned ApiClient balance wiring.
- **LiveMorph Qt**:
  - Fixed `BuyCreditsDrawer` post-payment crash (`Auth.refreshBalance` → `refreshProfile`).
  - Fixed Space shortcut (`Session.active` → `Session.isActive`) so it can stop a session.
  - Added missing `Camera.currentMicName` (was undefined → always "Default microphone").
  - Deduplicated record start/stop backend calls (ActionBar double-fired POSTs).
  - Scene mode now pushes a composed `<prompt> , <scene>` to the engine when active.
  - AuthScreen gained **Password sign-in + Create account** tabs (email + password +
    Google + OTP) using the unified `/api/v1/auth/login` + `/auth/register`.
  - Shared `StreamServer` now serves `/stream`, `/obs`, and `/status` (reference parity).

### Frontends
- **LiveEscape Qt**: Downloads screen wired (registered + open/close + backend list),
  streaming-unavailable banner, background-select wired to backend, access-gate
  crypto/card method toggle, crypto payload alignment (`pay_address`/`pay_amount`),
  payment-provisioning round-trip (order reference polling + `access_key` on the
  verify/status responses), single `/api/v1/ws` socket, **real MJPEG/OBS server**
  (shared `StreamServer` component now serves the decoded AI output on
  `:4789/stream`), 13-step dashboard tour.
- **LiveMorph Qt**: registered previously-missing QML types (`UploadTab`,
  `UploadConsentDialog`, `BackgroundBar`, `StreamKitPanel`, `PlatformSettings`
  singleton), added `Config.uploadConsentShown`, `Backend.selectBackground`,
  `Backend.fetchStreamingAvailability` + banner binding; enhance toggle, style
  presets, library delete, PiP visibility policy, maintenance gate, data
  export/delete-account UI.
- **Shared component**: `apps/common/streamserver/` (`StreamServer`) reused by
  both frontends for MJPEG/OBS output.
- **Licensing**: access keys carry an `expires_at` (annual); `/keys/validate`,
  `/keys/lookup`, `/keys/status` return it; expired keys are rejected with a
  renewal message.

### Internationalization (i18n) — shared `apps/common/i18n/`

- **Architecture**: `I18nManager` (shared) + `JsonTranslator` (QTranslator subclass).
  English-only in source code (`qsTr("...")`). Runtime translation via Chrome dict
  API (`curl` via `QProcess`), persistent JSON cache at `~/.config/<App>/translations/`.
- **Catalogs**: English `.ts` files embedded as Qt resources (`:/i18n/<app>_en.ts`).
  LM: 351 strings / 34 contexts. LE: 267 strings / 31 contexts.
- **First switch**: Synchronous batch translation (15 strings/batch) with
  `QCoreApplication::processEvents()` between batches for UI responsiveness.
  One-time operation; subsequent switches load from cache instantly.
- **Offline**: Falls back to English if no cache exists.
- **Languages**: en, es, fr, de, pt, it, nl, pl, sv, tr, ru, uk, ar, hi, id, vi, th, zh, ja, ko.
- **LE UI**: Language selector in AccountModal (ComboBox bound to `I18n.availableLanguages`).

## Verification this run
| Check | Result |
|-------|--------|
| `cargo check` / `cargo test` | **PASS** (19 unit + 15 hardening) |
| `cargo clippy` | **PASS** (0 warnings) |
| `tests/integration_tests.sh` (unified `/api/v1`) | **PASS 73/73** (incl. credit keys + upgrade pricing) |
| `scripts/endpoint_smoke.sh` (updated to `/api/v1`) | **PASS 36/36** |
| `verify.sh` (build + test + integration + smoke) | **PASS** |
| LiveEscape Qt build (Qt 6.11 cmake) | **PASS** |
| LiveMorph Qt build (Qt 6.11 cmake) | **PASS** |
| LiveMorph i18n (351 strings, 34 contexts) | **PASS** |
| LiveEscape i18n (267 strings, 31 contexts) | **PASS** |

## Production gates (backend boot, unchanged)
- JWT secret ≥32 in production; `DECART_API_KEY` required.
- `ALLOW_MANUAL_PAYMENTS` / `ALLOW_CREDITS_ADJUST` / `LOG_OTP_CODES` = false.
- Public payment webhooks (Paystack/NOWPayments) — signature + ref verified.
- Dual Mongo DBs: livemorph + liveescape.

## Operator checklist
1. `RUST_ENV=production` + real secrets + SMTP + HTTPS `PUBLIC_BASE_URL`.
2. Register Paystack/NOWPayments webhooks at the unified `/api/v1/payments/webhook/*`.
3. Build both apps (Qt6; `DECART_API_KEY` drives streaming availability).
4. E2E per product: auth → pay → license/session → live streaming (WS balance).