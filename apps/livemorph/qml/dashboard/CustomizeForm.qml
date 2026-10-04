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

        // ── Swap mode selector (Electron: Default/Scene/Identity) ──
        Text { text: "Swap mode"; color: Colors.textMuted; font: Theme.fontTiny }
        SegmentedControl {
            Layout.fillWidth: true
            model: [
                { "label": "Default", "value": "character" },
                { "label": "Scene", "value": "scene" },
                { "label": "Identity", "value": "identity" }
            ]
            currentValue: App.swapMode
            onActivated: (v) => App.swapMode = v
        }

        // ── Style presets (Electron prompt.stylePresets, EXACT names/prompts) ──
        Text { text: qsTr("Style presets"); color: Colors.textMuted; font: Theme.fontTiny }
        Flow {
            Layout.fillWidth: true
            spacing: 6

            Repeater {
                model: ListModel {
                    ListElement { name: "Default Swap"; prompt: "Transform into the person shown, preserving their identity and facial features." }
                    ListElement { name: "Anime"; prompt: "Transform into an anime character with large expressive eyes and stylized features." }
                    ListElement { name: "Zombie"; prompt: "Turn into a terrifying zombie with decayed skin, hollow eyes, and a deathly pale complexion." }
                    ListElement { name: "Cartoon"; prompt: "Transform into a 3D cartoon character with exaggerated proportions and bright colors." }
                    ListElement { name: "Cyberpunk"; prompt: "Transform into a futuristic cyberpunk character with neon accents and metallic implants." }
                    ListElement { name: "Old Age"; prompt: "Age the face dramatically to look like an elderly person with wrinkles and grey hair." }
                    ListElement { name: "Vampire"; prompt: "Transform into a gothic vampire with pale skin, sharp features, and red eyes." }
                    ListElement { name: "3D Animated"; prompt: "Transform into a 3D animated movie character with smooth stylized skin, big expressive eyes, and soft round features." }
                }

                Rectangle {
                    width: chipLabel.implicitWidth + 16
                    height: 28
                    radius: Theme.radiusFull
                    color: styleChipMa.containsMouse ? Colors.accent20 : Colors.surfaceOverlay
                    border.color: promptArea.text === model.prompt && model.prompt.length > 0 ? Colors.accent : Colors.surfaceBorder
                    border.width: 1

                    Text {
                        id: chipLabel
                        anchors.centerIn: parent
                        text: model.name
                        color: promptArea.text === model.prompt && model.prompt.length > 0 ? Colors.accent : Colors.textSecondary
                        font.pixelSize: 10
                        font.family: Theme.fontMono.family
                    }

                    MouseArea {
                        id: styleChipMa
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            if (model.prompt.length > 0) {
                                promptArea.text = model.prompt
                            } else {
                                promptArea.text = ""
                            }
                        }
                    }
                }
            }
        }

        Text { text: "Prompt"; color: Colors.textMuted; font: Theme.fontTiny }
        TextArea {
            id: promptArea
            Layout.fillWidth: true
            Layout.preferredHeight: 100
            padding: 10
            font.pixelSize: 12
            color: Colors.textPrimary
            placeholderText: App.swapMode === "scene"
                ? "Describe the character. Set the scene below."
                : (App.swapMode === "identity"
                    ? "Optional notes. Your face stays locked."
                    : "Describe the character transformation...")
            wrapMode: TextEdit.Wrap
            background: Rectangle {
                color: Colors.surfaceBase
                border.color: parent.activeFocus ? Colors.accent : Colors.surfaceBorder
                border.width: 1
                radius: Theme.radiusSm
            }
        }

        // ── Enhance toggle (Electron: Auto-improve prompts) ──
        RowLayout {
            Layout.fillWidth: true
            spacing: 8
            Switch {
                checked: Session.enhancePrompts
                onToggled: Session.enhancePrompts = checked
            }
            Text {
                text: "Auto-improve prompts (Optional)"
                color: Colors.textSecondary
                font.pixelSize: 11
                verticalAlignment: Text.AlignVCenter
                MouseArea {
                    id: enhanceMa
                    anchors.fill: parent
                    hoverEnabled: true
                    acceptedButtons: Qt.NoButton
                }
                Tooltip {
                    anchors.bottom: parent.top
                    anchors.bottomMargin: 4
                    text: "Lucy 2 auto-expands short prompts for better scene / background replacement and detail."
                    shown: enhanceMa.containsMouse
                }
            }
        }

        // ── Replace background toggle card (Electron prompt.background) ──
        Rectangle {
            Layout.fillWidth: true
            Layout.topMargin: 4
            height: 56
            radius: Theme.radiusSm
            color: Colors.surfaceRaised
            border.color: Colors.surfaceBorder
            border.width: 1

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 12
                anchors.rightMargin: 12
                spacing: 12

                Rectangle {
                    width: 32; height: 32; radius: Theme.radiusSm
                    color: Colors.surfaceOverlay
                    border.color: Colors.surfaceBorderSubtle
                    border.width: 1
                    Icon {
                        anchors.centerIn: parent
                        name: "image"
                        size: 16
                        color: Colors.accent
                    }
                }

                ColumnLayout {
                    spacing: 1
                    Layout.fillWidth: true
                    Text {
                        text: qsTr("Replace background")
                        color: Colors.textPrimary
                        font.pixelSize: 12
                        font.weight: Font.DemiBold
                    }
                    Text {
                        text: qsTr("Drop yourself into a new scene.")
                        color: Colors.textMuted
                        font.pixelSize: 11
                    }
                }

                Switch {
                    checked: Session.sceneEnabled
                    onToggled: {
                        Session.sceneEnabled = checked
                        if (checked) App.swapMode = "scene"
                    }
                }
            }
        }

        // ── Scene field + chips (Electron prompt.scene, EXACT prompts) ──
        ColumnLayout {
            visible: Session.sceneEnabled
            Layout.fillWidth: true
            Layout.topMargin: 4
            spacing: 6

            TextField {
                id: sceneField
                Layout.fillWidth: true
                placeholderText: qsTr("Add 2 to 3 sentences. E.g. inside a vast gothic cathedral, towering stained glass windows, dozens of flickering candles, dramatic chiaroscuro lighting, cinematic atmosphere")
                onEditingFinished: Session.setScenePrompt(text.trim())
            }

            // Horizontal chip row (Electron: 10px, px-2.5 py-1)
            Flow {
                Layout.fillWidth: true
                spacing: 6

                Repeater {
                    model: ListModel {
                        ListElement { name: "Hospital"; prompt: "in a busy hospital ward, sterile fluorescent lighting, medical equipment, white walls, blue scrubs, clinical atmosphere" }
                        ListElement { name: "Military barracks"; prompt: "in a military barracks at dawn, neat rows of bunks, morning light through windows, polished concrete floor, regulation order" }
                        ListElement { name: "Cyberpunk alley"; prompt: "in a rain-slicked neon alley at night, holographic billboards, steam rising from manholes, deep shadows, cinematic chiaroscuro lighting" }
                        ListElement { name: "Cathedral"; prompt: "inside a vast gothic cathedral, towering stained glass windows, dozens of flickering candles, stone arches and gargoyles, dramatic chiaroscuro lighting, cinematic atmosphere" }
                        ListElement { name: "Beach sunset"; prompt: "on a tropical beach at sunset, golden hour light, palm tree silhouettes, gentle waves on white sand, warm cinematic atmosphere" }
                        ListElement { name: "Tokyo rooftop"; prompt: "on a Tokyo skyscraper rooftop at night, glowing neon billboards in the distance, distant city lights, rain reflections, cinematic atmosphere" }
                    }

                    Rectangle {
                        width: sceneChipLabel.implicitWidth + 20
                        height: 24
                        radius: Theme.radiusFull
                        color: sceneChipMa.containsMouse ? Colors.accent10 : Colors.surfaceOverlay
                        border.color: Session.activeScene === model.prompt ? Colors.accent : Colors.surfaceBorder
                        border.width: 1

                        Text {
                            id: sceneChipLabel
                            anchors.centerIn: parent
                            text: model.name
                            color: Session.activeScene === model.prompt ? Colors.accent : Colors.textSecondary
                            font.pixelSize: 10
                        }

                        MouseArea {
                            id: sceneChipMa
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: {
                                sceneField.text = model.prompt
                                Session.setScenePrompt(model.prompt)
                                Session.setActiveScene(model.prompt)
                            }
                        }
                    }
                }
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
