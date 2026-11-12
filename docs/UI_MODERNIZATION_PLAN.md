# LiveMorph Frontend — UI/UX + Logic Modernization Plan

> **Scope:** every QML file (51) and the C++ presentation/logic layer (`apps/livemorph/src`, 16 classes).
> **Goal:** a bolder, slicker, modern "Nocturne Prism, sharpened" direction with **production readiness as the highest-priority constraint** and the **no-motion directive upheld**.
> **Status:** implementation in progress. Each proposed change lists its risk and its verification.
> **Companion reading:** `AGENTS.md` (architecture/gotchas), `docs/PARITY_MATRIX.md` (screen matrix).

## Implementation log

| Phase | Status | Verification |
|-------|--------|--------------|
| Phase 0 — safety net (Switch fix, i18n wrap, §9.7 restore, a11y primitives, ts regen) | **Done** | build 100%, `--verify-qml` PASS, smoke 7/7 |
| Phase 1 — foundation tokens (elevation, type scale, `zTooltip`, no-motion contract, Constants align) | **Done** | build 100%, `--verify-qml` PASS, smoke 7/7 |
| Phase 3+4 — depth & bolder aesthetics (PrimaryButton shadow+CTA, headings to scale, CharacterCard hover shadow) | **Done** | build 100%, `--verify-qml` PASS, smoke 7/7 |
| Phase 5 — a11y sweep (TopBar/ActionBar accessible names + keyboard) | **Done** | build 100%, `--verify-qml` PASS, smoke 7/7 |
| Phase 2 — safe extraction (`AuthManager::isValidEmail` used by AuthScreen) | **Done** | build 100%, `--verify-qml` PASS, smoke 7/7 |
| Phase 2 — perf/state: incremental `rebuildFiltered()` (prefix/suffix diff, no more full reset on filter/sort/hide) in `CharacterCatalogModel`; `SessionManager::status` enum Q_PROPERTY replacing StageFrame string sniffing | **Done** | smoke 7/7 (catalog filter/hide/rename), `--verify-qml` PASS |
| Phase 2 — `SessionPhase` extended: `ErrorKind` enum (Connection/Stall/NoOutput/Credits/Other) + `queuePosition`/`queueSize` on `SessionManager`; StageFrame network-hint / "No credits charged" / support-link now keyed off `errorKind` instead of the never-produced `conn:`/`fal:`/`no_output_watchdog` prefixes (latent bug fixed) | **Done** | build 100%, `--verify-qml` PASS, smoke 7/7 |
| Phase 5 — i18n plurals (`%n second(s)` / `%n minute(s)` for cooldown + balance), ts regen to 700 msgs | **Done** | build 100%, `--verify-qml` PASS |
| Round 3 cleanups: `App.LockReason` enum (no more lockTitle sniffing); PromptCommitBar scene commits on blur; removed unused `Config.themeAccent` hex leak; version single-sourced via `DeviceIdentity::APP_VERSION`; `Session.connectionQuality`; SettingsDrawer `file://` decode moved to `RecordingManager::pickOutputDirectoryFromUrl`; PresetGrid roster loops moved into `CharacterCatalogModel` (NOTIFY props); CustomizeForm chip names translatable via key lookup (prompts stay raw); `Notifier` category counts; verify.sh step 6 (no-motion + i18n-sync gates) | **Done** | build 100%, `--verify-qml` PASS, smoke 7/7, backend `cargo test` 34/34, ts in sync (710), anim gate 0 |
| Round 4: `WebRtcSignalingClient::reconnecting` split from `errorOccurred` (SessionManager consumes the dedicated signal); toast policy centralized in `Notifier` (`maxToasts`, `toastDurationMs`) and consumed by `NotificationToastHost`; a11y names on more `IconButton`s (StageControls ×4, SettingsDrawer/ShortcutsSheet closes) + TopBar bell/account | **Done** | build 100%, `--verify-qml` PASS, smoke 7/7, anim 0 |
| Round 5: ActionBar quick-action buttons (REC/OBS/Preview/Popout) are now focusable + `Accessible.Button` + keyboard (Return/Space) with shared `activate()`; ts synced (725) | **Done** | build 100%, `--verify-qml` PASS, smoke 7/7, anim 0 |
| Round 6: SettingsDrawer nav rows (delegate + Account + About) and NotificationCenter item cards are focusable + `Accessible.Button` + keyboard with shared `activate()` (routing extracted). a11y now spans 7 QML files | **Done** | build 100%, `--verify-qml` PASS, smoke 7/7, anim 0 |
| Round 7 (user-cued fixes): PresetGrid pack-header gap; StageFrame corner brackets inset+2px, REC pill compact, Swap Active centering; SettingsDrawer ACCOUNT rows restructured (no overlap), PiP 3-way selector unlocked, CAMERA spacing; AuthScreen redesigned (elevated card, SegmentedControl restyled bolder globally, dead social tiles → "coming soon" note, hero tint removed); version → 1.0.0; global type-scale bump + reduced label tracking; NotificationCenter bolder header + full-width tabs + edge-to-edge rows; ConfirmDialog bolder (gradient hairline, 48px icon disc, shadow, bigger type); InputPiP INPUT LOST → elevated card; TopBar/StatusBar taller (48/36); ActionBar CTA 296×48 bolder | **Done** | build 100%, verify exit 0, smoke 7/7, anim 0 |
| Round 8 (user-cued): proper `%n` plurals fixed (no more "minute(s)"); BuyCreditsDrawer bolder header/balance + flutterwave method added (all providers listed); language popup now opens upward + capped + scrollable (no overflow); PiP selector restyled as 3-equal gradient segments; HelpDrawer FAQ expanded to cover every feature (record/vcam/custom chars/presets/shortcuts/PiP/engines/cooldown/downloads/language/update) + bolder header; CustomizeForm header to type scale | **Done** | build 100%, verify PASS, smoke 7/7, anim 0, ts 743 |
| Round 9 (final): CustomizeForm redesigned (radiusLg card, 48px header, 30px icon tile, eyebrow labels to scale+trackingEyebrow); SettingsDrawer STREAM URL box given more presence (radiusLg, +40 height, 20px padding, 14px URL). **Full stack verified with Mongo up**: cargo test 34/34, integration ALL PASSED, endpoint smoke 36/0, frontend build 100%, `--verify-qml` PASS, smoke 7/7, anim gate 0, i18n in sync (743=743) | **Done** | all gates green |

