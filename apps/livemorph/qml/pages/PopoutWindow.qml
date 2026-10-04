import QtQuick
import QtQuick.Controls
import QtQuick.Window
import QtMultimedia
import LiveMorph

ApplicationWindow {
    id: root
    title: "MorphMe Output"
    width: 480
    height: 300
    minimumWidth: 200
    minimumHeight: 150
    color: "#000000"
    flags: Qt.Window | Qt.WindowStaysOnTopHint | Qt.FramelessWindowHint
    visible: false

    property point dragOffset

    onClosing: {
        root.destroy();
    }

    Rectangle {
        anchors.fill: parent
        color: "#000000"
        border.color: "#ffffff1a"
        border.width: 1
        radius: Theme.radiusXl
        clip: true

        VideoOutput {
            id: videoOut
            anchors.fill: parent
            fillMode: VideoOutput.PreserveAspectCrop
            visible: Session.isActive && Session.peerVideoSink !== null
        }
        Binding {
            target: videoOut
            property: "videoSink"
            value: Session.peerVideoSink
            when: Session.peerVideoSink !== null && root.visible
        }

        // Empty state
        Column {
            anchors.centerIn: parent
            spacing: 6
            visible: !Session.isActive

            Image {
                anchors.horizontalCenter: parent.horizontalCenter
                source: "qrc:/assets/livemorph-icon.png"
                width: 36
                height: 36
                opacity: 0.25
                fillMode: Image.PreserveAspectFit
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: "Waiting for output"
                color: Colors.textMuted
                font.pixelSize: 11
                opacity: 0.45
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: "Start a morph to begin"
                color: Colors.textMuted
                font.pixelSize: 8
                font.family: Theme.fontMono.family
                font.letterSpacing: 1.5
                opacity: 0.25
            }
        }

        // Title drag bar
        Rectangle {
            anchors.top: parent.top
            anchors.left: parent.left
            anchors.right: parent.right
            height: 28
            color: Colors.surfaceRaised + "f2"
            border.color: "#ffffff0d"
            border.width: 1

            // Round top corners only
            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                height: Theme.radiusLg
                color: parent.color
            }

            Row {
                anchors.left: parent.left
                anchors.leftMargin: 12
                anchors.verticalCenter: parent.verticalCenter
                spacing: 6

                Rectangle {
                    width: 6
                    height: 6
                    radius: 3
                    color: Session.isActive ? Colors.accent + "cc" : Colors.textMuted
                    anchors.verticalCenter: parent.verticalCenter
                }

                Text {
                    anchors.verticalCenter: parent.verticalCenter
                    text: "LIVE MORPH OUTPUT"
                    color: Colors.textMuted
                    font.pixelSize: 9
                    font.family: Theme.fontMono.family
                    font.letterSpacing: 1.5
                }
            }

            Rectangle {
                width: 24
                height: 24
                radius: Theme.radiusSm
                anchors.right: parent.right
                anchors.rightMargin: 6
                anchors.verticalCenter: parent.verticalCenter
                color: closeOverlayMa.containsMouse ? Colors.dangerMuted : "transparent"

                Icon {
                    anchors.centerIn: parent
                    name: "x"
                    size: 12
                    color: Colors.textMuted
                    opacity: 0.5
                }

                MouseArea {
                    id: closeOverlayMa
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: root.close()
                }
            }

            MouseArea {
                anchors.fill: parent
                anchors.rightMargin: 32
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
