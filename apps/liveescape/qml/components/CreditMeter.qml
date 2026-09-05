import QtQuick
import LiveEscape

Rectangle {
    id: root
    property int used: 0
    property int remaining: 0

    implicitWidth: row.implicitWidth + 24
    implicitHeight: 26
    radius: 6
    color: Theme.s2
    border.color: Theme.border
    border.width: 1

    Row {
        id: row
        anchors.centerIn: parent
        spacing: 10

        Text {
            id: usedTxt
            text: "USED  " + Math.floor(root.used) + " CR"
            color: Theme.red
            font.family: Theme.fontMono
            font.pixelSize: 9
            font.letterSpacing: 1
            scale: 1
            SequentialAnimation on scale {
                running: root.usedChanged
                loops: 1
                NumberAnimation { to: 1.15; duration: 120 }
                NumberAnimation { to: 1.0; duration: 120 }
            }
        }
        Rectangle { width: 1; height: 10; color: Theme.border; anchors.verticalCenter: parent.verticalCenter }
        Text {
            text: "LEFT  " + (root.remaining >= 0 ? Math.floor(root.remaining) : "—") + " CR"
            color: Theme.teal
            font.family: Theme.fontMono
            font.pixelSize: 9
            font.letterSpacing: 1
        }
    }
}
