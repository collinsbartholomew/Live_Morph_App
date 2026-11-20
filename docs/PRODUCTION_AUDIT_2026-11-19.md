# Production Readiness Audit — 2026-11-19

Scope: full backend (Rust/Actix + MongoDB), deploy/test harness, and the frontend
verification gates. Five parallel audit tracks (auth, config/startup, realtime,
payments/DB, route surface) plus direct review of the realtime proxy and auth core.

## Final verification (all executed, all green)

| Gate | Result |
|---|---|
| `cargo test` (unit + hardening + new `tests/logic_regressions.rs`) | 57 passed, 0 failed |
| `tests/integration_tests.sh` (live backend, both products) | 71 passed, 0 failed, 1 warning* |
| `scripts/endpoint_smoke.sh` | 36/36 PASS |
| Targeted new-behavior checks (burn idempotency, product gating, engine-key, liveness, support, update metadata) | 11/11 PASS |
| Frontend `ctest` (`lm_smoke`, `lm_frontend_integration`) | 100% passed |
| `LiveMorph --verify-qml` | PASS |
| i18n catalog sync / no-motion directive | PASS (889 messages) |
| Deployment assets (`verify.sh` step 7) | PASS |

*The warning is the password-reset token capture: tokens are intentionally never
logged anymore, so that block of the suite self-skips (`BACKEND_LOG` env now
selects the log path).

`verify.sh` was hardened after a real incident during the audit: a dev backend
already listening on :3874 caused the gate to test the WRONG instance (3 false
admin-secret failures). The gate now detects a foreign listener before spawning,
detects gate death during the health wait, and skips live suites instead of
testing whatever answers on the port (`verify.sh:63-133`).

## Critical/high fixes

### Money and settlement
- `services/billing.rs` — settlement rewritten around exactly-once markers:
  `funded_orders` on the platform wallet, `provisioned_orders` on the user doc.
  Removed the finalize-loss reversal that could zero out the only legitimate
  credit (worker A credits, worker B finalizes, A reverses → net 0). Credit and
  wallet funding are now idempotent across crashes, stale-claim reclaims, and
  concurrent workers; no multi-doc transaction required (standalone Mongo safe).
- Provisioned-order early return now re-runs ALL Secondary entitlements
  (activation key, upgrade, starter, renew), so a crash after finalize can never
  strand a paid purchase (`apply_secondary_entitlements`).
- Starter-pack single-claim is enforced AT SETTLEMENT before money moves;
  duplicate paid starter orders flip to `refund_required` instead of
  double-crediting.
- `ensure_activation_key` no longer lets an expired active key swallow a new
  activation; paid plan changes promote the existing license; concurrent mints
  tolerate duplicate-key errors.
- `routes/credits.rs` `/credits/burn` — exactly-once per `session_id` via the
  `burn_sessions` marker on the user doc (retry and crash-resume safe), 409
  replay contract preserved for credit keys, minimum 0.001 quantum (tiny burns
  can no longer spam free ledger rows), per-user 30/min limit, amount finiteness
  and bounds on every admin mutation.
- Credit-key and license-key redemption (`routes/credits.rs`, `routes/keys.rs`)
  are now claim → exactly-once credit (`redeemed_credit_keys` /
  `redeemed_access_keys` markers) → best-effort audit insert. A crash between
  claim and credit is resumable; license grants use the STORED key amount, not
  the plan catalog.
- `routes/payments.rs` — refund failure paths restore the debit before
  rollback (retry can no longer double-debit); successful refunds reverse
  wallet revenue/Decart budget exactly once (`refunded_orders`).
- `services/flutterwave.rs` — paid amount is floored, never rounded
  (9.995 vs 10.00 no longer provisions).

### Payment edges
- Unknown providers rejected BEFORE order insert (`create_order`, `pay_kind`).
- Crypto terminal-failure writes only touch `pending`/`creating` (a settling
  order can no longer be clobbered to `failed`).
- NOWPayments IPN must match the order's provider and stored `payment_id`, and
  is re-verified upstream (status + amount) before any paid transition.
- Webhook retries that find stuck `paid`/`provisioning` rows now DRIVE recovery
  instead of blindly acking; the sweeper gained a no-upstream recovery phase
  for `paid` and stale `provisioning` orders.
- Settlement takes the authoritative storage product from `find_order_any_db`
  (`settle_and_provision_in`), so legacy Secondary orders missing `product`
  can no longer settle into the LiveMorph database.

