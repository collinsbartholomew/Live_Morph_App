# PORTING ANALYSIS — Smoke Screen (Electron) → Native Qt 6

**Source of truth:** `/home/omega/Downloads/LIVE-ESCAPE-BUNDLED/app/` — `dashboard.html` (13,887 lines: CSS lines 16–4834, body 4837–6613, JS 6614–13887), `main.js` (144), `preload.js` (5).
**Brand:** **Smoke Screen** (full-fidelity branding per user decision). Window title `Smoke Screen`, version `1.8`.
**Rendering runtime:** Chromium/Electron. **Port target:** Qt 6.11.2 QML/C++ (native only).

---

## 1. Design Tokens (CSS `:root` — the Theme singleton)

| Token | Value | Theme.qml name |
|---|---|---|
| `--bg` | `#04040a` | `bg` |
| `--s1` | `#0a0a16` | `s1` |
| `--s2` | `#111120` | `s2` |
| `--border` | `#1c1c30` | `border` |
| `--gold` | `#e8c547` | `gold` |
| `--gold-d` | `rgba(232,197,71,.18)` | `goldD` |
| `--gold-g` | `rgba(232,197,71,.06)` | `goldG` |
| `--teal` | `#3fe8b8` | `teal` |
| `--teal-d` | `rgba(63,232,184,.15)` | `tealD` |
| `--red` | `#ff4d6d` | `red` |
| `--text` | `#e8e8f8` | `text` |
| `--dim` | `#606080` | `dim` |
| `--dim2` | `rgba(96,96,128,.55)` | `dim2` |
| `--card` | `var(--s2)` | — (alias) |
| `--r` | `7px` | `radius` |
| `--font` | `'Rajdhani', sans-serif` | `fontUi` |
| `--mono` | `'JetBrains Mono', monospace` | `fontMono` |

Aux hardcoded colors: `#d4a017` (gold gradient partner), `#1a0a00` (text on gold), `#0d0d18`/`#0d0d1a` (tooltip/access-card gradient end), `#25d366` (WhatsApp), **`rgba(240,168,48,…)`** (warm orange-gold used by tour/tutorial/low-credit-bar — distinct from `--gold`).

**Typography:** Rajdhani weights 400–700 loaded (higher = synthetic); JBM 300–500. Font sizes run 7px→64px; full per-class table in §5.

## 2. Screens & Overlays (all 25, exact ids/z)

| Screen/Modal | id | z | Shows when |
|---|---|---|---|
| Maintenance blocker | `maintenanceBlocker` | 100000 | maintenance API / boot fatal |
| Gate blocker | `gateBlocker` | 99999 | transient flicker guard in gate enforcement |
| Tutorial modal (full-bleed) | `tutorialModal` | 10002 | TUTORIALS button |
| Tour modal ("Are you Ready…") | `tourModal` | 10001 | tour start |
| Tour tooltip | `tourTooltip` | 10000 | 13-step tour |
| Preloader | `preloader` | 9999 | boot → `hidePreloader()` |
| Force update modal | `forceUpdateModal` | 9999 | `/version/check` force |
| Lock screen (credits exhausted) | `lockScreen` | 9999 | credits ≤0 with ledger |
| Toast | `toast` | 9999 | any `toast(msg,type)` |
| Starter lock screen | `starterLockScreen` | 9998 | starter + 0 credits |
| Tour overlay / highlight | `tourOverlay`/`tourHighlight` | 9997/9998 | during tour |
| Admin panel (disabled) | `adminPanel` | 900 | — (Ctrl+Shift+A blocked) |
| Exit theatre pill | `exitTheatre` | 900 | theatre mode |
| Low credit bar | `lowCreditBar` | 800 | remain ≤ 500 |
| Pay success modal | `paySuccessModal` | 700 | purchase verified |
| Expiry / Pay / Account / Consent / Stream-consent modals | `expiryModal`,`payModal`,`accountModal`,`consentModal`,`streamConsentModal` | 600 | per flow |
| Plan onboarding overlay | `planOnboardingOverlay` | 620 | per-plan first run |
| Onboarding overlay (legacy 7-step) | `onboardingOverlay` | 610 | legacy flag |
| Abuse / Upgrade / Dashboard-notification modals | `abuseReportModal`,`upgradeGate`,`dashboardNotificationModal` | 650 | per flow |
| Free credits modal | `freeCreditsModal` | 550 | welcome gift |
| Background panel backdrop | `bgPanelBackdrop`(+`bgPanel`) | 550 | BACKGROUND button |
| Welcome modal | `welcomeModal` | 540 | post free-credits |
| Starter pay modal | `starterPayModal` | 525 | Try First flow |
| Get started modal | `getStartedModal` | 520 | post-signup (retired routing: Try First → starter pay) |
| Auth screen | `authScreen` | 500 | not signed in |
| Access gate | `accessGate` | 500 | activation flow |
| Plan gate | `planGate` | 500 | credit top-up |
| **Dashboard** | `mainApp` (grid `auto 54px 1fr auto`) | — | signed in + cleared |
| FS hint / FS button / streaming banner / expiry banner / exit overlay | `fsHint`,`fsBtn`,`streamingUnavailableBanner`,`expiryBanner`,`reconnectingOverlay` | various | states |

