import LiveEscape
import QtCore
import QtMultimedia
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

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
    // True while a snapshot/freeze grab is in flight — HUD overlays hide so
    // captures contain ONLY the video content (Electron draws just the
    // <video> element to its snapshot canvas).
    property bool grabbing: false

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
            App.toast("Recording failed: " + errorString, "error");
        }
    }

    CaptureSession {
        id: capture

        recorder: mediaRecorder
        videoOutput: previewOut

        camera: Camera {
            id: cam

            // Camera only runs when a session is live/connecting/frozen — no idle capture.
            // Force 1280x720@30 to match the Electron capture spec
            // (getUserMedia { width:ideal:1280, height:ideal:720, frameRate:max:30 }).
            active: root.visible && (Stream.live || Stream.connecting || Stream.frozen)
            cameraFormat: _pickCameraFormat(cameraDevice)

            function _pickCameraFormat(dev) {
                // Prefer 1280x720@30; fall back to closest 16:9 at >=24fps.
                const fmts = dev && dev.videoFormats ? dev.videoFormats : [];
                let best = null;
                let bestScore = -1e9;
                for (const f of fmts) {
                    const r = f.resolution;
                    const fr = f.maxFrameRate || 0;
                    const ar = r.width / (r.height || 1);
                    const arDist = Math.abs(ar - 16/9);
                    const resDist = Math.abs(r.width * r.height - 1280 * 720);
                    const fpsDist = Math.abs(fr - 30);
                    const score = -(resDist / 1000) - arDist * 500 - fpsDist * 5;
                    if (score > bestScore) { bestScore = score; best = f; }
                }
                return best;
            }

            onErrorOccurred: function(error, msg) {
                console.warn("Camera error:", error, msg);
                App.toast("Camera error: " + msg, "error");
            }
        }

    }

    Rectangle {
        anchors.fill: parent
        color: "#000000"
        clip: true

        // ── Layer 1: local camera ─────────────────────────
        VideoOutput {
            id: previewOut

            anchors.fill: parent
            fillMode: root.stageFillMode === "contain" ? VideoOutput.PreserveAspectFit : VideoOutput.PreserveAspectCrop
            visible: !Stream.frozen && !(Stream.peerVideoSink !== null && Stream.live)
            opacity: Stream.live ? 0.9 : 1
            z: 1

            Component.onCompleted: Stream.bindCameraSink(videoSink)
        }

        // ── Layer 2: native GStreamer AI peer (replaces WebEngine) ──────
        VideoOutput {
            id: aiVideoOut

            anchors.fill: parent
            fillMode: root.stageFillMode === "contain" ? VideoOutput.PreserveAspectFit : VideoOutput.PreserveAspectCrop
            visible: Stream.peerVideoSink !== null && Stream.live && !Stream.frozen
            z: 2
        }

        // ── Bind AI video sink from Stream.peerVideoSink ──
        Binding {
            target: aiVideoOut
            property: "source"
            value: Stream.peerVideoSink
            when: Stream.peerVideoSink !== null
        }

        // ── Electron .stage::after scanlines: repeating-linear-gradient(0deg,
        //    transparent 3px, rgba(0,0,0,.015) 3-6px) — tiled 1x6 texture, z 3 ──
        Image {
            anchors.fill: parent
            source: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAGCAYAAAACEPQxAAAADklEQVR4nGNgwAAsCAIAAGYADU174b8AAAAASUVORK5CYII="
            fillMode: Image.Tile
            smooth: false
            visible: !root.grabbing
            z: 3
        }

        // ── Layer 3: real freeze frame ────────────────────
        Image {
            anchors.fill: parent
            visible: Stream.frozen && Stream.lastFramePath.length > 0
            source: Stream.lastFramePath.length > 0 ? ("file://" + Stream.lastFramePath) : ""
            fillMode: root.stageFillMode === "contain" ? Image.PreserveAspectFit : Image.PreserveAspectCrop
            z: 4
        }

        Rectangle {
            anchors.fill: parent
            visible: Stream.frozen && !root.grabbing
            color: Stream.lastFramePath.length > 0 ? "transparent" : "#0a0a14"
            z: 5
        }

        // ── Layer 4: status HUD ───────────────────────────
        ColumnLayout {
            anchors.centerIn: parent
            spacing: 10
            z: 3
            visible: !root.grabbing && !Stream.frozen && !(aiVideoOut.visible) && (!Stream.live || Decart.generating || !Decart.connected)

            Text {
                Layout.alignment: Qt.AlignHCenter
                text: Decart.generating ? "◉" : (Stream.live || Decart.connected ? "◈" : "○")
                color: Decart.generating ? Theme.teal : (Stream.live ? Theme.gold : Theme.dim)
                font.pixelSize: 36
            }

            Text {
                Layout.alignment: Qt.AlignHCenter
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
                Layout.alignment: Qt.AlignHCenter
                visible: Decart.sessionId.length > 0
                text: "session " + Decart.sessionId
                color: Theme.teal
                font.family: Theme.fontMono
                font.pixelSize: 9
            }

            Text {
                Layout.alignment: Qt.AlignHCenter
                visible: Decart.lastError.length > 0
                Layout.maximumWidth: Math.min(root.width - 24, 360)
                wrapMode: Text.WordWrap
                horizontalAlignment: Text.AlignHCenter
                text: Decart.lastError
                color: Theme.red
                font.family: Theme.fontMono
                font.pixelSize: 10
            }

            Text {
                Layout.alignment: Qt.AlignHCenter
                visible: Stream.live && !aiVideoOut.visible
                Layout.maximumWidth: Math.min(root.width - 32, 380)
                wrapMode: Text.WordWrap
                horizontalAlignment: Text.AlignHCenter
                text: qsTr("AI peer starting — check connection status above")
                color: Theme.dim2
                font.family: Theme.fontMono
                font.pixelSize: 9
            }

        }

        // Local PiP badge — draggable (Electron pip mousedown/mousemove parity)
        Rectangle {
            id: pipBadge
            objectName: "pipBadge"
            visible: root.showLocalPip && Stream.live && !Stream.frozen && !root.grabbing
            // Bottom-left default; drag moves it anywhere inside the stage.
            x: 12
            y: parent.height - height - 12
            width: 180
            height: 101

            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.SizeAllCursor
                drag.target: pipBadge
                drag.minimumX: 0
                drag.maximumX: Math.max(0, pipBadge.parent.width - pipBadge.width)
                drag.minimumY: 0
                drag.maximumY: Math.max(0, pipBadge.parent.height - pipBadge.height)
            }

            // Keep the PiP inside the stage after parent resizes
            Connections {
                target: pipBadge.parent
                function onWidthChanged() {
                    pipBadge.x = Math.min(pipBadge.x,
                        Math.max(0, pipBadge.parent.width - pipBadge.width))
                }
                function onHeightChanged() {
                    pipBadge.y = Math.min(pipBadge.y,
                        Math.max(0, pipBadge.parent.height - pipBadge.height))
                }
            }
            radius: 6
            color: "#000000"
            border.color: Theme.border
            border.width: 1
            z: 8
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
                        color: Theme.bg
                    }

                }

            }

            ColumnLayout {
                anchors.centerIn: parent
                spacing: 4

                Text {
                    Layout.alignment: Qt.AlignHCenter
                    text: aiVideoOut.visible ? "AI + LOCAL" : "YOUR CAM"
                    color: Theme.gold
                    font.family: Theme.fontMono
                    font.pixelSize: 10
                    font.letterSpacing: 1
                }

                Text {
                    Layout.alignment: Qt.AlignHCenter
                    text: Stream.connectionQuality
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 9
                }

            }

        }

        // Reconnecting overlay — centered pill (Electron style)
        Rectangle {
            anchors.centerIn: parent
            width: reconnCol.implicitWidth + 48
            height: reconnCol.implicitHeight + 32
            radius: 12
            color: Qt.rgba(4/255, 4/255, 10/255, 0.92)
            border.color: Theme.goldDim
            border.width: 1
            z: 9
            visible: Stream.reconnecting && !Stream.frozen

            ColumnLayout {
                id: reconnCol
                anchors.centerIn: parent
                spacing: 10

                BusyIndicator {
                    Layout.alignment: Qt.AlignHCenter
                    running: parent.visible
                    palette.dark: Theme.gold
                }

                Text {
                    Layout.alignment: Qt.AlignHCenter
                    text: qsTr("↻ RECONNECTING…")
                    color: Theme.gold
                    font.family: Theme.fontUi
                    font.pixelSize: 14
                    font.bold: true
                    font.letterSpacing: 2
                }

                Text {
                    Layout.alignment: Qt.AlignHCenter
                    text: qsTr("Attempting to restore your session")
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 10
                }
            }
        }

    }

    Connections {
        function onFrameGrabRequested(purpose) {
            var dest = App.captureImagePath(purpose);
            root.grabbing = true;
            root.grabToImage(function(result) {
                var ok = result.saveToFile(dest);
                root.grabbing = false;
                Stream.onFrameGrabbed(ok ? dest : "", purpose);
            });
        }

        function onRecordingChanged() {
            if (Stream.recording) {
                var dest = App.recordingPath();
                mediaRecorder.outputLocation = "file://" + dest;
                try {
                    mediaRecorder.record();
                    // NOTE: do NOT report the MP4 path yet — the file does not
                    // exist until the recorder stops. Reporting early would
                    // cancel the PNG-sequence fallback before the file exists.
                    // Stream.onFrameGrabbed(dest, "mp4") is emitted from
                    // onRecorderStateChanged when the recorder actually stops.
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

        target: Stream
    }

}
