import LiveEscape
import QtQuick

Rectangle {
    id: root

    property bool live: false
    property string label: live ? "LIVE" : "OFFLINE"

    implicitWidth: row.implicitWidth + 18
    implicitHeight: 28
    radius: Theme.radiusFull
    color: live ? Theme.tealDim : Theme.s2
    border.color: live ? Theme.teal : Theme.border
    border.width: 1

    Row {
        id: row

        anchors.centerIn: parent
        spacing: 8

    Rectangle {
        width: 7
        height: 7
        radius: 3.5
        anchors.verticalCenter: parent.verticalCenter
        color: root.live ? Theme.teal : Theme.dim
        scale: root.live ? 1.0 : 1.0
        SequentialAnimation on opacity {
            running: root.live && Qt.application.state === Qt.ApplicationActive
            loops: Animation.Infinite

            NumberAnimation {
                to: 0.3
                duration: 800
            }

            NumberAnimation {
                to: 1
                duration: 800
            }

        }
        NumberAnimation on scale {
            from: 1.0; to: 1.4; duration: 900; loops: Animation.Infinite
            running: root.live && Qt.application.state === Qt.ApplicationActive
        }

    }

        Text {
            text: root.label
            color: root.live ? Theme.teal : Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 10
            font.letterSpacing: 1.2
            font.weight: Font.DemiBold
            anchors.verticalCenter: parent.verticalCenter
        }

    }

}
