# Functional parity (excluding orphaned StreamServer)

**Policy:** Morph transport = WebEngine WebRTC. Local `StreamServer` is orphaned and not a parity target.

## Closed in this pass

| Area | Change |
|------|--------|
| Credits purchase | `CreditService` no longer stubs failure — routes to `BackendClient` Paystack APIs |
| Session credits | Start requires **credit + bonus**; optimistic local burn each 100ms tick; HD rate 3.0 vs 2.0 |
| Character on connect | `pushActiveTargetsToProvider()` on signaling connected + on character change while live |
| Identity lock default | Applied from `Config.identityLockDefault` on session start |
| Auto-record | `Config.autoRecord` starts/stops recording with morph session |
| MorphBridge ↔ Session | Offer/ICE/answer/start/stop already wired; media path intact |
| Payment → balance | `paymentOrderVerified` applies balance or `refreshProfile` |
| Config surface | mirror, builtins, camera-before-swap, identity lock default, product notifs, auto-record, recording extension, violet accent |
| Settings UI | Toggles + check updates + refresh profile |
| Camera mirror | Bound to `Config.mirrorCamera` |
| Recording | Extension from config; local state + backend; orphans retained |
| Auth errors | Surfaces as notifications |
| WebEngine missing | Warning toast on ready / start morph |
| Catalog | `hideStarters` when builtins disabled |

## Closed in 100% parity pass

| Area | Change |
|------|--------|
| Crypto USDT | NOWPayments create + poll + auto-provision; BuyCredits drawer invoice UI |
| Stream pause/resume | StreamServer holds TCP server; frames gated while paused |
| Virtual camera | StreamServer mode `virtual-camera` (MJPEG) matching original Electron helper |
| Orphan recovery UI | Settings list with Recover / Dismiss / List recent |
| Deep links | AppController.handleDeepLink + argv protocol URLs |
| OS notifications | QSystemTrayIcon showMessage |
| Order status API | BackendClient.fetchOrderStatus + paymentOrderStatusReceived |

## Intentionally out of scope

- OAuth / Google (product: backend OTP only)
- System kernel virtual-camera driver (MJPEG StreamServer is the supported path, as in original Electron)
- Native libdatachannel path (optional advanced build)
- Electron auto-updater UX (backend check/install only)

## Runtime requirements

1. Qt **WebEngine** in the kit for live morph video  
2. Rust backend on configured `apiBaseUrl` (default `127.0.0.1:3874`)  
3. Valid auth JWT for signaling and payments  
