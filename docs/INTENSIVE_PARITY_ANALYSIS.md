# Intensive UI / UX / Functionality parity — Original JS (MorphMe Electron) vs LiveMorph Qt

**Sources:** `app.zip` (Electron + React/Vite, v1.5.8) · `port/` (Qt6 QML + C++ + Rust API, v1.7.0)

---

## 1. Architecture (communication model)

| Concern | Original (JS bundle) | LiveMorph port | Communication health |
|---------|----------------------|----------------|----------------------|
| Auth | **Supabase** client (`lwplsztlrhxafyoayvkw.supabase.co`) — magic link / session in renderer | **Rust API** JWT: OTP request/verify, login, register, refresh, `/auth/me`, Google OAuth ticket exchange | **Aligned to new backend.** Desktop holds JWT in SecureStore; `Authorization: Bearer` on API calls |
| Morph / AI | **@decartai/sdk** in renderer → Decart directly | Desktop WebEngine Stage + **WebSocket** ` /api/v1/realtime?token=&model=` → Rust **proxies** to Decart (API key server-only) | **Correct for production.** Safer than original key-in-client risk |
| Catalog | Electron IPC `catalog:get` + local/starters | `GET/POST` catalog via `Backend.fetchCatalog` + local Presets | **OK** if packages fetched after sign-in (wired) |
| Payments | Paystack (+ crypto path) from renderer/backend helper | `POST /payments/orders`, verify, status; drawer + CheckoutSheet | **OK** — order_id, authorization_url, balance fields match client handlers |
| Credits display | Supabase/user metadata + client store | `credit_balance` / `bonus_balance` from auth responses + `/credits/balance` | **Improved** — balance refresh on sign-in + after verify |
| Stream / VCam | Electron main: MJPEG server, IPC start/stop/pause/resume | Local `StreamServer` + `VirtualCameraHelper`; backend `/stream/*` `/vc/*` are **intent-only** | **OK** — real frames never need cloud; same UX as original helper |
| Recording | Electron main ffmpeg-ish / file IPC | Qt Multimedia local + optional backend metadata | **OK** for desktop path |
| Updates | electron-updater IPC | Settings check/download/install UX | **Partial** — UX present; full auto-update depends on packaging |
| Deep links | morphme / site return URLs | `livemorph://` OAuth + payments return | **OK** |

### Frontend ↔ backend contract (desktop)

| Client call | Backend route | Notes |
|-------------|---------------|--------|
| Auth OTP / login / refresh / me | `/api/v1/auth/*` | `/auth/me` is **POST** (client matches) |
| Google start / exchange | `/auth/oauth/google/*` | Ticket flow, not raw JWT in URL |
| Packages / orders / verify / status | `/api/v1/payments/*` | Public webhooks separate |
| Credits balance | `/api/v1/credits/balance` | Wired after sign-in |
| Catalog | `/api/v1/catalog` | Wired after sign-in |
| Realtime WS | `/api/v1/realtime` | JWT query param |
| Stream / VC | `/api/v1/stream/*`, `/vc/*` | Intent; local MJPEG does the work |
| Health / version | `/api/v1/health`, `/app/version` | Ping every 15s |

**Judgment:** Communication is **consistent with the Rust API design**. Gaps that remained (balance not always re-fetched, packages not forced on drawer) were tightened in this pass.

---

## 2. UI surface map

| Original surface | Port surface | UX parity |
|------------------|--------------|-----------|
| Auth split panel + hero | `AuthScreen.qml` | **High** — email OTP, Google when enabled, legal footer |
| Dashboard shell | `Dashboard.qml` | **High** — top bar, stage, workshop, action/status |
| Stage + controls | `MorphStage*`, `StageControls`, `PromptCommitBar` | **High** if WebEngine present; degraded messaging if not |
| Workshop / presets | `WorkshopPanel`, `PresetGrid`, `CustomizeForm` | **High** |
| Action bar | `ActionBar.qml` | **High** — start/stop, record, stream, popout/preview |
| Buy credits modal/drawer | `BuyCreditsDrawer` + `CheckoutSheet` | **High** — packs, Paystack, crypto panel |
| Settings | `SettingsDrawer` / Settings page | **High** |
| Popout / Preview windows | `PopoutWindow`, `PreviewWindow` | **Present** |
| Onboarding / What’s new | `OnboardingTour`, `WhatsNewModal` | **Present** (LiveMorph copy) |
| Toasts / notifications | `ToastHost`, `NotificationsPanel` | **Present** |
| i18n | Multiple `translation-*.js` | Port has `I18nManager` + `.ts` files — **partial coverage** vs original language set |

