# UI/UX Parity Report – Electron vs Qt

## Scope
Electron bundles are UI/UX reference only.
- Live Morph Electron: `/home/omega/Downloads/app/dist/index.html` React app
- Live Escape Electron: `/home/omega/Downloads/LIVE-ESCAPE-BUNDLED/app/dashboard.html`

Qt implementations:
- LiveMorph Qt: `apps/livemorph/qml/`
- LiveEscape Qt: `apps/liveescape/qml/`

## Summary
Backend/API parity is achieved. UI/UX parity is partial.

## Live Escape Parity

### Covered
- AuthScreen.qml ↔ authScreen, tabLogin/tabSignup, reset forms
- AccessGateScreen.qml ↔ accessGate, deviceId, key validation
- DashboardScreen.qml ↔ mainApp stage, topBar, meterBlock, controls
- Modals: PayModal, UpgradeModal, PaymentStatusModal, CryptoProofModal, PlanGateModal, FreeCreditsModal, WelcomeModal, ConsentModal, LockScreen, AccountModal, AbuseReportModal, TutorialsModal
- Components: CreditMeter, StatusPill, PresetChip, DecartViewport
- Storage reset entry point added to AccessGateScreen.qml with `App.requestStorageReset()` flow
- DownloadsScreen.qml created and bound to `App.downloadsModel` + `loadDownloads()`
- Theme animations: GoldButton glow pulse, CreditMeter creditsPop, StatusPill pulse
- i18n skeleton created at `qml/i18n/en.qml`

### Gaps / Partial
- **Visual theme**: Electron uses gold/teal CSS animations pulse/spin/glow/creditsPop. Qt Theme.qml now includes pulse/glow/creditsPop equivalents.
- **Settings admin**: Electron `admin/engine-key`, `settings/api-endpoint`, `settings/payment-gateway`, `settings/crypto`, `settings/dashboard-maintenance`, `settings/credit-burn-rate`, `settings/dashboard-notification`. Qt Settings admin engine-key UI present in AdminModal.qml.
- **Flutterwave flow**: Electron shows Paystack/Flutterwave buttons. Qt maps to Paystack; Flutterwave button visibility needs verification.
- **Copy strings**: Onboarding tour, WhatsNew, tutorial text partially synced via i18n skeleton.

### Missing
- Full copy sync from Electron dashboard.html to Qt i18n
- Streaming unavailable banner binding for Live Escape

## Live Morph Parity

### Covered
- AuthScreen.qml ↔ Electron auth
- Dashboard.qml + dashboard/* ↔ Electron main stage, preset grid, action bar, prompt commit bar, workshop panel
- Settings.qml / SettingsDrawer.qml ↔ Electron settings
- BuyCredits.qml / BuyCreditsDrawer.qml / CheckoutSheet.qml ↔ Electron buy credits flow
- PreviewWindow.qml, PopoutWindow.qml ↔ Electron preview/popout
- WhatsNewModal.qml, OnboardingTour.qml ↔ Electron onboarding
- PlatformSettings.qml singleton created
- Streaming unavailable banner added to Dashboard.qml

### Gaps / Partial
- **Prompt enhancements**: Electron prompt commit UI with enhance/history. Qt PromptCommitBar.qml present with history view.
- **Background panel**: Electron `bgPanelBtn` opens background presets. Qt StageControls.qml background selection UX aligned.
- **Streaming availability banner**: Electron `streamingUnavailableBanner`. Qt banner added, binding to PlatformSettings.streamingUnavailable pending.
- **Payment in-flight banner**: Electron pay modal with Paystack/Flutterwave/Crypto. Qt PaymentInFlightBanner.qml exists; crypto proof upload flow verified.
- **Theme alignment**: React Tailwind vs QML Colors. Button radii, shadows, gold gradient now matched.

## Recommendations for 100% parity
1. Complete copy sync from Electron dashboard.html into Qt `i18n/` files – skeleton created.
2. Bind PlatformSettings.streamingUnavailable to backend `GET /api/v1/settings/streaming-availability`.
3. Register PlatformSettings singleton in C++ for Live Morph.
4. Verify Flutterwave button visibility and flow in Qt.
5. Create visual diff checklist per screen: Auth, Access Gate, Dashboard, Settings, Pay modals.

## Files touched
- Backend unified routes: done
- Qt API paths normalized: done
- apps/liveescape/qml/screens/AccessGateScreen.qml – storage reset button added
- apps/liveescape/src/core/AppController.h/cpp – requestStorageReset, downloadsModel
- apps/liveescape/qml/screens/DownloadsScreen.qml – downloads list UI
- apps/liveescape/qml/components/GoldButton.qml – glow pulse animation
- apps/liveescape/qml/components/CreditMeter.qml – creditsPop animation
- apps/liveescape/qml/components/StatusPill.qml – pulse animation
- apps/liveescape/qml/i18n/en.qml – i18n skeleton
- apps/livemorph/qml/PlatformSettings.qml – singleton stub
- apps/livemorph/qml/pages/Dashboard.qml – streaming unavailable banner
