import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

/**
 * Dual prompt / scene bars — original prompt surface.
 */
Rectangle {
    id: root
    color: Colors.surfaceBase
    border.color: Colors.surfaceBorder
    radius: Theme.radiusSm
    implicitHeight: col.implicitHeight + 12

    ColumnLayout {
        id: col
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.verticalCenter: parent.verticalCenter
        anchors.margins: 8
        spacing: 6

        RowLayout {
            Layout.fillWidth: true
            spacing: 8
            Text {
                text: "PROMPT"
                color: Colors.textMuted
                font.pixelSize: 9
                font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                font.weight: Font.Bold
                font.letterSpacing: 1.35
                Layout.preferredWidth: 56
            }
            TextField {
                id: promptField
                Layout.fillWidth: true
                Layout.preferredHeight: 34
                placeholderText: Session.activePrompt.length ? Session.activePrompt : "Describe the character or style…"
                text: Session.activePrompt
                color: Colors.textPrimary
                placeholderTextColor: Colors.textMuted
                font.pixelSize: 12
                background: Rectangle {
                    radius: Theme.radiusSm
                    color: "#17171f80"
                    border.color: promptField.activeFocus ? Colors.accent : Colors.surfaceBorder
                    border.width: promptField.activeFocus ? 1.5 : 1
                }
                onEditingFinished: {
                    if (text.trim().length)
                        Session.commitPrompt(text.trim())
                }
                Keys.onReturnPressed: {
                    if (text.trim().length) {
                        Session.commitPrompt(text.trim())
                        App.notify("Prompt applied", "success")
                    }
                }
            }
            GhostButton {
                text: "Apply"
                ToolTip.visible: hovered
                ToolTip.delay: 400
                ToolTip.text: "Commit prompt to live session"
                onClicked: {
                    if (promptField.text.trim().length) {
                        Session.commitPrompt(promptField.text.trim())
                        App.notify("Prompt applied", "success")
                    }
                }
            }
        }

        RowLayout {
            Layout.fillWidth: true
            spacing: 8
            Text {
                text: "SCENE"
                color: Colors.textMuted
                font.pixelSize: 9
                font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                font.weight: Font.Bold
                font.letterSpacing: 1.35
                Layout.preferredWidth: 56
            }
            TextField {
                id: sceneField
                Layout.fillWidth: true
                Layout.preferredHeight: 34
                placeholderText: "Optional background / scene description…"
                text: Session.scenePrompt || ""
                color: Colors.textPrimary
                placeholderTextColor: Colors.textMuted
                font.pixelSize: 12
                background: Rectangle {
                    radius: Theme.radiusSm
                    color: "#17171f80"
                    border.color: sceneField.activeFocus ? Colors.accent : Colors.surfaceBorder
                    border.width: sceneField.activeFocus ? 1.5 : 1
                }
                onEditingFinished: Session.setScenePrompt(text.trim())
                Keys.onReturnPressed: Session.setScenePrompt(text.trim())
            }
            Switch {
                checked: Session.identityLockEnabled
                onToggled: Session.identityLockEnabled = checked
            }
            Text {
                text: "ID lock"
                color: Colors.textMuted
                font.pixelSize: 10
                MouseArea {
                    id: idMa
                    anchors.fill: parent
                    hoverEnabled: true
                    acceptedButtons: Qt.NoButton
                }
                Tooltip {
                    anchors.bottom: parent.top
                    anchors.bottomMargin: 4
                    text: "Keep face identity stable"
                    shown: idMa.containsMouse
                }
            }
        }
    }
}
