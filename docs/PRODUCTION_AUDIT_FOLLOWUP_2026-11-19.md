# Production Readiness Audit — Follow-up, 2026-11-19

Fresh full review of the current tree after the first remediation pass. Five new
backend audit agents were launched (auth, money, realtime, runtime, routes);
provider overload/rate limiting prevented their reports, so every scope was also
reviewed directly and tested live. No findings were accepted from static reading
alone where a live test was practical.

## New defects fixed in this pass

- **Renewals could become perpetual subscriptions.** Provisioned-order healing
  used `Utc::now() + 365 days` on every poll. Renewal now anchors to the order's
  original `paid_at` (`services/billing.rs`, `renewal_expiry`). Live signed-
  webhook verification confirms identical expiry across repeated polls.
- **Discounted upgrade orders were reusable.** Multiple starter→creator orders
  could be created before one settled, and each would honor the discount.
  Orders now persist `source_plan` (`models/payment.rs`) and settlement rejects
  stale orders with `refund_required` before moving money or credits. A live
  two-order test proved first settlement succeeds exactly once and the second
  is rejected with 409/refund_required.
- **Password reset tokens were consumed before the password write.** A user
  lookup, bcrypt, or DB failure stranded a valid token. Consumption now rolls
  back on every pre-commit failure (`routes/auth.rs`).
- **Startup assumed a single replica by default.** The old reset could end
  another live replica's sessions. Default cleanup is now replica-safe and only
  aggressive cleanup requires explicit `SINGLE_INSTANCE=1`; stale legacy rows
  use the same 10-minute threshold as the reaper (`main.rs`, env docs).
- **Idempotency journals were unbounded.** `funded_orders`,
  `provisioned_orders`, `redeemed_credit_keys`, `redeemed_access_keys`,
  `burn_sessions`, and `refunded_orders` now retain at most 10,000 entries via
  Mongo `$slice`, keeping documents far below 16 MB.
- **Final usage tail was absent from session charge reporting.** A successful
  `generation_ended` tail charge now also increments `credits_charged`, while
  the single-writer session lifecycle remains unchanged (`realtime/proxy.rs`).
- **Wallet reversal after refund was best-effort only.** Extracted an
  idempotent `reverse_wallet_for_refund` and added sweeper recovery for any
  refunded order missing the wallet's `refunded_orders` marker.
- Same-plan upgrades are rejected instead of creating meaningless full-price
  upgrade orders (`services/orders.rs`).
- Removed unused `actix` dependency and remaining straightforward Clippy
  issues; only style-only complexity/collapsible-if hints remain.

## Realtime lifecycle and billing remediation (agent-confirmed findings)

- **HD authorization and tier binding.** Non-entitled HD requests now fail 403;
  entitled users selecting standard pay the standard multiplier. The WS uses the
  exact `session_id` intent row (also added to the Qt handshake), with only a
  60-second compatibility fallback instead of an arbitrary old live row.
- **Terminal sessions cannot resurrect.** `mark_session_ended` now transitions
  only `connecting`/`generating`, so reaper-ended rows cannot release twice.
- **Replica-safe healing.** Slot counts and zeroing are scoped by instance id,
  with a foreign-live guard instead of rewriting other replicas' claims.
- **Deterministic exactly-once billing.** Charges use stable
  `<decart-session>:tick|final:<seconds>` IDs recorded atomically on user and
  wallet documents. Crash/retry/reconnect cannot duplicate a debit or wallet
  burn. Refund compensation has its own idempotency marker. The ledger ref is
  deterministic and duplicate-tolerant.
- **Reconnect watermark.** Decart's session id loads the previous row's exact
  `billed_watermark`; every successful charge persists it, preventing both
  re-billing and the old 5-second approximation window.
- **Bounded resources.** Proxy registry and balance sockets are capped at 1024;
  both proxy queues have message-count AND byte budgets; upstream writes have
  timeouts and are aborted on teardown; balance sockets close on revocation.
- **Correct change notices.** Balance pushes compare total, credit, plan,
  token_version, and active state; config notices only fire on revision change.
- **Operational controls.** `STREAMING_UNAVAILABLE` now rejects realtime
  handshakes, and non-JSON WS input is explicitly rejected.

## Verification performed on the final code

- 60 unit/hardening/regression tests: all pass (including new renewal and
  upgrade-source invariants).
- Live integration suite: 71 passed, 0 failed, 1 warning (intentional reset-
  token log capture skip).
- Endpoint smoke: 36/36 pass.
- Targeted behavior checks: 11/11 pass.
- Dedicated stale-upgrade signed-webhook test: first order provisioned once,
  repeat does not alter balance, second discounted order is refund_required.
- Dedicated renewal signed-webhook test: repeated provisioning returns
  `already:true` and the license expiry does not move.
- Production template boot: refused (short JWT, then placeholder DECART key),
  before DB access.
- `cargo clippy --all-targets`: no actionable warnings (style-only complexity
  and collapsible-if suggestions remain).
- `git diff --check`: clean.
- Full `verify.sh`: backend build/tests, integration, smoke, frontend CTest,
  QML load, i18n, deployment assets all pass.

## Residual items that still require explicit product/architecture decisions

1. Pack economics still need repricing/credit adjustment; startup reports each
   underfunded pack. Code cannot choose the business margin unilaterally.
2. Credits and USD remain f64. A real integer-minor-unit/Decimal128 migration
   should be planned instead of silently changing stored data.
3. Provider-originated chargebacks/refunds still need verified event handling
   and a policy for already-spent credits; manual refunds and wallet recovery
   are now correct.
4. Strict cross-replica rate limiting still needs Redis/gateway enforcement;
   process startup/session cleanup itself is now replica-safe.
5. Configured long-lived TURN credentials should be replaced with per-user
   short-lived TURN REST/HMAC credentials (STUN-only default is safe).
6. Review global/per-route body limits and anonymous read throttling against
   the actual public traffic profile rather than imposing arbitrary values.

Nothing was committed to git.
