import QtQuick
import QtQuick.Controls
import QtQuick.Window
import QtMultimedia
import LiveMorph

ApplicationWindow {
    id: root
    title: "LiveMorph Overlay"
    width: 320
    height: 240
    minimumWidth: 200
    minimumHeight: 150
    color: "#000000"
    flags: Qt.Window | Qt.WindowStaysOnTopHint | Qt.FramelessWindowHint
    visible: false

    property point dragOffset

    Rectangle {
        anchors.fill: parent
        color: "#0a0a0e"
        border.color: Colors.accent + "66"
        border.width: 1
        radius: 8
        clip: true

        VideoOutput {
            id: videoOut
            anchors.fill: parent
            anchors.margins: 2
            fillMode: VideoOutput.PreserveAspectCrop
            visible: Session.isActive && Session.peerVideoSink !== null
        }
        Binding {
            target: videoOut
            property: "videoSink"
            value: Session.peerVideoSink
            when: Session.peerVideoSink !== null && root.visible
        }

        Text {
            anchors.centerIn: parent
            text: Session.isActive ? "" : "Start a morph to show output"
            color: Colors.textMuted
            font.pixelSize: 12
            visible: !Session.isActive
        }

        // Title drag bar
        Rectangle {
            anchors.top: parent.top
            anchors.left: parent.left
            anchors.right: parent.right
            height: 24
            color: "#000000b3"
            radius: 8

            Text {
                anchors.left: parent.left
                anchors.leftMargin: 8
                anchors.verticalCenter: parent.verticalCenter
                text: Session.isActive ? "LIVE OVERLAY" : "OVERLAY"
                color: Session.isActive ? Colors.statusError : Colors.textSecondary
                font.pixelSize: 10
                font.weight: Font.Bold
                font.family: "monospace"
            }

            Text {
                anchors.right: parent.right
                anchors.rightMargin: 8
                anchors.verticalCenter: parent.verticalCenter
                text: "✕"
                color: Colors.textMuted
                font.pixelSize: 12
                MouseArea {
                    anchors.fill: parent
                    anchors.margins: -4
                    cursorShape: Qt.PointingHandCursor
                    onClicked: root.close()
                }
            }

            MouseArea {
                anchors.fill: parent
                anchors.rightMargin: 28
                property point start
                onPressed: function(m) {
                    start = Qt.point(m.x, m.y)
                }
                onPositionChanged: function(m) {
                    if (pressed) {
                        root.x += m.x - start.x
                        root.y += m.y - start.y
                    }
                }
            }
        }
    }
}
