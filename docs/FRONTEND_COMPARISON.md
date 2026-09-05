# Frontend comparison — LiveMorph Qt vs Live Escape (SmokeScreen)

## API wiring (resolved)

| Client | Default API | Product header | Auth on requests |
|--------|-------------|----------------|------------------|
| **LiveMorph** | Config `apiBaseUrl` (typ. `:3001`) | `X-Frontend-Id: livemorph` | Bearer JWT |
| **Live Escape** | `http://127.0.0.1:3001` | `X-Frontend-Id: liveescape` | Bearer JWT + optional `x-access-key` |

WS: both use **same host/port** as HTTP (`/api/v1/realtime`, `/v1/realtime`, `/ws`).

---

## Feature matrix

| Feature | LiveMorph | Live Escape | Better |
|---------|-----------|-------------|--------|
| **Auth UX** | OTP + optional Google, passwordless primary | Email/password + access-key gate | **LM** for consumer desktop; **LE** for license/B2B gate |
| **Session restore** | SecureStore + refresh | Session + key binding | **LM** (refresh + secure store) |
| **Credits display** | Balance + bonus + ledger awareness | Remaining credits + burn | **LM** accounting clarity; **LE** simpler “remaining” |
| **Buy credits** | Pack catalog drawer + Paystack/crypto poll | Plans, starter/activation/upgrade multi-rail | **LM** pack checkout UX; **LE** plan funnel depth |
| **Morph / Stage** | WebEngine Stage + MorphBridge + PiP | Streaming session + engine proxy | **LM** stage polish; **LE** session start API coupling |
| **Catalog / characters** | Workshop, categories, search, prompts | Backgrounds presets (not full character shop) | **LM** |
| **Virtual cam / OBS** | StreamServer + OBS helper UI | Relies more on streaming APIs | **LM** |
| **Recording** | Local RecordingManager + orphans | Lighter / session-centric | **LM** |
| **Settings** | Language (20 locales), stream port, mirror | Plans, gateway flags, maintenance, engine key | **Split**: LM i18n/device; LE platform flags |
| **Onboarding / toasts** | Tour, WhatsNew, toast host | Free credits modal, access gate | **Tie** (different jobs) |
| **Updates** | Thin version check | Version check + force flags | **LE** slightly richer flags |
| **Realtime balance push** | Poll / session-driven | Dedicated `/ws` client | **LE** |
| **Referral / creator** | — | Full API surface in client | **LE** |
| **i18n** | Qt Linguist multi-locale | Fewer locales historically | **LM** |
| **Information architecture** | Auth split → Dashboard (TopBar/Stage/Workshop/ActionBar) | Screens: auth → access gate → app | **LM** for creator workspace; **LE** for license funnel |

---

## Similar flows (both apps)

1. Sign in → fetch credits → start AI session → burn credits  
2. Open external Paystack URL / verify payment  
3. Settings for API/backend reachability  
4. Decart-backed realtime morph (via server proxy)  

---

## Who should own what on a shared backend

| Domain | Prefer frontend patterns from |
|--------|-------------------------------|
| Auth passwordless + Google | LiveMorph |
| License key gate | Live Escape |
| Pack shop UI | LiveMorph |
| Plan/activation funnels | Live Escape |
| Stage / OBS / recording | LiveMorph |
| Live balance WebSocket | Live Escape |
| i18n | LiveMorph |

---

## Gaps still open (frontend)

- LE **balance `/ws`** not fully implemented on Actix host (HTTP surface is; push socket still thin)  
- LE App still expects some response shapes (`success: false`) — unified API uses HTTP status + `message`  
- LM does not show LE plan/activation UI (by design)  
