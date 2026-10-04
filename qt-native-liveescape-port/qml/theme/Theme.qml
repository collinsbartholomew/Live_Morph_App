pragma Singleton
import QtQuick

// Exact tokens from the reference CSS :root (dashboard.html lines 17–35)
QtObject {
    // Surfaces
    readonly property color bg: "#04040a"          // --bg
    readonly property color s1: "#0a0a16"          // --s1
    readonly property color s2: "#111120"          // --s2
    readonly property color border: "#1c1c30"       // --border
    readonly property color card: "#111120"        // --card (var(--s2))

    // Gold family
    readonly property color gold: "#e8c547"        // --gold
    readonly property color goldD: Qt.rgba(232/255, 197/255, 71/255, 0.18)   // --gold-d
    readonly property color goldG: Qt.rgba(232/255, 197/255, 71/255, 0.06)  // --gold-g
    readonly property color goldDeep: "#d4a017"    // gradient partner (135deg)
    readonly property color goldInk: "#1a0a00"     // text on gold

    // Teal / red
    readonly property color teal: "#3fe8b8"        // --teal
    readonly property color tealD: Qt.rgba(63/255, 232/255, 184/255, 0.15)    // --teal-d
    readonly property color red: "#ff4d6d"        // --red
    readonly property color redD: Qt.rgba(255/255, 77/255, 109/255, 0.08)

    // Text
    readonly property color text: "#e8e8f8"       // --text
    readonly property color dim: "#606080"        // --dim
    readonly property color dim2: Qt.rgba(96/255, 96/255, 128/255, 0.55)     // --dim2

    // Warm orange-gold used by tour/tutorial/low-credit accents (distinct from --gold)
    readonly property color tourGold: Qt.rgba(240/255, 168/255, 48/255, 1)
    readonly property color tooltipBg: "#0d0d18"  // tour/tooltip cards

    // Radii
    readonly property int radius: 7               // --r
    readonly property int radiusSm: 6             // copy-btn / small
    readonly property int radiusMd: 10            // upload/btn-row override
    readonly property int radiusLg: 12            // .modal
    readonly property int radiusXl: 14             // .auth-box
    readonly property int radiusFull: 100          // pills (.pill/.ibtn/.tgl)

    // Typography — Maple Mono NF is the single app font (UI + mono).
    readonly property string fontUi: "Maple Mono NF"
    readonly property string fontMono: "Maple Mono NF"

    // Motion (from keyframes/transitions)
    readonly property int motionFast: 200         // transition: all .2s
    readonly property int motionNormal: 250
    readonly property int slideUpMs: 350          // .modal slideUp
    readonly property int fadeInMs: 350           // .overlay fadeIn

    // Overlay backdrop — .overlay background (no backdrop-blur in Qt; .97 is opaque enough)
    readonly property color overlayBg: Qt.rgba(4/255, 4/255, 10/255, 0.97)
    readonly property color modalGlow: Qt.rgba(232/255, 197/255, 71/255, 0.07)

    // Semantic helpers mirroring common one-off values
    readonly property color focusRing: Qt.rgba(232/255, 197/255, 71/255, 0.06) // 0 0 0 2px --gold-g
    readonly property color divider: border
}