### 2.1 Auth screen (SCREEN 0) — **single centered 420px card** (`.auth-box`), radial-gold backdrop. NO hero panel, NO social login, NO footer.
Contents (exact): gem `S` + `SMOKE·SCREEN` wordmark + `1.8`; tagline `REAL-TIME AI VIDEO TRANSFORMATION`; tabs `SIGN IN` / `CREATE ACCOUNT`; 4 forms (login / reset-request / reset-password / signup) with exact labels & placeholders (Email→`your@email.com`, Password→`••••••••`, Name→`Your Name`, Phone→`e.g. 08012345678`, referral→`Enter friend's referral code`, terms checkbox; error/success lines; gold submit buttons `SIGN IN`/`SEND RESET LINK`/`RESET PASSWORD`/`CREATE ACCOUNT`; `Forgot password?` + `Back to sign in` help links).

### 2.2 Dashboard (`mainApp`) — CSS-grid: banner row / **54px top bar** / stage / control panel.
- **Top bar** (exact order): logo gem + `1.8` | status pill `.dot` + `OFFLINE` | meter `USED 0 CR` / `LEFT — CR` | buttons: `⬛ OBS`, `● REC`, `📷 SNAP`, `▶ TOUR`, `📚 TUTORIALS`, `👤 ACCOUNT`.
- **Stage**: video, out-glow, scanlines, freeze canvas, placeholder `◈ AI OUTPUT WILL APPEAR HERE`, loader `CONNECTING TO ENGINE…`, `◈ AI LIVE` badge, conn-quality pill `▲ LIVE IN-APP`, `⛶` fullscreen btn, PiP `YOUR CAM` (180×101, draggable, cursor:move).
- **Controls** (`255px | 1fr | 255px` grid): col1 camera select, mode seg `STYLE`/`FACE SWAP`, reference upload zone, streaming-unavailable banner, buttons `▶ CONNECT`/`⏸ PAUSE`/`▶ PLAY`/`■ STOP`/`🖼 BACKGROUND`, `🚨 Report Abuse`; col2 prompt area (LIVE UPDATE + ENHANCE toggles, presets, recent), starter lock overlay `Creator Plan Required` + `⚡ UPGRADE PLAN`; col3 balance (PLAN TOTAL/USED/REMAINING + bar, starter upsell), quality select (High/Balanced/Performance), latency, `🎟️ BUY MORE CREDITS`.

### 2.3 Shared patterns
- **`.overlay`**: fixed, `rgba(4,4,10,.97)`, blur 12px, z 500, `fadeIn .35s`.
- **`.modal`**: s1 card, gold-d border, radius 12, max 460, gold glow shadow, `slideUp .35s`. Children: `h2` gold 20px/700/3px-ls; `.sub` mono 9px dim; `.mbody` s2 box; `.ok-btn` gold 15px/700/3px.
- **Crypto panel ×4** (starter/gate/upgrade/creds): orange-tint panel `rgba(247,147,26,.06)`/border .25, coin chips, QR 120px white, address + COPY, TX ID input, proof image, submit `✓ I HAVE SENT PAYMENT` (orange gradient `#f7931a→#fbcc5c`), pending notice.
- **Gate plan tiles**: Starter $20/300cr, **Creator $75/500cr (Most Popular)**, Pro $120/2000cr; feature lists with ✓/– chips; method toggle `💳 Card / Transfer` / `₿ Crypto`.
- **Plan gate cards ×5**: Test $0.50/50cr, Starter $20/1000cr, **Pro $60/5000cr (MOST POPULAR)**, Premium $150/10k cr, Elite $550/50k cr.

