import QtQuick
import QtQuick.Layouts
import LiveMorph

/**
 * EmptyState — the shared zero/empty state for the Obsidian Hex UI:
 * faint honeycomb wash + hex badge + title + body + optional action button.
 * Used by the notification inbox, character library, downloads list and the
 * catalog load/error state (with a Retry action).
 * API: iconName, title, body, actionText (empty = no button), honeycomb.
 * signal action() fires the button.
 */
Item {
    id: root

    property string iconName: ""
    property string title: ""
    property string body: ""
    property string actionText: ""
    property bool honeycomb: true
    property int badgeSize: 48
    signal action()

    implicitHeight: col.implicitHeight + 32
    clip: true

    Honeycomb {
        visible: root.honeycomb
        anchors.fill: parent
        cellSize: Theme.honeycombCell
        lineColor: Colors.honeycombLineFaint
        opacity: 0.5
        sparkleEvery: 29
        sparkleAlpha: 0.06
    }

    ColumnLayout {
        id: col
        anchors.centerIn: parent
        width: Math.min(300, parent.width - 48)
        spacing: 10

        HexBadge {
            size: root.badgeSize
            iconName: root.iconName
            iconSize: 20
            lineWidth: 1.5
            lineColor: Colors.accent20
            fillColor: Colors.accent10
            iconColor: Colors.accent
            Layout.alignment: Qt.AlignHCenter
        }

        Text {
            Layout.fillWidth: true
            horizontalAlignment: Text.AlignHCenter
            wrapMode: Text.WordWrap
            text: root.title
            color: Colors.textSecondary
            font.pixelSize: 13
            font.weight: Font.Bold
        }

        Text {
            visible: root.body.length > 0
            Layout.fillWidth: true
            horizontalAlignment: Text.AlignHCenter
            wrapMode: Text.WordWrap
            text: root.body
            color: Colors.textMuted
            font.pixelSize: 11
            lineHeight: 1.45
        }

        SecondaryButton {
            visible: root.actionText.length > 0
            Layout.alignment: Qt.AlignHCenter
            Layout.topMargin: 6
            text: root.actionText
            onClicked: root.action()
        }
    }
}