### Realtime
- `realtime/proxy.rs` — the reporting `credits_charged` increment now happens
  only after a SUCCESSFUL debit (transient billing errors no longer inflate
  the session's reported charge on every retry).
- `main.rs` reaper — the conditional end transition now includes the staleness
  predicate, so a session re-touched between the scan and the update is never
  killed while active.

### Product/feature gating (API enforced, not UI-only)
- LiveMorph can no longer purchase Secondary-only entitlements (activation,
  starter pack, upgrade, renew) — those used to grant credits without the
  purchased license/plan (`routes/activation.rs`, `confirm_crypto_impl`).
- Referrals are Secondary-only (`routes/referral.rs`), 2-cycles are correctly
  rejected (compared the wrong code before), codes are 80-bit and always the
  persisted winner, and rewards are granted ONLY after the attacher's first
  settled purchase (Sybil farming with free signups is dead), idempotent via
  the unique referral ledger key, with self/cycle guards at reward time.
- Admin directives are per-user acknowledged (`acked_by`) — one client can no
  longer consume a global storage-reset/force-logout directive and hide it
  from every other client; directive selection is deterministic.

### Keys and devices
- Zero-grant (paid activation) keys bind to the first activating device;
  previously any device passed validation forever.
- Concurrent-claim re-reads re-check ownership AND device; responses return
  the persisted binding, not the caller's device echo.
- `POST /keys/status` added (keys out of query strings); a supplied device id
  must match the binding. Device ids capped at 128 chars.

### Config/startup hardening
- Production refuses `REPLACE_WITH_*` template placeholders for JWT, Decart,
  Paystack, NOWPayments, Google, ADMIN_SECRET, OTP_PEPPER and the template
  `PUBLIC_BASE_URL` (previously all passed validation).
- Every optional env string is trimmed and empty→unset (`Config::load`);
  JWT/Decart keys trimmed; empty `PUBLIC_BASE_URL` derives from the bind address.
- Mongo TLS is validated by parsing the URI query (substring `tls=true` in a
  password no longer counts; `tls=false` on SRV, `tlsInsecure` and
  invalid-cert/hostname flags are rejected), plus a post-parse TLS assertion in
  `Db::connect` with explicit connect/server-selection timeouts and a bounded
  5-attempt startup retry with backoff.
- New boot validations: `PUBLIC_BASE_URL` trailing slash, `STREAM_DEFAULT_PORT != 0`,
  `ICE_SERVERS_JSON` must be valid JSON of the right shape, production CORS must
  be https.
- dotenv loads now log the loaded file path (never values); invalid `RUST_LOG`
  logs the fallback.
- Pack funding invariant: startup logs every pack whose sold compute exceeds
  its funded compute (`billing::underfunded_packs`). SEE RESIDUAL RISK #1.

### Route surface
- 50-character quota is an atomic reservation on the user doc with rollback and
  delete release (concurrent creates can no longer bypass it); create rate limit.
- Character image URLs are parsed (https with real host, loopback-only http, no
  embedded credentials); `"image_url": null` now clears the image.
- Support tickets require non-empty subject/message, per-user open-ticket quota
  (20), and no longer echo the full submission.
- `/health/live` added (dependency-free liveness; `/health` stays readiness).
- Update availability requires a usable artifact (https URL + valid SHA-256);
  `artifact_ready` is reported.
- Engine-key admin no longer reports success without storing anything: overrides
  are rejected honestly, `/next` reports `rotated: false` with instructions.
- `/settings/crypto` no longer labels a credit count as USD; maintenance flags
  are consistent across platform-settings/dashboard/bootstrap.
- Catalog is per-IP throttled and publicly cacheable for 60s with the correct
  `Vary` (prompts stay public by design: they are the client-facing character
  descriptions).
- Per-request `std::env::var` reads for app/downloads/support/notification
  values centralized in cached `src/runtime_env.rs`; settings/streaming use the
  validated `cfg.decart_api_key` instead of a second raw env read.

### Deploy/index safety
- Unique key-hash indexes are now built under a stable new name BEFORE the
  legacy ones are dropped (no uniqueness-free window during rolling deploys).
- `verify.sh` fail-fast on foreign listeners (see above); integration suite
  honors `ADMIN_SECRET`/`BACKEND_LOG` env overrides.

## Regression tests added

`backend/tests/logic_regressions.rs` (9 tests): Flutterwave floor semantics,
funding analysis, referral entropy/gating, Mongo TLS option parsing,
PUBLIC_BASE_URL trailing slash, ICE JSON validation, production CORS https,
empty-option normalization.

## Residual risks / recommended next steps (not code-fixed)

1. **Pack economics (HIGH, business decision).** Defaults sell more compute
   than they fund (e.g. Basic $5: 250 sold seconds vs 162.5 funded; Pro: 4000
   vs 1462.5). Startup now logs the exact shortfall per pack. Fix prices,
   credits, or margin so `sold_seconds <= funded_seconds` for every pack, or
   derive pack credits from funded seconds.
2. **Money is f64 throughout.** Balances, ledger, USD accounting accumulate
   binary-float dust. Migrate to integer micro-credits/minor units (or
   Decimal128) with explicit quantization at boundaries; requires a data
   migration, so it was not done in this pass.
3. **Provider refund/chargeback events.** Paystack events other than
   `charge.success` and NOWPayments non-finished IPNs are ignored; post-
   provisioning chargebacks don't revoke credits. Manual refunds are now
   economically correct. Implement verified refund events with the same
   reversal flow, including already-spent-credit policy.
4. **Horizontal scaling.** Rate limits and the user-active cache remain
   per-process; use a shared limiter (Redis/gateway) for strict global caps.
   The follow-up audit made startup session cleanup replica-safe by default;
   aggressive whole-database cleanup now requires explicit SINGLE_INSTANCE=1.
5. **Static TURN credentials** (`ICE_SERVERS_JSON`) are returned to every
   authenticated user; use short-lived per-user TURN REST/HMAC credentials if
   TURN is configured (STUN-only default is unaffected).
6. **Global 8 MiB body limit** is coarse; several persisted strings rely on
   per-field caps added here, but route-specific smaller limits are
   recommended. No multi-document transactions are used anywhere (standalone
   Mongo compatible); if you move to a replica set, the marker-based
   idempotency can optionally be upgraded to real transactions.
7. **Per-route rate-limit coverage** for anonymous read-only endpoints other
   than catalog is light (bootstrap, plans, packages); add edge/global limits
   if exposed directly to the internet.

## Notes

- The audit ran while another editor session modified backend and frontend
  files; conflicting edits were reconciled (compose RUST_ENV, integration
  suite secret override, frontend integration test). QML "errors" chased
  during the audit turned out to be STALE build-embedded QML — always rebuild
  before `--verify-qml` (the gate's non-quick path does this).
- MongoDB was restarted with a user-owned dbpath (`/home/omega/mongodb_data`)
  because the previous system instance stopped and its data dir is root-owned.
  No existing data was modified.
- Nothing was committed to git.
