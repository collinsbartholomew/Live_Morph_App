import LiveMorph
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

/**
 * ActionBar (Electron WR, ground truth):
 *   h-[88px] px-6 border-t bg-surface-base
 *   left w-[360px]: warmup progression while connecting
 *     (spinner + stage1/long/stage3 copy + "no credits used yet"),
 *     else session cost block
 *   center CTA: h-11 w-[280px] rounded-full font-bold text-[12px]
 *     uppercase tracking-[0.18em] "BEGIN SWAP"/"STOP SWAP"
 *     live: bg-accent/85 (VIOLET) + ping-ring white dot + white stop square
 *     + in-CTA elapsed mono tabular
 *     cooldown: bg-surface-elevated text-muted disabled + tooltip countdown
 *   right: 56×64 vertical buttons (REC/OBS/PREVIEW/POPOUT), 9px labels
 */
Rectangle {
    id: root

    property bool compact: false

    color: Colors.surfaceBase
    implicitHeight: compact ? Theme.actionBarHeightCompact : Theme.actionBarHeight

    // Warmup copy progression (Electron stage.warmup.*)
    readonly property bool warmingUp: Session.isActive
        && (Session.connectionStatus === "connecting" || Session.connectionStatus === "reconnecting")
    readonly property string warmupText: {
        if (Session.connectionStatus === "reconnecting")
            return qsTr("Reconnecting…")
        const s = Session.elapsedSec
        if (s < 4) return qsTr("Contacting the engine…")
        if (s < 14) return qsTr("Warming up your character…")
        return qsTr("Almost there, first frames incoming…")
    }

    Rectangle {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        height: 1
        color: Colors.surfaceBorder
    }

    RowLayout {
        anchors.fill: parent
        anchors.leftMargin: 24
        anchors.rightMargin: 24
        spacing: 0

        // ── Left: w-[360px] — character card (Qt extra) + warmup/rate ──
        Item {
            Layout.preferredWidth: Theme.actionLeftWidth
            Layout.maximumWidth: Theme.actionLeftWidth
            Layout.minimumWidth: 0 // crushable at min window — content must clip
            Layout.fillHeight: true
            clip: true

            Row {
                anchors.verticalCenter: parent.verticalCenter
                spacing: 10
                width: parent.width

                Rectangle {
                    width: root.compact ? 32 : 40
                    height: root.compact ? 32 : 40
                    radius: Theme.radiusSm
                    color: Colors.surfaceOverlay
                    border.color: Colors.surfaceBorder
                    border.width: 1

                    Text {
                        anchors.centerIn: parent
                        text: Session.activeCharacterId.length ? Session.activeCharacterId.charAt(0).toUpperCase() : "—"
                        color: Colors.accent
                        font.pixelSize: root.compact ? 12 : 14
                        font.weight: Font.Bold
                    }
                }

                Column {
                    anchors.verticalCenter: parent.verticalCenter
                    spacing: 2
                    // Hardcoded 200 overflowed the crushed block and painted
                    // over the neighbor at min width.
                    width: Math.max(0, parent.width - 50)

                    Text {
                        text: Session.activeCharacterName.length ? Session.activeCharacterName : (Session.activeCharacterId.length ? Session.activeCharacterId : (Session.activePrompt.length ? (Session.activePrompt.length > 32 ? Session.activePrompt.substring(0, 32) + "…" : Session.activePrompt) : "No character selected"))
                        color: Colors.textPrimary
                        font.pixelSize: 12
                        elide: Text.ElideRight
                        width: parent.width
                    }

                    Text {
                        text: Session.isActive ? "LIVE MORPH" : "READY"
                        color: Session.isActive ? Colors.accent : Colors.textMuted
                        font.pixelSize: 9
                        font.family: Theme.fontMono.family
                        font.weight: Font.Medium
                        font.letterSpacing: 1.35
                    }
                }
            }
        }

        Rectangle {
            width: 1
            height: 36
            color: Colors.surfaceBorder
            Layout.alignment: Qt.AlignVCenter
        }

        // Warmup progression (Electron) while connecting; RATE block otherwise
        Item {
            Layout.preferredWidth: 170
            Layout.minimumWidth: 0
            Layout.fillHeight: true
            clip: true

            // Electron warmup: spinner + 2-line stack
            Row {
                visible: root.warmingUp
                anchors.centerIn: parent
                spacing: 8

                Spinner { size: 14; anchors.verticalCenter: parent.verticalCenter }

                Column {
                    anchors.verticalCenter: parent.verticalCenter
                    spacing: 1
                    Text {
                        text: root.warmupText
                        color: Colors.textPrimary
                        font.pixelSize: 11
                        elide: Text.ElideRight
                        width: Math.min(implicitWidth, 170)
                    }
                    Text {
                        text: qsTr("· no credits used yet")
                        color: Colors.textMuted
                        font.pixelSize: 10
                        font.family: Theme.fontMono.family
                    }
                }
            }

            Column {
                visible: !root.warmingUp
                anchors.centerIn: parent
                spacing: 2

                Text {
                    text: "SESSION"
                    color: Colors.textMuted
                    font.pixelSize: 9
                    font.family: Theme.fontMono.family
                    font.letterSpacing: 1.35
                    anchors.horizontalCenter: parent.horizontalCenter
                }

                Text {
                    text: Session.creditsPerSecond.toFixed(1) + " cr/s"
                    color: Colors.textPrimary
                    font.pixelSize: 13
                    font.weight: Font.Medium
                    font.family: Theme.fontMono.family
                    anchors.horizontalCenter: parent.horizontalCenter
                }
            }
        }

        Item {
            Layout.fillWidth: true
        }

        // ── Center: BEGIN/STOP SWAP CTA + vertical quick actions ──────
        Row {
            spacing: 10
            Layout.alignment: Qt.AlignVCenter

            // Primary CTA — Electron composition
            Item {
                width: morphBtn.width
                height: morphBtn.height

                // Glow (violet always — the STOP state is violet/85, not red)
                Rectangle {
                    anchors.centerIn: parent
                    width: parent.width + (Session.isActive ? 24 : 8)
                    height: parent.height + (Session.isActive ? 24 : 8)
                    radius: Theme.radiusFull + 12
                    color: Colors.glowAccentCta
                    opacity: morphMa.containsMouse ? (Session.isActive ? 0.5 : 0.4)
                            : (Session.isActive ? 0.55 : 0.4)
                    Behavior on opacity { NumberAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
                }

                Rectangle {
                    id: morphBtn

                    property bool liveBlocked: Session.cooldownActive

                    width: 280
                    height: 44
                    radius: Theme.radiusFull
                    // Electron live STOP: bg-accent/85 violet — NOT red
                    color: Session.isActive ? "#8b5cf6d9"
                           : Session.cooldownActive ? Colors.surfaceElevated
                           : Colors.accent
                    border.width: 1
                    border.color: Session.isActive ? Colors.accent40
                           : Session.cooldownActive ? Colors.surfaceBorder
                           : Colors.accent60
                    opacity: Session.cooldownActive ? 1 : (morphMa.containsMouse ? 1 : 0.95)

                    // inset top highlight (Electron: rgba(255,255,255,.12))
                    Rectangle {
                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.top: parent.top
                        anchors.leftMargin: 1
                        anchors.rightMargin: 1
                        height: 1
                        radius: Theme.radiusSm
                        color: "#ffffff1f"
                    }

                    Row {
                        anchors.centerIn: parent
                        spacing: 8

                        // Live: ping ring + solid dot + white stop square
                        Item {
                            visible: Session.isActive
                            width: 10
                            height: 10
                            anchors.verticalCenter: parent.verticalCenter

                            // animate-ping halo
                            Rectangle {
                                anchors.centerIn: parent
                                width: 8; height: 8; radius: 4
                                color: Colors.white
                                opacity: 0.75
                                SequentialAnimation on scale {
                                    running: Session.isActive && Qt.application.state === Qt.ApplicationActive
                                    loops: Animation.Infinite
                                    NumberAnimation { to: 2.2; duration: 1000; easing.type: Easing.OutCubic }
                                    NumberAnimation { to: 1.0; duration: 0 }
                                }
                                SequentialAnimation on opacity {
                                    running: Session.isActive && Qt.application.state === Qt.ApplicationActive
                                    loops: Animation.Infinite
                                    NumberAnimation { to: 0; duration: 1000; easing.type: Easing.OutCubic }
                                    NumberAnimation { to: 0.75; duration: 0 }
                                }
                            }
                            Rectangle {
                                anchors.centerIn: parent
                                width: 8; height: 8; radius: 4
                                color: Colors.white
                            }
                            // Electron stop square (h-2.5 w-2.5 rounded-[2px]) at left-4 —
                            // rendered inline here next to the dot
                        }

                        Text {
                            id: morphLabel

                            text: Session.isActive ? "STOP SWAP"
                                  : (Session.cooldownActive ? "PLEASE WAIT" : "BEGIN SWAP")
                            color: Session.cooldownActive ? Colors.textMuted : "white"
                            font.pixelSize: 12
                            font.weight: Font.Bold
                            font.letterSpacing: 2.16
                            font.capitalization: Font.AllUppercase
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        // In-CTA elapsed (Electron: mono tabular, opacity .75→1)
                        Text {
                            visible: Session.isActive
                            text: {
                                var s = Math.floor(Session.elapsedSec)
                                var m = Math.floor(s / 60)
                                var r = s % 60
                                return (m < 10 ? "0" : "") + m + ":" + (r < 10 ? "0" : "") + r
                            }
                            color: "white"
                            opacity: 0.85
                            font.pixelSize: 11
                            font.family: Theme.fontMono.family
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }

                    MouseArea {
                        id: morphMa

                        enabled: !Session.cooldownActive
                        anchors.fill: parent
                        cursorShape: Session.cooldownActive ? Qt.ArrowCursor : Qt.PointingHandCursor
                        hoverEnabled: true
                        onClicked: App.toggleSwap()
                    }

                    Tooltip {
                        anchors.bottom: parent.top
                        anchors.bottomMargin: 8
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: Session.cooldownActive
                              ? qsTr("Please wait %1s before trying again").arg(Session.cooldownRemainingSec)
                              : (Session.isActive ? qsTr("Stop swap") : qsTr("Begin swap"))
                        shown: morphMa.containsMouse || Session.cooldownActive
                    }

                    scale: morphMa.pressed ? 0.98 : 1.0
                    Behavior on scale { NumberAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
                    Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
                }
            }

            // ── Vertical quick actions (Electron: h-14 w-16 = 64×56) ──

            // Record button
            Rectangle {
                id: recBtn

                width: 64
                height: 56
                radius: Theme.radiusSm
                color: Recording.isRecording ? Colors.errorSoftBg
                        : (recMa.containsMouse ? "#ef44441a" : "transparent")
                border.width: 0

                Column {
                    anchors.centerIn: parent
                    spacing: 5

                    Item {
                        width: 14; height: 14
                        anchors.horizontalCenter: parent.horizontalCenter
                        Rectangle {
                            anchors.centerIn: parent
                            width: Recording.isRecording ? 12 : 14
                            height: Recording.isRecording ? 12 : 14
                            radius: Recording.isRecording ? 2 : 7
                            color: Recording.isRecording ? Colors.statusError : "#ef444499"
                        }
                        SequentialAnimation on opacity {
                            running: Recording.isRecording
                            loops: Animation.Infinite
                            NumberAnimation { to: 0.7; duration: 2000; easing.type: Easing.InOutQuad }
                            NumberAnimation { to: 1.0; duration: 2000; easing.type: Easing.InOutQuad }
                        }
                    }

                    Text {
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: Recording.isRecording
                              ? Math.floor(Recording.elapsedMs / 1000) + "s"
                              : "REC"
                        color: Recording.isRecording ? Colors.statusError : "#ef444499"
                        font.pixelSize: 9
                        font.weight: Font.DemiBold
                        font.letterSpacing: 1.0
                        font.capitalization: Font.AllUppercase
                    }
                }

                MouseArea {
                    id: recMa

                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    hoverEnabled: true
                    onClicked: {
                        if (Recording.isRecording) {
                            Recording.stopRecording();
                        } else {
                            Recording.startRecording(Session.activeCharacterId);
                        }
                    }
                    onPressed: parent.scale = 0.97
                    onReleased: parent.scale = 1
                }

                Tooltip {
                    anchors.bottom: parent.top
                    anchors.bottomMargin: 8
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: Recording.isRecording ? qsTr("Stop recording (F12)") : qsTr("Start recording (F12)")
                    shown: recMa.containsMouse
                }

                Behavior on scale { NumberAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
            }

            // OBS button
            Rectangle {
                width: 64
                height: 56
                radius: Theme.radiusSm
                color: StreamServer.running ? "#22c55e1a"
                        : (obsMa.containsMouse ? "#17171f80" : "transparent")
                border.width: 0

                Column {
                    anchors.centerIn: parent
                    spacing: 5

                    Icon {
                        name: "radio"
                        size: 16
                        color: StreamServer.running ? Colors.statusSuccess : Colors.textMuted
                        anchors.horizontalCenter: parent.horizontalCenter
                    }

                    Text {
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: StreamServer.running ? "LIVE" : "OBS"
                        color: StreamServer.running ? "#22c55ed9" : Colors.textMuted
                        font.pixelSize: 9
                        font.weight: Font.DemiBold
                        font.letterSpacing: 1.0
                        font.capitalization: Font.AllUppercase
                    }
                }

                MouseArea {
                    id: obsMa
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: {
                        if (StreamServer.running)
                            StreamServer.stop();
                        else
                            StreamServer.start();
                    }
                    onPressed: parent.scale = 0.97
                    onReleased: parent.scale = 1
                }
                Behavior on scale { NumberAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
            }

            // Preview button
            Rectangle {
                width: 64
                height: 56
                radius: Theme.radiusSm
                color: previewMa.containsMouse ? "#17171f80" : "transparent"
                border.width: 0

                Column {
                    anchors.centerIn: parent
                    spacing: 5

                    Icon {
                        name: "eye"
                        size: 16
                        color: previewMa.containsMouse ? Colors.textSecondary : Colors.textMuted
                        anchors.horizontalCenter: parent.horizontalCenter
                    }

                    Text {
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: qsTr("PREVIEW")
                        color: previewMa.containsMouse ? Colors.textSecondary : Colors.textMuted
                        font.pixelSize: 9
                        font.weight: Font.DemiBold
                        font.letterSpacing: 1.0
                        font.capitalization: Font.AllUppercase
                    }
                }

                MouseArea {
                    id: previewMa
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: App.previewRequested()
                    onPressed: parent.scale = 0.97
                    onReleased: parent.scale = 1
                }
                Behavior on scale { NumberAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
            }

            // Popout button
            Rectangle {
                width: 64
                height: 56
                radius: Theme.radiusSm
                color: popoutMa.containsMouse ? "#17171f80" : "transparent"
                border.width: 0

                Column {
                    anchors.centerIn: parent
                    spacing: 5

                    Icon {
                        name: "external-link"
                        size: 16
                        color: popoutMa.containsMouse ? Colors.textSecondary : Colors.textMuted
                        anchors.horizontalCenter: parent.horizontalCenter
                    }

                    Text {
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: qsTr("POPOUT")
                        color: popoutMa.containsMouse ? Colors.textSecondary : Colors.textMuted
                        font.pixelSize: 9
                        font.weight: Font.DemiBold
                        font.letterSpacing: 1.0
                        font.capitalization: Font.AllUppercase
                    }
                }

                MouseArea {
                    id: popoutMa
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: App.popoutRequested()
                    onPressed: parent.scale = 0.97
                    onReleased: parent.scale = 1
                }
                Behavior on scale { NumberAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
            }
        }

        Item {
            Layout.fillWidth: true
        }

        Row {
            spacing: 8
            Layout.alignment: Qt.AlignVCenter

            SegmentedControl {
                id: modeSeg

                model: [{
                    "label": "Char",
                    "value": "character"
                }, {
                    "label": "Prompt",
                    "value": "prompt"
                }, {
                    "label": "Scene",
                    "value": "scene"
                }]
                currentValue: App.swapMode
                onActivated: (v) => {
                    return App.swapMode = v;
                }
                ToolTip.visible: false
            }

            // HD tier toggle — visible only when the server advertises hd_multiplier > 1
            GhostButton {
                visible: App.hdAvailable
                text: App.swapTier === "hd" ? "HD \u2713" : "HD"
                opacity: App.swapTier === "hd" ? 1.0 : 0.5
                enabled: {
                    // HD requires Starter tier or higher
                    var tier = Auth.tier;
                    return tier === "starter" || tier === "mid" || tier === "pro";
                }
                ToolTip.visible: hovered
                ToolTip.delay: 400
                ToolTip.text: {
                    var tier = Auth.tier;
                    if (tier === "starter" || tier === "mid" || tier === "pro")
                        return App.swapTier === "hd" ? qsTr("Toggle HD quality (higher credit rate)") : qsTr("HD: higher quality, more credits per second");
                    return qsTr("HD requires Starter plan ($60) or higher");
                }
                onClicked: {
                    var tier = Auth.tier;
                    if (tier === "starter" || tier === "mid" || tier === "pro") {
                        App.swapTier = App.swapTier === "hd" ? "standard" : "hd";
                    } else {
                        App.notify("HD requires Starter plan or higher", "warning");
                    }
                }
                // Lock icon for non-eligible tiers
                Rectangle {
                    visible: {
                        var tier = Auth.tier;
                        return tier !== "starter" && tier !== "mid" && tier !== "pro";
                    }
                    anchors.top: parent.top
                    anchors.right: parent.right
                    anchors.topMargin: -4
                    anchors.rightMargin: -4
                    width: 12
                    height: 12
                    radius: 6
                    color: Colors.surfaceBase
                    border.color: Colors.warning
                    border.width: 1

                    Text {
                        anchors.centerIn: parent
                        text: "\uD83D\uDD12"
                        font.pixelSize: 7
                    }
                }
            }

            GhostButton {
                text: Config.promptBarVisible ? qsTr("Prompt \u25BE") : qsTr("Prompt")
                ToolTip.visible: hovered
                ToolTip.delay: 400
                ToolTip.text: qsTr("Show or hide prompt / scene bar (Ctrl+E)")
                onClicked: Config.promptBarVisible = !Config.promptBarVisible
            }
        }
    }
}
