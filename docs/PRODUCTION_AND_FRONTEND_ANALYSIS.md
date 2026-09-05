# Production readiness + frontend gap analysis

**Date:** 2026-08-18  
**Platform API:** LiveMorph Actix host **v1.8.0** (LiveMorph + Live Escape routes)  
**Toolchains:** see `TOOLCHAIN_LATEST.md`

---

## 1. Toolchain (latest targets)

| Layer | Pin in repo | Action on your machine |
|-------|-------------|------------------------|
| Rust | `rust-toolchain.toml` → **1.85.0**, `rust-version = "1.85"` | `rustup toolchain install 1.85.0 && rustup default 1.85.0` |
| Backend package | **1.8.0** | `cargo update && cargo build --release` |
| LiveMorph Qt | **1.8.0**, CMake **3.22**, C++**20**, Qt **6.8+** | Install Qt 6.8/6.9 + WebEngine + WebSockets |
| Live Escape Qt | **1.8.0**, CMake **3.22**, C++**20**, Qt **6.5+** (prefer 6.8) | Same kit + WebSockets |

This CI sandbox has **Rust 1.75** only — full `cargo build` of current crates needs **≥ 1.85** locally.

---

## 2. Endpoint test matrix (production smoke)

Script: `backend/scripts/endpoint_smoke.sh`

```bash
# Start Mongo + API with production-like env, then:
BASE=http://127.0.0.1:3001 bash backend/scripts/endpoint_smoke.sh
```

### Public / unauthenticated

| Method | Path | Product | Expected |
|--------|------|---------|----------|
| GET | `/api/v1/health` | LM | 200, mongo_livemorph + mongo_liveescape |
| GET | `/health` | LE | 200 |
| GET | `/api/v1/app/version` | LM | 200 |
| GET | `/api/v1/catalog` | LM | 200 |
| GET | `/api/v1/payments/packages` | LM | 200 + providers |
| GET | `/api/v1/webrtc/ice-servers` | LM | 200 |
| GET | `/api/v1/auth/oauth/google/status` | LM | 200 |
| GET | `/public/feature-flags` | LE | 200 |
| GET | `/settings/plans` | LE | 200 |
| GET | `/settings/platform-settings` | LE | 200 |
| GET | `/settings/payment-gateway` | LE | 200 |
| POST | `/version/check` | LE | 200 |
| POST | `/api/v1/version/check` | both | 200 |
| POST | `/webhooks/paystack` | shared | 403/400 without sig (not 404) |
| POST | `/api/v1/payments/webhook/paystack` | shared | same |

### LiveMorph authenticated (`X-Frontend-Id: livemorph`)

| Method | Path | Notes |
|--------|------|-------|
| POST | `/api/v1/auth/register` / `login` / `otp/*` / `refresh` / `me` / `logout*` | JWT |
| GET | `/api/v1/credits/balance` `/ledger` | ledger |
| POST | `/api/v1/credits/burn` | burn |
| POST | `/api/v1/payments/orders` + verify | Paystack when keyed |
| GET/POST | `/api/v1/stream/*` `/vc/*` `/recording/*` | intent/local |
| POST | `/api/v1/support/tickets` | shared |
| WS | `/api/v1/realtime?token=&product=livemorph` | Decart proxy |
| WS | `/ws?token=&product=livemorph` | balance push |

### Live Escape authenticated (`X-Frontend-Id: liveescape`)

| Method | Path | Notes |
|--------|------|-------|
| POST | `/auth/signup` `/auth/login` | LE DB |
| GET | `/credits` | LE DB |
| POST | `/credits/burn` `/credits/purchase` | plan packs |
| POST | `/keys/validate` `/keys/dev-issue` | keys |
| GET/POST | `/settings/*` `/streaming/*` | platform |
| POST | `/starter-pack/pay` `/activation/pay` `/upgrade/pay` | Paystack-first |
| GET/POST | `/referral/*` `/creator/*` `/support/tickets` | LE product |
| WS | `/v1/realtime` `/ws?product=liveescape` | shared handlers |

### Production readiness checklist (ops)

- [ ] `RUST_ENV=production`, strong `JWT_SECRET`, real `DECART_API_KEY`
- [ ] `ALLOW_CREDITS_ADJUST=false`, `ALLOW_MANUAL_PAYMENTS=false`
- [ ] Paystack live keys + **one** webhook URL (alias paths work)
- [ ] SMTP for OTP
- [ ] `MONGODB_DB` + `MONGODB_DB_LIVEESCAPE` both reachable
- [ ] TLS `PUBLIC_BASE_URL`
- [ ] Run `endpoint_smoke.sh` green
- [ ] Manual: OTP email, Paystack test charge, WS balance tick, morph session

