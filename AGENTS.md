# AGENTS.md — LiveMorph Platform

Native desktop + API platform. A **Qt6/C++20 QML desktop client** (`apps/livemorph`) plus one shared **Rust (Actix-web) backend** (`backend/`) backed by MongoDB. The original Electron app was replaced by this stack; there is **no Supabase/Auth0** — auth is JWT + OTP/password handled entirely in the backend. WebRTC media is **peer-to-peer between the Qt client and Decart**; the backend only proxies signaling and bills credits.

## Layout

| Path | Role |
|------|------|
| `apps/livemorph/` | LiveMorph Qt6 client: C++ in `src/core` + `src/services` + `src/models`, QML in `qml/` (`theme/` token singletons, `constants/`, `components/` shared widgets, `dashboard/` stage widgets, `pages/` + `screens/` views), smoke test in `tests/`, packaging in `packaging/` |
| `apps/common/` | Shared Qt libs built via `add_subdirectory` into the app: `gstpeer` (GstRtcPeer, GStreamer `webrtcbin` media plane), `streamserver` (local MJPEG server for OBS/virtual-cam output), `i18n` (JsonTranslator + I18nManager) |
| `backend/` | Rust API: auth, credit ledger, catalog, payments, Decart WS signaling proxy. `src/routes`, `src/services`, `src/models`, `src/realtime`, `src/auth` (incl. `auth/middleware.rs` — there is no top-level `src/middleware/`), `tests/`, `scripts/` |
| `docker-compose.yml` | MongoDB 7 (bound to 127.0.0.1:27017) + API on port 3874, `RUST_ENV=production` — see the Mongo/TLS gotcha below |
| `verify.sh` | Unified verification gate from repo root (see below) |
| `tools/spike-m0/` | Scratch proof-of-concept for GStreamer `webrtcbin` interop (contains venv, logs, tokens; not product code; `token.txt` is gitignored) |
| `docs/` | Point-in-time status/parity/production notes. Largely historical — see "Stale documentation" below. |

The backend serves **two product slots** from one `/api/v1` tree: `livemorph` (the client in this repo) and `secondary` (an **unclaimed slot reserved for the next desktop client**). See "The second product slot" below. There are **no CI workflow files** in the repo (no `.github/`) — verification is manual via `verify.sh`.

## Essential commands

Backend (Rust, toolchain pinned to 1.88 via `backend/rust-toolchain.toml`; Cargo.lock is tracked on purpose; crate/binary name is `livemorph-backend`):

```bash
cp backend/.env.example backend/.env   # then fill JWT_SECRET (>=32 chars), MONGODB_URI, DECART_API_KEY
docker compose up -d                    # Mongo + API (API on :3874) — see gotcha 18 before relying on this
# or, without docker:
cd backend && cargo run --release       # listens on 127.0.0.1:3874 by default
cd backend && cargo check               # fast compile check
cd backend && cargo test                # in-src unit tests + tests/security_hardening.rs
cd backend && bash tests/integration_tests.sh   # needs a running backend at 127.0.0.1:3874
cd backend && bash scripts/endpoint_smoke.sh
```

`.env.example` ships `RUST_ENV=development`, so a plain `cp .env.example .env` boots without the production guards. Only set `RUST_ENV=production` once the checklist in gotcha 2 is satisfied.

One-shot gate from repo root:

```bash
bash verify.sh          # cargo check + cargo test + boots backend if needed + integration + smoke + frontend build + QML verify + hygiene gates
bash verify.sh --quick  # skips the fresh frontend build
BASE=http://host:port bash verify.sh   # target a non-default backend
# verify.sh step 6 (verify.sh:95-113) also enforces two frontend directives: no
# time-based animation elements in qml/ (motion is banned project-wide), and
# livemorph_en.ts in sync with qsTr/tr
# sources (run `lupdate qml src -ts i18n/livemorph_en.ts -no-obsolete` from
# apps/livemorph after adding strings). See docs/UI_MODERNIZATION_PLAN.md for the
# UI/UX modernization roadmap and its implementation log.
```

