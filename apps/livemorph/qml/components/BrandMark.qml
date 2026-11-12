import QtQuick
import LiveMorph

/**
 * BrandMark — the Obsidian Hex monogram: a layered hex cell (outer outline +
 * inner solid hex + letter glyph). This is THE brand mark used in the title
 * bar, auth screen, lock screen, maintenance overlay and empty states —
 * always this component, never an inline hex+text copy.
 * API: size (outer hex width), letter ("LM"), plus color overrides.
 * Static geometry, no animation (motion banned project-wide).
 */
Item {
    id: root

    property int size: 32
    property string letter: "LM"
    property color lineColor: Colors.accent
    property color fillColor: Colors.accent
    property color letterColor: Colors.textOnAccent
    property real lineWidth: 1.5

    width: size
    height: size * Math.sqrt(3) / 2 + lineWidth
    implicitWidth: width
    implicitHeight: height

    // Outer outline cell
    Hexagon {
        anchors.centerIn: parent
        size: root.size
        lineWidth: root.lineWidth
        lineColor: root.lineColor
        fillColor: Colors.transparent
    }
    // Inner solid cell (86% — leaves a crisp gap ring)
    Hexagon {
        anchors.centerIn: parent
        size: root.size * 0.86
        lineWidth: 0
        fillColor: root.fillColor
    }
    Text {
        anchors.centerIn: parent
        text: root.letter
        color: root.letterColor
        font.family: Theme.fontUi.family
        font.pixelSize: Math.max(8, root.size * 0.3)
        font.weight: Font.Bold
        font.letterSpacing: root.size * 0.02
    }
}
