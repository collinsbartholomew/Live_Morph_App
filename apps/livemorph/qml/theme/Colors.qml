pragma Singleton
import QtQuick

/**
 * LiveMorph 2026 design tokens — deep graphite + violet accent, glass-friendly.
 */
QtObject {
    // Surfaces (layered depth)
    readonly property color surfaceBase:         "#07070b"
    readonly property color surfaceRaised:       "#0e0e14"
    readonly property color surfaceOverlay:      "#14141c"
    readonly property color surfaceElevated:     "#1a1a24"
    readonly property color surfaceHover:        "#1f1f2c"
    readonly property color surfaceBorder:       "#2a2a38"
    readonly property color surfaceBorderSubtle: "#2a2a3866"
    readonly property color surfaceGlass:        "#14141ccc"
    readonly property color surfaceGlassStrong:  "#0e0e14e6"

    // Text
    readonly property color textPrimary:         "#f4f4f8"
    readonly property color textSecondary:       "#a8a8bc"
    readonly property color textMuted:           "#6e6e86"
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

    // Semantic
    readonly property color statusSuccess:       "#34d399"
    readonly property color statusSuccessMuted:  "#34d39922"
    readonly property color statusWarning:       "#fbbf24"
    readonly property color statusWarningMuted:  "#fbbf2422"
    readonly property color statusError:         "#f87171"
    readonly property color statusErrorMuted:    "#f8717122"
    readonly property color statusInfo:          "#60a5fa"
    readonly property color statusInfoMuted:     "#60a5fa22"

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
    readonly property color overlayScrim:        "#000000cc"
    readonly property color overlayScrimSoft:    "#00000099"

    // Focus + elevation (single-source shadows replace hand-rolled glows)
    readonly property color focusRing:           "#8b5cf699"
    readonly property color shadow:              "#00000059"
    readonly property color shadowStrong:        "#00000099"

    readonly property color insetHighlight:      "#ffffff12"
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
