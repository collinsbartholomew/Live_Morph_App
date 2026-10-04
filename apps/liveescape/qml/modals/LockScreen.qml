import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveEscape

// Full-screen lock for session conflict, force-lock, or storage-reset.
Item {
    id: root
    anchors.fill: parent
    visible: App.showLockScreen
    z: 800

    // Electron #lockScreen: radial-gradient(ellipse at 50% 0%, rgba(255,77,109,.07) 0%, rgba(4,4,10,.98) 55%)
    Rectangle {
        anchors.fill: parent
        gradient: Gradient {
            GradientStop { position: 0; color: Qt.rgba(255/255, 77/255, 109/255, 0.07) }
            GradientStop { position: 0.55; color: "#04040a" }
            GradientStop { position: 1; color: "#04040a" }
        }

        Column {
            anchors.centerIn: parent
            spacing: 18
            width: Math.min(parent.width - 64, 440)

            Text {
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                text: qsTr("🔒")
                font.pixelSize: 54
            }
            Text {
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                text: App.lockTitle.length ? App.lockTitle : "CREDITS EXHAUSTED"
                color: Theme.red
                font.family: Theme.fontUi
                font.pixelSize: 22
                font.bold: true
                font.letterSpacing: 4
            }
            Text {
                width: parent.width
                wrapMode: Text.WordWrap
                horizontalAlignment: Text.AlignHCenter
                text: App.lockMessage.length
                      ? App.lockMessage
                      : "Your credit balance has reached zero.\nAll streaming has been stopped automatically."
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 10
                lineHeight: 1.9
            }

            Rectangle {
                width: parent.width
                height: creditsBox.implicitHeight + 24
                radius: Theme.radius
                color: Theme.s2
                border.color: Theme.redDim
                border.width: 1

                ColumnLayout {
                    id: creditsBox
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    anchors.margins: 12
                    spacing: 10

                    RowLayout {
                        Layout.fillWidth: true

                        Column {
                            Layout.fillWidth: true
                            spacing: 2

                            Text {
                                text: "PLAN CREDITS"
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 8
                                font.letterSpacing: 2
                            }
                            Text {
                                text: Math.floor(Session.creditsTotal)
                                color: Theme.gold
                                font.family: Theme.fontMono
                                font.pixelSize: 15
                                font.bold: true
                            }
                        }

                        Column {
                            Layout.fillWidth: true
                            spacing: 2

                            Text {
                                text: "CREDITS USED"
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 8
                                font.letterSpacing: 2
                            }
                            Text {
                                text: Math.floor(Session.creditsUsed)
                                color: Theme.red
                                font.family: Theme.fontMono
                                font.pixelSize: 15
                                font.bold: true
                            }
                        }
                    }

                    Rectangle {
                        Layout.fillWidth: true
                        height: 4
                        radius: 2
                        color: Theme.border

                        Rectangle {
                            width: parent.width
                            height: parent.height
                            radius: 2
                            color: Theme.red
                        }
                    }
                }
            }

            GoldButton {
                width: parent.width
                text: App.lockTitle.indexOf("CREDITS") >= 0 ? "🎟️ BUY MORE CREDITS" : "RETURN TO LOGIN"
                onClicked: {
                    if (App.lockTitle.indexOf("CREDITS") >= 0) {
                        App.dismissLockScreen()
                        App.showPlanGate = true
                    } else {
                        App.dismissLockScreen()
                        App.logout()
                    }
                }
            }
            GhostButton {
                width: parent.width
                visible: App.lockTitle.indexOf("CREDITS") >= 0
                text: qsTr("📞 CONTACT SUPPORT VIA WHATSAPP")
                onClicked: {
                    App.dismissLockScreen()
                    App.openExternal("https://wa.me/2348123456789")
                }
            }
            GhostButton {
                width: parent.width
                text: qsTr("Dismiss")
                visible: App.lockDismissable
                onClicked: App.dismissLockScreen()
            }
        }
    }
}