---

## 3. Functionality depth

### Auth & account
- Original: Supabase session, site account links (`morphmelive.com/account`).
- Port: Self-hosted OTP + optional Google; delete/export/logout_all endpoints exist on API; desktop should expose settings actions where product requires.
- **Parity:** Core sign-in **yes**. Account portal website **no** (by design for self-hosted).

### Live morph
- Original: Decart SDK WebRTC in Chromium (Electron).
- Port: Same class of WebRTC inside Qt WebEngine; signaling via backend proxy.
- **Parity:** **Yes** when WebEngine is packaged. **Hard dependency** on WebEngine deploy.

### Credits & payments
- Original: Buy credits UI, Paystack, burn rate copy (~2 credits/sec, HD multiplier).
- Port: Same product math on server (`CREDITS_PER_SECOND`, HD multiplier); Paystack + NOWPayments; desktop poll + webhook.
- **Parity:** **Yes** for card; crypto **yes** if NOWPayments configured. Desktop does not need to be a “web app” for this.

### Virtual camera / OBS
- Original: Local MJPEG `/stream`, pause/resume, OBS instructions.
- Port: Same model + optional Linux v4l2loopback.
- **Parity:** **Yes** (no kernel driver required — intentional).

### Recording
- Original: IPC start/stop/finalize/orphans/reveal.
- Port: Local camera record + orphan recover UI in settings.
- **Parity:** **Mostly yes**; edge codec behavior may differ by OS.

---

## 4. UX differences (intentional or residual)

| Topic | Assessment |
|-------|------------|
| Branding | LiveMorph throughout (rebrand complete) |
| Trust / secrets | **Better than original** — Decart/Paystack secrets not in desktop |
| Auth provider | Different stack (Supabase → custom API) — **same user job** (email code in) |
| Offline / backend down | Port surfaces `Backend.reachable` — **clearer** |
| WebEngine missing | Explicit notification — **must** ship WebEngine for morph |
| i18n breadth | Original stronger out of the box |
| Auto-update | Original electron-updater more mature |

---

## 5. Frontend communication checklist (verified in code)

- [x] Base URL normalized; Bearer token on API requests  
- [x] Auth routes match backend methods  
- [x] Payment create → `paymentOrderCreated` → Checkout / crypto UI  
- [x] Verify / status → balance apply via `Auth.applyBalance`  
- [x] Sign-in → fetch credits balance, catalog, packages  
- [x] Session start → WS URL includes `/api/v1/realtime` + JWT  
- [x] Stream/VC: local server primary; backend intent optional  
- [x] HTTP status + timeouts on get/post  
- [x] Ping keeps reachable flag honest  

---

## 6. Verdict

| Layer | Score | Comment |
|-------|-------|---------|
| **UI layout / IA** | ~95% | Stage, workshop, action bar, drawers match original structure |
| **UX flows** | ~90% | Auth, buy, morph, record, OBS path equivalent |
| **Functionality** | ~90–95% | Full morph needs WebEngine; payments need configured API |
| **Backend design** | **Production-stronger** | Server ledger + Decart proxy + signed webhooks |
| **Frontend↔backend sync** | **Sound** after this pass | Field names and refresh paths aligned |

The original bundle is a **Supabase + Decart-in-renderer** Electron app. The port is a **native desktop + self-hosted API** with the same product surfaces. They are not wire-compatible with Supabase, but they are **product-parity oriented** and the Qt client is wired to the Rust API as intended.