`verify.sh` kills any running `target/debug/livemorph-backend`, then restarts it with `AUTH_MAX_ATTEMPTS=500` so the suites' repeated same-IP auth calls don't trip the lockout. It writes logs to `/tmp/verify_*.log` and `/tmp/backend.log`.

Frontend (needs Qt 6.5+ with Multimedia, WebSockets, Svg, Test, LinguistTools; C++20; plus GStreamer 1.x dev packages with `gstreamer-webrtc-1.0`):

```bash
cd apps/livemorph && ./build.sh                       # Release build into build/ (set CMAKE_PREFIX_PATH to your Qt kit if needed)
# or: cmake --preset debug && cmake --build build    # presets in CMakePresets.json (debug/release)
cmake --build build
QT_QPA_PLATFORM=offscreen ./build/bin/LiveMorph_smoke_test   # smoke test (ctest is NOT wired up — see gotcha 12)
./build/bin/LiveMorph --verify-qml                    # headless QML load check (sets QPA=offscreen itself); used by verify.sh
./build/bin/LiveMorph --shot /tmp/shots               # headless screenshot pass: walks fixed UI states, saves one PNG per state
./build/bin/LiveMorph --dev                           # QML hot reload from the source qml/ tree
```

Preset binary dirs differ: `debug` → `build/`, `release` → `build-release/`, `relwithdebinfo` → `build-relwithdeb/` (`CMakePresets.json`). The app binary always lands in `<build-dir>/bin/LiveMorph` (`CMAKE_RUNTIME_OUTPUT_DIRECTORY`) — `build.sh`'s final "Run:" echo says `build/LiveMorph`, which is wrong.

Deploy: `backend/Dockerfile` is the multi-stage production image (healthcheck hits `/api/v1/health`); the bundled `docker-compose.yml` needs the Mongo/TLS fix from gotcha 18 before it will boot with `RUST_ENV=production`. Desktop packaging scripts live in `apps/livemorph/packaging/` (`deploy-linux.sh`, `deploy-macos.sh`, `deploy-windows.ps1`); CPack is configured in `CMakeLists.txt` (TGZ/DEB on Linux, DragNDrop on macOS, ZIP/NSIS on Windows).

## Backend architecture

- Single unified `/api/v1` scope in `backend/src/main.rs:347`; every route module registers via `.configure(routes::<mod>::configure)` (chain at `main.rs:348-369`). **Product identity is carried only by `X-Frontend-Id` / `X-Client-Product` headers** (or `?product=` / `?frontend_id=` query, or a body field) — `ProductId::from_headers_query` at `backend/src/product.rs:89`. `livemorph` is the default; aliases: `lm`/`morph`/`live-morph` and `secondary`/`sec`/`second`/`product2`/`p2`. An unknown product id falls back to `livemorph`. No product-named route scopes and **no path heuristic**.
- `auth::JwtAuth` middleware wraps the whole app; public vs protected routes are split in `routes::auth::configure_public` / `configure_protected`. HS256 JWTs (access ~15 min, refresh ~30 d), bcrypt passwords, OTP magic-link with lockout (`AUTH_MAX_ATTEMPTS`/`AUTH_LOCKOUT_SECS`), optional Google OAuth.
- **JWT `aud` is bound to the product.** The realtime WS rejects a token whose `aud` doesn't match the request's product (`backend/src/realtime/proxy.rs:48-52`). Cross-product token use is a 401, not a silent switch.
- **WS token auth**: `Authorization: Bearer <jwt>` is preferred; the `?token=` query form is accepted **only outside production** (`backend/src/realtime/proxy.rs:30-43`) because query strings land in access logs. The access logger uses `%U` (path-only) for the same reason (`backend/src/main.rs:403`).
- Config is **env-only** (`backend/src/config.rs` via envy/dotenvy); every key is documented in `backend/.env.example`. `Config::load()` (not `from_env()`) is the startup entry point — it fills the derived default for `MONGODB_DB_SECONDARY` (`config.rs:286-291`).
- DB layer `backend/src/db/mod.rs`: `db` (LiveMorph) and `db_secondary` (secondary slot, isolated). Every route that touches product data branches on `ProductId` and picks the matching collection (`users()` vs `users_secondary()` at `db/mod.rs:43`/`:48`, `ledger()` vs `ledger_secondary()`, etc.).
- Realtime: `GET WS /api/v1/realtime?model=lucy-2.1&tier=standard` (`backend/src/realtime/proxy.rs`) proxies signaling (offer/answer/ICE/prompt/set_image) to `wss://api3.decart.ai/v1/stream`. `GET WS /api/v1/ws` is the balance push socket. **Media never passes through this process.**
- Payments: Paystack (card, NGN primary), NOWPayments (USDT crypto), Flutterwave (optional); `backend/src/services/billing.rs` provisions platform tokens to the ledger on verify and maintains a platform wallet/budget. `provider: "manual"` works only in local dev and is blocked in production. Webhooks verify HMAC-SHA512 with a constant-time compare (`backend/tests/security_hardening.rs`).
- Errors via `backend/src/error.rs` (thiserror); logging via `tracing` with the `RUST_LOG` filter.

