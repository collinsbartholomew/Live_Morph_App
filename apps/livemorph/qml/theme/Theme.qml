pragma Singleton
import QtQuick

/**
 * Spacing & chrome tokens for the "Obsidian Hex" design system
 * (monochrome black/white + honeycomb).
 *
 * ─────────────────────────────────────────────────────────────────────
 *  MOTION IS BANNED PROJECT-WIDE (permanent user directive).
 *  Do NOT add Behavior / NumberAnimation / ColorAnimation /
 *  SequentialAnimation / ParallelAnimation / RotationAnimation /
 *  Transition / *Animator elements anywhere in this app.
 *  State changes must be instant (plain property bindings only).
 *  Allowed: changes driven by REAL state (a progress value bound to
 *  Session.elapsedSec) — those are bindings, not interpolated motion.
 *  The motion* duration tokens are retained for API stability only.
 * ─────────────────────────────────────────────────────────────────────
 */
QtObject {
    // Radius ladder (single scale, no ad-hoc literals). Sharpened for the
    // Radius ladder — SHARP brutalist hex-tech: panels, cards, buttons,
    // inputs and dropdowns use 0–2px corners (no rounded borders); only
    // true pills (status chips, toggles, avatars) use radiusFull.
    readonly property int radiusXs: 0
    readonly property int radiusHairline: 1 // 1px rounding on hairline borders
    readonly property int radiusSm: 2
    readonly property int radiusMd: 2
    readonly property int radiusLg: 2
    readonly property int radiusXl: 3
    readonly property int radius2xl: 4
    readonly property int radiusFull: 999
    readonly property int inputRadius: 2

    readonly property int spacingXs: 4
    readonly property int spacingSm: 8
    readonly property int spacingMd: 12
    readonly property int spacingLg: 16
    readonly property int spacingXl: 24
    readonly property int spacing2xl: 32
    readonly property int spacing3xl: 48
    // Container / section rhythm
    readonly property int padContainer: 24
    readonly property int padSection: 20
    readonly property int gapCard: 10

    // Layout chrome heights (Electron: status footer h-8 = 32px FIXED)
    readonly property int titleBarHeight: 40
    readonly property int topBarHeight: 48
    readonly property int statusBarHeight: 36
    readonly property int actionBarHeight: 72
    readonly property int actionBarHeightCompact: 56
    readonly property int promptBarHeight: 48
    readonly property int stageControlsHeight: 48
    readonly property int drawerHeaderHeight: 56
    readonly property int compactChromeBelow: 780
    readonly property int narrowBreakpoint: 1100
    // Stage-controls strip hides the working-with chip below this width
    // (distinct from compactChromeBelow, which drives chrome heights).
    readonly property int stageControlsNarrow: 760

    // Pill/chip sizing (one padding + two heights — replaces the mixed
    // +10/+12/+14/+16/+20 paddings and 16..28px heights found inline).
    readonly property int pillPad: 12
    readonly property int pillHeightSm: 20
    readonly property int pillHeightMd: 24

    // Honeycomb texture opacities (single ladder: bg field / idle state)
    readonly property real honeycombBgOpacity: 0.5
    readonly property real honeycombIdleOpacity: 0.8

    // Z-scale (single source for overlay stacking order)
    readonly property int zScrim: 150
    readonly property int zTour: 180
    readonly property int zDrawer: 200
    readonly property int zTitleBar: 210 // window chrome stays above drawers/downloads
    readonly property int zSheet: 250
    readonly property int zDialog: 300
    readonly property int zLock: 960 // above everything incl. toasts: a lock screen must cover them
    // Toasts sit ABOVE page content but BELOW every overlay: the notification
    // center (145) covers the toast stack (140), and scrim/drawers/sheets/
    // dialogs (150/200/250/300) cover both — an open overlay never leaves
    // toast cards painting over it or stealing its clicks.
    readonly property int zToast: 140
    readonly property int zNotificationCenter: 145
    readonly property int zTooltip: 950
    readonly property int zOfflineBanner: 89
    readonly property int zBanner: 90
    readonly property int zPageBanner: 49 // in-page strip (e.g. streaming-unavailable)
    readonly property int zMaintenance: 150 // full-screen gate: above toasts (140) + notif center (145)
    // Intra-component local stacking (always below the overlay ladder above)
    readonly property real zUnder2: -2
    readonly property real zUnder: -1
    readonly property real zLocal0: 0
    readonly property real zLocal1: 1
    readonly property real zLocal1_5: 1.5
    readonly property real zLocal2: 2
    readonly property real zLocal3: 3
    readonly property real zLocal5: 5
    readonly property real zLocal7_5: 7.5
    readonly property int zCatcher: 20 // full-area dropdown catcher, below popups
    readonly property int zLocal4: 4
    readonly property int zLocal6: 6
    readonly property int zLocal7: 7
    readonly property int zLocal8: 8
    readonly property int zLocal9: 9
    readonly property int zLocal10: 10
    readonly property int zLocal11: 11
    readonly property int zLocal12: 12

    readonly property int workshopWidth: 360
    readonly property int workshopCollapsedWidth: 48
    readonly property int workshopMinWidth: 280
    readonly property int workshopMaxWidth: 380
    readonly property int actionLeftWidth: 360
    readonly property int settingsDrawerWidth: 560
    readonly property int buyCreditsDrawerWidth: 500
    readonly property int helpDrawerWidth: 480
    readonly property int notificationsWidth: 340
    readonly property int toastWidth: 320

    readonly property real trackingLabel: 0.15
    readonly property real trackingDisplay: -0.5
    // Small uppercase labels: keep them crisp, not "outlined" — reduce the
    // wide tracking that made bold caps look stroked at small sizes.
    readonly property real trackingEyebrow: 1.0
    readonly property real trackingChip: 1.2 // mono micro-chips (STAGE, REC, pills)
    readonly property real trackingCta: 2.0 // big CTA labels (BEGIN SWAP)

    // Honeycomb geometry (hex grid pitch = flat-top hex width; see Honeycomb.qml)
    readonly property int honeycombCell: 28
    readonly property int honeycombCellLg: 44
    readonly property real honeycombLineWidth: 1.0

    readonly property int motionFast: 150
    readonly property int motionNormal: 200
    readonly property int motionSlow: 300
    readonly property int motionSpring: 420
    readonly property int motionPopover: 220

    // Icon sizing (lucide ladder: xs=12 sm=14 md=18 lg=22 xl=28)
    readonly property int iconXs: 13
    readonly property int iconSm: 16
    readonly property int iconMd: 18
    readonly property int iconLg: 22
    readonly property int iconXl: 28
    readonly property real iconStroke: 2.0
    readonly property real iconStrokeEmphasis: 2.75

    // Elevation (soft shadow offsets for the single-source shadow color)
    readonly property int shadowY: 3
    readonly property int shadowBlur: 18
    readonly property int shadowYStrong: 6
    readonly property int shadowBlurStrong: 28

    // ---- Fonts (product decision: Maple Mono everywhere — bundled in
    // resources and loaded via QFontDatabase at startup, so every machine
    // renders identically; no CSS-style fallback lists — Qt does NOT parse
    // comma-separated families). Only Light / Regular / Bold are bundled, so
    // every weight below maps deterministically onto those three. ----
    readonly property font fontUi: Qt.font({ family: "Maple Mono", pixelSize: 14 })
    readonly property font fontSmall: Qt.font({ family: "Maple Mono", pixelSize: 13 })
    readonly property font fontTiny: Qt.font({ family: "Maple Mono", pixelSize: 12 })
    readonly property font fontLabel: Qt.font({ family: "Maple Mono", pixelSize: 11, weight: Font.Bold, letterSpacing: 1.0 })
    readonly property font fontCaption: Qt.font({ family: "Maple Mono", pixelSize: 10, weight: Font.Bold, letterSpacing: 0.8 })
    readonly property font fontTitle: Qt.font({ family: "Maple Mono", pixelSize: 16, weight: Font.Bold })
    readonly property font fontHeading: Qt.font({ family: "Maple Mono", pixelSize: 20, weight: Font.Bold })
    readonly property font fontHeadline: Qt.font({ family: "Maple Mono", pixelSize: 28, weight: Font.Bold })
    readonly property font fontDisplay: Qt.font({ family: "Maple Mono", pixelSize: 40, weight: Font.Bold })
    readonly property font fontAuthHeadline: Qt.font({ family: "Maple Mono", pixelSize: 34, weight: Font.Bold })
    readonly property font fontMono: Qt.font({ family: "Maple Mono", pixelSize: 12 })
    readonly property font fontMonoTiny: Qt.font({ family: "Maple Mono", pixelSize: 10 })
    // 9px mono micro-labels (HUD pills, eyebrows on chips) — smallest size in
    // the system; anything smaller was off-ladder.
    readonly property font fontMicro: Qt.font({ family: "Maple Mono", pixelSize: 9 })
}
