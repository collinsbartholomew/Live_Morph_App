# LiveMorph production plan — frontend vs backend

**Principle:** The desktop app never owns Decart API keys, never bills credits authoritatively, and never runs jobs that belong on the server. It is a **client**: UI, local devices, WebRTC media surface, and authenticated calls to your API.

---

## 1. System architecture (production)

```
┌────────────────────────── Desktop (Qt) ──────────────────────────┐
│  Auth UI  →  JWT in SecureStore (OS-backed where possible)       │
│  Catalog / Workshop / Settings / Buy Credits (opens Paystack URL)│
│  Camera (Qt Multimedia)                                          │
│  Stage: Qt WebEngine + morph.js (getUserMedia + RTCPeerConnection)│
│  MorphBridge (QWebChannel) ↔ SessionManager                      │
│  WebRtcSignalingClient ──WSS──►                                  │
│  Optional: local MJPEG StreamServer (OBS Browser Source)         │
│  Optional: local QMediaRecorder (camera file on disk)            │
└─────────────────────────────┬────────────────────────────────────┘
                              │ HTTPS + WSS (JWT)
                              ▼
┌────────────────────────── Backend (Rust) ────────────────────────┐
│  OTP / JWT / refresh                                             │
│  Credit ledger (authoritative) + Paystack webhooks               │
│  Catalog                                                         │
│  WSS /api/v1/realtime?token=&model=  →  proxy to Decart          │
│       • holds DECART_API_KEY                                       │
│       • opens Decart session only after credit check             │
│       • forwards offer / answer / ICE / prompt / set_image         │
│       • can emit insufficient_credits → client stops             │
│  Optional: recording metadata, update manifest, VCam helper      │
└─────────────────────────────┬────────────────────────────────────┘
                              │ Decart WS + WebRTC
                              ▼
                           Decart / Lucy
```

---

## 2. Responsibility matrix

| Concern | Frontend (Qt) | Backend (Rust) |
|--------|----------------|----------------|
| OTP request / verify | Calls API | Issues codes, JWT |
| Token storage | SecureStore | — |
| Credit **display** | Shows balances from API | Ledger source of truth |
| Credit **burn** | Optimistic UI only | Authoritative; reject session if empty |
| Paystack checkout | Opens `authorization_url` | Creates order, verifies webhook |
| Decart API key | **Never** | Env / secrets manager |
| Signaling | Client WS to **your** proxy | Proxy ↔ Decart |
| WebRTC media | Stage WebEngine | Not required for media path |
| Local camera | Qt Multimedia | — |
| Local file recording | QMediaRecorder on camera | Optional metadata only |
| OBS MJPEG | Local StreamServer | — |
| Virtual camera | UI trigger only if you ship a helper | Driver / helper process if product needs it |
| App update | Check API, open download URL | Hosts manifest + installers |
| Catalog | Renders list | Serves list |

---

## 3. Frontend packages / modules (right tools)

| Need | Package / Qt module |
|------|---------------------|
| UI | Qt Quick / Quick Controls 2 |
| Camera + local record | **Qt Multimedia** (`QCamera`, `QMediaCaptureSession`, `QMediaRecorder`) |
| Signaling WS | **Qt WebSockets** |
| Stage WebRTC | **Qt WebEngine** + **WebChannel** + bundled `morph.js` |
| HTTP API | **Qt Network** |
| Secure tokens | Windows **DPAPI**, macOS **Keychain**, Linux file vault (upgrade to libsecret/QtKeychain later) |
| i18n | Qt Linguist / `QTranslator` |
| Packaging | `windeployqt` / `macdeployqt` / linuxdeploy **with WebEngine** |

Do **not** embed `@decartai/sdk` or Decart secrets in the desktop binary.

---

## 4. Frontend production checklist

### Done / in tree
- [x] Proxy-only signaling (`WebRtcSignalingClient` + JWT)
- [x] MorphBridge + Stage morph path (WebEngine when linked)
- [x] Auth OTP client (release fails closed if offline; demo only `QT_DEBUG`)
- [x] SecureStore upgraded (DPAPI / Keychain / protected file)
- [x] Local camera recording via `QMediaRecorder` (not backend encode)
- [x] StreamServer as **optional local** MJPEG (OBS)
- [x] Update flow opens download URL only (no fake client installer)
- [x] Orphan native WebRtcPeer / direct DecartClient removed
- [x] Credit deduct marked optimistic; server remains truth via API/signaling

### Ship gates (on your machine)
- [ ] Link **Qt WebEngine** + package Chromium resources
- [ ] E2E: OTP → catalog → Start Morph → remote video in Stage against **staging** proxy
- [ ] Release build **without** `QT_DEBUG` demo auth
- [ ] Code-sign (Windows Authenticode, macOS notarization)
- [ ] Crash reporting (optional Sentry/native)
- [ ] Linux: optional QtKeychain/libsecret for token store parity

### Explicitly **not** frontend work
- Decart key rotation, rate limits, anti-abuse
- Paystack webhook settlement
- Authoritative credit ledger
- Server-side recording encode farm
- System-wide virtual camera driver

---

## 5. Backend implementation plan (your Rust service)

1. **Auth** — OTP issue/verify, JWT access + refresh, revoke  
2. **Credits** — balance, burn on morph ticks or session seconds, reject WS if empty  
3. **Paystack** — create order, webhook → credit grant  
4. **Realtime proxy** — validate JWT, open Decart `wss://api3.decart.ai/v1/stream?api_key=…&model=…`, pipe JSON signaling, close on stop/disconnect/insufficient credits  
5. **Catalog** — characters/presets JSON  
6. **Update manifest** — `{ version, download_url, notes }`  
7. **Optional** — recording metadata, VCam helper IPC  

Client already calls paths under `/api/v1/...` consistent with this.

---

## 6. Recommended ship sequence

| Phase | Focus | Owner |
|-------|--------|--------|
| A | Staging Rust proxy + JWT + Decart | Backend |
| B | Desktop WebEngine package + E2E morph | Frontend |
| C | Paystack live + credit ledger | Backend |
| D | Code-sign + auto-update manifest | Both |
| E | VCam only if product requires (native helper) | Separate |
| F | Hardening (rate limit, abuse, monitoring) | Backend |

---

## 7. What “100% production-ready” means here

**Frontend is production-ready when:**
- WebEngine-packaged builds pass E2E morph against staging
- Tokens in OS-backed store on Win/macOS
- No secrets or Decart keys in the binary
- Recording/stream features labeled accurately (local camera / local MJPEG)
- Release builds have no offline demo login

**Product is production-ready when the above plus:**
- Rust proxy is load-tested, keyed, and credit-safe
- Payments and refunds handled
- Legal/privacy and support process in place

The Qt client is the **shell + media surface**. The Rust service is the **trust boundary**.
