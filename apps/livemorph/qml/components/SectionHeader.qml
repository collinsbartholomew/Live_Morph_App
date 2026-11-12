import QtQuick
import LiveMorph

/**
 * SectionHeader — eyebrow section title for the Obsidian Hex design: a small
 * hexagon glyph followed by an uppercase tracked label and a hairline rule
 * that runs to the right edge. Replaces ad-hoc label rows in drawers/panels.
 */
Item {
    id: root

    property string text: ""
    property color labelColor: Colors.textMuted
    property color lineColor: Colors.surfaceBorderSubtle
    property color hexColor: Colors.textPrimary

    implicitHeight: 20

    Row {
        id: labelRow
        anchors.left: parent.left
        anchors.verticalCenter: parent.verticalCenter
        spacing: Theme.spacingSm

        Hexagon {
            size: 10
            lineColor: root.hexColor
            lineWidth: 1.5
            anchors.verticalCenter: parent.verticalCenter
        }

        Text {
            text: root.text.toUpperCase()
            color: root.labelColor
            font: Theme.fontLabel
            anchors.verticalCenter: parent.verticalCenter
        }
    }

    Rectangle {
        anchors.left: labelRow.right
        anchors.leftMargin: Theme.spacingSm
        anchors.right: parent.right
        anchors.verticalCenter: parent.verticalCenter
        height: 1
        color: root.lineColor
    }
}