### The second product slot (`secondary`)

`ProductId::Secondary` is an **unclaimed slot reserved for the next desktop client**. It is not a second app in this repo — it is the backend-side half of the multi-product contract.

Claiming it needs **no Rust change**:

```bash
# backend/.env
SECONDARY_PRODUCT_ID=myclient     # the wire id clients send in X-Frontend-Id
MONGODB_DB_SECONDARY=myclient_db  # its isolated Mongo database (defaults to SECONDARY_PRODUCT_ID)
```

- `backend/src/product.rs` holds the slot: `init_secondary_id()` (called once from `main.rs`) binds the configured wire id into a `OnceLock`, `secondary_id()` reads it, and `ProductId::Secondary.as_str()` returns it. With nothing configured the slot answers to `secondary` and uses the `secondary` database.
- `ProductId::parse` (`product.rs:71`) also accepts the fixed aliases `secondary`/`sec`/`second`/`product2`/`p2`, plus the configured id.
- Everything the slot owns is already wired: its own user/ledger/order/session/OTP collections (`db_secondary`), its own bootstrap payload (`bootstrap_for_secondary`), its own plan catalogue (`services/plans.rs::plans_for`), its own feature-flag set, its own license-key/activation/starter-pack/upgrade flows (`routes/keys.rs`, `services/billing.rs`), and its own JWT `aud` binding.
- `Config::validate()` rejects `MONGODB_DB == MONGODB_DB_SECONDARY`, an empty `SECONDARY_PRODUCT_ID`, or a secondary id equal to `livemorph` (`config.rs:387`).
- The test suites target the slot with `P2_ID` (`P2_ID="${P2_ID:-secondary}"` in `backend/tests/integration_tests.sh` and `backend/scripts/endpoint_smoke.sh`) — export `P2_ID` to match a non-default `SECONDARY_PRODUCT_ID`.

## Frontend architecture

