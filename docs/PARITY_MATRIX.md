# UI/UX & Client-Flow Parity Matrix — Electron vs Qt

Reference apps (UI/UX reference **only**, not backend contracts):
- Live Morph Electron: `/home/omega/Downloads/app/dist/` (React)
- Live Escape Electron: `/home/omega/Downloads/LIVE-ESCAPE-BUNDLED/app/dashboard.html`

Qt implementations:
- `apps/livemorph/` — violet theme, unified Rust backend, native GStreamer WebRTC
- `apps/liveescape/` — gold/teal theme, unified Rust backend, native GStreamer WebRTC

## Intentional divergences (kept as Qt improvements)
| Area | Electron | Qt (kept) |
|---|---|---|
| Backend | Supabase/fal (LM) & own Node API (LE) | Single unified Rust/Actix backend, product via `X-Frontend-Id` / `X-Client-Product` |
| Media transport | WebEngine renderer | Native GStreamer WebRTC peer (`GstRtcPeer`), MJPEG local OBS feed |
| Onboarding (LE) | 13-step tour | 13-step tour (copy aligned) |
| Voice Changer | advertised (Creator+) | **Removed** (no backend/UI implementation existed) |
| i18n | 8+ shipped languages | Mechanism wired + English catalog; multi-language follow-up |
| Payment rails | Paystack + Flutterwave + crypto | Paystack + **Flutterwave (restored)** + crypto (NowPayments) |

## LiveEscape parity
| Screen/Flow | Status |
|---|---|
| Auth (login/signup/forgot/reset) | ✅ (`/auth/signup` + `/auth/logout-all` aliases added) |
| Access Gate (device id, plans, key entry) | ✅ (+ Flutterwave method toggle) |
| Get-Started / Starter Pack | ✅ |
| Dashboard (top bar, meter, controls, OBS, theatre) | ✅ (OBS SRC CAM/AI+CAM now functional) |
| PayModal / PlanGate / Upgrade | ✅ (upgrade-vs-purchase discriminated by intent, not plan id) |
| Crypto proof / payment status | ✅ |
| Free credits / welcome / consent | ✅ |
| Lock screens / expiry / force-update | ✅ |
| Downloads screen | ✅ registered in loader + CMake |
| Tutorials / Tour | ✅ 13-step + tutorials copy fixed (WebEngine→native) |
| Admin panel | ✅ (engine key + `set_total` credit override fixed) |
| Referral / Creator payout / support | ✅ |
| Credit burn rate | ✅ single source (2.0/s default, backend-driven) |

## LiveMorph parity
| Screen/Flow | Status |
|---|---|
| Auth (email OTP + Google) | ✅ |
| Dashboard / stage / workshop / action bar | ✅ |
| Prompt & background bars | ✅ (BackgroundBar now server-preset-driven) |
| Upload / reference (consent-gated) | ✅ (local reference; `/characters/mine` CRUD present in backend) |
| Stream Kit (disclosure templates) | ✅ (open flow fixed) |
| Buy credits / checkout / in-flight | ✅ |
| Preview / Popout windows | ✅ |
| Settings drawer (general/camera/stream/recording/account) | ✅ |
| Onboarding tour | ✅ 8 steps (credits step added) |
| WhatsNew | ✅ |
| HD gating | ✅ (tier-based; Starter+ unlocks) |
| Streaming-unavailable banner | ✅ (`PlatformSettings` wired) |
| Recording | ✅ single backend round-trip |
| Icon set | ✅ `file-text` added |

## Backend unification
- Single `/api/v1` namespace; no product-named scopes; no root/legacy aliases.
- One route per "movement"; product identity solely via headers / WS query.
- Unified order engine `services/orders.rs` (kind × product × provider).
- Flutterwave fully restored: `services/flutterwave.rs`, `FLUTTERWAVE_PUBLIC_KEY` config, order + verify wiring.
- Endpoint reconciliation for Qt clients: `/auth/signup`, `/auth/logout-all`, `/credits/*`, `/downloads/list`, `/characters/mine`, `/settings/activation-plans`, `/settings/crypto`, `/api/v1/public/*`.

## Verified in this pass
- Backend: `cargo check` clean, `cargo test` 23 unit + 15 security hardening PASS; integration/smoke extended.
- LiveEscape Qt: full CMake build PASS; qmllint clean.
- LiveMorph Qt: full CMake build PASS; qmllint clean.

## Known follow-ups (non-blocking)
- Multi-language translation files (both apps) — mechanism is wired (EN only shipped).
- `UploadTab` persists reference to `/characters/mine` library UI (backend + CRUD ready; no Library tab wired yet).
- Dead/private `ApiClient` helpers in LiveEscape (`lookupKey`, `burnCredits`, `addCredits`, `fetchEngineKey`, `rotateEngineKey`, `attachReferral`, `connectBalanceSocket`) — harmless, left for future cleanup.