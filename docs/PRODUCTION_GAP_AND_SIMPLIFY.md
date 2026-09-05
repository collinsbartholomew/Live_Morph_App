# Production readiness: Original Electron vs LiveMorph (C++/Rust)

Analysis date: 2026-08-17  
Scope: gaps that still hurt production, and over-implementations to **simplify**.

---

## 1. Architecture snapshot

| Layer | Original (MorphMe 1.5.8) | LiveMorph port |
|-------|--------------------------|----------------|
| Shell | Electron main + preload IPC | Qt 6 QML + C++ managers |
| UI | React/Vite | QML (same IA: Auth split, Dashboard, drawers) |
| Auth | **Supabase** client | **Self-hosted** JWT + OTP (+ optional Google) |
| AI | **@decartai/sdk** in renderer | WebEngine Stage + **Rust WS proxy** to Decart |
| Money | Paystack (+ crypto in UI) | Paystack + NOWPayments, server ledger |
| Stream/VC | **Local** Electron MJPEG | **Local** StreamServer + OBS helper |
| Recording | **Local** Electron | **Local** RecordingManager |
| Updates | electron-updater | Partial UI / open download URL |

**Important:** The port is not a line-for-line protocol clone of Supabase+Decart-in-client. It is a **product-parity** redesign that is **safer** on secrets.

---

## 2. What is already production-strong (keep)

- Server-side Decart key + credit ledger  
- JWT auth, refresh, logout_all, export/delete hooks  
- Paystack initialize/verify + webhook path design  
- Local MJPEG + OBS Virtual Camera workflow  
- Desktop never needs to be a “web app” for payments (poll + webhook to API)  
- Clear separation: morph = WebEngine; OBS = optional helper  

---

## 3. Gaps that still matter for production

### P0 — ship blockers

| Gap | Why it matters | Action |
|-----|----------------|--------|
| **Qt WebEngine packaging** | Morph is non-functional without it | CI installers must include WebEngine + test Stage starts |
| **Backend deploy + HTTPS** | Auth, credits, WS, webhooks need a real host | One public `PUBLIC_BASE_URL`, TLS, Mongo, secrets only in env |
| **`.qm` i18n build** | Catalogs exist; runtime needs `lrelease` | Build step + embed `:/i18n/*.qm` |
| **Code signing / auto-update** | Original had electron-updater; port is thin | Pick one: Qt Installer Framework / Sparkle / WinSparkle / your CDN + version API |

### P1 — reliability / trust

| Gap | Action |
|-----|--------|
| **SMTP real provider** | Replace Mailtrap for production OTP |
| **Paystack webhook signature always enforced** | Server-side only; never optional in prod |
| **NOWPayments** | Ship only if keys configured; hide crypto UI if not |
| **Google OAuth** | Optional; if off, hide button (already status-gated) |
| **Rate limits / abuse** | OTP request, payment create, WS connect |
| **Observability** | Structured logs, health, error tracking (Sentry or similar) |

### P2 — parity polish (not blockers)

| Gap | Notes |
|-----|--------|
| Full i18n string coverage | Core strings translated; rest unfinished in `.ts` |
| electron-updater-class smoothness | Download progress, silent update |
| Kernel VCam | **Not a gap vs original** — intentional; OBS is the standard |

---

## 4. Over-implementations to simplify

These add surface area without proportional production value.

### A. Backend routes that only **echo intent** (desktop does the real work)

| Routes | Reality | Simplify |
|--------|---------|----------|
| `/stream/*`, `/vc/*` | MJPEG/OBS are **local** | Remove from public API **or** mark internal/no-op and stop calling from QML |
| `/recording/*` | Returns JSON only; files are local | Drop client calls; keep RecordingManager only |
| `/stream/frame` POST | Empty no-op in client | Delete |

**Rule:** Anything that only runs on the user’s machine should not pretend to be a cloud API.

### B. Dual client payment orchestration

