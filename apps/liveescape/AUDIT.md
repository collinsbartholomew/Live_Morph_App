# Live Escape — Full audit vs original JS (Smoke Screen Electron)

Date: 2026-08-17  
Baseline original: `LIVE-ESCAPE-BUNDLED` / `dashboard.html` + Electron shell  
Port: Qt 6 QML/C++ client + Rust/Axum/Mongo backend (`SmokeScreen/`)

---

## 1. Executive verdict

| Layer | Match level | Production-ready? |
|-------|-------------|-------------------|
| Visual theme / chrome | **High** (~95%) | Yes |
| Screen / modal coverage | **High** (~90%) | Yes |
| Core product loop (auth → gate → connect → burn → pay) | **High** (~90%) | Yes with secrets |
| Payment providers | **High** (Paystack strongest) | Yes with ops config |
| Realtime AI pixels | **Medium** (needs WebEngine + ICE) | Conditional |
| Pixel-perfect UI density / animations | **Medium** | Acceptable for native |
| Every Electron-only helper (demo token, OS downloads list, etc.) | **Partial** | Non-blocking |

**Overall:** The port is a **production-oriented rewrite**, not a line-clone of the HTML app. Feature parity for the money-making and streaming loop is strong. Remaining gaps are mostly environment-dependent (WebEngine, TURN, payment secrets) or deliberate native tradeoffs (recording).

---

## 2. UI / UX audit

### 2.1 Screens (original → port)

| Original | Port | Notes |
|----------|------|--------|
| `#preloader` | `PreloaderScreen` | Matched structure; brand Live Escape |
| `#authScreen` login/signup/reset | `AuthScreen` modes 0–3 | Reset **request + complete token** present |
| `#gateBlocker` / access | `AccessGateScreen` | License key + plan entry |
| `#planGate` / plan cards | `PlanGateModal` | Plans from API + fallback |
| Main dashboard | `DashboardScreen` | Top bar, stage, 3 columns |
| `#maintenanceBlocker` | `Main.qml` maint component | Present |
| Theatre / OBS | `Stream.theatreMode` overlay | Full DecartViewport |
| Stage fullscreen | `stageFullscreen` | Present |

### 2.2 Modals

| Original | Port | Status |
|----------|------|--------|
| accountModal | AccountModal | Present (referral, logout, creator) |
| tutorialModal | TutorialsModal | Present |
| tourModal / tourOverlay | TourOverlay | Present |
| consent / streamConsent | ConsentModal | Present |
| welcome / getStarted | WelcomeModal | Present |
| freeCreditsModal | FreeCreditsModal | Present |
| lockScreen / starterLock | LockScreen | Present |
| adminPanel | AdminModal | Ctrl+Shift+A |
| abuseReportModal | AbuseReportModal | Present |
| bgPanel | BackgroundPanel | Present |
| payModal / starterPay / upgrade | PayModal + CheckoutWebModal | Present |
| crypto panels | CryptoProofModal | Present |
| paySuccess / payment status | PaymentStatusModal | Present |
| dashboardNotification | NotificationModal | Present |
| upgradeCardPanel | UpgradeModal | **Fixed** unterminated string |
| forceUpdateModal | UpdateChecker + QMessageBox | Native dialog |
| expiryModal | Expiry banner on dashboard | Banner, not full modal |
| onboarding overlays | Tour + Welcome | Simplified |

### 2.3 Dashboard controls

| Control | Original | Port |
|---------|----------|------|
| Status pill | Yes | `StatusPill` |
| Credit meter | Yes | `CreditMeter` |
| OBS / theatre | Yes | Yes |
| REC | Yes | Yes (MP4 prefer / PNG fallback) |
| SNAP | Yes | Real `grabToImage` |
| FREEZE | Internal AI freeze | Explicit user toggle + real frame |
| TOUR / TUTORIALS / ACCOUNT | Yes | Yes |
| Reference face upload + camera | Yes | File + camera popup |
| CONNECT / STOP / PAUSE | Yes | Yes |
| Background | Yes | Feature-gated |
| Prompt + presets + recent | Yes | Yes |
| Session balance + quality + latency | Yes | Yes |
| Buy more credits | Yes | Opens plan gate |
| Report abuse | Yes | Yes |

### 2.4 UX deltas (intentional / residual)

1. **Brand:** Smoke Screen → **Live Escape**
2. **FREEZE** is user-facing on the port (original mostly auto during generation)
3. Less CSS animation density (native QML)
4. Expiry is a **banner**, not a blocking modal
5. In-app checkout needs **WebEngine**; else opens system browser

---

## 3. Functionality audit

### 3.1 Happy path (both stacks)

```
Boot → preloader → auth → access key → dashboard
→ upload face → CONNECT → session-start → signaling → burn credits
→ SNAP / FREEZE / REC → STOP → buy credits → webhook provision
```

Client guards already present:
- No double connect (`m_live || m_connecting`)
- No connect without credits
- No connect without reference face
- Streaming availability gate
- Credits exhausted → `disconnectEngine` + toast
- Server force_logout / storage_reset → lock screens

### 3.2 Recording / capture

