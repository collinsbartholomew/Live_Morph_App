pragma Singleton
import QtQuick

/**
 * Spacing & chrome — layouts preserved; radii/motion modernised.
 */
QtObject {
    readonly property int radiusXs: 6
    readonly property int radiusSm: 8
    readonly property int radiusMd: 12
    readonly property int radiusLg: 16
    readonly property int radiusXl: 20
    readonly property int radius2xl: 24
    readonly property int radiusFull: 999

    readonly property int spacingXs: 4
    readonly property int spacingSm: 8
    readonly property int spacingMd: 12
    readonly property int spacingLg: 16
    readonly property int spacingXl: 24
    readonly property int spacing2xl: 32

    // Layout chrome heights (unchanged structure)
    readonly property int titleBarHeight: 36
    readonly property int topBarHeight: 48
    readonly property int statusBarHeight: 48
    readonly property int actionBarHeight: 88
    readonly property int actionBarHeightCompact: 64
    readonly property int promptBarHeight: 72
    readonly property int compactChromeBelow: 780
    readonly property int narrowBreakpoint: 1100
    readonly property int statusBarHeightCompact: 32

    readonly property int workshopWidth: 320
    readonly property int workshopCollapsedWidth: 48
    readonly property int workshopMinWidth: 280
    readonly property int workshopMaxWidth: 380
    readonly property int actionLeftWidth: 360
    readonly property int settingsDrawerWidth: 480
    readonly property int buyCreditsDrawerWidth: 500
    readonly property int notificationsWidth: 360

    readonly property real trackingLabel: 0.12

    readonly property int motionFast: 140
    readonly property int motionNormal: 240
    readonly property int motionSlow: 360
    readonly property int motionSpring: 420

    // Icon sizing
    readonly property int iconXs: 12
    readonly property int iconSm: 14
    readonly property int iconMd: 16
    readonly property int iconLg: 18
    readonly property int iconXl: 22
    readonly property real iconStroke: 1.75

    // Elevation (soft shadow offsets for the single-source shadow color)
    readonly property int shadowY: 3
    readonly property int shadowBlur: 18
    readonly property int shadowYStrong: 6
    readonly property int shadowBlurStrong: 28

    readonly property font fontUi: Qt.font({ family: "Inter, Segoe UI, system-ui, sans-serif", pixelSize: 13 })
    readonly property font fontSmall: Qt.font({ family: "Inter, Segoe UI, system-ui, sans-serif", pixelSize: 12 })
    readonly property font fontTiny: Qt.font({ family: "Inter, Segoe UI, system-ui, sans-serif", pixelSize: 11 })
    readonly property font fontLabel: Qt.font({ family: "Inter, Segoe UI, system-ui, sans-serif", pixelSize: 11, weight: Font.Medium, letterSpacing: 0.4 })
    readonly property font fontCaption: Qt.font({ family: "Inter, Segoe UI, system-ui, sans-serif", pixelSize: 10, weight: Font.Medium, letterSpacing: 0.8 })
    readonly property font fontHeading: Qt.font({ family: "Inter, Segoe UI, system-ui, sans-serif", pixelSize: 18, weight: Font.DemiBold })
    readonly property font fontAuthHeadline: Qt.font({ family: "Inter, Segoe UI, system-ui, sans-serif", pixelSize: 36, weight: Font.Bold })
    readonly property font fontMono: Qt.font({ family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", pixelSize: 12 })
    readonly property font fontMonoTiny: Qt.font({ family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", pixelSize: 10 })
}