| Piece | Issue |
|-------|--------|
| `BackendClient` payment methods **and** `CreditService` | CreditService is **never constructed / not in QML** |
| BuyCreditsDrawer talks to `Backend` directly | Fine |

**Simplify:** Delete or wire **one** path. Prefer keep `BackendClient` + QML; remove unused `CreditService` until needed.

### C. Auth API surface vs Auth UI

| Backend | UI |
|---------|-----|
| register + password login | UI is **OTP-first** (passwordless) |

**Simplify:** Either hide password register in API for prod, or keep for admin only. Don’t maintain two equal UX stories.

### D. Demo / test endpoints

| Endpoint | Risk |
|----------|------|
| `credits/adjust_demo` | Must be **compile-flagged or env-gated** (`ALLOW_DEMO_TOPUP=false` in prod) |

### E. Documentation sprawl

Many overlapping markdown files (`PRODUCTION_*.md`, gap changelogs).  

**Simplify:** One `README` + one `PRODUCTION.md` + one `SECURITY.md` for ops; archive the rest under `docs/archive/`.

### F. BackendClient “Electron IPC mirror” methods

`checkUpdates`, `installUpdate`, `clearAuthSession`, `pushStreamFrame`, clipboard/reveal helpers mixed into HTTP client.

**Simplify:**  
- HTTP-only in `BackendClient`  
- Desktop OS helpers in a small `DesktopShell` / stay on managers (Auth, Recording, VirtualCamera)

### G. Optional providers always compiled

Paystack + NOWPayments + Google + SMTP all in one binary is fine, but **UI and routes** should soft-disable when env empty (already partially true for Google).

---

## 5. Original Electron — what **not** to copy

| Original trait | Production judgment |
|----------------|---------------------|
| Decart/SDK secrets reachable from renderer risk | **Do not** reintroduce |
| Supabase as system of record | Only if you abandon self-hosted ledger |
| Heavy client-side credit trust | Server ledger is better |
| Electron auto-update maturity | Copy *behavior*, not Electron itself |

---

## 6. Recommended production shape (slim)

```
Qt desktop
  AuthManager ──────────► /api/v1/auth/*
  Session + MorphBridge ─► /api/v1/realtime (WS) + WebEngine
  BackendClient ─────────► /payments/*, /credits/balance, /catalog, /app/version
  StreamServer + VirtualCamera ─ local only (OBS)
  RecordingManager ───────────── local only
Rust API
  auth, credits ledger, catalog, payments+webhooks, realtime proxy
  NO stream/vc/recording frame APIs in prod surface
```

---

## 7. Scorecard

| Dimension | Original | Port | Winner for production |
|-----------|----------|------|------------------------|
| Secret handling | Weaker | Stronger | **Port** |
| Auth ownership | Supabase | Yours | **Port** (ops cost higher) |
| Morph reliability | Chromium solid | Needs WebEngine ship | Tie if packaged |
| Payments | Mature client flows | Server-first | **Port** if webhooks+verify solid |
| VCam/OBS | Local helper | Local + OBS UX | **Tie / port slightly clearer** |
| Updates | Stronger | Weaker | **Original** |
| i18n breadth | Stronger historically | Catalogs expanded, need `.qm` | Closing |
| Complexity tax | Electron+React+Supabase | Qt+Rust+many intent routes | **Simplify port** |

**Overall:** Port is **directionally more production-correct** (secrets, ledger, proxy). Remaining work is **narrowing** dead dual paths, packaging WebEngine/updates, and hardening ops—not adding more features.

---

## 8. Action list (ordered)

1. Package WebEngine; smoke-test morph session  
2. Gate/remove demo credit adjust; enforce webhook HMAC in prod  
3. Stop calling backend stream/recording/vc from desktop (local only)  
4. Remove or use `CreditService` (don’t leave half-wired)  
5. `lrelease` + ship `.qm`  
6. Real SMTP + production Mongo + HTTPS `PUBLIC_BASE_URL`  
7. Choose and implement auto-update  
8. Collapse docs to a short ops set  
9. Soft-hide crypto/Google when unconfigured  