## 3. Behavior (JS state machine)

- **Boot IIFE**: resolve `API_URL` (override chain: `?api=` → `ss_api_url` → cached config probe → `ss_api_active_url` → prod default) → `startApp()` → maintenance check → gate enforcer → `bootApp()`.
- **`bootApp()`** order: hide everything → storage-reset token (wipe+reload on change) → logout token → branding → force-update check → **consent gate** → gated-UI → device ID (native → fingerprint, `SS-XXXX-XXXX-XXXX(-XXXX)`) → URL params (`?token`,`?forgot`,`?ref`,`?auth=1`) → plans/gateway/burn-rate/crypto loads → session checks (no-session→auth; re-auth guard→auth) → starter-pack status sync (server-authoritative) → license lookup/validate → expiry → first-run free-credits (feature-flagged) → credit sync → exhaustion lock → **showMainApp**.
- **Gate enforcer** (1 s interval + visibility/focus events): recomputes required screen (`auth|get_started|access|expiry|starter_lock|lock|main`), re-syncs credits every 30 s, respects in-flight purchase flows.
- **Streaming**: consent → availability → camera → credits hard-block → key (demo→server→cached) → Decart SDK WebRTC (`lucy-2.5`) → session log + 8-credit overhead → burn 1 s interval (flush ≥30) → states (connecting/generating/reconnecting/disconnected) with last-good-frame saver (500 ms), freeze canvas, hard auto-reconnect (Decart 60 s limit), paid-key fallback/rotation, latency sampler (3 s), 15 s safety timer.
- **Overlay protection**: 14 PROTECTED_IDS; MutationObserver + 800 ms sweep force-restore active overlays (anti-tamper); clickjacking check.
- **First-run**: tour (13 steps) → free-credits modal → welcome modal.
- **Key shortcuts**: `F` fullscreen (not in inputs), Enter submits (login/signup/key inputs), Ctrl+Shift+A blocked. **No ESC/F5–F11 handlers.**
- **Timers** (all): burn 1 s; overlay sweep 800 ms; gate enforce 1 s; credit sync 30 s; notification poll 60 s; NowPayments poll 10 s (unused offline); WS reconnect 2.5 s; latency 3 s; frame save 500 ms; toast 4.5 s; prompt debounce 600 ms; preloader removal 500 ms.
- **Electron-native (main.js)**: window 1200×800→maximize; no menu; machine ID = SHA-256 of OS GUID → `SS-` format; native force-update check (`platform:'desktop'`) that quits.

## 4. State & Storage

- **localStorage** (30 keys, `ss_*`): consent, onboarded, user JSON, session email, access JSON (license), cred start/used, plan SKU + account tier, free-credits flags, referral (code/by/earned), storage-reset + logout tokens, starter-pack (5 keys), notif dismissed, tour completed/dismissed, engine key, hidden plans, admin referral config, site logo/favicon, payments audit, device id.
- **sessionStorage**: auth-seen, credits-exhausted ack, low-credit-bar dismissed.
- **Qt mapping**: QSettings-backed store keyed by the same `ss_*` names (storage-reset/logout wipes everything but branding keys — same semantics).
- **Global state**: `S` streaming object (mode/client/rt/stream/connected/paused/rec/secs/refImg/history/…), credits constants (rate 3.0/s server-overridable, free 1500, starter 500/$10), gate plans (20/75/120), gateway state, crypto selections, engine-key mode, WS handle.

## 5. CSS→QML component mapping (exact)

