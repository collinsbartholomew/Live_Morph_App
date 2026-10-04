import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import QtMultimedia
import LiveMorph

Rectangle {
    id: root
    // Electron stage box: rounded(4) — brackets/glow carry the live state,
    // not the frame border.
    color: "#050508"
    radius: Theme.radiusSm
    clip: true
    border.color: Colors.surfaceBorder
    border.width: 1

    // Double-click the stage → popout (Electron hint parity)
    signal popoutRequested()
    MouseArea {
        anchors.fill: parent
        acceptedButtons: Qt.LeftButton
        propagateComposedEvents: true
        z: 0.5
        onDoubleClicked: root.popoutRequested()
        onClicked: function(mouse) { mouse.accepted = false }
        onPressed: function(mouse) { mouse.accepted = false }
    }

    // Bottom ellipse glow (Electron): idle transparent → warming accent/20 →
    // live accent/30 with a 6.5s pulse; error uses red.
    Rectangle {
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.bottom: parent.bottom
        width: parent.width * 0.5
        height: 56
        radius: height / 2
        color: Session.connectionStatus === "error" ? Colors.statusError : Colors.accent
        opacity: !Session.isActive ? 0
            : Session.connectionStatus === "connecting" || Session.connectionStatus === "reconnecting" ? 0.20
            : 0.30
        // stage-glow-pulse: 6.5s ease-in-out .72↔1
        SequentialAnimation on opacity {
            running: root.visible && Session.isActive
                     && Session.connectionStatus !== "connecting"
                     && Qt.application.state === Qt.ApplicationActive
            loops: Animation.Infinite
            NumberAnimation { to: 0.72 * (Session.connectionStatus === "error" ? 0.8 : 1.0); duration: 3250; easing.type: Easing.InOutQuad }
            NumberAnimation { to: Session.connectionStatus === "error" ? 0.25 : 0.30; duration: 3250; easing.type: Easing.InOutQuad }
        }
        Behavior on opacity { NumberAnimation { duration: 300; easing.type: Easing.OutCubic } }
        z: 0
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
        visible: CameraCtrl.isActive && !Session.isActive
        transform: Scale {
            origin.x: videoOut.width / 2
            xScale: CameraCtrl.mirrored ? -1 : 1
        }
        onVisibleChanged: if (visible) CameraCtrl.bindVideoOutput(videoOut)
        Component.onCompleted: if (visible) CameraCtrl.bindVideoOutput(videoOut)
    }

    // ── Stage label pill (Electron: always top-left) ────────────────
    Rectangle {
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.margins: 12
        height: 22
        width: stageLabel.implicitWidth + 16
        radius: Theme.radiusSm
        color: "#08080cb3"
        border.color: Colors.surfaceBorder
        border.width: 1
        z: 5
        Text {
            id: stageLabel
            anchors.centerIn: parent
            text: qsTr("STAGE")
            color: Colors.textMuted
            font.family: Theme.fontMono.family
            font.pixelSize: 9
            font.letterSpacing: 1.5
        }
    }

    // Idle empty state (Electron: "Ready to stream" + BEGIN SWAP chip)
    Column {
        anchors.centerIn: parent
        spacing: 12
        visible: !CameraCtrl.isActive && !Session.isActive
        z: 4
        width: Math.min(320, parent.width - 48)

        // 64px icon box with breathing radial glow (Electron)
        Item {
            width: 64
            height: 64
            anchors.horizontalCenter: parent.horizontalCenter
            Rectangle {
                anchors.fill: parent
                radius: Theme.radiusSm
                color: "#101019cc"
                border.color: Colors.accent15
                border.width: 1
            }
            Rectangle {
                anchors.centerIn: parent
                width: 104; height: 104
                radius: 52
                color: Colors.accent
                opacity: 0.10
                // breathe: 3s opacity 1↔0.5
                SequentialAnimation on opacity {
                    running: root.visible && Qt.application.state === Qt.ApplicationActive
                    loops: Animation.Infinite
                    NumberAnimation { to: 0.05; duration: 1500; easing.type: Easing.InOutQuad }
                    NumberAnimation { to: 0.10; duration: 1500; easing.type: Easing.InOutQuad }
                }
            }
            Icon {
                anchors.centerIn: parent
                name: "venetian-mask"
                size: 28
                color: Colors.accentHover
            }
        }

        Text {
            anchors.horizontalCenter: parent.horizontalCenter
            text: qsTr("Ready to stream")
            color: Colors.textPrimary
            font.pixelSize: 14
            font.weight: Font.Medium
        }

        Row {
            anchors.horizontalCenter: parent.horizontalCenter
            spacing: 6
            Text {
                text: qsTr("Press")
                color: Colors.textMuted
                font.pixelSize: 12
                anchors.verticalCenter: parent.verticalCenter
            }
            Rectangle {
                height: 22
                width: beginChip.implicitWidth + 12
                radius: Theme.radiusSm
                color: Colors.accent10
                border.color: Colors.accent30
                border.width: 1
                anchors.verticalCenter: parent.verticalCenter
                Text {
                    id: beginChip
                    anchors.centerIn: parent
                    text: qsTr("BEGIN SWAP")
                    color: Colors.accentHover
                    font.pixelSize: 10
                    font.letterSpacing: 1.2
                }
            }
            Text {
                text: qsTr("to transform")
                color: Colors.textMuted
                font.pixelSize: 12
                anchors.verticalCenter: parent.verticalCenter
            }
        }
    }

    // ── Corner brackets (Electron: ALWAYS visible, state-colored) ────
    // idle: white/15 · warming: accent/45 · live: accent · error: error/70
    Repeater {
        model: 4
        Item {
            readonly property int pos: index  // 0=TL 1=TR 2=BL 3=BR
            readonly property color bracketColor: Session.connectionStatus === "error" ? "#ef4444b3"
                : Session.isActive
                  ? (Session.connectionStatus === "connecting" || Session.connectionStatus === "reconnecting"
                     ? "#8b5cf673" : Colors.accent)
                : "#ffffff26"
            z: 5
            x: (pos % 2 === 0) ? 6 : parent.width - 20
            y: (pos < 2) ? 6 : parent.height - 20
            width: 14
            height: 14

            Rectangle {
                width: 1.5; height: parent.height; radius: 1
                color: bracketColor
                x: (pos % 2 === 0) ? 0 : parent.width - width
                Behavior on color { ColorAnimation { duration: 300; easing.type: Easing.OutCubic } }
            }
            Rectangle {
                width: parent.width; height: 1.5; radius: 1
                color: bracketColor
                y: (pos < 2) ? 0 : parent.height - height
                Behavior on color { ColorAnimation { duration: 300; easing.type: Easing.OutCubic } }
            }
        }
    }

    // ── Warmup / connecting overlay ──────────────────────────────────
    Item {
        anchors.fill: parent
        visible: Session.isActive && Session.connectionStatus === "connecting"
        z: 6

        Rectangle { anchors.fill: parent; color: Colors.surfaceBase; opacity: 0.75 }

        Column {
            anchors.centerIn: parent
            spacing: 12

            Spinner {
                anchors.horizontalCenter: parent.horizontalCenter
                width: 32; height: 32
                running: true
            }
            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: qsTr("Connecting to morph engine\u2026")
                color: Colors.textPrimary
                font.pixelSize: 14
                font.weight: Font.DemiBold
            }
        }
    }

    // ── Cooldown overlay ─────────────────────────────────────────────
    Item {
        anchors.fill: parent
        visible: Session.cooldownActive
        z: 6

        Rectangle { anchors.fill: parent; color: Colors.surfaceBase; opacity: 0.7 }

        Text {
            anchors.centerIn: parent
            text: qsTr("Cooldown: %1s").arg(Session.cooldownRemainingSec)
            color: Colors.textPrimary
            font.pixelSize: 18
            font.weight: Font.Bold
        }
    }

    // ── Error overlay (Electron: stage.error) ────────────────────────
    property bool errorDismissed: false
    Connections {
        target: Session
        function onConnectionStatusChanged() {
            if (Session.connectionStatus === "error")
                root.errorDismissed = false
        }
    }

    Item {
        anchors.fill: parent
        visible: Session.connectionStatus === "error" && !root.errorDismissed
        z: 8

        Rectangle { anchors.fill: parent; color: Colors.surfaceBase; opacity: 0.85 }

        Column {
            anchors.centerIn: parent
            spacing: 12
            width: Math.min(320, parent.width - 48)

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: "⚠"
                color: Colors.statusError
                font.pixelSize: 28
            }
            Text {
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                wrapMode: Text.WordWrap
                text: Session.statusText.length ? Session.statusText : qsTr("Something went wrong")
                color: Colors.textPrimary
                font.pixelSize: 14
                font.weight: Font.DemiBold
            }
            Text {
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                wrapMode: Text.WordWrap
                visible: /network|connection|timeout|signaling/i.test(Session.statusText)
                text: qsTr("A VPN, firewall, or work/school wifi may be blocking it. Try another network. Or switch to the Standard engine in Settings, which works on most networks.")
                color: Colors.textMuted
                font.pixelSize: 11
            }
            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: qsTr("No credits charged")
                color: Colors.textMuted
                font.pixelSize: 10
                font.family: Theme.fontMono.family
            }

            RowLayout {
                anchors.horizontalCenter: parent.horizontalCenter
                spacing: 8

                PrimaryButton {
                    text: Session.cooldownActive
                          ? qsTr("Try again in %1s").arg(Session.cooldownRemainingSec)
                          : qsTr("Try again")
                    enabled: !Session.cooldownActive
                    onClicked: {
                        root.errorDismissed = true
                        App.toggleSwap()
                    }
                }
                GhostButton {
                    text: qsTr("Dismiss")
                    onClicked: root.errorDismissed = true
                }
            }
        }
    }

    // ── Inline camera controls (Electron: camera picker + mirror in stage) ──
    Rectangle {
        id: cameraControls
        visible: CameraCtrl.isActive && !Session.isActive
        anchors.bottom: parent.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.margins: 8
        height: 36
        radius: Theme.radiusSm
        color: Qt.rgba(8/255, 8/255, 12/255, 0.85)
        border.color: Colors.surfaceBorder
        border.width: 1
        z: 7

        RowLayout {
            anchors.fill: parent
            anchors.leftMargin: 10
            anchors.rightMargin: 10
            spacing: 10

            // Camera icon
            Icon {
                name: "camera"
                size: Theme.iconSm
                color: Colors.textMuted
                anchors.verticalCenter: parent.verticalCenter
            }

            // Camera device selector
            ComboBox {
                id: camSelect
                Layout.preferredWidth: 180
                Layout.fillHeight: true
                model: CameraCtrl.availableDevices
                currentIndex: {
                    var id = CameraCtrl.currentDeviceId;
                    for (var i = 0; i < model.length; i++) {
                        if (model[i].id === id) return i;
                    }
                    return 0;
                }
                onActivated: {
                    var dev = CameraCtrl.availableDevices[currentIndex];
                    if (dev) CameraCtrl.currentDeviceId = dev.id;
                }

                font.family: Theme.fontMono.family
                font.pixelSize: 10

                background: Rectangle {
                    color: Colors.surfaceOverlay
                    border.color: camSelect.activeFocus ? Colors.accent : Colors.surfaceBorder
                    border.width: 1
                    radius: Theme.radiusSm
                }

                contentItem: Text {
                    text: camSelect.displayText
                    color: Colors.textPrimary
                    font: camSelect.font
                    verticalAlignment: Text.AlignVCenter
                    leftPadding: 6
                    elide: Text.ElideRight
                }
            }

            // Mirror toggle
            Rectangle {
                height: 28
                width: mirrorRow.implicitWidth + 12
                radius: Theme.radiusFull
                color: Config.mirrorCamera ? Colors.accent20 : Colors.surfaceOverlay
                border.color: Config.mirrorCamera ? Colors.accent : Colors.surfaceBorder
                border.width: 1

                Row {
                    id: mirrorRow
                    anchors.centerIn: parent
                    spacing: 4

                    Icon {
                        name: "refresh-ccw"
                        size: 12
                        color: Config.mirrorCamera ? Colors.accent : Colors.textMuted
                        anchors.verticalCenter: parent.verticalCenter
                    }

                    Text {
                        text: "Mirror"
                        color: Config.mirrorCamera ? Colors.accent : Colors.textSecondary
                        font.pixelSize: 10
                        font.family: Theme.fontMono.family
                        anchors.verticalCenter: parent.verticalCenter
                    }
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: Config.mirrorCamera = !Config.mirrorCamera
                }
            }

            Item { Layout.fillWidth: true }

            // Engine label
            Text {
                text: Session.engineLabel
                color: Colors.textMuted
                font.pixelSize: 9
                font.family: Theme.fontMono.family
                font.letterSpacing: 1
                anchors.verticalCenter: parent.verticalCenter
            }
        }
    }
}