- Qt6 QML app, module URI `LiveMorph`, binary `build/bin/LiveMorph`. C++ (`src/core`, `src/services`, `src/models`) is exposed to QML as **singleton instances** registered in `apps/livemorph/src/main.cpp:277-297`: `App`, `Auth`, `Session`, `CameraCtrl`, `Recording`, `StreamServer`, `VirtualCamera`, `Config`, `I18n`, `Notifier`, `Catalog`, `Presets`, `Backend`, `Signaling`. `src/core` also carries internal (non-singleton) helpers: `SecureStore`, `DeviceIdentity`, `MorphRecorder`.
- `BackendClient` talks to `http://127.0.0.1:3874` (configurable at runtime via `Config.apiBaseUrl`, default at `BackendClient.cpp:46`), `WebRtcSignalingClient` does WS signaling; media goes through the shared `GstRtcPeer` (GStreamer `webrtcbin`), **not** WebEngine (see `tools/spike-m0/M0_REPORT.md` — webrtcbin interop proven; the only unproven step was CGNAT/no-TURN, environmental).
- The client sends `X-Frontend-Id: livemorph` **and** `X-Client-Product: livemorph` on REST (`BackendClient.cpp:79-80`) and `frontend_id=livemorph` on the WS query (`WebRtcSignalingClient.cpp:68`).
- `SessionManager` is the orchestrator: it owns the session state machine (`enum class Status { Idle, Connecting, Connected, Generating, Cooldown, InsufficientCredits, Error }`, `src/core/SessionManager.h:56`), the reconnect ladder (5 attempts with exponential backoff + jitter, 35 s first-frame watchdog — `SessionManager.h:206-218`, `SessionManager.cpp:117-137`), and the native peer lifecycle.
- `StreamServer` serves local MJPEG (default port 4789, `STREAM_DEFAULT_PORT`) for OBS Browser Source / virtual camera; JPEG encoding is off the GUI thread and the frame mailbox is latest-wins. Frames stay client-side.
- Notifications have a **single funnel**: C++ signals → `Notifier` store → toast + notification center (`apps/livemorph/src/main.cpp:202-215`). Route new user-facing messages through `AppController::notify` / `Notifier::push`, not ad-hoc QML dialogs.
- Settings live in `QSettings` via `ConfigManager` (`src/core/ConfigManager.h`) and are exposed as `Q_PROPERTY` pairs with `NOTIFY` signals; changing the API base URL re-points both HTTP and the cached WS sockets (`main.cpp:161,177-178`).
- Single-instance guard via `QLocalServer` key `livemorph-single-instance` (`main.cpp:371`); deep links use the `livemorph://` URL scheme (`main.cpp:382,428-430,623-625`).
- App-wide: `QQuickStyle::setStyle("Basic")`, a hand-set dark `QPalette` (`main.cpp:146-154`, native chrome only), and embedded Maple Mono fonts loaded from `:/fonts/` (`main.cpp:132-134`; fontconfig fallback was resolving "Inter" to Noto Sans).

### i18n (not Qt Linguist runtime)

Runtime translation is **online and cached**, not compiled `.qm` catalogs:

1. Source strings are English-only `qsTr("...")` / `tr("...")`.
2. `I18nManager` parses the embedded English catalog `:/i18n/livemorph_en.ts` at runtime (`apps/common/i18n/`).
3. On a non-English switch it batches unique source strings (`kBatchSize = 15`, `I18nManager.h:125`) to `https://clients5.google.com/translate_a/t`, one batch in flight, up to 2 retries (`I18nManager.cpp:222-258`).
4. Results are cached as JSON at `QStandardPaths::AppConfigLocation/translations/<lang>.json` with a 7-day TTL; a stale cache still loads instantly and refreshes in the background (`I18nManager.cpp:136-167`).
5. A `JsonTranslator` (a `QTranslator` subclass) serves the lookups; `engine->retranslate()` applies a live switch with no restart.

`qt_add_translations` in `CMakeLists.txt` exists so `lupdate` can rescan the English `.ts`; it does **not** produce runtime `.qm` translations. `apps/livemorph/i18n/README.md` describes a 20-language Qt Linguist workflow that no longer matches the code.

### Design system: Obsidian Hex

The UI is the **"Obsidian Hex"** system (see the header comments in `qml/theme/Colors.qml` and `qml/theme/Theme.qml`): a pure black/white monochrome canvas (true-black `surfaceBase`) with white as the single accent (inverted solid CTAs, hairline borders, hex cells), a honeycomb line motif across screens (brand widgets in `qml/components/`: `Honeycomb`, `Hexagon`, `HexBadge`, `BrandMark`, `CornerTicks`, `SectionHeader`; corner-bracket framing on stage/PiP/cards), and sharpened corners (radius 0-4 px; only pills/toggles/avatars use `radiusFull`). The only hues are functional status semantics (success/warning/error/info) and third-party brand glyphs. Hard directives:

