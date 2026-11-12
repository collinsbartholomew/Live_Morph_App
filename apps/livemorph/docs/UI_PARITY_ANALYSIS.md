# LiveMorph UI/UX parity analysis (original JS vs QML)

**Source of truth:** `/app/dist/assets/*.js` + `index-sFHf0CmO.css` from the shipped bundle.

---

## Closure status (100% parity pass)

| Item | Status |
|------|--------|
| Palette violet `#8b5cf6` + surface tokens | Done (`Colors.qml`) |
| Accent alpha steps / inset highlights | Done |
| TopBar **44px** (`h-11`), `bg-surface-base` | Done |
| StatusBar **48px** (`h-12`), `bg-surface-base` | Done |
| ActionBar **88px**, left **360px** | Done |
| Workshop **320px** | Done |
| Constants ↔ Theme chrome sync (no stale 52/32/340) | Done |
| Auth form left / hero right + 42px headline | Done |
| Auth `tracking-label` 0.15em + headline -0.03em | Done |
| Settings **480px drawer** over Dashboard | Done |
| **Buy Credits 500px drawer** (not full page) | Done (`BuyCreditsDrawer` + `App.showBuyCredits`) |
| ActionBar CTA glow + inset + hover lift | Done |
| PrimaryButton glow + scale | Done |
| Notifications `w-80` (320) panel-popover | Done |
| Panel-drawer left-edge highlight | Done |
| Micro active scale 0.96 | Done |
| Pulse on LIVE / backend dots | Done |
| Motion 220ms OutCubic on drawers | Done |

### Intentional product differences (not parity bugs)

- OAuth / Google buttons omitted (backend email OTP only)
- Morph stage via embedded WebEngine (same product intent)
- Qt backdrop-blur approximated with solid `black/70` scrim (platform limit without MultiEffect)

### Remaining sub-pixel notes

- True CSS `backdrop-filter: blur()` needs Qt GraphicalEffects / MultiEffect if available in the kit
- Account `Menu` uses Qt Controls styling; popover shadow is approximate
- Tour spotlight path fidelity is step-based, not path-traced

**Overall:** chrome geometry, tokens, navigation model (drawers), CTA weight, and label tracking match the original JS/CSS design system.


---

## 100% parity pass (2026-08-16)

| Item | Status |
|------|--------|
| USDT / crypto Buy Credits tab | Enabled + invoice panel + poll |
| Stream pause / resume | StreamServer |
| Virtual camera (MJPEG helper) | StreamServer mode |
| Orphan recover / dismiss list | Settings |
| Deep links + OS notifications | AppController |
| Backdrop blur | Still approximated (platform limit) |
| OAuth Google | Intentionally omitted (OTP-only product) |

**Overall:** Functional parity with original Electron app for all production paths except kernel VCam driver and Google OAuth (both intentional product choices). Crypto payments restored via NOWPayments.
