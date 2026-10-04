import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

/**
 * BackgroundBar — scene/background selector bar with presets and custom input.
 * Shows below the prompt bar during live morph sessions.
 */
RowLayout {
    id: root
    spacing: 8

    property string activePreset: "none"

    Component.onCompleted: Backend.fetchBackgroundPresets()

    Text {
        text: qsTr("Background:")
        color: Colors.textMuted
        font.pixelSize: 11
        font.weight: Font.Medium
    }

    // "None" chip (always present)
    Rectangle {
        width: noneLabel.implicitWidth + 16
        height: 26
        radius: 13
        color: root.activePreset === "none" ? Colors.accentMuted : Colors.surfaceOverlay
        border.color: root.activePreset === "none" ? Colors.accent : Colors.surfaceBorder
        border.width: 1
        Text {
            id: noneLabel
            anchors.centerIn: parent
            text: qsTr("None")
            color: root.activePreset === "none" ? Colors.accent : Colors.textSecondary
            font.pixelSize: 11
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: {
                root.activePreset = "none"
                Backend.selectBackground("none", "")
                App.notify("Background: None", "info")
            }
        }
    }

    // Hardcoded scene presets (Electron parity)
    Repeater {
        model: ListModel {
            ListElement { sceneId: "hospital";    label: "Hospital";            prompt: "Bright hospital room, sterile lighting, white walls" }
            ListElement { sceneId: "military";    label: "Military Barracks";    prompt: "Military barracks interior, bunk beds, harsh lighting" }
            ListElement { sceneId: "cyberpunk";   label: "Cyberpunk Alley";      prompt: "Neon-lit cyberpunk alley, rain reflections, holographic signs" }
            ListElement { sceneId: "cathedral";   label: "Cathedral";            prompt: "Grand cathedral interior, stained glass, dramatic lighting" }
            ListElement { sceneId: "beach";       label: "Beach Sunset";         prompt: "Tropical beach at sunset, golden hour, warm tones" }
            ListElement { sceneId: "tokyo";       label: "Tokyo Rooftop";        prompt: "Tokyo rooftop at night, city lights, neon skyline" }
        }
        Rectangle {
            width: sceneLabel.implicitWidth + 16
            height: 26
            radius: 13
            color: modelData.sceneId === root.activePreset ? Colors.accentMuted : Colors.surfaceOverlay
            border.color: modelData.sceneId === root.activePreset ? Colors.accent : Colors.surfaceBorder
            border.width: 1
            Text {
                id: sceneLabel
                anchors.centerIn: parent
                text: modelData.label
                color: modelData.sceneId === root.activePreset ? Colors.accent : Colors.textSecondary
                font.pixelSize: 11
                font.weight: modelData.sceneId === root.activePreset ? Font.DemiBold : Font.Normal
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: {
                    root.activePreset = modelData.sceneId
                    Backend.selectBackground(modelData.sceneId, modelData.prompt)
                    App.notify("Background: " + modelData.label, "info")
                }
            }
        }
    }

    // Server-driven presets
    Repeater {
        model: Backend.backgroundPresets
        Rectangle {
            width: bgLabel.implicitWidth + 16
            height: 26
            radius: 13
            color: modelData.id === root.activePreset ? Colors.accentMuted : Colors.surfaceOverlay
            border.color: modelData.id === root.activePreset ? Colors.accent : Colors.surfaceBorder
            border.width: 1
            Text {
                id: bgLabel
                anchors.centerIn: parent
                text: modelData.label || modelData.id
                color: modelData.id === root.activePreset ? Colors.accent : Colors.textSecondary
                font.pixelSize: 11
                font.weight: modelData.id === root.activePreset ? Font.DemiBold : Font.Normal
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: {
                    root.activePreset = modelData.id
                    Backend.selectBackground(modelData.id, modelData.prompt || "")
                    App.notify("Background: " + (modelData.label || modelData.id), "info")
                }
            }
        }
    }

    // Custom background input
    TextField {
        Layout.preferredWidth: 140
        Layout.preferredHeight: 26
        placeholderText: qsTr("Custom scene…")
        font.pixelSize: 11
        color: Colors.textPrimary
        background: Rectangle {
            color: Colors.surfaceBase
            border.color: parent.activeFocus ? Colors.accent : Colors.surfaceBorder
            border.width: 1
            radius: Theme.radiusSm
        }
        onAccepted: {
            if (text.trim().length > 0) {
                root.activePreset = "custom"
                Backend.selectBackground("custom", text.trim())
                App.notify("Custom background applied", "success")
            }
        }
    }
}