- **Motion is banned project-wide** (permanent directive, restated in `Theme.qml`): no `Behavior` / `*Animation` / `Transition` / `*Animator` elements anywhere in `qml/` — `verify.sh` step 6 greps for them (`verify.sh:95-100`; excludes only `theme/Theme.qml`, which retains `motion*` duration tokens for API stability, and `boundsBehavior`). State changes must be instant via plain bindings; changes driven by real state (e.g. a progress bound to `Session.elapsedSec`) are bindings, not interpolated motion, and are allowed.
- **No gradients, glows, shadows, blur, or backdrop effects** anywhere (removed project-wide; `Colors.qml` keeps only gradient-*stop token names* for API, valued as a monochrome ramp).
- **Token names are API**: never rename a `Colors`/`Theme`/`Constants` property, only revalue it (comment in `Colors.qml`).
- Components must not use hard-coded hex colors, magic `z` literals, or radius literals — use the `Colors.*`, `Theme.z*` (z-stack ladder: `zScrim` 150 … `zLock` 960, `zTitleBar` 210 above drawers), and `Theme.radius*`/`spacing*` tokens instead.

## Shared libraries (`apps/common/`)

| Lib | Target | Notes |
|-----|--------|-------|
| `gstpeer` | `GstRtcPeer` (static) | GStreamer `webrtcbin`; needs `pkg-config` modules `gstreamer-1.0 gstreamer-webrtc-1.0 gstreamer-sdp-1.0 gstreamer-app-1.0 gstreamer-video-1.0` and `GST_USE_UNSTABLE_API=1`. The pipeline runs on a private worker thread with its own `GMainContext` (this Qt build has no GLib event-loop support). A `QVideoSink` feeds only one `VideoOutput`, so popout/preview windows bind their own aux sink via `GstRtcPeer::addAuxSink` — binding the main sink steals video from the stage. |
| `streamserver` | `StreamServer` (static) | MJPEG multipart server for OBS Browser Source / virtual camera; JPEG encoding runs off the GUI thread and the frame mailbox is latest-wins (one encode in flight, stale frames dropped). |
| `i18n` | `CommonI18n` | `JsonTranslator` + `I18nManager` as described above. |

## Conventions

- **Rust**: edition 2021, toolchain pinned to 1.88 (`backend/rust-toolchain.toml`); actix-web 4 + tokio; `thiserror` for errors, `anyhow` in `main`; `tracing` (not `println!`) for runtime logs. Mongo access via `mongodb` 3 / `bson` 2 with `doc!` macro literals.
- **C++**: C++20 (`CMAKE_CXX_STANDARD 20`), AUTOMOC/AUTORCC, `QObject`/`Q_PROPERTY` style, `PascalCase` classes, `.h` + `.cpp` pairs listed explicitly in `CMakeLists.txt` `SOURCES`/`HEADERS`. Qt types are used for everything crossing the QML boundary (`QString`, `QVariantMap`, `QVariantList`).
- **QML**: `qsTr()` for user-visible strings; all colors/spacing/radii/z-index come from the `Colors`/`Theme`/`Constants` singletons, never hard-coded literals in components, and the Obsidian Hex directives above apply (no motion, no gradients/glow/shadow, token names are API). After adding strings, resync the catalog with `lupdate qml src -ts i18n/livemorph_en.ts -no-obsolete` from `apps/livemorph` (`verify.sh` step 6 fails otherwise).
- **Secrets**: never commit `.env` (gitignored; only `.env.example` / `.env.production.template` are tracked). `backend/.env` values must never be shipped to the Qt client (Decart key, Paystack/NOWPayments secrets, JWT secret, OTP pepper).
- `build/`, `build-*/`, `backend/target/`, `venv/`, logs, `token.txt` are gitignored — don't commit build artifacts. Note `.gitignore` also ignores `*.cmake` globally, so a new CMake include module needs `git add -f`.