## Functional audit (round 10) — bugs found by deep audit and fixed

- **Video sinks never attached (Qt 6.12)**: `VideoOutput.videoSink` is read-only (`isReadonly` in qmltypes); the writable side is `QVideoSink.videoOutput`. Switched MorphStage/PopoutWindow/PreviewWindow/`CameraManager::bindMirrorVideoOutput` to set `sink.videoOutput = output`. This was the popout/stage/preview/mirror "no video" bug.
- **Session**: error status no longer clobbered by Idle/Cooldown on stopSession; connect watchdog re-armed on each reconnect attempt.
- **Auth**: rate-limit lockout + error cleared on session clear/sign-out; refresh-401 bumps auth epoch; refresh token only overwritten when present; OTP requires the full code and digits are no longer wiped on error; "different email" calls `resetOtpFlow`; OAuth exchange re-entrancy guard; busy guards on export/logout-all/delete.
- **Recording**: rename-failure now reports failure (no fake "saved"); finalize-failure clears recording state; orphan scan skips the live `.part`; finalize flag armed before async camera stop; `listRecent` emits the keys the QML reads (`fileName`/`sizeText`/`dateText`); F12 toast only on actual start success (`startRecording` → bool); backend echo path only trusted if it exists locally; output dir validated+persisted+rescanned; recording extension matches the real encoder (mp4/webm); MorphRecorder close no longer frees `m_impl` under a live worker (UAF) and reports rename failure.
- **Payments**: Flutterwave passes through as its own provider (was mapped to paystack); settled orders clear `pendingOrderId` and stop the poller.
- **Settings/catalog**: swapTier + camera device + recording folder now persisted; `isHidden` persisted and preserved across online reloads; `savedCount` is a NOTIFY property (was stale); sort/hide persist the cache; dead "Smooth output" toggle removed; language + camera popups open upward and are capped/scrollable (no overflow); Direct-MJPEG URL derives from the real port.
- **Controls**: HD rate no longer double-multiplied (StageControls/Onboarding/ActionBar); scene toggle enabled when idle + resets swapMode; tour anchors (`tourEngine`/`tourPrivacy`) added; Notifier dismiss decrements unseen; main.qml shortcuts gated to dashboard; non-dismissable lock swallows Escape.
- Verified each batch: build 100%, `--verify-qml` PASS, smoke 7/7, anim gate 0.
- **Payments fixes (round 10)**: Flutterwave passes through as its own provider; duplicate "Payment confirmed" toast removed (success handled once in `onPaymentOrderVerified`); crypto terminal states (failed/expired/refunded/cancelled) stop the poller and surface an inline error; cancel now waits for the server (`onPaymentOrderCancelled`, 409 surfaces as error not "cancelled"); drawer poller capped (720) and crypto-only; banner shows "still confirming" at cap; settled orders clear `pendingOrderId`; CTA disabled while an order is pending; credit-key redeem has a busy guard + error surfaced.
- **FINAL GATE (Mongo up): `bash verify.sh --quick` → ALL VERIFY GATES PASSED (exit 0)**: cargo check ✓, cargo test 34/34 ✓, backend reachable ✓, integration_tests ✓, endpoint smoke 36/0 ✓, frontend `--verify-qml` PASS ✓, no-motion gate 0 ✓, i18n in sync (749) ✓, frontend smoke 7/7 ✓.
- **Round 11 (orphan sweep)**: removed dead functions (`showPaystackTimeout`/`showCryptoTimout`/`showCryptoStillProcessing`/`clearInlineMessages` in BuyCreditsDrawer) and the never-read config props `smoothOutput`, `autoRecordOnSwap`, `micAudioEnabled` (ConfigManager h+cpp) plus the dead mic-audio toggle + OBS-dup warning UI in SettingsDrawer. No src files missing from CMake; all QML registered in qmldir. Re-verified: full `verify.sh` ALL GATES PASSED (exit 0), i18n 743, anim 0, smoke 7/7.

