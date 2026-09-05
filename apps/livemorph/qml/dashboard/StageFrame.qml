import QtQuick
import QtMultimedia
import LiveMorph

/**
 * Stage surface: local camera when idle; MorphStage (GStreamer WebRTC) when session active.
 * Signaling: Session → WebRtcSignalingClient → Rust proxy (auth + credits + Decart).
 */
Rectangle {
    id: root
    color: "#050508"
    radius: Theme.radiusMd
    clip: true
    border.color: Session.isActive ? Colors.accent40 : Colors.surfaceBorder
    border.width: Session.isActive ? 1.5 : 1

    readonly property int overlayTopPad: 12
    readonly property int overlayBottomPad: 12

    // Soft glow when live
    Rectangle {
        anchors.fill: parent
        anchors.margins: -2
        radius: parent.radius + 2
        color: "transparent"
        border.color: Colors.accent
        border.width: 2
        opacity: Session.isActive ? 0.35 : 0
        Behavior on opacity { NumberAnimation { duration: 220 } }
        z: -1
    }

    // GStreamer WebRTC morph surface
    MorphStage {
        id: morphStage
        anchors.fill: parent
        active: Session.isActive
        visible: Session.isActive
        z: 1
    }

    // Local camera when not morphing
    VideoOutput {
        id: videoOut
        anchors.fill: parent
        fillMode: VideoOutput.PreserveAspectCrop
        visible: Camera.isActive && !Session.isActive
        transform: Scale {
            origin.x: videoOut.width / 2
            xScale: Camera.mirrored ? -1 : 1
        }
    }
    Binding {
        target: videoOut
        property: "videoSink"
        value: Camera.videoSink
        when: Camera.videoSink !== null && !Session.isActive
    }

    // Idle empty state + CTA
    Column {
        anchors.centerIn: parent
        spacing: 14
        visible: !Camera.isActive && !Session.isActive
        z: 4
        Text {
            anchors.horizontalCenter: parent.horizontalCenter
            text: qsTr("Camera is off")
            color: Colors.textPrimary
            font.pixelSize: 16
            font.weight: Font.DemiBold
        }
        Text {
            anchors.horizontalCenter: parent.horizontalCenter
            width: Math.min(280, parent.parent.width - 48)
            horizontalAlignment: Text.AlignHCenter
            wrapMode: Text.WordWrap
            text: qsTr("Enable the camera to preview, then pick a character and go live.")
            color: Colors.textMuted
            font.pixelSize: 12
        }
        PrimaryButton {
            anchors.horizontalCenter: parent.horizontalCenter
            text: qsTr("Start camera")
            onClicked: Camera.start()
        }
    }

    // Session phase stepper + live chrome
    Rectangle {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.leftMargin: 12
        anchors.rightMargin: 12
        anchors.topMargin: 12
        height: 36
        radius: Theme.radiusMd
        color: Colors.surfaceGlassStrong
        border.color: Colors.surfaceBorder
        border.width: 1
        visible: Session.isActive || Session.connectionStatus === "connecting"
        z: 5

        Row {
            anchors.centerIn: parent
            spacing: 8
            Repeater {
                model: [
                    { id: "connect", label: qsTr("Connect") },
                    { id: "live", label: qsTr("Live") },
                    { id: "morph", label: qsTr("Morph") }
                ]
                delegate: Row {
                    spacing: 8
                    required property var modelData
                    required property int index
                    readonly property bool done: {
                        var s = Session.connectionStatus
                        if (modelData.id === "connect")
                            return Session.isActive || s === "connected" || s === "live" || s === "generating"
                        if (modelData.id === "live")
                            return s === "connected" || s === "live" || s === "generating"
                        if (modelData.id === "morph")
                            return s === "generating" || s === "live"
                        return false
                    }
                    readonly property bool current: {
                        var s = Session.connectionStatus
                        if (modelData.id === "connect")
                            return s === "connecting" || s === "idle"
                        if (modelData.id === "live")
                            return s === "connected"
                        if (modelData.id === "morph")
                            return s === "generating" || s === "live"
                        return false
                    }
                    Rectangle {
                        width: 8; height: 8; radius: 4
                        anchors.verticalCenter: parent.verticalCenter
                        color: parent.done || parent.current ? Colors.accent : Colors.textMuted
                        opacity: parent.current ? 1 : (parent.done ? 0.85 : 0.35)
                    }
                    Text {
                        text: modelData.label
                        color: parent.done || parent.current ? Colors.textPrimary : Colors.textMuted
                        font.pixelSize: 11
                        font.weight: parent.current ? Font.DemiBold : Font.Normal
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    Text {
                        visible: index < 2
                        text: "→"
                        color: Colors.textMuted
                        font.pixelSize: 11
                        anchors.verticalCenter: parent.verticalCenter
                    }
                }
            }
        }
    }

    // Character + elapsed when live
    Rectangle {
        anchors.left: parent.left
        anchors.bottom: parent.bottom
        anchors.leftMargin: 12
        anchors.bottomMargin: root.overlayBottomPad
        height: 32
        radius: Theme.radiusFull
        color: Colors.surfaceGlassStrong
        border.color: Colors.surfaceBorder
        border.width: 1
        visible: Session.isActive
        z: 5
        width: liveLbl.implicitWidth + 20
        Text {
            id: liveLbl
            anchors.centerIn: parent
            text: {
                var name = Session.activeCharacterName || qsTr("Live")
                var sec = Math.floor(Session.elapsedSec || 0)
                var m = Math.floor(sec / 60)
                var s = sec % 60
                var ts = (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s
                return name + " · " + ts
            }
            color: Colors.textPrimary
            font.pixelSize: 11
            font.weight: Font.Medium
        }
    }

    // REC badge
    Rectangle {
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.rightMargin: 12
        anchors.topMargin: root.overlayTopPad
        height: 28
        width: recLbl.implicitWidth + 16
        radius: Theme.radiusFull
        color: Colors.statusErrorMuted
        border.color: Colors.statusError
        border.width: 1
        visible: Recording.isRecording
        z: 6
        Text {
            id: recLbl
            anchors.centerIn: parent
            text: {
                var sec = Math.floor((Recording.elapsedMs || 0) / 1000)
                var m = Math.floor(sec / 60)
                var s = sec % 60
                return "● REC " + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s
            }
            color: Colors.statusError
            font.pixelSize: 11
            font.weight: Font.Bold
            font.family: Theme.fontMono.family
        }
    }

}
