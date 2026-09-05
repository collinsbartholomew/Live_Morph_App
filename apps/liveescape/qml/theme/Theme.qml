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
    readonly property color dim2: "#3a3a55"
    readonly property int radius: 7
    readonly property int radiusSm: 4
    readonly property int radiusLg: 14
    readonly property int radiusXl: 20
    readonly property int radiusFull: 999
    readonly property string fontUi: "Rajdhani"
    readonly property string fontMono: "JetBrains Mono"

    readonly property color glass: "#12121c"
    readonly property color scrim: "#cc04040a"
    readonly property int motionFast: 120
    readonly property int motionNormal: 220

    // Semantic — focus ring + hover + status tints (shared token shape)
    readonly property color focusRing: "#e8c54788"
    readonly property color hover: "#ffffff0a"
    readonly property color insetHighlight: "#ffffff12"
    readonly property color divider: "#ffffff0d"
    readonly property color successMuted: "#0d2a22"
    readonly property color warningMuted: "#3a3010"
    readonly property color infoMuted: "#151528"
}
