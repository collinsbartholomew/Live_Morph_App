import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

Flickable {
    id: root
    contentHeight: col.implicitHeight
    clip: true
    boundsBehavior: Flickable.StopAtBounds

    ColumnLayout {
        id: col
        width: root.width
        spacing: 14

        Text {
            text: "Custom character / style"
            color: Colors.textSecondary
            font.family: Theme.fontSmall.family

            font.pixelSize: Theme.fontSmall.pixelSize
            font.weight: Font.DemiBold
        }

        Text { text: "Prompt"; color: Colors.textMuted; font: Theme.fontTiny }
        TextArea {
            id: promptArea
            Layout.fillWidth: true
            Layout.preferredHeight: 100
            padding: 10
            font.pixelSize: 12
            color: Colors.textPrimary
            placeholderText: "A cyberpunk assassin with glowing neon tattoos…"
            wrapMode: TextEdit.Wrap
            background: Rectangle {
                color: Colors.surfaceBase
                border.color: parent.activeFocus ? Colors.accent : Colors.surfaceBorder
                border.width: 1
                radius: Theme.radiusSm
            }
        }

        Text { text: "Negative prompt (optional)"; color: Colors.textMuted; font: Theme.fontTiny }
        TextField {
            id: negField
            Layout.fillWidth: true
            placeholderText: "blurry, low quality, deformed…"
        }

        Text { text: "Preset name (when saving)"; color: Colors.textMuted; font: Theme.fontTiny }
        TextField {
            id: nameField
            Layout.fillWidth: true
            placeholderText: "My custom style"
        }

        RowLayout {
            Layout.fillWidth: true
            spacing: 8
            PrimaryButton {
                Layout.fillWidth: true
                text: "Apply custom"
                onClicked: {
                    const p = promptArea.text.trim()
                    if (!p.length) return
                    Session.commitPrompt(p)
                    App.swapMode = "prompt"
                    App.notify("Custom prompt applied", "success")
                }
            }
            SecondaryButton {
                text: "Save preset"
                onClicked: {
                    const p = promptArea.text.trim()
                    if (!p.length) return
                    const n = nameField.text.trim() || ("Custom " + (Presets.count + 1))
                    Presets.addCustom(n, p, "prompt")
                    App.notify("Preset saved: " + n, "success")
                }
            }
        }

        Rectangle { Layout.fillWidth: true; height: 1; color: Colors.surfaceBorder }

        Text {
            text: "Saved presets"
            color: Colors.textSecondary
            font.family: Theme.fontSmall.family

            font.pixelSize: Theme.fontSmall.pixelSize
            font.weight: Font.DemiBold
        }

        Repeater {
            model: Presets
            delegate: Rectangle {
                Layout.fillWidth: true
                height: 52
                radius: Theme.radiusSm
                color: Colors.surfaceOverlay
                border.color: Colors.surfaceBorder
                border.width: 1

                RowLayout {
                    anchors.fill: parent
                    anchors.margins: 8
                    spacing: 8

                    Column {
                        Layout.fillWidth: true
                        spacing: 2
                        Text {
                            text: name
                            color: Colors.textPrimary
                            font.pixelSize: 12
                            font.weight: Font.Medium
                            elide: Text.ElideRight
                            width: parent.width
                        }
                        Text {
                            text: prompt
                            color: Colors.textMuted
                            font.pixelSize: 10
                            elide: Text.ElideRight
                            width: parent.width
                        }
                    }

                    GhostButton {
                        text: "Use"
                        onClicked: {
                            Session.commitPrompt(prompt)
                            App.notify("Applied " + name, "success")
                        }
                    }
                    GhostButton {
                        text: "↑"
                        onClicked: {
                            if (index > 0) Presets.move(index, index - 1)
                        }
                    }
                    GhostButton {
                        text: "↓"
                        onClicked: {
                            if (index < Presets.count - 1) Presets.move(index, index + 1)
                        }
                    }
                    GhostButton {
                        text: "✕"
                        onClicked: {
                            Presets.removeAt(index)
                            App.notify("Preset removed", "info")
                        }
                    }
                }
            }
        }

        Item { Layout.preferredHeight: 8; Layout.fillWidth: true }
    }

    Component.onCompleted: {
        if (Presets.count === 0)
            Presets.load()
    }
}
