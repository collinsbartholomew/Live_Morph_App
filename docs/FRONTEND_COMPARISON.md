# Frontend comparison — LiveMorph Qt vs the secondary product slot

> Historical comparison. The secondary slot has **no client in this repo** — the
> backend only reserves the product id, database, bootstrap payload, plan
> catalogue and license-key flow for it. The "Secondary" column below describes
> the slot's intended capabilities, not a shipped app.

## API wiring (resolved)

| Client | Default API | Product header | Auth on requests |
|--------|-------------|----------------|------------------|
| **LiveMorph** | Config `apiBaseUrl` (default `http://127.0.0.1:3874`) | `X-Frontend-Id: livemorph` | Bearer JWT |
| **Secondary slot** | same host | `X-Frontend-Id: <SECONDARY_PRODUCT_ID>` (default `secondary`) | Bearer JWT + optional `x-access-key` |

WS: both use **same host/port** as HTTP (`/api/v1/realtime`, `/api/v1/ws`).

---

## Feature matrix

| Feature | LiveMorph | Secondary | Better |
|---------|-----------|-------------|--------|
| **Auth UX** | OTP + optional Google, passwordless primary | Email/password + access-key gate | **LM** for consumer desktop; **secondary** for license/B2B gate |
| **Session restore** | SecureStore + refresh | Session + key binding | **LM** (refresh + secure store) |
| **Credits display** | Balance + bonus + ledger awareness | Remaining credits + burn | **LM** accounting clarity; **secondary** simpler “remaining” |
| **Buy credits** | Pack catalog drawer + Paystack/crypto poll | Plans, starter/activation/upgrade multi-rail | **LM** pack checkout UX; **secondary** plan funnel depth |
| **Morph / Stage** | WebEngine Stage + MorphBridge + PiP | Streaming session + engine proxy | **LM** stage polish; **secondary** session start API coupling |
| **Catalog / characters** | Workshop, categories, search, prompts | Backgrounds presets (not full character shop) | **LM** |
| **Virtual cam / OBS** | StreamServer + OBS helper UI | Relies more on streaming APIs | **LM** |
| **Recording** | Local RecordingManager + orphans | Lighter / session-centric | **LM** |
| **Settings** | Language (20 locales), stream port, mirror | Plans, gateway flags, maintenance, engine key | **Split**: LM i18n/device; secondary platform flags |
| **Onboarding / toasts** | Tour, WhatsNew, toast host | Free credits modal, access gate | **Tie** (different jobs) |
| **Updates** | Thin version check | Version check + force flags | **secondary** slightly richer flags |
| **Realtime balance push** | Poll / session-driven | Dedicated `/ws` client | **secondary** |
| **Referral / creator** | — | Full API surface in client | **secondary** |
| **i18n** | Runtime online translation + JSON cache (20 locales) | Fewer locales historically | **LM** |
| **Information architecture** | Auth split → Dashboard (TopBar/Stage/Workshop/ActionBar) | Screens: auth → access gate → app | **LM** for creator workspace; **secondary** for license funnel |

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
| License key gate | Secondary |
| Pack shop UI | LiveMorph |
| Plan/activation funnels | Secondary |
| Stage / OBS / recording | LiveMorph |
| Live balance WebSocket | Secondary |
| i18n | LiveMorph |

---

## Gaps still open (frontend)

- The secondary slot's **balance `/api/v1/ws`** client is not implemented here (the HTTP surface and push socket are; no client consumes them yet)
- LM does not show the secondary slot's plan/activation UI (by design)
