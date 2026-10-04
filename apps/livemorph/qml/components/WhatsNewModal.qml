import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

/**
 * What's New modal (Electron P1 + changelog C1):
 *   eyebrow "WHAT'S NEW" (mono uppercase) · title "v{version}" 24px
 *   release headline · markdown-ish release notes (##/bold/bullets)
 *   fallback: "This update includes performance improvements and bug fixes."
 *   footer right-aligned "Got it"
 */
Rectangle {
    id: root
    property bool open: false
    // Release headline + notes for the current version (set by callers when
    // the update payload provides them; Electron renders changelog markdown)
    property string headline: ""
    property var notes: []
    anchors.fill: parent
    color: Colors.overlayScrim
    visible: open
    z: 200
    opacity: open ? 1 : 0
    Behavior on opacity { NumberAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }

    MouseArea {
        anchors.fill: parent
        onClicked: root.open = false
    }

    Rectangle {
        anchors.centerIn: parent
        width: Math.min(parent.width - 48, 448) // Electron max-w-md
        height: Math.min(parent.height - 64, panelCol.implicitHeight + 24)
        radius: Theme.radiusLg
        color: Colors.surfaceOverlay
        border.color: Colors.surfaceBorder
        border.width: 1
        clip: true

        MouseArea { anchors.fill: parent /* absorb */ }

        // panel-hairline accent gradient top
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 1
            gradient: Gradient {
                orientation: Qt.Horizontal
                GradientStop { position: 0.0; color: Colors.transparent }
                GradientStop { position: 0.5; color: Colors.accent60 }
                GradientStop { position: 1.0; color: Colors.transparent }
            }
        }

        ColumnLayout {
            id: panelCol
            anchors.fill: parent
            spacing: 0

            Rectangle {
                Layout.fillWidth: true
                height: 72
                color: Colors.surfaceRaised
                ColumnLayout {
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.verticalCenter: parent.verticalCenter
                    anchors.leftMargin: 20
                    anchors.rightMargin: 20
                    spacing: 2
                    Text {
                        text: qsTr("WHAT'S NEW")
                        color: Colors.textMuted
                        font.family: Theme.fontMono.family
                        font.pixelSize: 9
                        font.letterSpacing: 1.5
                    }
                    Text {
                        text: "v" + (App.appVersion || Backend.appVersion || "1.0.0")
                        color: Colors.textPrimary
                        font.pixelSize: 24
                        font.weight: Font.Bold
                    }
                    Text {
                        visible: root.headline.length > 0
                        text: root.headline
                        color: Colors.textSecondary
                        font.pixelSize: 13
                        wrapMode: Text.WordWrap
                        Layout.fillWidth: true
                    }
                }
            }

            Flickable {
                Layout.fillWidth: true
                Layout.fillHeight: true
                contentHeight: notesCol.implicitHeight + 24
                clip: true
                boundsBehavior: Flickable.StopAtBounds

                ColumnLayout {
                    id: notesCol
                    width: parent.width
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    anchors.margins: 20
                    spacing: 12

                    // Release notes bullets, or the Electron fallback line
                    Repeater {
                        model: root.notes.length > 0 ? root.notes : [qsTr("This update includes performance improvements and bug fixes.")]
                        Row {
                            required property var modelData
                            Layout.fillWidth: true
                            spacing: 8
                            Rectangle {
                                width: 3; height: 3; radius: 1.5
                                color: Colors.accent
                                anchors.verticalCenter: parent.verticalCenter
                            }
                            Text {
                                text: parent.modelData
                                color: Colors.textSecondary
                                font.pixelSize: 12
                                wrapMode: Text.WordWrap
                                Layout.fillWidth: true
                                lineHeight: 1.4
                            }
                        }
                    }
                }
            }

            Rectangle {
                Layout.fillWidth: true
                height: 56
                color: Colors.surfaceRaised
                Rectangle {
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    height: 1
                    color: Colors.surfaceBorder
                }
                RowLayout {
                    anchors.fill: parent
                    anchors.margins: 12
                    Item { Layout.fillWidth: true }
                    PrimaryButton {
                        text: qsTr("Got it")
                        onClicked: {
                            Config.whatsNewSeenVersion = App.appVersion || Backend.appVersion || "1.0.0"
                            root.open = false
                        }
                    }
                }
            }
        }
    }
}
