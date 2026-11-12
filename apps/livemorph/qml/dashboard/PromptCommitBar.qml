import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

/**
 * Stage prompt bars (Electron l1/Fu, ground truth):
 *   ONE full-bleed row under the stage: border-t, px-4 py-1.5, inner
 *   max-w-[880px] centered: prompt bar + background bar side-by-side,
 *   EQUAL flex-1 halves, each rounded-md bordered form: leading icon ·
 *   controlled input (value = committed; Escape reverts) · trailing 24px
 *   send button — idle bg-surface-overlay NO border · dirty bg-accent
 *   white · applied bg-success/15 + check (1.5s).
 */
Rectangle {
    id: root
    color: Colors.surfaceBase
    implicitHeight: Theme.promptBarHeight

    Rectangle {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        height: 1
        color: Colors.surfaceBorder
    }

    // Controlled drafts (Electron: input value == committed when not editing)
    property string promptDraft: ""
    property string sceneDraft: ""

    Component.onCompleted: {
        promptDraft = Session.activePrompt
        sceneDraft = Session.scenePrompt || ""
    }

    Connections {
        target: Session
        function onActivePromptChanged() {
            if (!promptField.activeFocus)
                root.promptDraft = Session.activePrompt
        }
        function onScenePromptChanged() {
            if (!sceneField.activeFocus)
                root.sceneDraft = Session.scenePrompt || ""
        }
    }

    RowLayout {
        anchors.fill: parent
        // Electron: inner max-w-[880px] centered cluster
        anchors.leftMargin: Math.max(16, (parent.width - Constants.maxPromptBarWidth) / 2)
        anchors.rightMargin: Math.max(16, (parent.width - Constants.maxPromptBarWidth) / 2)
        anchors.topMargin: 6
        anchors.bottomMargin: 6
        spacing: 8

        Item { Layout.fillWidth: true; Layout.maximumWidth: 40 }

        // ── Prompt bar ────────────────────────────────────────────
        Rectangle {
            id: promptBarCard
            Layout.fillWidth: true
            height: 36
            radius: Theme.radiusMd
            color: Colors.surfaceRaised
            border.color: promptField.activeFocus ? Colors.accent40
                        : promptBarMa.containsMouse ? Colors.surfaceBorderStrong
                        : Colors.surfaceBorder
            border.width: 1

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 6
                anchors.rightMargin: 4
                spacing: 6

                Item {
                    width: 24; height: 24
                    Layout.leftMargin: 2
                    Hexagon {
                        anchors.centerIn: parent
                        size: 25
                        lineWidth: 1
                        lineColor: Colors.surfaceBorderSubtle
                        fillColor: Colors.surfaceOverlay
                    }
                    Icon {
                        anchors.centerIn: parent
                        name: "wand-sparkles"
                        size: 13
                        color: promptField.activeFocus ? Colors.accentHover : Colors.textMuted
                    }
                }

                TextField {
                    id: promptField
                    Layout.fillWidth: true
                    background: null
                    leftPadding: 0
                    rightPadding: 0
                    // Hard cap: an oversized prompt becomes one huge WS frame
                    // and can kill the session (proxy frame limit).
                    maximumLength: 1000
                    text: root.promptDraft
                    placeholderText: qsTr("Add sunglasses, a hat, or a new background…")
                    color: Colors.textPrimary
                    placeholderTextColor: Colors.textMuted
                    font.pixelSize: 12
                    selectByMouse: true
                    selectionColor: Colors.selectionBg
                    selectedTextColor: Colors.selectionText
                    onTextEdited: root.promptDraft = text
                    // Escape reverts to the committed value (Electron). The
                    // window-level Shortcut owns Escape, so delegate via
                    // escapeReverts (main.qml routes it here); the Keys handler
                    // stays as a fallback for non-window contexts.
                    escapeReverts: true
                    onEscapeRevertRequested: {
                        root.promptDraft = Session.activePrompt
                        focus = false
                    }
                    Keys.onEscapePressed: {
                        root.promptDraft = Session.activePrompt
                        focus = false
                    }
                    Keys.onReturnPressed: commitPrompt()
                    onActiveFocusChanged: {
                        // Commit on blur so a typed prompt is never silently lost.
                        if (!activeFocus)
                            commitPrompt()
                    }
                }

                // Character counter (warns at the cap)
                Text {
                    text: promptField.text.length + "/" + promptField.maximumLength
                    color: promptField.text.length >= promptField.maximumLength
                           ? Colors.statusWarning : Colors.textMuted
                    font.pixelSize: 9
                    font.family: Theme.fontMono.family
                    Layout.alignment: Qt.AlignVCenter
                }

                // 26px send hexagon: idle → dirty solid white → applied green
                Item {
                    id: promptSend
                    property bool dirty: root.promptDraft.trim().length > 0
                                         && root.promptDraft.trim() !== Session.activePrompt
                    width: 26; height: 26
                    Hexagon {
                        anchors.centerIn: parent
                        size: 28
                        lineWidth: (promptApplied.running || promptSend.dirty) ? 1 : 0
                        lineColor: promptApplied.running ? Colors.statusSuccess : Colors.accent
                        fillColor: promptApplied.running ? Colors.statusSuccess15
                                 : promptSend.dirty ? Colors.accent
                                 : Colors.surfaceOverlay
                    }

                    Icon {
                        anchors.centerIn: parent
                        name: promptApplied.running ? "check" : "send"
                        size: 12
                        emphasis: promptApplied.running
                        color: promptApplied.running ? Colors.statusSuccess
                             : promptSend.dirty ? Colors.textOnAccent
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

        // ── Background bar (equal half) ────────────────────────────
        Rectangle {
            id: bgBarCard
            Layout.fillWidth: true
            height: 36
            radius: Theme.radiusMd
            color: Colors.surfaceRaised
            border.color: sceneField.activeFocus ? Colors.accent40
                        : bgBarMa.containsMouse ? Colors.surfaceBorderStrong
                        : Colors.surfaceBorder
            border.width: 1

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 6
                anchors.rightMargin: 4
                spacing: 6

                Item {
                    width: 24; height: 24
                    Layout.leftMargin: 2
                    Hexagon {
                        anchors.centerIn: parent
                        size: 25
                        lineWidth: 1
                        lineColor: Colors.surfaceBorderSubtle
                        fillColor: Colors.surfaceOverlay
                    }
                    Icon {
                        anchors.centerIn: parent
                        name: "image"
                        size: 13
                        color: sceneField.activeFocus ? Colors.accentHover : Colors.textMuted
                    }
                }

                TextField {
                    id: sceneField
                    Layout.fillWidth: true
                    background: null
                    leftPadding: 0
                    rightPadding: 0
                    text: root.sceneDraft
                    placeholderText: qsTr("Set the background… e.g. a sunlit beach")
                    color: Colors.textPrimary
                    placeholderTextColor: Colors.textMuted
                    font.pixelSize: 12
                    selectByMouse: true
                    selectionColor: Colors.selectionBg
                    selectedTextColor: Colors.selectionText
                    onTextEdited: root.sceneDraft = text
                    escapeReverts: true
                    onEscapeRevertRequested: {
                        root.sceneDraft = Session.scenePrompt || ""
                        focus = false
                    }
                    Keys.onEscapePressed: {
                        root.sceneDraft = Session.scenePrompt || ""
                        focus = false
                    }
                    Keys.onReturnPressed: {
                        Session.setScenePrompt(text.trim())
                        sceneApplied.restart()
                    }
                    // Commit on blur too (Return above also fires editingFinished;
                    // setScenePrompt is idempotent so a double commit is harmless).
                    onEditingFinished: {
                        if (root.sceneDraft.trim() !== (Session.scenePrompt || "")) {
                            Session.setScenePrompt(root.sceneDraft.trim())
                            sceneApplied.restart()
                        }
                    }
                }

                Item {
                    id: sceneSend
                    property bool dirty: root.sceneDraft.trim().length > 0
                                         && root.sceneDraft.trim() !== (Session.scenePrompt || "")
                    width: 26; height: 26
                    Hexagon {
                        anchors.centerIn: parent
                        size: 28
                        lineWidth: (sceneApplied.running || sceneSend.dirty) ? 1 : 0
                        lineColor: sceneApplied.running ? Colors.statusSuccess : Colors.accent
                        fillColor: sceneApplied.running ? Colors.statusSuccess15
                                 : sceneSend.dirty ? Colors.accent
                                 : Colors.surfaceOverlay
                    }

                    Icon {
                        anchors.centerIn: parent
                        name: sceneApplied.running ? "check" : "send"
                        size: 12
                        emphasis: sceneApplied.running
                        color: sceneApplied.running ? Colors.statusSuccess
                             : sceneSend.dirty ? Colors.textOnAccent
                             : Colors.textMuted
                    }

                    Timer { id: sceneApplied; interval: 1500 }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            if (root.sceneDraft.trim().length) {
                                Session.setScenePrompt(root.sceneDraft.trim())
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

    // Coalesces typing bursts / rapid Enter into ONE engine round-trip.
    Timer {
        id: commitDebounce
        interval: 400
        onTriggered: {
            const p = root.promptDraft.trim()
            if (p.length) {
                Session.commitPrompt(p)
                promptApplied.restart()
            }
        }
    }

    function commitPrompt() {
        const p = promptDraft.trim()
        if (!p.length) return
        commitDebounce.restart()
    }
}
