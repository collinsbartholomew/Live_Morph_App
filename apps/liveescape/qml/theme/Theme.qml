pragma Singleton
import QtQuick

QtObject {
    readonly property color bg: "#04040a"
    readonly property color s1: "#0a0a16"
    readonly property color s2: "#111120"
    readonly property color s3: "#181828"
    readonly property color border: "#1c1c30"
    readonly property color gold: "#e8c547"
    readonly property color goldDim: "#2e2a14"
    readonly property color goldGlow: "#1a180c"
    readonly property color goldGlowStrong: "#3a3418"
    readonly property color goldHover: "#f0d56a"
    readonly property color teal: "#3fe8b8"
    readonly property color tealDim: "#0d2a22"
    readonly property color red: "#ff4d6d"
    readonly property color redDim: "#3a1520"
    readonly property color warnDim: "#3a3010"
    readonly property color text: "#e8e8f8"
    readonly property color dim: "#606080"
    readonly property color dim2: Qt.rgba(96 / 255, 96 / 255, 128 / 255, 0.55)

    // Electron translucent overlay tokens (--gold-d / --gold-g / --teal-d / red washes)
    readonly property color goldD: Qt.rgba(232 / 255, 197 / 255, 71 / 255, 0.18)
    readonly property color goldG: Qt.rgba(232 / 255, 197 / 255, 71 / 255, 0.06)
    readonly property color goldDReduced: Qt.rgba(240 / 255, 168 / 255, 48 / 255, 0.15)
    readonly property color tealD: Qt.rgba(63 / 255, 232 / 255, 184 / 255, 0.15)
    readonly property color redWash: Qt.rgba(255 / 255, 77 / 255, 109 / 255, 0.06)
    readonly property color redBorderWash: Qt.rgba(255 / 255, 77 / 255, 109 / 255, 0.25)
    readonly property int radius: 7
    readonly property int radiusSm: 4
    readonly property int radiusLg: 14
    readonly property int radiusXl: 20
    readonly property int radiusFull: 999
    readonly property string fontUi: "Rajdhani"
    readonly property string fontSans: "Rajdhani"
    readonly property string fontMono: "JetBrains Mono"

    readonly property color glass: "#12121c"
    readonly property color scrim: "#cc04040a"
    readonly property int motionFast: 200
    readonly property int motionNormal: 250

    // Modal / overlay tokens (match Electron .overlay + .modal)
    readonly property color backdropSolid: Qt.rgba(8 / 255, 8 / 255, 13 / 255, 0.7)
    readonly property color modalShadow: Qt.rgba(232 / 255, 197 / 255, 71 / 255, 0.07)

    // Semantic — focus ring + hover + status tints (shared token shape)
    readonly property color focusRing: "#e8c54788"
    readonly property color hover: "#ffffff0a"
    readonly property color insetHighlight: "#ffffff12"
    readonly property color divider: "#ffffff0d"
    readonly property color successMuted: "#0d2a22"
    readonly property color warningMuted: "#3a3010"
    readonly property color infoMuted: "#151528"

    // Responsive properties (from ResponsiveHelper)
    readonly property int responsiveTopBarHeight: ResponsiveHelper.topBarHeight
    readonly property int responsiveControlsBarHeight: ResponsiveHelper.controlsBarHeight
    readonly property int responsiveSidebarWidth: ResponsiveHelper.sidebarWidth
    readonly property bool responsiveShowBarMid: ResponsiveHelper.showBarMid
    readonly property bool responsiveControlsSingleColumn: ResponsiveHelper.controlsSingleColumn
    readonly property int responsivePlanGridColumns: ResponsiveHelper.planGridColumns
    readonly property int responsiveSpacingXs: ResponsiveHelper.spacingXs
    readonly property int responsiveSpacingSm: ResponsiveHelper.spacingSm
    readonly property int responsiveSpacingMd: ResponsiveHelper.spacingMd
    readonly property int responsiveSpacingLg: ResponsiveHelper.spacingLg
    readonly property int responsiveFontSizeXs: ResponsiveHelper.fontSizeXs
    readonly property int responsiveFontSizeSm: ResponsiveHelper.fontSizeSm
    readonly property int responsiveFontSizeMd: ResponsiveHelper.fontSizeMd
    readonly property int responsiveFontSizeLg: ResponsiveHelper.fontSizeLg
    readonly property int responsiveFontSizeXl: ResponsiveHelper.fontSizeXl
    readonly property int responsiveButtonHeightSm: ResponsiveHelper.buttonHeightSm
    readonly property int responsiveButtonHeightMd: ResponsiveHelper.buttonHeightMd
    readonly property int responsiveButtonHeightLg: ResponsiveHelper.buttonHeightLg
    readonly property int responsiveModalMaxWidthSm: ResponsiveHelper.modalMaxWidthSm
    readonly property int responsiveModalMaxWidthMd: ResponsiveHelper.modalMaxWidthMd
    readonly property int responsiveModalMaxWidthLg: ResponsiveHelper.modalMaxWidthLg
    readonly property int responsiveModalMaxWidthXl: ResponsiveHelper.modalMaxWidthXl
    readonly property bool responsiveShowScanlines: ResponsiveHelper.showScanlines
}
