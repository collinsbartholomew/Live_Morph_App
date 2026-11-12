import QtMultimedia
import LiveMorph
import QtQuick

/**
 * Morph surface host — native GStreamer WebRTC peer renders AI output here.
 */
Item {
    id: root

    property bool active: false

    Rectangle {
        anchors.fill: parent
        color: Colors.surfaceBase
        visible: !aiVideoOut.visible

        // Honeycomb texture under the connecting overlay / idle stage
        Honeycomb {
            anchors.fill: parent
            cellSize: Theme.honeycombCellLg
            lineColor: Colors.honeycombOnBlack
            opacity: Theme.honeycombBgOpacity
            focusX: width / 2
            focusY: height / 2
            fadeRadius: Math.max(width, height) * 0.8
            sparkleEvery: 25
            sparkleAlpha: 0.06
        }
   }

    VideoOutput {
        id: aiVideoOut

        anchors.fill: parent
        visible: root.active && Session.peerVideoSink !== null
        fillMode: VideoOutput.PreserveAspectCrop
    }

    // Qt 6.12: VideoOutput.videoSink is read-only and each VideoOutput owns
    // its internal sink — an external sink can never be attached TO an
    // output. The working direction is to hand the output's OWN sink to the
    // peer, which feeds it via its aux-sink fan-out.
    function bindStage() {
        Session.bindStageVideoOutput(aiVideoOut)
    }
    Connections {
        target: Session

        function onPeerVideoSinkChanged() {
            bindStage()
        }
    }

    Component.onCompleted: bindStage()
    Component.onDestruction: Session.unbindStageVideoOutput()

}
