import LiveMorph
import QtMultimedia
import QtQuick

/**
 * Morph surface host — native GStreamer WebRTC peer renders AI output here.
 */
Item {
    id: root

    property bool active: false

    Rectangle {
        anchors.fill: parent
        color: "#050508"
        visible: !aiVideoOut.visible

        Column {
            anchors.centerIn: parent
            spacing: 10
            width: parent.width * 0.85

            Text {
                text: {
                    if (Session.isActive && Session.peerVideoSink !== null)
                        return "Connecting morph…";

                    if (Session.isActive)
                        return "Connecting…";

                    return "Morph Stage";
                }
                color: Colors.accent
                font.pixelSize: 14
                font.weight: Font.DemiBold
                anchors.horizontalCenter: parent.horizontalCenter
            }

            Text {
                width: parent.width
                wrapMode: Text.Wrap
                horizontalAlignment: Text.AlignHCenter
                text: Session.isActive ? "GStreamer WebRTC · native media path" : "Press Start to begin morphing"
                color: Colors.textMuted
                font.pixelSize: 12
                lineHeight: 1.35
            }

        }

    }

    VideoOutput {
        id: aiVideoOut

        anchors.fill: parent
        visible: Session.peerVideoSink !== null && Session.isActive
        fillMode: VideoOutput.PreserveAspectCrop
    }

    Connections {
        target: Session

        function onPeerVideoSinkChanged() {
            if (Session.peerVideoSink !== null)
                aiVideoOut.videoSink = Session.peerVideoSink;
        }
    }

    Component.onCompleted: {
        if (Session.peerVideoSink !== null)
            aiVideoOut.videoSink = Session.peerVideoSink;
    }

}
