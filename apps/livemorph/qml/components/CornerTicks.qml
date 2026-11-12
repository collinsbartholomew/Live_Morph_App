import QtQuick
import LiveMorph

/**
 * CornerTicks — the Obsidian Hex "target frame" motif: four L-shaped corner
 * brackets inset into a parent's corners (stage box, CTA, selected cards,
 * modal/dialog panels, toasts on hover). Pure geometry, static (motion is
 * banned project-wide).
 *
 * Usage:
 *   CornerTicks { anchors.fill: parent; color: Colors.accent40 }
 */
Item {
    id: root

    property int tickSize: 7      // arm length of each L
    property real thickness: 1.5
    property color color: Colors.accent40
    property real inset: 8

    Repeater {
        model: 4
        Rectangle {
            readonly property int pos: index // 0=TL 1=TR 2=BL 3=BR
            width: root.tickSize
            height: root.thickness
            color: root.color
            x: (pos % 2 === 0) ? root.inset : root.width - root.inset - root.tickSize
            y: (pos < 2) ? root.inset : root.height - root.inset - root.thickness
        }
    }
    Repeater {
        model: 4
        Rectangle {
            readonly property int pos: index
            width: root.thickness
            height: root.tickSize
            color: root.color
            x: (pos % 2 === 0) ? root.inset : root.width - root.inset - root.thickness
            y: (pos < 2) ? root.inset : root.height - root.inset - root.tickSize
        }
    }
}
