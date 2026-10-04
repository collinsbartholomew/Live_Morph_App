import LiveEscape
import QtQuick
import QtQuick.Layouts

Rectangle {
    id: root

    property bool live: false
    property bool connecting: false
    property bool error: false
    property string label: live ? "LIVE" : (connecting ? "CONNECTING" : (error ? "ERROR" : "OFFLINE"))

    implicitWidth: row.implicitWidth + 18
    implicitHeight: 24
    radius: Theme.radiusFull
    color: Theme.s2
    border.color: Theme.border
    border.width: 1

    RowLayout {
        id: row

        anchors.centerIn: parent
        spacing: 8

        Rectangle {
            width: 7
            height: 7
            radius: 3.5
            Layout.alignment: Qt.AlignVCenter
            color: root.live ? Theme.teal : (root.error ? Theme.red : (root.connecting ? Theme.gold : Theme.dim))
            SequentialAnimation on opacity {
                running: (root.live || root.connecting) && Qt.application.state === Qt.ApplicationActive
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

            Rectangle {
                anchors.centerIn: parent
                width: parent.width + 8
                height: parent.height + 8
                radius: (parent.width + 8) / 2
                color: "transparent"
                border.color: root.live ? Theme.teal : "transparent"
                border.width: 1
                opacity: 0.4
                visible: root.live
            }
        }

        Text {
            text: root.label
            color: root.live ? Theme.teal : (root.error ? Theme.red : (root.connecting ? Theme.gold : Theme.dim))
            font.family: Theme.fontMono
            font.pixelSize: 10
            font.letterSpacing: 1.5
            Layout.alignment: Qt.AlignVCenter
        }
    }
}
