# FUNCTIONAL PARITY MATRIX — Smoke Screen → Qt 6

Legend: ✅ ported & wired · ⚠ partial/divergent (documented) · — n/a

## Screens & overlays (reference → Qt file)

| Reference | Qt file | Status |
|---|---|---|
| #preloader | screens/PreloaderScreen.qml | ✅ |
| #authScreen (4 forms: login/reset-request/reset-password/signup) | screens/AuthScreen.qml | ✅ |
| #accessGate (3-step stepper, gate plans ×3, method toggle, crypto, key entry) | screens/AccessGateScreen.qml | ✅ |
| #mainApp dashboard (bar / stage / 3-col controls) | screens/DashboardScreen.qml + components/StageViewport.qml | ✅ |
| #consentModal | modals/ConsentModal.qml | ✅ |
| #gateBlocker | components/GateBlocker.qml | ✅ |
| #welcomeModal | modals/WelcomeModal.qml | ✅ |
| #freeCreditsModal | modals/FreeCreditsModal.qml | ✅ |
| #getStartedModal | modals/GetStartedModal.qml | ✅ |
| #starterPayModal (paystack/fw/crypto + pending) | modals/StarterPayModal.qml | ✅ |
| #starterLockScreen | modals/StarterLockScreen.qml | ✅ |
| #planGate (5 credit cards) | modals/PlanGateModal.qml | ✅ |
| #payModal (summary, methods, manual key) | modals/PayModal.qml | ✅ |
| #accountModal (info, referral, creator payout) | modals/AccountModal.qml | ✅ |
| #upgradeGate | modals/UpgradeModal.qml | ✅ |
| #expiryModal | modals/ExpiryModal.qml | ✅ |
| #lockScreen (credits exhausted) | modals/LockScreen.qml | ✅ |
| #paySuccessModal | modals/PaySuccessModal.qml | ✅ |
| #streamConsentModal | modals/StreamConsentModal.qml | ✅ |
| #abuseReportModal | modals/AbuseReportModal.qml | ✅ |
| #dashboardNotificationModal | modals/NotificationModal.qml | ✅ |
| #forceUpdateModal | modals/ForceUpdateModal.qml | ✅ |
| #adminPanel | modals/AdminModal.qml | ✅ |
| #tourModal + #tourOverlay/#tourHighlight/#tourTooltip (13 exact steps) | modals/TourOverlay.qml | ✅ |
| #tutorialModal (Setup/Voice tabs, gating, placeholders) | modals/TutorialsModal.qml | ✅ |
| #bgPanelBackdrop/#bgPanel (presets + apply overlay) | modals/BackgroundPanel.qml | ✅ |
| #onboardingOverlay (legacy 7-step) | modals/OnboardingOverlay.qml | ⚠ step copy is condensed (legacy flow retired from reference boot) |
| #toast | components/Toast.qml | ✅ |
| shared crypto panel ×4 (starter/gate/upgrade/credits) | components/CryptoPayPanel.qml + starter inline panel | ✅ |
| #tgSupportFloat | — hidden in the reference build itself | — |

## Behaviors

| Behavior | Qt implementation | Status |
|---|---|---|
| Boot flow (API resolve → maintenance → consent gate → session/license → gates → dashboard) | AppController::boot (C++ core) | ✅ |
| Config endpoint resolution (`?api=`, ss_api_url, cached config) | ApiClient::resolveApiEndpoint | ✅ |
| Auth: login / signup (+409 auto-login) / password reset ×2 / deep-link token | ApiClient + AuthScreen | ✅ |
| License: validate / lookup / activation key entry | ApiClient + AccessGate | ✅ |
| Starter pack: status reconcile / paystack / fw / crypto + pending | AppController + StarterPayModal | ✅ |
| Credits: sync / burn(1s, flush ≥30) / redeem key / purchase | SessionManager + StreamController + ApiClient | ✅ |
| Payments: paystack/fw hosted checkout, crypto proof ×4 flows | AppController + CryptoPayPanel | ✅ |
| Upgrade flow (discounted targets, card/crypto) | AppController + UpgradeModal | ✅ |
| Streaming: connect/pause/resume/stop, freeze, snapshots, record, theatre, virtual cam | StreamController (+ GstRtcPeer) | ✅ |
| Streaming states: connecting/generating/reconnecting + last-good-frame freeze | StreamController + StageViewport | ✅ |
| Decart engine transport | native WebRTC via backend WS signaling proxy (model lucy-2.5) | ⚠ documented divergence (no browser SDK) |
| Balance WebSocket (balance_update / force_disconnect / tokens / notification) | WebSocketClient (C++ core) | ✅ |
| Credit lock + starter lock + expiry routing | AppController | ✅ |
| Gate enforcer (periodic re-route, 30s credit resync) | AppController boot/revalidate logic | ⚠ periodic enforcer simplified to boot + event-driven checks |
| First-run: tour (13) → free credits → welcome | AppController + TourOverlay + modals | ✅ |
| Tutorials load (/downloads/list + placeholder padding to 10) | TutorialsModal + ApiClient::loadDownloads | ✅ |
| Background presets (list/apply/apply-overlay/locked) | BackgroundPanel + StreamController | ✅ |
| Referral (code display, copy, attach from deep link) | AccountModal + AppController | ✅ |
| Creator payout details (creator/pro) | AccountModal + ApiClient | ✅ |
| Keyboard: F fullscreen (not in inputs), Enter submits, Ctrl+Shift+A blocked | Main.qml + forms | ✅ |
| Deep links (smokescreen:// token/ref/payments/access/auth) | AppController::handleDeepLink | ✅ |
| Overlay protection / clickjacking guard | — browser-specific anti-tamper; not applicable natively (documented) | — |
| Notifications poll (60s) + dismissed-id persistence | ApiClient::fetchDashboardNotification + AppController | ✅ |
| Storage-reset / logout tokens | ⚠ not yet ported (backend endpoints exist; low-frequency admin ops) |

## Known divergences (all documented in ARCHITECTURE.md)

1. Engine transport is native WebRTC (same engine/model) instead of the browser SDK.
2. Paystack/Flutterwave run as external browser checkout (same server verification).
3. `backdrop-filter` blur approximated with the 97% opaque reference backdrop.
4. Synthetic 800/900 font weights map to real Rajdhani Bold.
5. Gate enforcer runs boot + event-driven rather than a 1s browser interval.
