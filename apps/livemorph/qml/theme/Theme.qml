pragma Singleton
import QtQuick

/**
 * Spacing & chrome — Electron ground truth (Tailwind scale):
 *   rounded-sm=4  rounded-md=6  rounded-lg=8  rounded-xl=12
 *   transitions: .15s ease / .15s cubic-bezier(.4,0,.2,1) / .22s / .3s
 *   tracking-label=.15em  icons: xs12 sm14 md18 lg22 xl28
 */
QtObject {
    readonly property int radiusXs: 2
    readonly property int radiusSm: 4
    readonly property int radiusMd: 6
    readonly property int radiusLg: 8
    readonly property int radiusXl: 12
    readonly property int radius2xl: 20
    readonly property int radiusFull: 999
    readonly property int inputRadius: 4

    readonly property int spacingXs: 4
    readonly property int spacingSm: 8
    readonly property int spacingMd: 12
    readonly property int spacingLg: 16
    readonly property int spacingXl: 24
    readonly property int spacing2xl: 32

    // Layout chrome heights (Electron: status footer h-8 = 32px FIXED)
    readonly property int titleBarHeight: 40
    readonly property int topBarHeight: 44
    readonly property int statusBarHeight: 32
    readonly property int actionBarHeight: 88
    readonly property int actionBarHeightCompact: 64
    readonly property int promptBarHeight: 72
    readonly property int compactChromeBelow: 780
    readonly property int narrowBreakpoint: 1100
    readonly property int statusBarHeightCompact: 32

    readonly property int workshopWidth: 360
    readonly property int workshopCollapsedWidth: 48
    readonly property int workshopMinWidth: 280
    readonly property int workshopMaxWidth: 380
    readonly property int actionLeftWidth: 360
    readonly property int settingsDrawerWidth: 480
    readonly property int buyCreditsDrawerWidth: 500
    readonly property int notificationsWidth: 360

    readonly property real trackingLabel: 0.15

    readonly property int motionFast: 150
    readonly property int motionNormal: 200
    readonly property int motionSlow: 300
    readonly property int motionSpring: 420
    readonly property int motionPopover: 220

    // Icon sizing (Electron lucide ladder: xs=12 sm=14 md=18 lg=22 xl=28)
    readonly property int iconXs: 12
    readonly property int iconSm: 14
    readonly property int iconMd: 18
    readonly property int iconLg: 22
    readonly property int iconXl: 28
    readonly property real iconStroke: 1.75
    readonly property real iconStrokeEmphasis: 2.5

    // Elevation (soft shadow offsets for the single-source shadow color)
    readonly property int shadowY: 3
    readonly property int shadowBlur: 18
    readonly property int shadowYStrong: 6
    readonly property int shadowBlurStrong: 28

    // ---- Fonts (product decision: Maple Mono everywhere — bundled in
    // resources and loaded via QFontDatabase at startup, so every machine
    // renders identically; no CSS-style fallback lists — Qt does NOT parse
    // comma-separated families) ----
    readonly property font fontUi: Qt.font({ family: "Maple Mono", pixelSize: 13 })
    readonly property font fontSmall: Qt.font({ family: "Maple Mono", pixelSize: 12 })
    readonly property font fontTiny: Qt.font({ family: "Maple Mono", pixelSize: 11 })
    readonly property font fontLabel: Qt.font({ family: "Maple Mono", pixelSize: 11, weight: Font.Medium, letterSpacing: 0.4 })
    readonly property font fontCaption: Qt.font({ family: "Maple Mono", pixelSize: 10, weight: Font.Medium, letterSpacing: 0.8 })
    readonly property font fontHeading: Qt.font({ family: "Maple Mono", pixelSize: 18, weight: Font.Bold })
    readonly property font fontAuthHeadline: Qt.font({ family: "Maple Mono", pixelSize: 36, weight: Font.Bold })
    readonly property font fontMono: Qt.font({ family: "Maple Mono", pixelSize: 12 })
    readonly property font fontMonoTiny: Qt.font({ family: "Maple Mono", pixelSize: 10 })
}
