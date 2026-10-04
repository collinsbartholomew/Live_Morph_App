pragma Singleton
import QtQuick

/**
 * LiveMorph 2026 design tokens — deep graphite + violet accent, glass-friendly.
 */
QtObject {
    // Surfaces (layered depth)
    readonly property color surfaceBase:         "#08080c"
    readonly property color surfaceRaised:       "#101019"
    readonly property color surfaceOverlay:      "#17171f"
    readonly property color surfaceElevated:     "#1d1d27"
    readonly property color surfaceHover:        "#1f1f2c"
    readonly property color surfaceFocus:        "#131320"
    readonly property color surfaceBorder:       "#262630"
    readonly property color surfaceBorderSubtle: "#181824"
    readonly property color surfaceBorderStrong: "#36364a"
    readonly property color surfaceGlass:        "#17171fcc"
    readonly property color surfaceGlassStrong:  "#101019e6"

    // Text
    readonly property color textPrimary:         "#f0f0f5"
    readonly property color textSecondary:       "#a4a4b8"
    readonly property color textMuted:           "#8a8aa3"
    readonly property color textInverse:         "#0a0a10"

    // Accent (violet)
    readonly property color accent:              "#8b5cf6"
    readonly property color accentHover:         "#a78bfa"
    readonly property color accentPressed:       "#7c3aed"
    readonly property color accentMuted:         "#8b5cf633"
    readonly property color accent10:            "#8b5cf61a"
    readonly property color accent15:            "#8b5cf626"
    readonly property color accent20:            "#8b5cf633"
    readonly property color accent30:            "#8b5cf64d"
    readonly property color accent40:            "#8b5cf666"
    readonly property color accent60:            "#8b5cf699"
    readonly property color accent70:            "#8b5cf6b3"
    // Electron /N fills: drawer/panel washes (BuyCredits selected cards)
    readonly property color accent06:            "#8b5cf60f"
    readonly property color accent12:            "#8b5cf61f"

    // Semantic
    readonly property color statusSuccess:       "#22c55e"
    readonly property color statusSuccessMuted:  "#22c55e22"
    readonly property color statusWarning:       "#f59e0b"
    readonly property color warning:             "#f59e0b" // shorthand kept for older QML call sites
    readonly property color statusWarningMuted:  "#f59e0b22"
    readonly property color statusError:         "#ef4444"
    readonly property color statusErrorMuted:    "#ef444422"
    readonly property color statusInfo:           "#60a5fa"
    readonly property color statusInfoMuted:     "#60a5fa22"

    // Electron /N alpha variants (pill bg /5, border /25-/40, destructive /15)
    readonly property color successFaintBg:       "#22c55e0d"
    readonly property color successFaintBorder:    "#22c55e40"
    readonly property color warningFaintBg:       "#f59e0b0d"
    readonly property color warningFaintBorder:    "#f59e0b40"
    readonly property color errorFaintBg:         "#ef44441a"
    readonly property color errorFaintBorder:       "#ef44444d"
    readonly property color errorSoftBg:          "#ef444426"

    // Plan tier badges (Electron exact, pre-blended)
    readonly property color tierProBg:            "#f59e0b26"
    readonly property color tierProBorder:        "#f59e0b4d"
    readonly property color tierProText:           "#fbb24b"
    readonly property color tierMidBg:             "#3b82f626"
    readonly property color tierMidBorder:         "#3b82f64d"
    readonly property color tierMidText:          "#60a5fa"
    readonly property color tierStarterBg:         "#10b98126"
    readonly property color tierStarterBorder:     "#10b9814d"
    readonly property color tierStarterText:      "#34d399"
    readonly property color tierBasicBg:           "#14b8a626"
    readonly property color tierBasicBorder:       "#14b8a64d"
    readonly property color tierBasicText:         "#2dd4bf"

    // Text selection (Electron ::selection)
    readonly property color selectionBg:           "#8b5cf659"
    readonly property color selectionText:         "#f0f0f5"

    // Semantic — destructive / success strong (action fills)
    readonly property color danger:              "#ef4444"
    readonly property color dangerHover:         "#f87171"
    readonly property color dangerMuted:         "#ef444422"
    readonly property color textOnAccent:         "#ffffff"

    // Utility
    readonly property color white:               "#ffffff"
    readonly property color black:               "#000000"
    readonly property color transparent:         "transparent"

    readonly property color glowAccent:          "#8b5cf655"
    readonly property color glowAccentStrong:    "#8b5cf688"
    readonly property color glowAccentCta:      "#a855f7" // Electron CTA/glow shadows use a855f7
    readonly property color overlayScrim:        "#00000099"
    readonly property color overlayScrimSoft:   "#00000099"

    // Focus + elevation (single-source shadows replace hand-rolled glows)
    readonly property color focusRing:           "#8b5cf699"
    readonly property color shadow:              "#00000059"
    readonly property color shadowStrong:        "#00000099"

    readonly property color insetHighlight:      "#ffffff0a"
    readonly property color insetHighlightSoft:  "#ffffff0a"
    readonly property color white03:             "#ffffff08"
    readonly property color white06:             "#ffffff0f"
    readonly property color white10:             "#ffffff1a"
    readonly property color divider:             "#ffffff0d"

    // Toast type fills
    readonly property color toastInfoBg:         "#14141cf2"
    readonly property color toastSuccessBg:      "#0c1f1af2"
    readonly property color toastWarningBg:      "#1f1a0cf2"
    readonly property color toastErrorBg:        "#1f0c0cf2"
}