Foundation: `.ok-btn`(gold btn) → GoldButton; `.field`(label+input) → FieldInput; `.auth-tab`/`.seg-btn` → SegButton; `.tgl`(32×17 switch, 11px knob, translateX 15) → ToggleSwitch; `.ibtn` (pill 100px radius) → BarButton; `.pill`/`.meter` → StatusPill/CreditMeter; `.modal`/`.overlay` → ModalBase; `.toast` (slide-up 300 ms, 4.5 s) → Toast; `.p-btn`(preset chips); `.hi`(recent); `.plan-card`/`.gate-plan-opt` → plan tiles; `.bal-bar`; `.step-num`; `.device-id-card`; `.akey-input`; `.copy-btn`; `.upload-zone` (dashed border); crypto panel → CryptoPayPanel; tour → TourOverlay (2px gold border + glow, tooltip #0d0d18, 220–300px, cubic-bezier(.4,0,.2,1) moves).
Keyframes → QML animations: pulse(1→.45→1), spin, fadeIn .35s, slideUp(24px→0) .35s/.4s/.3s, glow(credits), creditsPop(scale 1.08), preloaderPulse(2.4s), ringRotate(1.6s), dotBounce(1.4s stagger .16/.32), preloaderFade(.45s), bgApplySpin(.7s), tutFadeIn(.22s).

## 6. Responsive breakpoints (exact)

- **≤900px**: plan cards 2-col.
- **≤768px** (main pass): auth box padding 32/24 width 94%; bar 52px, logo small hidden, `.ibtn span:not(.dot)` hidden (icon-only buttons); stage pip 110×62; ctrl single column, cols stack with bottom borders; all inputs 12px; toggles 36×20; modals 28/22; account single-col buttons; tutorial sidebar below.
- **≤480px**: plan cards 2-col gap 10 (price 28px); auth 26/18; bar 48px, `.bar-mid` hidden; pip 90×51.
- **≤360px**: auth 20/14; bar-right gap 4.

## 7. Network API (Qt ApiClient map)

- **No Bearer, no X-Frontend-Id** in the Electron. Auth = httpOnly cookie (`credentials:'include'`) for the login family; license family = header trio `x-access-key`/`x-user-id`/`x-device-id`; burn/streaming put `access_key` in the **body**; endpoints are root-relative (`/auth/login`, `/settings/...`) — no `/api/v1` prefix.
- 55 fetch call sites across: auth(6), bootstrap/settings(15), license(2), payments paystack/flutterwave/crypto(15), credits(4), streaming(4), referral/creator(3), support/downloads(2), version(1), + WS + Decart SDK (esm.sh, model `lucy-2.5`).
- **WebSocket** `ws(s)://API_HOST?user_id=&access_key=`: `balance_update`, `force_disconnect`, `storage_reset`, `force_logout`, `dashboard_notification`.
- **Reuse verdict (from code verification):** the existing C++ core (`ApiClient`, `SessionManager`, `AppController`, `StreamController`, `UpdateChecker`, `WebSocketClient`, `DecartSignalingClient`, `SecureStore`, `MachineIdProvider`) is functionally proven against this backend and covers ~90% of this surface. Deltas to add: `/public/storage-reset-token` + `/public/logout-token` checks, `/settings/crypto` dedicated fetch, starter-pack boot reconcile (`/starter-pack/status` exists), NowPayments poll (skip — disabled backend), burn flush semantics (≥30 credits), session-log body fields (`consent_given`, `face_upload_hash`, mode, prompt). The JWT-vs-cookie difference is internal to the backend and works; keep the proven transport, document the divergence.

## 8. Assets

- Fonts: bundled (Rajdhani ×4, JBM variable) → `resources/fonts/`.
- Logo: remote `https://smokescreenapp.com/logo.png` injected at runtime (unreachable offline) — Qt renders the CSS default: gold gem square with `S` glyph (preloader gem is the 135° gradient gold→#d4a017→teal square).
- No local images in the bundle (icon.png/ico exist but are runtime favicon/logo candidates).

## 9. Non-equivalents / decisions

1. **Decart SDK**: browser SDK over esm.sh. Qt equivalent = existing native WebRTC pipeline (`common/gstpeer` + `DecartSignalingClient` → backend WS signaling proxy, model `lucy-2.5`). Same engine, native transport — documented divergence (no raw browser SDK).
2. **Paystack/Flutterwave JS widgets**: browser-only. Qt uses backend-hosted checkout hand-off (existing proven flow) — same server verification endpoints; the in-app widget step becomes an external-browser step.
3. **`backdrop-filter: blur(12px)`**: Qt Quick has no backdrop blur; overlay backdrops use the reference's solid `rgba(4,4,10,.97)` (visually near-identical at .97 opacity).
4. **Font weight 800/900**: synthesized in the browser; Qt uses real Rajdhani Bold (700).
5. **`.step-num` double CSS definition**: pick Def 1 (31px gradient badge) — matches access-gate renders.
