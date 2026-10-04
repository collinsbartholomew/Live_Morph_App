import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

/**
 * StreamKitPanel — pre-built stream disclosure templates for OBS overlays.
 * 3 styles: Minimal, Playful, Pro. Copy-to-clipboard.
 */
Dialog {
    id: root
    title: qsTr("Stream Kit")
    modal: true
    anchors.centerIn: parent
    width: Math.min(500, parent ? parent.width - 48 : 500)
    closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside

    property int usageCount: 0

    readonly property var templates: [
        {
            name: "Minimal",
            text: "This stream uses AI-powered character transformation. No real face is shown to viewers."
        },
        {
            name: "Playful",
            text: "What you see is AI magic! This stream uses real-time AI face transformation. The face on screen is AI-generated."
        },
        {
            name: "Pro",
            text: "DISCLOSURE: This broadcast utilizes AI-driven facial transformation technology. All on-screen facial features are synthetically generated in real-time. No authentic facial data is transmitted or recorded."
        }
    ]

    background: Rectangle {
        color: Colors.surfaceRaised
        border.color: Colors.surfaceBorder
        border.width: 1
        radius: Theme.radiusMd
    }

    contentItem: ColumnLayout {
        spacing: 16

        Text {
            text: qsTr("Choose a disclosure template for your stream overlay. Viewers should be informed about AI usage.")
            color: Colors.textSecondary
            font.pixelSize: 12
            wrapMode: Text.WordWrap
            Layout.fillWidth: true
        }

        Repeater {
            model: root.templates
            Rectangle {
                Layout.fillWidth: true
                Layout.preferredHeight: templateCol.implicitHeight + 24
                radius: Theme.radiusSm
                color: Colors.surfaceOverlay
                border.color: Colors.surfaceBorder
                border.width: 1

                ColumnLayout {
                    id: templateCol
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    anchors.margins: 12
                    spacing: 8

                    RowLayout {
                        Text {
                            text: modelData.name
                            color: Colors.textPrimary
                            font.pixelSize: 13
                            font.weight: Font.DemiBold
                            Layout.fillWidth: true
                        }
                        GhostButton {
                            text: qsTr("Copy")
                            onClicked: {
                                Backend.copyToClipboard(modelData.text)
                                root.usageCount++
                                App.notify("Copied to clipboard", "success")
                            }
                        }
                    }

                    Text {
                        text: modelData.text
                        color: Colors.textMuted
                        font.pixelSize: 11
                        wrapMode: Text.WordWrap
                        Layout.fillWidth: true
                        lineHeight: 1.3
                    }
                }
            }
        }

        Text {
            text: root.usageCount > 0 ? qsTr("Copied %1 time(s)").arg(root.usageCount) : ""
            color: Colors.textMuted
            font.pixelSize: 10
            Layout.alignment: Qt.AlignHCenter
        }
    }
}