## Testing approach

- **Backend unit tests**: `cargo test` runs 19 in-source `#[cfg(test)]` tests (e.g. `backend/src/config.rs:539` onward) plus 15 in `backend/tests/security_hardening.rs` (HMAC verify, JWT secret policy, token package economics) — 34 total, all green. The tree currently carries ~10 compiler warnings (dead code, unused imports) — `cargo test` still passes; don't treat existing warnings as a regression.
- **Backend integration**: `backend/tests/integration_tests.sh` is bash + curl against a **running** backend, using `X-Frontend-Id` headers to target products. It registers throwaway users per run, so it is safe to re-run but it does mutate the database. The second product slot is addressed with `P2_*` variables and the `P2_ID` wire id (default `secondary`).
- **Endpoint smoke**: `backend/scripts/endpoint_smoke.sh` asserts 2xx on the public/unauthenticated endpoint surface for both product slots.
- **Frontend smoke**: `apps/livemorph/tests/smoke.cpp` (QtTest, 7 cases) exercises only the dependency-free models (`CharacterCatalogModel`, `PresetModel`). Run the binary directly with `QT_QPA_PLATFORM=offscreen` — `ctest` does **not** work here (see gotcha 12). The target is only built when `BUILD_TESTING=ON` is in the cache, which `build.sh` does not set.
- **QML load gate**: `./build/bin/LiveMorph --verify-qml` is the real UI regression gate and the only frontend check `verify.sh` runs. It installs a Qt message handler that flags runtime-only QML errors ("Cannot assign to non-existent", "is not a type", "Cannot create component", "object creation failed", "Required property"), loads the UI headless, flips to the dashboard so every dashboard component instantiates, and exits non-zero on any match (`apps/livemorph/src/main.cpp:57-110`). It sets `QT_QPA_PLATFORM=offscreen` itself; benign warnings (missing `omega.png` asset, VDPAU probe) print but do not fail the gate.
- **`--shot <dir>`**: headless screenshot pass (`main.cpp:91-105`, `:534-572`) — loads the UI offscreen, walks a fixed state list (auth, dashboard, notifications, settings, buy-credits, whats-new, lock screen, narrow 1024x640) on a timer schedule, and saves one PNG per state into `<dir>`. Useful for visually reviewing UI changes without a display.
- No unit-test framework exists for the C++ services; keep new C++ logic testable through the models or the `--verify-qml` path.

## Gotchas

