import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

/**
 * Stage prompt bars (Electron l1/Fu, ground truth):
 *   ONE row, border-t, px-4 py-1.5, inner mx-auto max-w-[880px]:
 *   prompt bar + background bar SIDE-BY-SIDE, each a rounded-md bordered
 *   form: leading icon · input (12px, focus ring accent/50) · trailing 24px
 *   send button — idle bg-surface-overlay/muted · dirty bg-accent white ·
 *   applied bg-success/15 + check (1.5s). Escape reverts to committed value.
 */
Rectangle {
    id: root
    color: Colors.surfaceBase
    border.color: Colors.surfaceBorderSubtle
    border.width: 0

    Rectangle {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        height: 1
        color: Colors.surfaceBorder
    }

    RowLayout {
        anchors.fill: parent
        anchors.leftMargin: 16
        anchors.rightMargin: 16
        spacing: 8

        Item { Layout.fillWidth: true; Layout.maximumWidth: 40 } // centers the 880px cluster

        // ── Prompt bar ────────────────────────────────────────────
        Rectangle {
            id: promptBarCard
            Layout.fillWidth: true
            Layout.maximumWidth: 560
            height: 34
            radius: Theme.radiusMd
            color: Colors.surfaceRaised
            border.color: promptField.activeFocus ? Colors.accent40
                        : promptBarMa.containsMouse ? Colors.surfaceBorderStrong
                        : Colors.surfaceBorder
            border.width: 1
            Behavior on border.color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 8
                anchors.rightMargin: 4
                spacing: 6

                Icon {
                    name: "wand-sparkles"
                    size: 14
                    color: Colors.textMuted
                    Layout.leftMargin: 2
                }

                TextField {
                    id: promptField
                    Layout.fillWidth: true
                    background: null
                    leftPadding: 0
                    rightPadding: 0
                    placeholderText: Session.activePrompt.length ? Session.activePrompt
                                    : qsTr("Add sunglasses, a hat, or a new background…")
                    color: Colors.textPrimary
                    placeholderTextColor: Colors.textMuted
                    font.pixelSize: 12
                    selectByMouse: true
                    selectionColor: Colors.selectionBg
                    selectedTextColor: Colors.selectionText
                    // Escape reverts to the committed value (Electron)
                    Keys.onEscapePressed: {
                        text = ""
                        focus = false
                    }
                    Keys.onReturnPressed: commitPrompt()
                }

                // 24px send button: idle → dirty accent → applied green
                Rectangle {
                    width: 24; height: 24; radius: Theme.radiusSm
                    color: promptApplied.running ? "#22c55e26"
                         : promptField.text.trim().length ? Colors.accent
                         : Colors.surfaceOverlay
                    border.width: 1
                    border.color: promptApplied.running ? Colors.statusSuccess
                                 : promptField.text.trim().length ? Colors.accent
                                 : Colors.surfaceBorder
                    Behavior on color { ColorAnimation { duration: 150; easing.type: Easing.OutCubic } }

                    Icon {
                        anchors.centerIn: parent
                        name: promptApplied.running ? "check" : "send"
                        size: 12
                        emphasis: promptApplied.running
                        color: promptApplied.running ? Colors.statusSuccess
                             : promptField.text.trim().length ? Colors.white
                             : Colors.textMuted
                    }

                    Timer { id: promptApplied; interval: 1500 }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: commitPrompt()
                    }
                }
            }

            MouseArea {
                id: promptBarMa
                anchors.fill: parent
                hoverEnabled: true
                acceptedButtons: Qt.NoButton
            }
        }

        // ── Background bar ─────────────────────────────────────────
        Rectangle {
            id: bgBarCard
            Layout.fillWidth: true
            Layout.maximumWidth: 320
            height: 34
            radius: Theme.radiusMd
            color: Colors.surfaceRaised
            border.color: sceneField.activeFocus ? Colors.accent40
                        : bgBarMa.containsMouse ? Colors.surfaceBorderStrong
                        : Colors.surfaceBorder
            border.width: 1
            Behavior on border.color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 8
                anchors.rightMargin: 4
                spacing: 6

                Icon {
                    name: "image"
                    size: 14
                    color: Colors.textMuted
                    Layout.leftMargin: 2
                }

                TextField {
                    id: sceneField
                    Layout.fillWidth: true
                    background: null
                    leftPadding: 0
                    rightPadding: 0
                    placeholderText: qsTr("Set the background… e.g. a sunlit beach")
                    text: Session.scenePrompt || ""
                    color: Colors.textPrimary
                    placeholderTextColor: Colors.textMuted
                    font.pixelSize: 12
                    selectByMouse: true
                    selectionColor: Colors.selectionBg
                    selectedTextColor: Colors.selectionText
                    Keys.onEscapePressed: {
                        text = Qt.binding(function() { return Session.scenePrompt || "" })
                        focus = false
                    }
                    Keys.onReturnPressed: {
                        Session.setScenePrompt(text.trim())
                        sceneApplied.restart()
                    }
                }

                Rectangle {
                    width: 24; height: 24; radius: Theme.radiusSm
                    color: sceneApplied.running ? "#22c55e26"
                         : sceneField.text.trim().length ? Colors.accent
                         : Colors.surfaceOverlay
                    border.width: 1
                    border.color: sceneApplied.running ? Colors.statusSuccess
                                 : sceneField.text.trim().length ? Colors.accent
                                 : Colors.surfaceBorder
                    Behavior on color { ColorAnimation { duration: 150; easing.type: Easing.OutCubic } }

                    Icon {
                        anchors.centerIn: parent
                        name: sceneApplied.running ? "check" : "send"
                        size: 12
                        emphasis: sceneApplied.running
                        color: sceneApplied.running ? Colors.statusSuccess
                             : sceneField.text.trim().length ? Colors.white
                             : Colors.textMuted
                    }

                    Timer { id: sceneApplied; interval: 1500 }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            if (sceneField.text.trim().length) {
                                Session.setScenePrompt(sceneField.text.trim())
                                sceneApplied.restart()
                            }
                        }
                    }
                }
            }

            MouseArea {
                id: bgBarMa
                anchors.fill: parent
                hoverEnabled: true
                acceptedButtons: Qt.NoButton
            }
        }

        Item { Layout.fillWidth: true; Layout.maximumWidth: 40 }
    }

    function commitPrompt() {
        const p = promptField.text.trim()
        if (!p.length) return
        Session.commitPrompt(p)
        promptApplied.restart()
    }
}
