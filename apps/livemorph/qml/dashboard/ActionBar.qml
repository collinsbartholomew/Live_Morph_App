import LiveMorph
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

/**
 * ActionBar — original h-[88px] border-t bg-surface-base px-6
 * Left w-[360px] | center Start LiveMorph CTA with glow | right modes
 */
Rectangle {
    id: root

    property bool compact: false

    color: Colors.surfaceBase
    implicitHeight: compact ? Theme.actionBarHeightCompact : Theme.actionBarHeight

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

        // ── Left: active character (w-[360px]) ────────────────────────
        Item {
            Layout.preferredWidth: Theme.actionLeftWidth
            Layout.maximumWidth: Theme.actionLeftWidth
            Layout.fillHeight: true

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
                    width: 200

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
                        font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
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

        Item {
            Layout.preferredWidth: 100
            Layout.fillHeight: true

            Column {
                anchors.centerIn: parent
                spacing: 2

                Text {
                    text: "RATE"
                    color: Colors.textMuted
                    font.pixelSize: 9
                    font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                    font.letterSpacing: 1.35
                    anchors.horizontalCenter: parent.horizontalCenter
                }

                Text {
                    text: Session.creditsPerSecond.toFixed(1) + " cr/s"
                    color: Colors.textPrimary
                    font.pixelSize: 13
                    font.weight: Font.Medium
                    font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                    anchors.horizontalCenter: parent.horizontalCenter
                }

            }

        }

        Item {
            Layout.fillWidth: true
        }

        // ── Center: Start/Stop session + Record ─────────────────────────
        Row {
            spacing: 10
            Layout.alignment: Qt.AlignVCenter

            // Primary CTA — original shadow-glow + inset highlight + hover lift
            Item {
                width: morphBtn.width
                height: morphBtn.height

                // Soft single-layer glow (replaces the former 3-rect hand-rolled shadow)
                Rectangle {
                    anchors.centerIn: parent
                    width: parent.width + 8
                    height: parent.height + 8
                    radius: Theme.radiusLg + 2
                    color: Qt.rgba(Session.isActive ? Colors.danger.r : Colors.accent.r, Session.isActive ? Colors.danger.g : Colors.accent.g, Session.isActive ? Colors.danger.b : Colors.accent.b, 0.18)
                    opacity: Session.isActive ? 0.8 : 0.9
                }

                Rectangle {
                    id: morphBtn

                    width: morphLabel.implicitWidth + 40
                    height: 40
                    radius: Theme.radiusSm
                    color: Session.isActive ? Colors.statusError : Colors.accent
                    border.width: 1
                    border.color: Session.isActive ? Colors.danger : Colors.accent60

                    // inset top highlight
                    Rectangle {
                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.top: parent.top
                        anchors.leftMargin: 1
                        anchors.rightMargin: 1
                        height: 1
                        color: "#ffffff1f"
                        radius: Theme.radiusSm
                    }

                    Row {
                        anchors.centerIn: parent
                        spacing: 8

                        Rectangle {
                            visible: Session.isActive
                            width: 8
                            height: 8
                            radius: 4
                            color: "white"
                            anchors.verticalCenter: parent.verticalCenter

                            SequentialAnimation on opacity {
                                running: Session.isActive && Qt.application.state === Qt.ApplicationActive
                                loops: Animation.Infinite

                                NumberAnimation {
                                    from: 1
                                    to: 0.3
                                    duration: 700
                                }

                                NumberAnimation {
                                    from: 0.3
                                    to: 1
                                    duration: 700
                                }

                            }

                        }

                        Text {
                            id: morphLabel

                            text: Session.isActive ? "STOP" : "START MORPH"
                            color: "white"
                            font.pixelSize: 12
                            font.weight: Font.DemiBold
                            font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                            font.letterSpacing: 0.6
                            anchors.verticalCenter: parent.verticalCenter
                        }

                    }

                    MouseArea {
                        id: morphMa

                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        hoverEnabled: true
                        onClicked: App.toggleSwap()
                        onPressed: morphBtn.y = 0.5
                        onReleased: morphBtn.y = morphMa.containsMouse ? -0.5 : 0
                        onEntered: morphBtn.y = -0.5
                        onExited: morphBtn.y = 0
                    }

                    Tooltip {
                        anchors.bottom: parent.top
                        anchors.bottomMargin: 8
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: Session.isActive ? "Stop morph session" : "Start morph (WebRTC in Stage)"
                        shown: morphMa.containsMouse
                    }

                    Behavior on y {
                        NumberAnimation {
                            duration: Theme.motionFast
                        }

                    }

                    Behavior on color {
                        ColorAnimation {
                            duration: Theme.motionFast
                        }

                    }

                    states: State {
                        when: morphMa.containsMouse && !Session.isActive

                        PropertyChanges {
                            target: morphBtn
                            color: Colors.accentHover
                        }

                    }

                }

            }

            // Record button
            Rectangle {
                id: recBtn

                width: 40
                height: 40
                radius: Theme.radiusSm
                color: Recording.isRecording ? Colors.statusErrorMuted : Colors.surfaceOverlay
                border.color: Recording.isRecording ? Colors.statusError : Colors.surfaceBorder
                border.width: 1

                Rectangle {
                    width: Recording.isRecording ? 12 : 14
                    height: Recording.isRecording ? 12 : 14
                    radius: Recording.isRecording ? 2 : 7
                    color: Colors.statusError
                    anchors.centerIn: parent
                }

                MouseArea {
                    id: recMa

                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    hoverEnabled: true
                    onClicked: {
                        if (Recording.isRecording) {
                            Recording.stopRecording();
                            Backend.stopRecording("user");
                        } else {
                            Recording.startRecording(Session.activeCharacterId);
                            Backend.startRecording({
                                "output_dir": Recording.outputDirectory,
                                "extension": "mp4",
                                "character": Session.activeCharacterId
                            });
                        }
                    }
                    onPressed: parent.scale = 0.96
                    onReleased: parent.scale = 1
                }

                Tooltip {
                    anchors.bottom: parent.top
                    anchors.bottomMargin: 8
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: Recording.isRecording ? "Stop recording" : "Record (F12)"
                    shown: recMa.containsMouse
                }

                Behavior on scale {
                    NumberAnimation {
                        duration: Theme.motionFast
                    }

                }

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
            // Hover tip via transparent area is limited; label on GhostButton:

            GhostButton {
                text: Config.promptBarVisible ? qsTr("Prompt ▾") : qsTr("Prompt")
                ToolTip.visible: hovered
                ToolTip.delay: 400
                ToolTip.text: qsTr("Show or hide prompt / scene bar (Ctrl+E)")
                onClicked: Config.promptBarVisible = !Config.promptBarVisible
            }

            Text {
                visible: Session.isActive
                text: {
                    var s = Math.floor(Session.elapsedSec);
                    var m = Math.floor(s / 60);
                    var r = s % 60;
                    return (m < 10 ? "0" : "") + m + ":" + (r < 10 ? "0" : "") + r;
                }
                color: Colors.textMuted
                font.pixelSize: 11
                font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                anchors.verticalCenter: parent.verticalCenter
            }

        }

    }

}
