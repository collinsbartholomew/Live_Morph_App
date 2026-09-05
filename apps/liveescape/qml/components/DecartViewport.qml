import LiveEscape
import QtCore
import QtMultimedia
import QtQuick
import QtQuick.Controls

/**
 * Stage surface for Decart realtime.
 *
 * Layers:
 *   1. Local camera (always available)
 *   2. DecartPeer video (GStreamer webrtcbin receive)
 *   3. Freeze overlay
 *   4. Status HUD / local PiP badge
 */
Item {
    id: root

    property string signalingWsUrl: Stream.signalingUrl
    property string userId: Session.userId
    property string accessKey: Session.accessKey
    property string model: "lucy-2.5"
    property bool active: false
    property bool showLocalPip: true
    property string stageFillMode: "cover"
    // OBS source mode: "camera" | "ai" | "both"
    property string obsMode: "camera"
    // Whether AI output is being recorded alongside local camera
    property bool recordAi: false

    function toggleAiRecording() {
        recordAi = !recordAi;
    }

    // Qt 6: Camera is driven by the `active` property (bound above); no start()/stop()
    Component.onDestruction: {
        cam.active = false;
    }

    MediaRecorder {
        id: mediaRecorder

        quality: MediaRecorder.HighQuality
        outputLocation: ""
        onRecorderStateChanged: {
            if (recorderState === MediaRecorder.StoppedState && outputLocation.toString().length)
                Stream.onFrameGrabbed(outputLocation.toString().replace("file://", ""), "mp4");

        }
        onErrorOccurred: function(error, errorString) {
            console.warn("MediaRecorder error", errorString);
        }
    }

    CaptureSession {
        id: capture

        recorder: mediaRecorder
        videoOutput: previewOut

        camera: Camera {
            id: cam

            // Camera only runs when a session is live/connecting/frozen — no idle capture.
            active: root.visible && (Stream.live || Stream.connecting || Stream.frozen)
            onErrorOccurred: function(error, msg) {
                console.warn("Camera error:", error, msg);
            }
        }

    }

    Rectangle {
        anchors.fill: parent
        color: "#05050c"
        radius: 6
        border.color: (Decart.generating || Stream.live) ? Theme.teal : Theme.goldDim
        border.width: 1
        clip: true

        // ── Layer 1: local camera ─────────────────────────
        VideoOutput {
            id: previewOut

            anchors.fill: parent
            anchors.margins: 1
            fillMode: root.stageFillMode === "contain" ? VideoOutput.PreserveAspectFit : VideoOutput.PreserveAspectCrop
            visible: !Stream.frozen && !(webPeer.available && webPeer.loaded && Stream.live)
            opacity: Stream.live ? 0.9 : 1
            z: 1
        }

        // ── Layer 2: native GStreamer AI peer (replaces WebEngine) ──────
        VideoOutput {
            id: aiVideoOut

            anchors.fill: parent
            anchors.margins: 1
            fillMode: root.stageFillMode === "contain" ? VideoOutput.PreserveAspectFit : VideoOutput.PreserveAspectCrop
            visible: Stream.peerVideoSink !== null && Stream.live && !Stream.frozen
            z: 2
        }

        // ── Connections to bind VideoOutput to GstRtcPeer videoSink ──
        Connections {
            target: Stream

            function onPeerVideoSinkChanged() {
                if (Stream.peerVideoSink !== null)
                    aiVideoOut.videoOutput = Stream.peerVideoSink;
            }
        }

        Component.onCompleted: {
            if (Stream.peerVideoSink !== null)
                aiVideoOut.videoOutput = Stream.peerVideoSink;
        }

        // ── Layer 3: real freeze frame ────────────────────
        Image {
            anchors.fill: parent
            anchors.margins: 1
            visible: Stream.frozen && Stream.lastFramePath.length > 0
            source: Stream.lastFramePath.length > 0 ? ("file://" + Stream.lastFramePath) : ""
            fillMode: root.stageFillMode === "contain" ? Image.PreserveAspectFit : Image.PreserveAspectCrop
            z: 4
        }

        Rectangle {
            anchors.fill: parent
            anchors.margins: 1
            visible: Stream.frozen
            color: Stream.lastFramePath.length > 0 ? "transparent" : "#0a0a14"
            border.color: Theme.gold
            border.width: 2
            z: 5

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                anchors.top: parent.top
                anchors.topMargin: 10
                text: "❄ FROZEN"
                color: Theme.gold
                font.family: Theme.fontUi
                font.pixelSize: 14
                font.bold: true
                font.letterSpacing: 2
            }

        }

        // ── Layer 4: status HUD ───────────────────────────
        Column {
            anchors.centerIn: parent
            spacing: 10
            z: 3
            visible: !Stream.frozen && !(aiVideoOut.visible) && (!Stream.live || Decart.generating || !Decart.connected)

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: Decart.generating ? "◉" : (Stream.live || Decart.connected ? "◈" : "○")
                color: Decart.generating ? Theme.teal : (Stream.live ? Theme.gold : Theme.dim)
                font.pixelSize: 36
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: {
                    if (Decart.generating)
                        return "AI OUTPUT LIVE";

                    if (aiVideoOut.visible)
                        return "AI VIDEO ACTIVE";

                    if (Decart.connected)
                        return "SIGNALING CONNECTED — NEGOTIATING MEDIA";

                    if (Stream.connecting)
                        return "CONNECTING…";

                    if (Stream.live)
                        return "SESSION LIVE — AWAITING GENERATION";

                    return "CAMERA READY — PRESS CONNECT";
                }
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 11
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                visible: Decart.sessionId.length > 0
                text: "session " + Decart.sessionId
                color: Theme.teal
                font.family: Theme.fontMono
                font.pixelSize: 9
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                visible: Decart.lastError.length > 0
                width: Math.min(root.width - 24, 360)
                wrapMode: Text.WordWrap
                horizontalAlignment: Text.AlignHCenter
                text: Decart.lastError
                color: Theme.red
                font.family: Theme.fontMono
                font.pixelSize: 10
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                visible: Stream.live && !aiVideoOut.visible
                width: Math.min(root.width - 32, 380)
                wrapMode: Text.WordWrap
                horizontalAlignment: Text.AlignHCenter
                text: "AI peer starting — check connection status above"
                color: Theme.dim2
                font.family: Theme.fontMono
                font.pixelSize: 9
            }

        }

        // Local PiP badge
        Rectangle {
            visible: root.showLocalPip && Stream.live && !Stream.frozen
            anchors.right: parent.right
            anchors.bottom: parent.bottom
            anchors.margins: 12
            width: 148
            height: 84
            radius: 6
            color: "#000000"
            border.color: Theme.border
            border.width: 1
            z: 6
            clip: true

            Rectangle {
                anchors.fill: parent

                gradient: Gradient {
                    GradientStop {
                        position: 0
                        color: "#1a1a28"
                    }

                    GradientStop {
                        position: 1
                        color: "#0a0a12"
                    }

                }

            }

            Column {
                anchors.centerIn: parent
                spacing: 4

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: aiVideoOut.visible ? "AI + LOCAL" : "LOCAL CAM"
                    color: Theme.gold
                    font.family: Theme.fontMono
                    font.pixelSize: 10
                    font.letterSpacing: 1
                }

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: Stream.connectionQuality
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 9
                }

            }

        }

        // Live border
        Rectangle {
            anchors.fill: parent
            radius: 6
            color: "transparent"
            border.color: Stream.live ? Theme.teal : "transparent"
            border.width: Stream.live ? 2 : 0
            opacity: 0.45
            z: 10
            visible: Stream.live && !Stream.frozen
        }

    }

    Connections {
        function onFrameGrabRequested(purpose) {
            var dest = App.captureImagePath(purpose);
            root.grabToImage(function(result) {
                var ok = result.saveToFile(dest);
                Stream.onFrameGrabbed(ok ? dest : "", purpose);
            });
        }

        function onRecordingChanged() {
            if (Stream.recording) {
                var dest = App.recordingPath();
                mediaRecorder.outputLocation = "file://" + dest;
                try {
                    mediaRecorder.record();
                    Stream.onFrameGrabbed(dest, "mp4");
                } catch (e) {
                    console.warn("MediaRecorder.record failed, using PNG sequence", e);
                }
            } else {
                try {
                    mediaRecorder.stop();
                } catch (e) {
                }
            }
        }

        function onLiveChanged() {
            // Native peer lifecycle managed by StreamController

        }

        target: Stream
    }

}
