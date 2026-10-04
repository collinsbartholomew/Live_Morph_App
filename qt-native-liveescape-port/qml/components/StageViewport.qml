import QtQuick
import QtMultimedia
import SmokeScreen

// .stage — video layer stack (reference z-map):
//   vidOut z2 · out-glow/scanlines z3 · freeze z4 · ai-label z6 · fs-btn z7 ·
//   pip z8 · sloader z10
Item {
    id: root

    property bool stageContain: true        // fillMode contain vs cover
    property string cameraId: ""
    property bool grabbing: false
    property bool activeViewport: true      // only the on-screen instance claims the camera sink
    signal fullscreenRequested()

    // Re-claim the camera sink whenever the mode flips so the visible
    // viewport always owns the feed (the other instance releases it).
    Connections {
        target: Stream
        function onTheatreChanged() { if (root.activeViewport && localOut.videoSink) Stream.bindCameraSink(localOut.videoSink) }
    }

    // ── layer 1: local camera (shown when not live, or as PiP) ──
    VideoOutput {
        id: localOut
        anchors.fill: parent
        fillMode: root.stageContain ? VideoOutput.PreserveAspectFit : VideoOutput.PreserveAspectCrop
        visible: !(Stream.peerVideoSink !== null && Stream.live)
        z: 1
        Component.onCompleted: Stream.bindCameraSink(videoSink)
    }

    // ── layer 2: native AI peer output ──
    VideoOutput {
        id: aiOut
        anchors.fill: parent
        fillMode: root.stageContain ? VideoOutput.PreserveAspectFit : VideoOutput.PreserveAspectCrop
        visible: Stream.peerVideoSink !== null && Stream.live && !Stream.frozen
        z: 2
    }
    Binding {
        target: aiOut
        property: "source"
        value: Stream.peerVideoSink
        when: Stream.peerVideoSink !== null
    }

    // ── scanlines (Electron .stage::after, rgba(0,0,0,.015) 3px/3px) ──
    Image {
        anchors.fill: parent
        source: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAGCAYAAAACEPQxAAAADklEQVR4nGNgwAAsCAIAAGYADU174b8AAAAASUVORK5CYII="
        fillMode: Image.Tile
        smooth: false
        z: 3
        visible: !root.grabbing
    }

    // ── out-glow: inset 0 0 80px rgba(63,232,184,.03) ──
    Rectangle {
        anchors.fill: parent
        color: "transparent"
        z: 3
        border.width: 24
        border.color: Qt.rgba(63/255, 232/255, 184/255, 0.02)
        visible: !root.grabbing
    }

    // ── freeze frame ──
    Image {
        anchors.fill: parent
        visible: Stream.frozen && Stream.lastFramePath.length > 0
        source: Stream.lastFramePath.length > 0 ? ("file://" + Stream.lastFramePath) : ""
        fillMode: root.stageContain ? Image.PreserveAspectFit : Image.PreserveAspectCrop
        z: 4
    }

    // ── placeholder: ◈ AI OUTPUT WILL APPEAR HERE ──
    Column {
        anchors.centerIn: parent
        spacing: 10
        z: 5
        visible: !root.grabbing && !Stream.frozen
                 && !aiOut.visible && !Stream.connecting
        Text {
            anchors.horizontalCenter: parent.horizontalCenter
            text: "◈"
            color: Theme.dim
            font.pixelSize: 54
            opacity: 0.15
        }
        Text {
            anchors.horizontalCenter: parent.horizontalCenter
            text: qsTr("AI OUTPUT WILL APPEAR HERE")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 11
            font.letterSpacing: 1
            opacity: 0.35
        }
    }

    // ── loader: CONNECTING TO ENGINE… ──
    Rectangle {
        anchors.fill: parent
        z: 10
        color: Qt.rgba(4/255, 4/255, 10/255, 0.9)
        visible: Stream.connecting && !Stream.frozen
        Column {
            anchors.centerIn: parent
            spacing: 16
            Rectangle {
                anchors.horizontalCenter: parent.horizontalCenter
                width: 40
                height: 40
                radius: 20
                color: "transparent"
                border.width: 2
                border.color: Theme.border
                Rectangle {
                    width: parent.width
                    height: parent.height
                    radius: 20
                    color: "transparent"
                    border.width: 2
                    border.color: "transparent"
                    Rectangle {
                        width: parent.width / 2
                        height: parent.height / 2
                        color: "transparent"
                        border.width: 2
                        border.color: Theme.gold
                        radius: 2
                    }
                    SequentialAnimation on rotation {
                        loops: Animation.Infinite
                        NumberAnimation { from: 0; to: 360; duration: 1000 }
                    }
                }
            }
            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: Stream.loaderText.length > 0 ? Stream.loaderText : qsTr("CONNECTING TO ENGINE…")
                color: Theme.gold
                font.family: Theme.fontMono
                font.pixelSize: 11
                font.letterSpacing: 2
            }
        }
    }

    // ── AI LIVE badge ──
    Rectangle {
        visible: Stream.live && !Stream.frozen
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.margins: 12
        width: aiLabel.implicitWidth + 18
        height: 18
        radius: 4
        color: Qt.rgba(4/255, 4/255, 10/255, 0.82)
        border.width: 1
        border.color: Qt.rgba(63/255, 232/255, 184/255, 0.22)
        z: 6
        Text {
            id: aiLabel
            anchors.centerIn: parent
            text: Stream.paused ? qsTr("◈ AI PAUSED") : qsTr("◈ AI LIVE")
            color: Theme.teal
            font.family: Theme.fontMono
            font.pixelSize: 9
            font.letterSpacing: 2
        }
    }

    // ── fullscreen button ⛶ ──
    Rectangle {
        anchors.top: parent.top
        anchors.right: parent.right
        anchors.margins: 12
        width: 34
        height: 34
        radius: 7
        color: Qt.rgba(4/255, 4/255, 10/255, 0.82)
        border.width: 1
        border.color: Qt.rgba(255, 255, 255, 0.1)
        z: 7
        Text {
            anchors.centerIn: parent
            text: "⛶"
            color: Theme.dim
            font.pixelSize: 15
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: root.fullscreenRequested()
        }
    }

    // ── PiP: YOUR CAM (180×101, draggable) ──
    Rectangle {
        id: pip
        visible: Stream.live && !Stream.frozen && !root.grabbing
        width: 180
        height: 101
        radius: 8
        color: "#000000"
        border.width: 1
        border.color: Qt.rgba(255, 255, 255, 0.1)
        x: 12
        y: parent.height - height - 12
        z: 8
        clip: true

        VideoOutput {
            anchors.fill: parent
            fillMode: VideoOutput.PreserveAspectCrop
        }

        Rectangle {
            anchors.top: parent.top
            anchors.left: parent.left
            anchors.right: parent.right
            height: 22
            gradient: Gradient {
                GradientStop { position: 0; color: Qt.rgba(4/255, 4/255, 10/255, 0.88) }
                GradientStop { position: 1; color: Qt.rgba(4/255, 4/255, 10/255, 0) }
            }
            Text {
                anchors.left: parent.left
                anchors.leftMargin: 10
                anchors.top: parent.top
                anchors.topMargin: 6
                text: qsTr("YOUR CAM")
                color: Theme.gold
                font.family: Theme.fontMono
                font.pixelSize: 8
                font.letterSpacing: 2
            }
        }

        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.SizeAllCursor
            drag.target: pip
            drag.minimumX: 0
            drag.maximumX: Math.max(0, pip.parent.width - pip.width)
            drag.minimumY: 0
            drag.maximumY: Math.max(0, pip.parent.height - pip.height)
        }

        Connections {
            target: pip.parent
            function onWidthChanged() {
                pip.x = Math.min(pip.x, Math.max(0, pip.parent.width - pip.width))
            }
            function onHeightChanged() {
                pip.y = Math.min(pip.y, Math.max(0, pip.parent.height - pip.height))
            }
        }
    }

    // ── camera session (drives both outputs via bindCameraSink) ──
    MediaDevices { id: md }

    CaptureSession {
        id: capture
        videoOutput: localOut
        camera: Camera {
            id: cam
            active: root.visible && (Stream.live || Stream.connecting || Stream.frozen)
            cameraDevice: {
                if (!root.cameraId)
                    return md.defaultVideoInput
                const devs = md.videoInputs || []
                for (let i = 0; i < devs.length; i++)
                    if (devs[i].id === root.cameraId) return devs[i]
                return md.defaultVideoInput
            }
            onErrorOccurred: function(error, msg) { console.warn("Camera error:", error, msg) }
        }
    }
}