**This environment:** smoke script ran → all **FAIL (connection refused)** — API not running here. Run script against your host after `cargo run`.

---

## 3. Frontend vs original — LiveMorph

**Original:** Electron + React/Vite (MorphMe bundle in `app.zip`)  
**Port:** Qt 6 QML + C++ (`LiveMorphQt`)

| Area | Original Electron | LiveMorph Qt | Gap / verdict |
|------|-------------------|--------------|---------------|
| Shell | Chromium window, electron-updater | Qt Quick window | Updater weaker on Qt |
| Auth UI | Split auth, magic link, Google | Same IA, OTP + Google ticket | **Parity strong** |
| Dashboard IA | TopBar → Stage → Workshop → ActionBar | Same structure in QML | **Parity strong** |
| Stage / morph | Decart in renderer / webview | WebEngine Stage + MorphBridge | Needs **WebEngine packaged** |
| Catalog | Character grid, search, prompts | WorkshopPanel, PresetGrid, CustomizeForm | **Parity** |
| Buy credits | Drawer / Paystack | BuyCreditsDrawer + poll | **Parity** (server ledger better) |
| Settings | Full settings + i18n many locales | Settings + Linguist 20 langs | Closing; original i18n historically broader strings |
| OBS / VCam | MJPEG helper | StreamServer + OBS UX | **Parity** |
| Recording | Local | RecordingManager + orphans | **Parity** |
| Popout / preview | Windows | PopoutWindow, PreviewWindow | **Parity** |
| Toasts / onboarding | Yes | ToastHost, OnboardingTour, WhatsNew | **Parity** |
| Auto-update | electron-updater mature | Thin version API | **Original wins** |
| Feel / theme | CSS design system | QML Colors/Theme | Visual polish may differ; IA aligned |

**Net:** LiveMorph Qt is **feature-aligned** with MorphMe for core creator UX; gaps are **packaging (WebEngine)**, **updater maturity**, and residual **i18n string coverage**.

---

## 4. Frontend vs original — Live Escape

**Original product frontend:** SmokeScreen Qt is already the LE client (no separate Electron original in this workspace). Compare to **documented original LE UX** in `BACKEND_MAP` / `ANALYSIS` (license gate, plans, streaming).

| Area | Expected LE product UX | SmokeScreen (current) | Gap |
|------|------------------------|-------------------------|-----|
| Auth | Password signup/login | Yes + unified JWT | OK |
| Access key gate | Validate key before app | AccessGate flow | OK |
| Plans / pay | Starter, activation, upgrade, multi-gateway | API wired; UI for plans/pay | Flutterwave/crypto **backend stubs** on unified host |
| Streaming | Session start/end, backgrounds | StreamController + Decart viewport | Depends on `/v1/realtime` |
| Credits live | `/ws` balance | ApiClient + WebSocketClient → unified `/ws` | OK when API up |
| Referral / creator | In client API | Methods present | UI depth vs marketing product |
| Settings flags | maintenance, gateway, engine key | Fetches present | OK |

**Net:** LE frontend is **coherent with its own product**; against the **unified backend**, Paystack path is real, Flutterwave/crypto need later work, and balance WS is JWT-based on the platform host.

---

## 5. Cross-product frontend comparison (LM Qt vs LE Qt)

| Capability | Better UX/functionality |
|------------|-------------------------|
| Creator workspace (Stage, Workshop) | **LiveMorph** |
| License + plan funnel | **Live Escape** |
| Passwordless auth | **LiveMorph** |
| i18n | **LiveMorph** |
| OBS / recording | **LiveMorph** |
| Live credit push | **Live Escape** (client + `/ws`) |
| Multi-step commerce | **Live Escape** |
| Pack shop simplicity | **LiveMorph** |

---

## 6. Production readiness verdict

| Layer | Status |
|-------|--------|
| Unified API design | Ready for local/staging with dual DB + product headers |
| Endpoint coverage | Broad; smoke script covers critical HTTP paths |
| Live E2E in this sandbox | **Blocked** (no running API/Mongo/Rust 1.85) |
| LiveMorph UI vs MorphMe | **High functional parity**; ship WebEngine + updater next |
| Live Escape UI vs LE product | **Aligned**; complete Flutterwave only if required |

**Next commands on your machine**

```bash
rustup default 1.85.0
cd port/backend && cp .env.example .env   # fill secrets
# start Mongo, then:
cargo run --release
bash scripts/endpoint_smoke.sh
```
