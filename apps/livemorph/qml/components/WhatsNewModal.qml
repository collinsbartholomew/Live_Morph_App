import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

/**
 * What's New — release notes for the Qt6 native desktop product.
 */
Rectangle {
    id: root
    property bool open: false
    anchors.fill: parent
    color: Colors.overlayScrim
    visible: open
    z: 200
    opacity: open ? 1 : 0
    Behavior on opacity { NumberAnimation { duration: Theme.motionFast } }

    MouseArea {
        anchors.fill: parent
        onClicked: root.open = false
    }

    Rectangle {
        anchors.centerIn: parent
        width: Math.min(parent.width - 48, 480)
        height: Math.min(parent.height - 64, panelCol.implicitHeight + 24)
        radius: Theme.radiusLg
        color: Colors.surfaceOverlay
        border.color: Colors.surfaceBorder
        border.width: 1
        clip: true

        MouseArea { anchors.fill: parent /* absorb */ }

        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 1
            color: Colors.insetHighlight
        }

        ColumnLayout {
            id: panelCol
            anchors.fill: parent
            spacing: 0

            Rectangle {
                Layout.fillWidth: true
                height: 64
                color: Colors.surfaceRaised
                ColumnLayout {
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.verticalCenter: parent.verticalCenter
                    anchors.leftMargin: 20
                    anchors.rightMargin: 20
                    spacing: 2
                    Text {
                        text: qsTr("What's new")
                        color: Colors.textPrimary
                        font.pixelSize: 18
                        font.weight: Font.DemiBold
                    }
                    Text {
                        text: "LiveMorph " + (App.appVersion || "1.0.0") + " · Qt6 native"
                        color: Colors.textMuted
                        font.pixelSize: 11
                        font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
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
                    spacing: 14

                    Repeater {
                        model: [
                            {
                                title: qsTr("LiveMorph Desktop"),
                                body: qsTr("A native LiveMorph desktop built for speed and focus — Stage, Workshop, credits, and settings in one place.")
                            },
                            {
                                title: qsTr("Native media path"),
                                body: qsTr("Realtime morphing runs over native GStreamer WebRTC — in-app, no browser required.")
                            },
                            {
                                title: qsTr("Passwordless sign-in"),
                                body: qsTr("Sign in with an email code. Google sign-in appears when your LiveMorph host enables it.")
                            },
                            {
                                title: qsTr("Workshop library"),
                                body: qsTr("Character catalog, categories, search, and custom prompts — with HD when available.")
                            },
                            {
                                title: qsTr("Capture tools"),
                                body: qsTr("Record locally and use keyboard shortcuts to stay in flow.")
                            },
                            {
                                title: qsTr("Credits that travel"),
                                body: qsTr("Purchase credit packs securely — balances live on the LiveMorph service.")
                            },
                            {
                                title: qsTr("OBS & virtual camera"),
                                body: qsTr("Optional MJPEG output for OBS and virtual-camera workflows.")
                            }
                        ]
                        ColumnLayout {
                            Layout.fillWidth: true
                            spacing: 4
                            Row {
                                spacing: 8
                                Rectangle {
                                    width: 6; height: 6; radius: 3
                                    color: Colors.accent
                                    anchors.verticalCenter: parent.verticalCenter
                                }
                                Text {
                                    text: modelData.title
                                    color: Colors.textPrimary
                                    font.pixelSize: 13
                                    font.weight: Font.DemiBold
                                }
                            }
                            Text {
                                text: modelData.body
                                color: Colors.textSecondary
                                font.pixelSize: 12
                                wrapMode: Text.WordWrap
                                Layout.fillWidth: true
                                leftPadding: 14
                                lineHeight: 1.35
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