1. **`RUST_ENV` fails closed.** The default is `"production"` (`Config::default_rust_env`, `backend/src/config.rs:188`) and `Config::is_production()` returns true for anything that isn't exactly `development`/`dev`/`local`/`test` (`config.rs:302`). A typo like `prod` or `staging` silently enables every production guard. `.env.example` ships `RUST_ENV=development`; the default and `docker-compose.yml` ship `production`.
2. **Production prerequisites are enforced in `Config::validate()` (`backend/src/config.rs:314`, production gates inside, e.g. `OTP_PEPPER` at `:424-425`), not just the `main.rs` warning block.** In production `validate()` returns `Err` (boot fails) when: `ALLOW_CREDITS_ADJUST`/`ALLOW_MANUAL_PAYMENTS` is true; `DECART_SIGNALING_URL` doesn't start `wss://`; `PUBLIC_BASE_URL` doesn't start `https://`; `MONGODB_URI` starts `mongodb://` without `tls=true` (use `mongodb+srv://` or append `tls=true`); `SMTP_HOST` is set without `SMTP_USERNAME`+`SMTP_PASSWORD`; or `OTP_PEPPER` (a bare env var, **not** a `Config` field, so it's absent from `.env.example`) is < 16 chars. `validate()` also rejects (any env) `0`/`NaN` on money/rate values, `PLATFORM_MARGIN_RATIO` outside `[0, 0.9]`, `OTP_LENGTH` outside `6..=12`, `MAX_CONCURRENT_SESSIONS < 1`, `MAX_BODY_BYTES` `0` or `> 64 MiB`, `JWT_REFRESH_TTL_SECS <= JWT_ACCESS_TTL_SECS`, `JWT_*_TTL` outside `1..=31536000`, `SIGNUP_BONUS_CREDITS > 1e6`, and a `SMTP_PORT=587` with `SMTP_STARTTLS=false`. The `main.rs:55-160` block hard-fails only the production cases and otherwise `warn!`s (short `JWT_SECRET`, placeholder/empty `DECART_API_KEY`, and missing Paystack/NOWPayments/Google/SMTP credentials).
3. **The backend refuses to boot with the shipped test JWT secret** (`backend/src/main.rs:166-169`) in any environment, and `.test.env` is only loaded when `ALLOW_TEST_ENV=1` is set (`backend/src/config.rs:273-279`).
4. **rustls has no default crypto provider** here (both `aws-lc-rs` and `ring` are enabled), so `main.rs` installs `aws_lc_rs::default_provider()` at startup (`main.rs:48`) — the realtime proxy panics on the first upstream dial without it.
5. **Session rows have two shapes.** The client calls `POST /api/v1/streaming/session-start` (stamps a `"live"` intent row, `routes/streaming.rs:84`) and *then* opens the WS (a `"connecting"`/`"generating"` row) — one logical session, two rows. Only rows that own a Decart stream count toward `MAX_CONCURRENT_SESSIONS`; counting "live" would self-collide with the app's own REST row. The slot is claimed with a single conditional atomic `$inc` so exactly one racing connection wins (`backend/src/realtime/proxy.rs:130-170`); a failed insert releases the claim.
6. **Billing uses a watermark, not a counter.** `generation_tick` bills only `delta = max(seconds - last_billed, 0)`, so an upstream counter reset never re-bills already-paid seconds (`backend/src/realtime/proxy.rs:434-490`). Charge = `delta × CREDITS_PER_SECOND × tier_multiplier` (HD). A billing failure sends `insufficient_credits` or `platform_budget_exhausted` and closes the stream.
7. **Session lifecycle has a single writer.** `mark_session_ended()` (`backend/src/realtime/proxy.rs:703`) is the only code allowed to flip a session row to `ended` — its conditional transition is what releases the `active_sessions` slot. `run_proxy` deliberately does **not** write `status: ended` itself (comments at `proxy.rs:503-520`, `:556-562`); ending the row anywhere else makes the slot release a no-op and leaks the slot on every disconnect. Separately, the **reaper** marks any session with no activity for 10 minutes as `ended` (`connecting`/`generating`/`live`) and decrements `active_sessions` with a clamped `$max(…, 0)` (`backend/src/main.rs:238-330`, loop ticks every 60 s). **On startup the process also resets orphaned claims**: any still-open rows are marked `ended` (`end_reason: "server_restart"`) and every user's `active_sessions` is zeroed (`main.rs:194-236`) — a restart kills all WS connections, so leftover claims are stale by definition.
8. **Middleware order is reverse of registration.** `JwtAuth` is registered first and `Logger` last so requests flow `Logger → DefaultHeaders → Cors → JwtAuth → routes`, and preflight responses still get security headers (`backend/src/main.rs:377-403`).
9. **Every new QML file must be registered twice**: in `qt_add_qml_module(... QML_FILES ...)` (`apps/livemorph/CMakeLists.txt:94-97`) *and* in the hand-written `apps/livemorph/qml/qmldir`. The compiled module generates its own qmldir, but `--dev` mode resolves components through the source `qml/qmldir` — a file missing there builds fine but breaks in dev mode.
10. **QML singletons need the `QT_QML_SINGLETON_TYPE TRUE` source property** (`CMakeLists.txt:86`) *and* the `singleton` keyword in `qml/qmldir` (`Colors`, `Theme`, `Constants`, `PlatformSettings`).
11. **New C++ classes must be added to `SOURCES`/`HEADERS`** in `apps/livemorph/CMakeLists.txt` (`:38`/`:57`) — they are listed explicitly, not globbed.
12. **`ctest` does not work in this project.** `CMakeLists.txt:182-188` calls `add_test()` but never calls `enable_testing()` (nor `include(CTest)`), so no `CTestTestfile.cmake` is generated and `ctest` in the build dir aborts with "No test configuration file found!". Run `./build/bin/LiveMorph_smoke_test` with `QT_QPA_PLATFORM=offscreen` instead. `BUILD_TESTING` is also not a standard CMake variable without `include(CTest)` — it only exists because the `debug` preset sets it as a cache variable, so `build.sh` (plain Release) does not build the smoke target at all.
13. **`--verify-qml` is the only gate that catches runtime QML errors.** A green CMake build means nothing about QML type resolution; run it after any QML change.
14. **Signals must be connected before `engine.load`** (`apps/livemorph/src/main.cpp:310`; load at `:438`) or early-fired signals are missed during QML initialization.
15. **Model whitelist semantics** (`Config::resolve_model`, `backend/src/config.rs:439`): the alias `lucy-latest` maps to `lucy-2.6` first (`:443`). If `DECART_ALLOWED_MODELS` is set and non-empty, **only** ids in that comma list are accepted; the hardcoded fallback `["lucy-2.1", "lucy-2.5", "lucy-restyle-2"]` (`config.rs:458`) is used **only** when the list is unset/empty. The example `DECART_DEFAULT_MODEL=lucy-2.6` is *not* in that fallback, so clearing `DECART_ALLOWED_MODELS` while keeping the default model makes every session a 400. Anything not allowed is a 400.
16. **The OTP lockout is per-IP** (`AUTH_MAX_ATTEMPTS`, `AUTH_LOCKOUT_SECS`), which is why `verify.sh` overrides `AUTH_MAX_ATTEMPTS=500` when it boots the backend for the suites.
17. **The secondary slot's wire id is a process global.** `ProductId::Secondary.as_str()` reads a `OnceLock` that `main.rs` populates from `SECONDARY_PRODUCT_ID` at startup (`backend/src/product.rs:39`). Unit tests that never boot `main` see the default `secondary`. If you add code that must distinguish the slot at runtime, compare against `ProductId::Secondary`, never against the literal string.
18. **The bundled `docker-compose.yml` contradicts `Config::validate()`.** It force-sets `RUST_ENV=production` and `MONGODB_URI=mongodb://mongo:27017` (overriding `env_file`), but `validate()` rejects a non-TLS `mongodb://` URI in production — so `docker compose up -d` as shipped makes the API exit on startup. For a working local stack either run the backend directly with `.env.example` (`RUST_ENV=development`), or edit the compose `MONGODB_URI` to include `tls=true`, or set `RUST_ENV=development` in the compose api service.

## Stale documentation (do not trust these)

These files still describe earlier stacks. Verify against the code before following them:

- `apps/livemorph/README.md` — says "C++17", "no OAuth/Google login", and "Morph Stage: embedded WebEngine".
- `apps/livemorph/packaging/README.md` — describes bundling `QtWebEngineProcess`/Chromium; the app no longer uses WebEngine.
- `apps/livemorph/i18n/README.md` — describes 20 Qt Linguist `.qm` catalogs; only `livemorph_en.ts` exists and runtime translation is online.
- `backend/README.md` — header claims a build status on "rustc 1.97" (the toolchain is pinned to 1.88).
- `docs/README.md` — references a legacy `LiveMorphQt/` path; the app lives at `apps/livemorph/`.
- `docs/*.md`, `PRODUCTION_ANALYSIS.md`, `UI_PARITY_REPORT.md` — point-in-time parity/production reports. Useful for history, not authoritative; several still describe a second Qt client that is not in this repo.