## Security audit (round 12) — findings fixed
**Backend (Rust)**: `delete_account` no longer purges the sibling product DB or deactivates a same-email sibling account (was a cross-product deactivation via email squatting); WS handlers return generic errors (raw Mongo/JWT errors no longer sent to clients, logged server-side); JWT `aud` is now REQUIRED on REST (legacy aud-less tokens rejected); rate limit added on order verify/status/cancel; shipped `.test.env` `ADMIN_SECRET` refused in production at boot. Verified OK: cross-product REST/WS isolation (aud↔header enforced), no Mongo JS-injection sinks, webhook HMAC-SHA512 + amount/currency/CAS checks on all 3 providers, OTP/reset token handling (pepper, single-use CAS, constant-time), JWT HS256 pinning + refresh rotation + reuse detection, X-Forwarded-For trusted only from configured TRUSTED_PROXY_IPS, CORS/headers in prod, billing races (atomic slot claim, monotonic watermark, CAS settle).
**Frontend (Qt)**: server-supplied catalog `image` restricted to qrc:/https: (was file:// local-read+upload exfiltration); OAuth deep-link callback now requires the client nonce (`state`) match (anti session-fixation); single-instance QLocalServer now checks SO_PEERCRED uid + only accepts `livemorph://` lines; TURN credentials percent-encoded before the gst_parse_launch URI (pipeline injection); server-pushed `balance_ws` must be same-host + TLS-matched; bootstrap `api_base` only adopted if https; update downloads are https-only + filename sanitized (no `\`/`..` traversal) + never auto-executed; `LIVEMORPH_DEV_AUTH` and `--dev` hot-reload are now `#ifndef NDEBUG` (debug-only); server-derived notification text forced to PlainText; local MJPEG `/stream` now requires a per-run `?token=`; i18n language validated against the known list (path traversal). Verified OK: no backend secrets in the client, openExternal scheme allowlist, download URLs https-only, deep links only trigger server-verified actions.
**Final gate: `bash verify.sh --quick` → ALL VERIFY GATES PASSED (exit 0)** — cargo 34/34, integration PASS, smoke 36/0, `--verify-qml` PASS, anim 0, i18n 744 in sync, smoke 7/7.
| Phase 2 — large controllers (`PaymentController`, `ToastQueue`, `NotificationCenterModel`, full `SessionPhase`) | **Deferred** (designed here; not started to avoid risking live payment/session flows) | — |
| Phase 5 — remaining (full a11y audit of every Rectangle+MouseArea, PresetGrid JS-loop dedup, snapshot off-thread, docs) | **Partial** | — |

Notes: no motion was added anywhere (directive upheld). The `livemorph_en.ts` catalog was regenerated with `lupdate qml src -no-obsolete` (700 messages, dead contexts removed) so the newly wrapped/pluralized strings are translatable.

---

## 0. North star

LiveMorph today is a deliberately **flat, motionless** dark UI ("Nocturne Prism"). The request is to make it **bolder and slicker** while keeping the hard constraints that are already recorded in the codebase:

- `qml/theme/Theme.qml`: *"ANIMATIONS ARE BANNED PROJECT-WIDE (permanent user directive)."* — **upheld.**
- `qml/theme/Colors.qml`: *"SHADOWS ARE REMOVED PROJECT-WIDE (flat design directive)."* — **relaxed** (elevation returns), unless you want flat kept too (see §12).

This plan delivers "slick" through **typography, color, contrast, geometry, and real elevation** — never through time-based motion. "Slick without motion" is achievable and is in fact the harder, more disciplined design: **state must be legible at a glance through static cues** (color, weight, position, badges, elevation, real-data progress), not through transitions.

**Working name:** *Nocturne Prism, sharpened.*

---

## 1. Current-state assessment

### 1.1 What exists (verified)

| Area | Finding |
|------|---------|
| Design tokens | `Colors` (~150 tokens), `Theme` (radius/spacing/heights/z/fonts), `Constants` (copy + layout mirrors). Token **names are treated as API** ("never rename, only revalue"). |
| Color | Deep violet-cast near-black canvas, `brandA/B/C` = violet→fuchsia→cyan, WCAG-AA text. Strong base. |
| Type | **Maple Mono everywhere**, 9–34px, weights map onto Light/Regular/Bold only. Heavy tracking on labels. |
| Depth | **None.** All `Colors.shadow*` are `"transparent"`. Depth is carried only by fills + 1px borders. |
| Motion | **None, by directive** (0 `Behavior`/`*Animation`/`Transition`/`*Animator`). This is a constraint to design around, not a gap. |
| A11y | **0 `Accessible.*` usages.** Keyboard focus exists only on `Switch`, `SegmentedControl`, `TextField`, and Controls-derived buttons (via `FocusRing`). Most interactive elements are bare `Rectangle` + `MouseArea`. |
| i18n | 549 `qsTr()` calls; runtime online translation via shared `I18nManager`. Gaps: several untranslated strings, no plural forms, raw enum values shown. |
| Hardcoded color | Mostly clean; exceptions are brand glyphs (Google/Twitch/Kick, coin logos) and one raw `Qt.rgba` in `StatusBar`. |
| Perf | `StreamServer` JPEG encode off-thread; snapshot capture throttled; but **every catalog/preset filter change calls `beginResetModel()`** (drops scroll/selection) and several large `Repeater`s recompute JS loops on every model change. |

### 1.2 Strengths to preserve
- Token discipline and the documented "names are API" contract.
- Single notification funnel (`App`/`Notifier`), single overlay/modal stack (`App.openModals` + Escape chain), single global shortcut host (`main.qml`).
- Rich **states already exist** (idle/connecting/error/cooldown/camera-lost) in `StageFrame`; empty/loading states in most overlays.
- QML never touches secrets; all network via `BackendClient`.

### 1.3 Cross-cutting findings (the real backlog)
1. **Business logic lives in views.** Payment polling + caps (`BuyCreditsDrawer`, `PaymentInFlightBanner`, `CheckoutSheet`), toast lifetime/eviction policy (`NotificationToastHost`), notification grouping/routing (`NotificationCenter`), file-path URL decoding (`SettingsDrawer`), email parsing (`AuthScreen`) are in QML.
2. **No accessibility layer at all.** The single largest production-readiness gap.
3. **Coarse session state.** `SessionManager` exposes a 7-value `Status` enum; queue position, ICE-checking, and media-stall are folded into a `statusText` string, and `StageFrame` parses it with `indexOf`/regex prefixes (`conn:`, `fal:`, `no_output_watchdog`). Fragile, and blocks richer UI (determinate status, queue, phases).
4. **Port drift, not dead code.** Many symbols are set-but-never-read (or defined-but-never-called) because their original Electron behavior was **not wired during the Qt port**. They are misplaced/forgotten, not obsolete — the fix is to **restore the original wiring**, not delete. Full inventory in §9.7.
5. **i18n leaks**: `LockScreen` (4 strings), `BuyCreditsDrawer` (method labels + all notify strings), `StatusPill` default `"Idle"` + raw enum in tooltip, `StatusBar "·"/" ms"`, `ActionBar "SESSION COST"/"REC"/"OBS"/"LIVE"/"PAUSED"/"···"/" cr"`, `PreviewWindow` title/labels, `DownloadsScreen "File"`, `CustomizeForm` chip `ListModel`s.
6. **px literals everywhere** (sizes, paddings, `font.pixelSize`) bypass the spacing/type tokens. Only color and radius are tokenized.
7. **`PresetGrid` is Catalog-driven** and never touches the `Presets` singleton; rename logic exists twice (`CharacterCard` inline + `PresetGrid.renameDialog`).

### 1.4 Original Electron application (port reference)

The original app (**morphme v1.5.8**, Electron + React + Tailwind + Radix + zustand) is still present at `~/Downloads/app (2)/` (renderer bundles in `dist/assets/`, Electron host in `dist-electron/`). It is the authoritative reference for the port drift in §9.7. Confirmed from its bundles:

- The `formatters` module exports `fmtInt = n => n.toLocaleString("en-US")`, `formatDuration(secs, cps=2)` = floor minutes (`<60 min` → `"N min"`, else `"Xh Ym"`), `savingsPercent`, tier badges (Basic/Starter/Mid/Pro/Free with glyphs ●/★/◆/♛), `hdPackageKeys = ["starter","mid","pro"]`, and an HD/Smooth/Standard engine-selection hook gated by `hdFlagEnabled` / `hdOpenToAll` / `standardEnabled` / `smoothEnabled` + tier.
- Crypto method labels `"Pay with Crypto"`, `"Pay in NGN"`, `"USDT"`, `"Recheck"` exist in the original i18n bundles, i.e. they were meant to be translated.
- Coin map keys `usdt, usdc, sol, trx, btc, eth, bnb, matic, xrp, ton` backed by the `cryptocurrency-icons` package.
- Loaders used Tailwind `animate-spin`, and the stylesheet ships a `@media (prefers-reduced-motion:)` block, so the original **honored reduced motion** and animated spinners. Under our no-motion directive the static Qt `Spinner` is a deliberate adaptation.
- Tooltips used Radix `delayDuration` / `skipDelayDuration`; the original has **no** open/close durations.
- Popout dragging used CSS `-webkit-app-region: drag`, so there was no JS drag offset; Qt's `PopoutWindow.dragOffset` is the port's (unwired) equivalent.
- The original carried `aria-label` / `aria-hidden` on key controls (e.g. popout close button `"aria-label": "Close overlay"`, decorative dots `"aria-hidden": "true"`). Those labels were dropped in the Qt port, so restoring `Accessible.*` recovers original intent rather than adding net-new scope.

---

## 2. Design principles

1. **Accessible by default.** Every visual affordance ships with a role/name, keyboard path, and AA contrast. Non-negotiable.
2. **Legible without motion.** State changes are expressed by static cues: color, border, elevation, weight, position, badges, and real-data progress. Nothing depends on a transition to be understood.
3. **Slick is contrast and hierarchy, not decoration.** Bigger headlines, heavier tracking on labels, gradient-forward CTAs and active states, generous emptiness.
4. **Depth on demand.** Elevation (shadow + inner highlight + optional glow) signals interactivity/stacking; it never replaces the 1px border.
5. **Production over polish.** Any effect that risks frame drops, layout churn, or `--verify-qml` regressions is cut.
6. **Logic out of views.** Views render state; C++ owns policy (payment, toast, grouping, validation, session phase).
7. **Restore, don't delete.** Unwired port artifacts are clues to intended behavior; investigate and reconnect them.

---

## 3. Foundation: token & system overhaul

All changes are **additive** (new tokens) or **revalue-only** (existing tokens), honoring "names are API".

### 3.1 Elevation & depth
Give the shadow tokens real values instead of `"transparent"` (reverses the flat directive; see §12):

| Token | New intent | Value direction |
|-------|-----------|-----------------|
| `shadowSoft` | resting cards, pills | black @ ~0.35, blur 18, y 3 |
| `shadow` | raised panels, popovers | black @ ~0.45, blur 24, y 6 |
| `shadowStrong` | drawers, modals | black @ ~0.55, blur 32, y 10 |
| `shadowDeep` | full-screen sheets | black @ ~0.65, blur 44, y 16 |
| `glowAccent*` | **keep**, strengthen on active CTA/stage | violet/fuchsia alpha |
| `insetHighlight`/`Soft` | **keep**, extend to more surfaces | white alpha hairlines |

New helper: `Theme.elevation(level)` returning `{blur, y, color}` so components don't hand-roll. Qt has **no backdrop blur** (no WebEngine), so "glass" is layered translucency, never a real blur. Elevation is static: a hover simply swaps which elevation token is applied (an instant binding change, no transition).

### 3.2 Motion: none (contract)
Motion stays banned. To make this enforceable and documented:
- Update `Theme.qml`'s comment to state the contract precisely: **no time-based animation elements** (`Behavior`, `*Animation`, `Transition`, `*Animator`).
- **Clarification that keeps the door open for legitimately "live" UI:** changes driven by *real state* are allowed (a progress bar bound to `Session.elapsedSec`, a credits number bound to `Auth.creditBalance`, a status dot whose *color* changes with state). What is banned is *interpolated* motion over time (`NumberAnimation`, easing, transitions). This distinction lets us ship determinate progress and live counters without an animation loop.
- Keep the `Theme.motion*` duration tokens for API stability but document them as **retained-only** (like `Tooltip.openDuration`) unless we later remove them.

### 3.3 Typography system
Bolder/slicker needs hierarchy. Proposal:
- Keep **Maple Mono as the product identity face** for labels, data, mono, and "engine" text.
- Expand the Maple scale for hierarchy (Maple has only Light/Regular/Bold, so use **size + tracking**, not weight, for step-ups): `fontDisplay` 40–44, `fontHeadline` 28, `fontHeading` 20, tighten headline tracking via a new `Theme.trackingDisplay`, keep wide tracking on labels.
- Replace ad-hoc `font.pixelSize` literals with `Theme.font*` everywhere.
- **Decision point:** bundling a display/grotesk face adds ~100–200KB + licensing review. Recommended fallback: Maple-only scale (no new assets).

### 3.4 Color & gradient
- Add `gradientBrand` (violet→fuchsia), `gradientBrandWide` (violet→fuchsia→cyan), `gradientDanger`, and ready-made **gradient border** tokens for active/selected states (components currently re-declare stops).
- Strengthen active/selected treatment: gradient hairline + soft glow on selected cards, active nav, focused CTA.
- Add a small **semantic elevation-tint** set (surface + ~4% brand for "selected" surfaces) to reduce per-component `Qt.rgba` blends.

### 3.5 Geometry, spacing, z-scale
- Extend radius ladder; document "crisp by default, pill only for chips/CTAs".
- Force components to consume the existing `spacingXs…3xl` tokens instead of px literals.
- Fix z-scale violation: `Tooltip.z:1000` exceeds `Theme.zToast(900)`; add `Theme.zTooltip` and replace all raw `z:` literals (`89/90/100/120/200/210/300`).

---

## 4. Interaction language (motionless)

Because there is no motion, every state must be **unambiguous as a still frame**. This is the "slick" spec:

| State | Static treatment |
|-------|------------------|
| Hover | border/tint/gradient swap (instant), plus an elevation step (static) |
| Pressed | darker tint + `scale 0.98` (already present; keep as a static state) |
| Focus | `FocusRing` visible wherever focus can land (add to `SegmentedControl`, `ToggleRow`, and all `Rectangle`+`MouseArea` controls) |
| Selected / active | gradient hairline + soft glow + a persistent badge/left-bar |
| Disabled | desaturated + reduced opacity + **a visible reason** where helpful (e.g. tooltip "unlocks after first swap") |
| Loading | determinate progress from real data when available (`Session.elapsedSec`, payment `elapsedSec`, update `updateProgress`); otherwise a **static skeleton** with a state label, not a spinning ring |
| Live / generating | color + badge + (optionally) a *real-value* pulse of opacity bound to data updates, not a timer |
| Success / error | distinct fill + icon + sticky banner; never relies on a fade to be noticed |

**Spinner specifically:** the current static quarter-arc reads as "stuck". Since it can't rotate, replace the *indeterminate* uses with a determinate progress bar or a static "working" glyph + label; keep the arc only where a determinate fraction is available.

---

## 5. Accessibility program (top production gate)

Highest-value, lowest-risk upgrade; currently absent entirely.

1. **Roles & names.** Add `Accessible.role`/`Accessible.name`/`Accessible.description` to: `IconButton` (critical — TitleBar window controls are unlabelled), `Switch`, `StatusPill`, `SegmentedControl`, every `Rectangle`+`MouseArea` interactive element, toasts (live region), the lock screen, and payment banners.
2. **Keyboard everywhere.** Make interactive `Rectangle`s `activeFocusOnTab` with `Keys.onReturnPressed`/`onSpacePressed`, or replace with Controls-derived buttons. Add `FocusRing` to `SegmentedControl` (focusable today, no cue) and `ToggleRow`.
3. **Focus management.** Drawers/modals capture and restore focus and trap Tab; the click-away `MouseArea` layers in `Dashboard` are invisible modality traps and need real focus handling.
4. **Contrast pass** on low-opacity text (Popup/Preview empty states at 0.25–0.45).

(No reduce-motion work is needed: there is no motion to reduce.)

Note: the original Electron app did carry `aria-label` / `aria-hidden` on key controls (see §1.4), so this program restores labels that were dropped in the Qt port rather than inventing new scope. Reuse the original label strings where possible.

---

## 6. i18n program

1. Wrap the known untranslated strings (§1.3 item 5). Convert `StatusPill` default and tooltip to translated status names; never show raw enum values.
2. Plural forms: `qsTr("%n minute(s)", "", n)` for credits/time (`ActionBar`, `StatusPill`, `StatusBar`, `CustomizeForm`).
3. Move `CustomizeForm` style/scene chip labels out of non-translatable `ListElement`s into C++ catalog data (also removes copy from the view).
4. Replace hardcoded URLs (`HelpDrawer` report URL, `UploadConsentDialog` Decart AUP) with `Constants`.
5. Add an i18n completeness check (translated keys vs `qsTr`) to the verification gate.

---

## 7. Performance program

1. **Incremental model updates.** `CharacterCatalogModel`/`PresetModel` reset on every filter/sort/load. Switch to `beginInsertRows`/`beginRemoveRows`/`dataChanged` (or `QSortFilterProxyModel`) so filtering never drops scroll/selection.
2. **De-duplicate JS loops.** `PresetGrid` recomputes roster arrays with JS loops on every model change; expose computed data once in C++.
3. **Virtualize long lists.** Ensure `NotificationCenter`/`DownloadsScreen` use `cacheBuffer`/`reuseItems` and light delegates; cap `Repeater`s that can instantiate dozens of `Canvas` cells (`PresetGrid` add-slots).
4. **Keep heavy work off the GUI thread.** Move `CameraCtrl.snapshotDataUrl()`/`grabFrame()` encode to a worker; make `MorphRecorder.close()` fully async where possible.
5. **Bindings hygiene.** Replace imperative `text` writes (e.g. `StageControls` clock) and magic literals (`parent.width > 760`, `rightMargin: 144`) with tokens/derived properties.

---

## 8. Logic architecture refactor (views render, C++ owns policy)

### 8.1 New / reshaped C++ components
| Component | Responsibility | Replaces view logic in |
|-----------|----------------|------------------------|
| **`PaymentController`** (new) | Full order lifecycle: create, poll cadence by provider (card vs crypto), caps, elapsed, status phases, cancel/recheck/verify, success/failure. Exposes `phase`, `statusHint`, `elapsedSec`, `method`, `failed`, signals. | `BuyCreditsDrawer` timers, `PaymentInFlightBanner` polling, `CheckoutSheet` verify timer, `BackendClient` order handlers |
| **`ToastQueue`** (new, or fold into `Notifier`) | Toast lifetime/eviction/coalescing/rate-limited inbox mirroring policy. | `NotificationToastHost` policy JS |
| **`NotificationCenterModel`** (new, or extend `Notifier`) | Grouped rows, relative-time buckets, category→action routing, per-category counts. | `NotificationCenter.rebuild()` |
| **`SessionPhase`** (extend `SessionManager`) | Discrete `Q_ENUM` phase + `queuePosition`, `connectionQuality`, `stallReason`; stop string-prefix parsing. | `StageFrame` statusText regex/`indexOf` |
| **`Validation`** util | Email/code parsing. | `AuthScreen` `indexOf` heuristic |

### 8.2 New / changed signals (enable richer UI without hacking strings)
- `SessionManager`: `phaseChanged(Phase)`, `queueChanged(int,int)`, `qualityChanged(Quality)`, `stalled(reason)`.
- `WebRtcSignalingClient`: raise `queuePositionChanged` to first-class; split `errorOccurred` from `reconnecting` notices.
- `Notifier`: `categories`/`countsByCategory` for filter chips (relative `timeText` already localized in C++).
- `RecordingManager`: `progressChanged` + `segmentStarted` for a live progress UI.
- `AuthManager`: expose provider availability for a cleaner auth tab model.

### 8.3 QML → C++ migration summary
Move: payment (all three overlays), toast policy, notif grouping/routing, file-path decode (`SettingsDrawer`), email validation (`AuthScreen`), chip copy (`CustomizeForm`), status-string parsing (`StageFrame`).

---

## 9. Component-by-component plan

Legend: **UI/UX** = visual/hierarchy/interaction; **Logic** = behavior/data. Every row assumes §3 tokens and §5 a11y. Motion verbs are absent by design.

### 9.1 Design singletons
| File | UI/UX | Logic |
|------|-------|-------|
| `theme/Colors.qml` | Revalue shadows to real elevation; add gradient + gradient-border + selected-surface tokens; keep text AA. | Additive only; keep all names. |
| `theme/Theme.qml` | Add elevation helper; expand type scale; add `zTooltip`; `trackingDisplay`. Keep `motion*` as retained-only. | Rewrite the animation comment to the precise "no time-based animation; real-state changes allowed" contract. |
| `constants/Constants.qml` | Reconcile layout mirrors that already drift from `Theme` (`settingsDrawerWidth` 480 vs 560, `notificationsWidth` 320 vs 340, `actionBarHeight` 88 vs 72). | Single source for layout constants. |
| `PlatformSettings.qml` | (none) | Consider folding into `Backend`/`App` to drop a singleton. |

### 9.2 Primitives (`qml/components/`, small)
| File | UI/UX | Logic |
|------|-------|-------|
| `Icon.qml` | Keep Shapes/PathSvg (crisp, scalable). Stroke tokens only. | Decorative; no a11y. |
| `IconButton.qml` | Add `Accessible.name`/`role`; gradient accent on `emphasis`; static hover/press states. | Add a `tooltip` property; drop legacy `iconText` only after confirming no Electron-driven caller (§9.7). |
| `PrimaryButton.qml` | Bolder CTA (bigger display text, gradient + glow + shadow). Replace the static `busy` dot with a determinate/static "working" treatment (see §4). | Expose `Accessible.name`. |
| `SecondaryButton.qml` | Sharper outline language + elevation on hover. | Add `Accessible.name`. |
| `GhostButton.qml` | Use `Theme.fontSmall` instead of hardcoded 12px. | — |
| `Switch.qml` | Add accessible role/checked. **Fix the re-declared `property bool enabled`** (shadows `Item.enabled`; `--verify-qml` risk). | Keep binding-preserving `toggled`. |
| `TextField.qml` | Keep focus halo (static). | Add `Accessible`. |
| `SegmentedControl.qml` | **Add `FocusRing`** (focusable today, no cue); per-segment a11y; gradient active pill. | `move()` at ends should not re-emit; guard. |
| `StatusPill.qml` | Gradient + glow for active; stronger static dot. | Map status→translated label; never show raw enum. |
| `Spinner.qml` | Replace indeterminate use with determinate progress/static glyph (§4). Wire or document `reduceMotion`. | — |
| `StyledScrollBar.qml` | Slightly thicker, always-visible thumb when scrollable. | — |
| `Tooltip.qml` | Use `Theme.zTooltip`; keep instant show. Decide fate of `openDuration/closeDuration`. | Add tooltip role. |
| `ToggleRow.qml` | Make the whole row keyboard-activatable + focused. Replace `"transparent"` literal with token. | — |
| `FocusRing.qml` | Keep pure visual (now used more widely). | — |
| `BrandingFooter.qml` | Make link focusable/accessible. | — |
| `TitleBar.qml` | Bolder wordmark; **accessible names on min/max/close**; replace `rightMargin:144` coupling with a derived value. | i18n the version prefix. |

### 9.3 Overlays (`qml/components/`, large)
| File | UI/UX | Logic |
|------|-------|-------|
| `SettingsDrawer.qml` (2156) | Stronger static tab indicator; card elevation; accessible nav rows + popups (keyboard); fix duplicated comment at 2072. Consider splitting the 6 tabs into subcomponents. | Decode `file://` path in C++; replace manual `Config.value` cache with a `NOTIFY`-backed property; unify duplicated layout literals with `Theme`. |
| `BuyCreditsDrawer.qml` (1568) | Bolder price ladder; determinate crypto progress (bound to `elapsedSecs`); **wire `paymentFailed` into a failure panel, `coinLogos` into the method list, `formatElapsed` into the tracker** (§9.7). Centralize coin brand colors in `Constants.cryptoLogos`. | **Move all 3 timers + order state machine to `PaymentController`**; i18n method labels + notify strings; centralize the `nowpayments.io` URL. |
| `CheckoutSheet.qml` | Real progress for `verifying` (from the controller, not a fake 4s timer). | Verifying/order state from `PaymentController`. |
| `PaymentInFlightBanner.qml` | Determinate progress + distinct card vs crypto cadence. | Polling/caps/elapsed to `PaymentController`. |
| `HelpDrawer.qml` | Bolder chips; keyboard-navigable FAQ accordion; static (no expansion animation). | Move FAQ data + diagnostics string to C++/`Constants`; replace hardcoded report URL. |
| `NotificationCenter.qml` | Filter chips a11y; stronger unread treatment; keep `ListView` virtualized. | **Move grouping/relative-time/routing to `NotificationCenterModel`**. |
| `NotificationToastHost.qml` | Bolder rails; sticky/priority styling; hover-pause retained. | Move lifetime/eviction/coalescing/rate-limit policy to `ToastQueue`; remove fragile `_cbs` JS side-map. |
| `OnboardingTour.qml` | Bolder spotlight; ensure card children are focusable; keep `Keys` nav. | Keep item math; drop legacy positional `registerTargets` signature. |
| `LockScreen.qml` | Bolder typography + gradient CTA; **i18n the 4 strings**. | Stop string-sniffing `lockTitle` — add an explicit `App.lockReason` enum. |
| `ConfirmDialog.qml` | Keyboard default focus (cancel has focus; confirm reachable via Tab). | `Accessible`; keep modal-stack wiring. |
| `UploadConsentDialog.qml` | Make checkbox rows keyboard/Space togglable + accessible. | Replace hardcoded Decart AUP URL with `Constants`. |
| `WhatsNewModal.qml` | Bolder release-note layout. | Parse `notes` markdown if the header comment is to be honored, else drop the comment. |
| `ShortcutsSheet.qml` | Bolder key chips. | Add Esc-to-close here (currently external). |

### 9.4 Dashboard (`qml/dashboard/`)
| File | UI/UX | Logic |
|------|-------|-------|
| `TopBar.qml` | Bolder account pill; stronger unread badge. **Implement the `narrow` branch** (currently written by Dashboard, never read — §9.7). | i18n `"9+"/"?"`; accessible menu items. |
| `StatusBar.qml` | Stronger connection dot; **fix raw `Qt.rgba(138/255…)` separator**; i18n `" ms"`/`"·"`. | — |
| `ActionBar.qml` | Bolder centered CTA (gradient + glow + shadow); stronger REC/session-cost chips. **Restore `fmtInt` call site and `liveBlocked` CTA gating; remove the duplicate filler** (§9.7). | i18n `"SESSION COST"/"REC"/"OBS"/"LIVE"/"PAUSED"/"···"/" cr"`; plural for cooldown. |
| `StageFrame.qml` | Bolder state overlays (idle/connecting/live as distinct still frames), stronger brackets/HUD. | Replace `statusText` prefix/regex parsing with `SessionManager.phase`/`stallReason`. |
| `StageControls.qml` | Stronger HD switch + popup; accessible controls; fix breakpoint literal. | i18n `" cr/sec"`; replace imperative clock text with a derived property. |
| `MorphStage.qml` | Subtle static "warming" vignette while connecting. | Wire or remove unused `active` (§9.7). |
| `InputPiP.qml` | Corner-snap + empty state when no devices; accessible camera chip. | Keep per-frame write guard; add empty-device state. |
| `WorkshopPanel.qml` | Bolder header; keep single scroll. | — |
| `PresetGrid.qml` | Bolder pack header; card hover lift (static elevation) + selection glow; limit add-slot `Canvas` Repeaters. | **Move roster JS loops to C++**; consolidate rename (remove duplicate with `CharacterCard`); add loading state for `Catalog.load()`. |
| `CharacterCard.qml` | Bolder name scrim; static hover ring/lift; stronger check; replace `Qt.rgba(0,0,0,0.45)` discs with tokens; make rename/delete/menu keyboard-reachable (hover-only today). | Remove duplicate rename path. |
| `CustomizeForm.qml` | Bolder section headers; static dropzone drag state; address the display-only `Switch` (a11y). | Move chip `ListModel` copy to C++ (translatable); stop setting `App.swapMode="scene"` without reset; add `Presets.load()` loading/error state. |
| `PromptCommitBar.qml` | Clearly-distinct committed vs draft state (static). | **Fix: scene field commits on Return but never on blur** (scene lost). Add disabled state when not live. |

### 9.5 Pages & screens
| File | UI/UX | Logic |
|------|-------|-------|
| `AuthScreen.qml` | Bolder hero; clearer step indicator for email↔code (static). Centralize brand hex (Google/Twitch/Kick) into `Constants`. | Email validation → `Validation` util; safe OTP-box accessors (no `children[0]`); narrow `Keys.forwardTo`. |
| `Dashboard.qml` | Bolder overlay choreography via static layering; cleaner narrow/compact reflow. Remove the stale low-credits comment block and the trivial `statusBarEffectiveHeight`. | Focus management for the click-away layers; keep Escape chain. |
| `PreviewWindow.qml` | **i18n title + labels** (currently literals); stronger toolbar. | Deduplicate the window-title constant. |
| `PopoutWindow.qml` | Bolder empty→live transition (static); accessible close. **Wire `dragOffset`** (§9.7); i18n `" Output"` suffix. | — |
| `DownloadsScreen.qml` | Accessible rows/keyboard download; i18n `"File"`. | Feedback when a download URL is missing/non-https. |
| `main.qml` | Distinct static page states (replace the freeze-frame `opacity` swap with a clear switch); centralize the `#08080c` palette literals in `Colors`. | — |

### 9.6 C++ layer
| Class | Change |
|-------|--------|
| `SessionManager` | Add `phase`/`queue`/`quality`/`stall` signals; keep enum for compat; unify duplicated `pushActiveTargetsToProvider` branches; `applyCooldown` should emit a dedicated signal, not only `error`. |
| `AuthManager` | Expose provider availability; move email parsing here; keep refresh ladder; document that Linux `SecureStore` is obfuscation, not encryption. |
| `ConfigManager` | **Remove the `themeAccent` hardcoded color leak** (move to `Colors`); `sync()` policy documented. (No `reduceMotion` needed — no motion.) |
| `Notifier` | Add category counts + relative-time helpers for the new center; decide inbox persistence. |
| `RecordingManager` | Add progress/segment signals for a live UI; keep 45-min cap and orphan recovery. |
| `CameraManager` | Move snapshot encode off the GUI thread; add an empty-device signal. |
| `BackendClient` | Split `errorOccurred`/reconnect; expose discrete order-status fields instead of raw maps. |
| `AppController` | Add `lockReason` enum (replace title sniffing); keep the modal stack. |
| `main.cpp` | Move palette/fonts/geometry into a themed bootstrap; single-source the version string (duplicated in 4 places). |
| `models/*` | Incremental `dataChanged` instead of `beginResetModel`; expose computed roster data. |

### 9.7 Port drift — dormant wiring to restore (do not delete)
These are set-but-never-read or defined-but-never-called symbols whose original Electron behavior was not re-connected in the Qt port. Each has been confirmed against the original **morphme v1.5.8** bundle (§1.4). Restore the intended wiring; do not delete.

| Symbol | File | Confirmed original behavior | Restoration |
|--------|------|------------------------------|-------------|
| `narrow` | `TopBar.qml` | Responsive top bar (width classes like `w-[112px]`, `max-w-[…]` switch at breakpoints) | `Dashboard` already passes `narrow: narrowLayout`; implement the narrow branch (compact pill, hide labels). |
| `fmtInt(n)` | `ActionBar.qml` | `n => n.toLocaleString("en-US")` (formatters export), used for credit/cost numbers | The cost text at the call site inlines the same math; route it through `fmtInt`. |
| `morphBtn.liveBlocked` | `ActionBar.qml` | CTA gated while a session is live/cooldown (`disabled` bindings next to `cooldownRemainingSec`) | Bind CTA enabled state and label to it. |
| duplicate filler `Item` | `ActionBar.qml` | A single layout spacer | Keep one; the second is a copy-paste artifact. |
| `active` | `MorphStage.qml` | Stage active/fallback visual driven by session state | `StageFrame` already passes `active: Session.isActive`; use it. |
| `coinLogos` | `BuyCreditsDrawer.qml` | Coin → icon/color map for `usdt, usdc, sol, trx, btc, eth, bnb, matic, xrp, ton` (`cryptocurrency-icons` package) | Wire into the method/coin list; centralize brand hex in `Constants.cryptoLogos`. |
| `paymentFailed` | `BuyCreditsDrawer.qml` | A real reset-on-retry state flag in the original order flow | It is set `true` (~line 1537) but never rendered; add the failure panel. |
| `formatElapsed(totalSecs)` | `BuyCreditsDrawer.qml` | `mm:ss` elapsed, local to the crypto invoice tracker | The tracker computes it inline; call the helper. |
| `dragOffset` | `PopoutWindow.qml` | Original used CSS `-webkit-app-region: drag` (no JS offset) | Mirror `TitleBar.clickPos` in the popout drag `MouseArea`. |
| `reduceMotion` | `Spinner.qml` | Original honored `prefers-reduced-motion` and used `animate-spin` | Under the no-motion directive the static spinner is intentional; mark `reduceMotion` retained-only or remove it. |
| `openDuration` / `closeDuration` | `Tooltip.qml` | Original tooltips used Radix `delayDuration` / `skipDelayDuration`, not open/close durations | Reconcile to `showDelay` semantics; remove the invented no-op params. |
| duplicated comment | `SettingsDrawer.qml:2072` | — | Housekeeping only. |

---

## 10. Phased rollout

Each phase is independently shippable and gated by §11.

- **Phase 0 — Safety net (no visual change).** Fix `Switch.enabled` re-declaration; wrap missing i18n strings; add `Accessible.*` + keyboard to primitives; **restore the §9.7 dormant wiring**; remove the SettingsDrawer duplicate comment. Verify: `--verify-qml`, smoke, manual a11y pass.
- **Phase 1 — Foundation.** Token overhaul (§3): elevation, type scale, gradient tokens, z-fixes; update the Theme directive comments to the precise no-motion contract.
- **Phase 2 — Logic extraction.** Introduce `PaymentController`, `ToastQueue`, `NotificationCenterModel`, `SessionPhase`, `Validation`; migrate views; add incremental model updates.
- **Phase 3 — Depth & hierarchy pass.** Apply §3/§4 to cards, drawers, modals, buttons, the stage; introduce static hover-lift and gradient borders.
- **Phase 4 — Bolder aesthetics.** Type scale applied, gradient/glow accents, bolder status/live treatments, optional display face.
- **Phase 5 — Hardening & polish.** Perf pass, empty/loading/error completeness, i18n plural pass, accessibility audit, docs update (`AGENTS.md`, parity).

---

## 11. Production-readiness gates (must pass before merge)

1. `bash verify.sh --quick` green (cargo check/test, integration, endpoint smoke, `--verify-qml`).
2. `./build/bin/LiveMorph --verify-qml` clean (runtime QML errors are the #1 risk across 51 files).
3. **Keyboard-only** walkthrough of: auth, dashboard, all drawers/modals, stage controls, notifications.
4. **Accessibility spot-check**: every icon-only control has a name; toasts announce; dialogs trap+restore focus.
5. **Contrast**: no body text below AA; low-opacity empty-state text raised.
6. **No new time-based animation elements** (grep gate: `Behavior|*Animation|Transition|*Animator`).
7. **Perf**: no frame drops on list scroll / drawer open / camera PiP; `Catalog`/`Presets` filtering no longer resets the model.
8. **i18n**: no new unwrapped user strings; plurals correct; raw enum values never shown.
9. Token-only colors: no new hardcoded hex outside the crypto/brand map.
10. `qmldir` + `CMakeLists.txt` updated for any new QML file (dev-mode gotcha).

---

## 12. Risks & open decisions

**Settled:**
- **No motion** — the animation directive stands. All "slickness" comes from type, color, geometry, elevation, and real-state-driven changes.
- **Dormant symbols are restored, not deleted** (they are port drift with a home in the original app — §9.7).

**Recommended default (autonomous), reversible:**
- Keep token **names** stable; only add/revalue.
- Keep Maple Mono; defer any second display face.
- Reintroduce **elevation** (relaxing the flat/shadow directive). If you want flat retained too, drop §3.1 and the Phase-3 lifts; the plan still works with fills + borders + gradient only.

**Needs a decision:**
1. **Keep flat, or allow elevation?** (The shadow directive.) This plan assumes elevation returns.
2. **Bundle a display grotesk?** (+assets/licensing) or Maple-only scale.
3. **Persist the notification inbox?** (memory-only today.)
4. **Split the two 1500–2200-line drawers** into subcomponents (maintainability vs churn)?
5. The original Electron bundle **is available** (`~/Downloads/app (2)/`, morphme v1.5.8) and has been used to confirm §9.7 (§1.4). No further action; re-check against it when restoring each item.

**Risks:**
- Editing 51 files risks `--verify-qml` regressions — mitigate with the Phase 0 safety net + per-phase gate.
- Moving logic to C++ touches payment/session paths — mitigate with backend integration tests and staged migration.
- Many real shadows on weak GPUs can cost fill-rate — mitigate by capping blur, limiting elevation to a few layers, and profiling.