| Feature | Production proof |
|---------|------------------|
| Snapshot | Real path under Pictures/LiveEscape |
| Freeze | Real frame path |
| MP4 | Best-effort MediaRecorder; may not include WebEngine pixels |
| PNG sequence | Fallback after 2s; valid JSON sidecar |

### 3.3 Realtime AI

| Piece | Status |
|-------|--------|
| Backend Decart WS proxy `/v1/realtime` | Auth + credit gate + upstream key |
| C++ signaling client | Offer/ICE/prompt/image |
| WebEngine peer HTML | WebRTC + TURN params + `skip_local` |
| Without WebEngine | Camera + signaling only; no AI pixels |

---

## 4. Backend audit vs original API surface

### 4.1 Route coverage

Original `fetch(API_URL + '...')` paths are largely mirrored in `main.rs` + `ApiClient.cpp` (auth, keys, credits, streaming, settings, starter/activation/upgrade pay*, webhooks, referral, support, version).

See `BACKEND_MAP.md` for the full table.

### 4.2 Production safeguards (present)

| Guard | Implementation |
|-------|----------------|
| Production secret checks | `ADMIN_SECRET`, JWT non-default when `RUST_ENV=production` |
| CORS | Allow-list; no open `*` in production if empty → restrictive |
| Rate limiting | `middleware_rate` |
| Credit burn cap | Server caps per request (~5s of rate) |
| Insufficient credits | Session start + burn return errors |
| Paystack webhook HMAC | SHA-512 signature |
| Order fulfillment | Atomic claim, idempotent provision, stale reclaim |
| Flutterwave webhook | `verif-hash` required in production |
| FX | Configurable `USD_NGN_RATE` |
| Dev-only instant provision | Blocked when production + no Paystack key |

### 4.3 Edge cases

| Case | Behavior |
|------|----------|
| Zero credits while live | Client disconnect + toast; server burn fails |
| Connect with 0 credits | Client blocks; server min_credits check |
| Double CONNECT | Client no-op |
| Disconnect while recording | Timers stopped, recording flag cleared |
| Webhook replay | Fulfillment idempotent (`already_provisioned`) |
| Wrong admin secret | 403 |
| Maintenance flag | Client → maintenance screen |
| Force logout WS | Session clear + lock UI |
| Password reset | Request + complete with token |

### 4.4 Residual backend / ops risks

1. Hard-coded plan price table in multiple places — keep in sync with DB seed  
2. NGN FX must be updated operationally (`USD_NGN_RATE`)  
3. Decart platform float must stay funded  
4. `PUBLIC_BASE_URL` must be HTTPS public URL for webhooks  
5. Some JS-only paths (e.g. `/downloads/list`, demo token host) are **not** product-critical for the native client  

---

## 5. Production proof checklist

### Must set before production traffic

```bash
RUST_ENV=production
JWT_SECRET=<long random>
ADMIN_SECRET=<long random>
MONGODB_URI=...
PUBLIC_BASE_URL=https://api.yourdomain.com
DECART_API_KEY=...
PAYSTACK_SECRET_KEY=...
PAYSTACK_WEBHOOK_SECRET=...
PAYSTACK_CURRENCY=NGN
USD_NGN_RATE=<current>
CORS_ORIGINS=https://app.yourdomain.com
# optional
FLUTTERWAVE_* / NOWPAYMENTS_* / SMTP_* / TURN_*
```

### Client production

```bash
cmake -B build -DCMAKE_BUILD_TYPE=Release
# Prefer Qt build with WebEngine
export LIVEESCAPE_API_URL=https://api.yourdomain.com
export LIVEESCAPE_TURN_URLS=turn:...
./build/bin/LiveEscape
```

### Smoke tests

1. Signup / login / logout-all  
2. Validate key on fresh device  
3. Connect with face → burn → disconnect at 0 credits  
4. Paystack test charge → webhook → credits  
5. Admin Ctrl+Shift+A with secret  
6. Force maintenance flag  
7. WS force_logout  

---

## 6. Sync status (JS bundle ↔ port)

| Area | Synced? |
|------|---------|
| Theme tokens | Yes |
| Plan IDs / credit economics | Yes (fallback + API) |
| API route names | Yes for core + payments |
| WS event types | Yes |
| Device ID style `SS-…` | Yes |
| Branding text | **Renamed** Live Escape |
| Browser SDK (Paystack inline JS) | Replaced by hosted URL + WebEngine/browser |
| HTML canvas freeze pipeline | Replaced by Qt grab |

---

## 7. Known non-blockers vs original HTML

- Fewer micro-animations / scanlines  
- Theatre mode is native full-window, not CSS class hacks  
- No Capacitor/Android path in this package (desktop-first)  
- Recording not guaranteed AI-surface MP4 without WebEngine capture path  

---

## 8. Conclusion

The Qt/Rust product is **aligned with the original Electron app’s product surface** for auth, licensing, credits, streaming control, payments, admin, and lock/force events. It is **production-capable** when secrets, Mongo, HTTPS webhooks, and (for AI pixels) WebEngine+TURN are in place.

It is **not** a 100% pixel clone of `dashboard.html`, and should not be sold as such; it is a **native production port** with stronger server-side fulfillment and clearer environment gates than the bundled JS SPA alone.
