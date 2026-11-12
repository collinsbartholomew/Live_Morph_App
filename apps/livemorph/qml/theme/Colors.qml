pragma Singleton
import QtQuick

/**
 * LiveMorph "Obsidian Hex" design tokens — pure black/white monochrome canvas
 * with honeycomb line-work as the signature texture. White is the single
 * accent (inverted solid CTAs, hairline borders, hex cells); the only hues
 * left in the system are the functional status semantics (success/warning/
 * error/info) and third-party brand glyphs.
 * Token NAMES are API: never rename, only revalue.
 */
QtObject {
    // Surfaces (layered depth on a true-black canvas, clear luminance ladder)
    readonly property color surfaceBase:         "#000000"
    readonly property color surfaceRaised:       "#0a0a0a"
    readonly property color surfaceRaised40:     "#660a0a0a"
    readonly property color surfaceOverlay:      "#141414"
    readonly property color surfaceElevated:     "#1a1a1a"
    readonly property color surfaceHover:        "#242424"
    readonly property color surfaceFocus:        "#0d0d0d"
    readonly property color surfaceBorder:       "#2a2a2a"
    readonly property color surfaceBorderSubtle: "#1c1c1c"
    readonly property color surfaceBorderStrong: "#404040"
    readonly property color surfaceGlass:        "#141414"
    readonly property color surfaceGlassStrong:  "#0a0a0a"
    // Alpha variants of the surfaces
    readonly property color overlay20:           "#33141414"
    readonly property color overlay30:           "#4d141414"
    readonly property color overlay40:           "#66141414"
    readonly property color overlay50:           "#80141414"
    readonly property color overlay60:           "#99141414"
    readonly property color base20:              "#33000000"
    readonly property color base40:              "#66000000"
    readonly property color base50:              "#80000000"
    readonly property color base70:              "#b3000000"
    readonly property color raised20:            "#330a0a0a"
    readonly property color raised80:            "#cc0a0a0a"
    readonly property color raised95:            "#f20a0a0a"
    readonly property color border20:            "#332a2a2a"
    readonly property color border40:            "#662a2a2a"
    readonly property color border50:            "#992a2a2a"
    readonly property color borderSubtle40:      "#661c1c1c"
    readonly property color borderSubtle50:      "#991c1c1c"

    // Text (AA on surfaceBase: primary 21:1, secondary 12.6:1, muted 5.9:1)
    readonly property color textPrimary:         "#ffffff"
    readonly property color textSecondary:       "#b8b8b8"
    readonly property color textMuted:           "#7f7f7f"
    readonly property color textInverse:         "#000000"
    readonly property color textMuted10:         "#1a7f7f7f"
    readonly property color textMuted20:         "#337f7f7f"
    readonly property color textMuted30:         "#4d7f7f7f"
    readonly property color textMuted40:         "#667f7f7f"
    readonly property color textMuted50:         "#807f7f7f"
    readonly property color textMuted60:         "#997f7f7f"
    readonly property color textMuted70:         "#b37f7f7f"

    // Brand: the identity IS monochrome — white on black (gradient-stop names
    // kept for API; values are a white→grey monochrome ramp).
    readonly property color brandA:              "#ffffff"
    readonly property color brandB:              "#d4d4d4"
    readonly property color brandC:              "#8a8a8a"

    // Third-party brand glyph colors (logos only, not theme)
    readonly property color brandGoogle:         "#4285F4"
    readonly property color brandGoogleBorder:   "#664285f4"
    readonly property color brandTwitch:         "#9146FF"
    readonly property color brandKick:           "#53FC18"

    // Accent (white identity; solid-white CTAs carry black text on top)
    readonly property color accent:              "#ffffff"
    readonly property color accentIndigo:        "#e5e5e5"
    readonly property color accentHover:         "#ffffff"
    readonly property color accentPressed:       "#a3a3a3"
    readonly property color accentMuted:         "#29ffffff"
    readonly property color accent06:            "#0fffffff"
    readonly property color accent10:            "#1affffff"
    readonly property color accent12:            "#1fffffff"
    readonly property color accent15:            "#26ffffff"
    readonly property color accent20:            "#33ffffff"
    readonly property color accent25:            "#40ffffff"
    readonly property color accent30:            "#4dffffff"
    readonly property color accent40:            "#66ffffff"
    readonly property color accent45:            "#73ffffff"
    readonly property color accent50:            "#80ffffff"
    readonly property color accent55:            "#8cffffff"
    readonly property color accent60:            "#99ffffff"
    readonly property color accent70:            "#b3ffffff"
    readonly property color accent80:            "#ccffffff"
    readonly property color accent85:            "#d9ffffff"

    // Semantic (functional status hues kept tiny; everything else is B/W)
    readonly property color statusSuccess:       "#34d399"
    readonly property color statusSuccessMuted:  "#2234d399"
    readonly property color statusSuccess08:     "#1434d399"
    readonly property color statusSuccess10:     "#1a34d399"
    readonly property color statusSuccess15:     "#2634d399"
    readonly property color statusSuccess30:     "#4d34d399"
    readonly property color statusSuccess50:     "#8034d399"
    readonly property color statusSuccess80:     "#cc34d399"
    readonly property color statusSuccess85:     "#d934d399"
    readonly property color statusWarning:       "#fbbf24"
    readonly property color statusWarning05:     "#0dfbbf24"
    readonly property color statusWarning06:     "#0afbbf24"
    readonly property color statusWarning10:     "#1afbbf24"
    readonly property color statusWarning20:     "#33fbbf24"
    readonly property color statusWarning30:     "#4dfbbf24"
    readonly property color statusWarning40:     "#66fbbf24"
    readonly property color warning:             "#fbbf24" // legacy shorthand
    readonly property color statusWarningMuted:  "#22fbbf24"
    readonly property color statusError:         "#fb7185"
    readonly property color statusErrorMuted:    "#22fb7185"
    readonly property color statusError05:       "#0dfb7185"
    readonly property color statusError10:       "#1afb7185"
    readonly property color statusError20:       "#33fb7185"
    readonly property color statusError30:       "#4dfb7185"
    readonly property color statusError40:       "#66fb7185"
    readonly property color statusError60:       "#99fb7185"
    readonly property color statusError80:       "#ccfb7185"
    readonly property color statusError85:       "#d9fb7185"
    readonly property color statusInfo:          "#38bdf8"
    readonly property color statusInfoMuted:     "#2238bdf8"

    // Faint semantic fills
    readonly property color successFaintBg:       "#0d34d399"
    readonly property color successFaintBorder:   "#4034d399"
    readonly property color warningFaintBg:       "#0dfbbf24"
    readonly property color warningFaintBorder:   "#40fbbf24"
    readonly property color errorFaintBg:         "#1afb7185"
    readonly property color errorFaintBorder:     "#4dfb7185"
    readonly property color errorSoftBg:          "#26fb7185"

    // Dashboard banner strips
    readonly property color warningBannerBg:     "#1a1a12"
    readonly property color errorBannerBg:       "#1a0d0d"

    // Plan tier badges (monochrome ladder: pro = solid white, then grey steps)
    readonly property color tierProBg:            "#ffffff"
    readonly property color tierProBorder:        "#ffffff"
    readonly property color tierProText:          "#000000"
    readonly property color tierMidBg:            "#33d4d4d4"
    readonly property color tierMidBorder:        "#66d4d4d4"
    readonly property color tierMidText:          "#d4d4d4"
    readonly property color tierStarterBg:        "#26a3a3a3"
    readonly property color tierStarterBorder:    "#4da3a3a3"
    readonly property color tierStarterText:      "#a3a3a3"
    readonly property color tierBasicBg:          "#1a8a8a8a"
    readonly property color tierBasicBorder:      "#338a8a8a"
    readonly property color tierBasicText:        "#8a8a8a"

    // Text selection
    readonly property color selectionBg:           "#66ffffff"
    readonly property color selectionText:         "#000000"

    // Destructive / on-accent (danger = inverted white in this monochrome system)
    readonly property color danger:              "#ffffff"
    readonly property color dangerHover:         "#d4d4d4"
    readonly property color dangerPressed:       "#a3a3a3"
    readonly property color dangerMuted:         "#29ffffff"
    readonly property color textOnAccent:        "#000000"

    // Utility
    readonly property color white:               "#ffffff"
    readonly property color black:               "#000000"
    readonly property color transparent:         "transparent"

    // Glows (white alpha halo used sparingly on CTA / live stage / selected card)
    readonly property color glowAccent:          "#4dffffff"
    readonly property color glowAccentStrong:    "#80ffffff"
    readonly property color glowAccentCta:       "#66ffffff"
    readonly property color glowCyan:            "#33ffffff"
    readonly property color overlayScrim:        "#a6000000"
    readonly property color overlayScrimSoft:    "#66000000"

    // Focus + elevation. Depth = layered alpha rects + fills + 1px borders
    // (motion stays banned, see Theme).
    readonly property color focusRing:           "#80ffffff"
    readonly property color shadowFaint:         "#1a000000"
    readonly property color shadowTip:           "#40000000"
    readonly property color shadowKnob:          "#59000000"
    readonly property color shadowSoft:          "#59000000"
    readonly property color shadow:              "#73000000"
    readonly property color shadowStrong:        "#8c000000"
    readonly property color shadowDeep:          "#a6000000"
    readonly property color scrim:               "#a6000000"
    readonly property color scrimMid:            "#c2000000"
    readonly property color scrimHeavy:          "#d9000000"
    readonly property color black70:             "#d9000000"

    readonly property color insetHighlight:      "#1affffff"
    readonly property color insetHighlightSoft:  "#0affffff"
    readonly property color white03:             "#08ffffff"
    readonly property color white06:             "#0fffffff"
    readonly property color white10:             "#1affffff"
    readonly property color white15:             "#26ffffff"
    readonly property color white35:             "#59ffffff"
    readonly property color white40:             "#66ffffff"
    readonly property color white65:             "#a6ffffff"
    readonly property color white90:             "#e6ffffff"
    readonly property color white95:             "#f2ffffff"
    readonly property color divider:             "#0dffffff"

    // Toast card fills (info neutral, success/warning/error keep faint semantics)
    readonly property color toastInfoBg:         "#f20d0d0d"
    readonly property color toastSuccessBg:      "#f20a1f18"
    readonly property color toastWarningBg:      "#f2231a08"
    readonly property color toastErrorBg:        "#f21f0c0c"

    // ── Honeycomb texture tokens (signature pattern; see Honeycomb.qml) ──
    readonly property color honeycombLine:        "#12ffffff"
    readonly property color honeycombLineStrong:  "#2effffff"
    readonly property color honeycombLineFaint:   "#0affffff"
    readonly property color honeycombFill:        "#06ffffff"
    readonly property color honeycombCell:        "#ffffff"   // single highlighted cell
    readonly property color honeycombCellBg:      "#141414"
    readonly property color honeycombOnBlack:     "#1affffff" // lines over pure black
}
