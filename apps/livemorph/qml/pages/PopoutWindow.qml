import QtQuick
import QtQuick.Controls
import QtQuick.Window
import QtMultimedia
import LiveMorph

ApplicationWindow {
    id: root
    title: qsTr("%1 Output").arg(Constants.appName)
    width: 480
    height: 300
    minimumWidth: 480
    minimumHeight: 300
    color: Colors.black
    flags: Qt.Window | Qt.WindowStaysOnTopHint | Qt.FramelessWindowHint
    visible: false

    property point dragOffset

    // Qt 6.12: VideoOutput.videoSink is read-only and each VideoOutput owns
    // its internal sink — feed the output's OWN sink from the peer.
    function bindSink() {
        Session.bindPopoutVideoOutput(videoOut)
    }
    onVisibleChanged: if (visible) bindSink()
    Connections {
        target: Session
        function onPeerVideoSinkChanged() { if (root.visible) root.bindSink() }
        function onPopoutVideoSinkChanged() { if (root.visible) root.bindSink() }
    }

    onClosing: {
        Session.unbindPopoutVideoOutput()
        root.destroy();
    }

    Rectangle {
        anchors.fill: parent
        color: Colors.black
        border.color: Colors.white10
        border.width: 1
        radius: Theme.radiusLg
        clip: true

        Honeycomb {
            anchors.fill: parent
            cellSize: Theme.honeycombCell
            lineColor: Colors.honeycombOnBlack
            opacity: 0.5
        }

        // Hex-tech corner frame on the popout surface
        CornerTicks {
            anchors.fill: parent
            inset: 6
            tickSize: 10
            thickness: 1.5
            color: Colors.white15
        }

        VideoOutput {
            id: videoOut
            anchors.fill: parent
            fillMode: VideoOutput.PreserveAspectFit
            visible: Session.isActive && Session.peerVideoSink !== null
        }
        // (popout sink bound via bindSink above)
        // Feed this output's own sink from the peer's aux-sink fan-out.
        Component.onCompleted: root.bindSink()

        // Empty state
        Column {
            anchors.centerIn: parent
            spacing: 6
            visible: !(Session.isActive && Session.peerVideoSink !== null)

            Item {
                width: 44; height: 44
                anchors.horizontalCenter: parent.horizontalCenter
                Hexagon {
                    anchors.centerIn: parent
                    size: 44
                    lineWidth: 1.5
                    lineColor: Colors.white35
                }
                Image {
                    anchors.centerIn: parent
                    source: "qrc:/assets/livemorph-icon.png"
                    width: 22
                    sourceSize: Qt.size(44, 44)
                    height: 22
                    opacity: 0.4
                    fillMode: Image.PreserveAspectFit
                }
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: qsTr("Waiting for output")
                color: Colors.textMuted
                font.pixelSize: 11
                opacity: 0.45
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: qsTr("Start a morph to begin")
                color: Colors.textMuted
                font.family: Theme.fontMono.family
                font.pixelSize: Theme.fontMicro.pixelSize
                font.letterSpacing: 1.5
            }
        }

        // Title drag bar
        Rectangle {
            anchors.top: parent.top
            anchors.left: parent.left
            anchors.right: parent.right
            height: 28
            color: Colors.raised95
            border.color: Colors.divider
            border.width: 1
            // Top hairline (the outer clip already rounds the corners; no
            // square overlay needed)
            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                height: 1
                color: Colors.insetHighlightSoft
            }

            Row {
                anchors.left: parent.left
                anchors.leftMargin: 12
                anchors.verticalCenter: parent.verticalCenter
                spacing: 6

                Hexagon {
                    size: 9
                    lineWidth: 0
                    fillColor: Session.isActive ? Colors.accent80 : Colors.textMuted
                    anchors.verticalCenter: parent.verticalCenter
                }

                Text {
                    anchors.verticalCenter: parent.verticalCenter
                    text: qsTr("LIVE MORPH OUTPUT")
                    color: Colors.textMuted
                    font.family: Theme.fontMono.family
                    font.pixelSize: Theme.fontMicro.pixelSize
                    font.weight: Font.Bold
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
                color: closeOverlayMa.containsMouse ? Colors.overlay50 : Colors.transparent

                Icon {
                    anchors.centerIn: parent
                    name: "x"
                    size: 12
                    color: closeOverlayMa.containsMouse ? Colors.textPrimary : Colors.textMuted
                    opacity: closeOverlayMa.containsMouse ? 1.0 : 0.5
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
                onPressed: function(m) {
                    root.dragOffset = Qt.point(m.x, m.y)
                }
                onPositionChanged: function(m) {
                    if (pressed) {
                        root.x += m.x - root.dragOffset.x
                        root.y += m.y - root.dragOffset.y
                    }
                }
            }
        }
    }
}
