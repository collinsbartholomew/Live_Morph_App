import QtQuick
import QtQuick.Layouts
import LiveMorph

Rectangle {
    id: root
    implicitWidth: row.implicitWidth + 24
    implicitHeight: 48
    radius: 24
    color: "#0e0e14f2"
    border.color: Colors.surfaceBorder
    border.width: 1

    property bool streamOn: false
    property bool vcOn: false

    Row {
        id: row
        anchors.centerIn: parent
        spacing: 6

        GhostButton {
            text: Camera.mirrored ? "⇄ Mirrored" : "⇄ Normal"
            onClicked: Camera.mirrored = !Camera.mirrored
        }

        GhostButton {
            text: Session.identityLockEnabled ? "Lock ON" : "ID Lock"
            ToolTip.visible: hovered
            ToolTip.delay: 400
            ToolTip.text: "Keep face identity stable across morph frames"
            onClicked: Session.identityLockEnabled = !Session.identityLockEnabled
        }

        GhostButton {
            text: Session.hdActive ? "HD" : "STD"
            ToolTip.visible: hovered
            ToolTip.delay: 400
            ToolTip.text: Session.hdActive ? "HD tier (higher credit rate)" : "Standard tier"
            onClicked: {
                Session.hdActive = !Session.hdActive
                App.swapTier = Session.hdActive ? "hd" : "standard"
            }
        }

        Rectangle { width: 1; height: 22; color: Colors.surfaceBorder; anchors.verticalCenter: parent.verticalCenter }

        PrimaryButton {
            text: Session.cooldownActive
                  ? ("Wait " + Session.cooldownRemainingSec + "s")
                  : (Session.isActive ? "Stop session" : "Start LiveMorph")
            implicitHeight: 34
            enabled: !Session.cooldownActive
            onClicked: App.toggleSwap()
        }

        Rectangle { width: 1; height: 22; color: Colors.surfaceBorder; anchors.verticalCenter: parent.verticalCenter }

        GhostButton {
            text: Recording.isRecording ? "■ Stop" : "● Rec"
            onClicked: {
                if (Recording.isRecording)
                    Recording.stopRecording("user")
                else
                    Recording.startRecording(Session.activeCharacterId)
            }
        }

        GhostButton {
            text: root.streamOn ? "Stream ON" : "Stream"
            ToolTip.visible: hovered
            ToolTip.delay: 400
            ToolTip.text: "Local MJPEG for OBS (http://127.0.0.1:" + Config.streamPort + "/stream)"
            onClicked: {
                if (typeof StreamServer === "undefined") return
                if (StreamServer.running) {
                    StreamServer.stop()
                    root.streamOn = false
                    App.notify(qsTr("Stream stopped"), "info")
                } else {
                    StreamServer.port = Config.streamPort; StreamServer.start()
                    root.streamOn = StreamServer.running
                    if (StreamServer.running)
                        App.notify(qsTr("Stream: %1").arg(StreamServer.url), "success")
                    else
                        App.notify(qsTr("Could not start stream server"), "error")
                }
            }
        }

        GhostButton {
            text: root.vcOn ? "VC ON" : "VC"
            ToolTip.visible: hovered
            ToolTip.delay: 400
            ToolTip.text: "Optional virtual camera when backend/OS support it"
            onClicked: {
                if (root.vcOn) { Backend.stopVirtualCamera(); root.vcOn = false }
                else { Backend.startVirtualCamera(); root.vcOn = true }
            }
        }

        GhostButton {
            text: "Preview"
            ToolTip.visible: hovered
            ToolTip.delay: 400
            ToolTip.text: "Open preview window (Ctrl+P)"
            onClicked: {
                var w = Window.window
                if (w && w.openPreview) w.openPreview()
            }
        }
    }

    Connections {
        target: StreamServer
        function onRunningChanged() { root.streamOn = StreamServer.running }
    }
    Connections {
        target: Backend
        function onVirtualCameraStarted(r) { root.vcOn = true }
        function onVirtualCameraStopped(r) { root.vcOn = false }
    }
    Component.onCompleted: {
        if (typeof StreamServer !== "undefined")
            root.streamOn = StreamServer.running
    }
}
