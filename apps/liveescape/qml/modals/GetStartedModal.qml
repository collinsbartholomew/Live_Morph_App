import LiveEscape
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ModalBase {
    open: App.showGetStarted
    modalZ: 520
    panelWidth: Math.min(parent.width * 0.92, 480)
    closeOnBackdrop: false
    onClose: App.showGetStarted = false

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 4
        spacing: 16

        Text {
            Layout.alignment: Qt.AlignHCenter
            text: "🚀"
            font.pixelSize: 42
        }

        Text {
            Layout.alignment: Qt.AlignHCenter
            text: qsTr("Welcome to Live Escape")
            color: Theme.gold
            font.family: Theme.fontUi
            font.pixelSize: 20
            font.bold: true
            font.letterSpacing: 3
        }

        Text {
            Layout.alignment: Qt.AlignHCenter
            text: qsTr("Choose how you want to get started")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 10
            font.letterSpacing: 1.5
        }

        // Option 1: Activate Now
        Rectangle {
            Layout.fillWidth: true
            height: activateContent.implicitHeight + 32
            radius: 10
            color: "transparent"
            border.width: 1
            border.color: ma1.containsMouse ? "transparent" : "transparent"
            MouseArea {
                id: ma1
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: App.getStartedActivate()
                onEntered: activateRect.color = "#3a3418"
                onExited: activateRect.color = "transparent"
            }

            Rectangle {
                id: activateRect
                anchors.fill: parent
                anchors.margins: 1
                radius: 9
                gradient: Gradient {
                    GradientStop { position: 0; color: "#f7d060" }
                    GradientStop { position: 0.55; color: "#f0a830" }
                    GradientStop { position: 1; color: "#d4711a" }
                }
                Behavior on color { ColorAnimation { duration: 200 } }

                Row {
                    id: activateContent
                    anchors.centerIn: parent
                    spacing: 14
                    anchors.leftMargin: 16
                    anchors.rightMargin: 16
                    anchors.topMargin: 16
                    anchors.bottomMargin: 16

                    Text {
                        font.pixelSize: 28
                        text: "🔓"
                    }

                    Column {
                        spacing: 2
                        Text {
                            text: qsTr("ACTIVATE NOW")
                            color: Theme.bg
                            font.family: Theme.fontUi
                            font.pixelSize: 15
                            font.bold: true
                            font.letterSpacing: 1.5
                        }
                        Text {
                            id: activationFeeText
                            text: qsTr("Pay $75 one-time activation fee — unlock full permanent access + buy credits")
                            color: Qt.rgba(26/255, 10/255, 0/255, 0.7)
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 0.5
                            lineHeight: 1.4
                        }
                    }
                }
            }

            transform: Translate {
                id: activateTransform
                y: ma1.containsMouse ? -1 : 0
                Behavior on y { NumberAnimation { duration: 200 } }
            }
        }

        Text {
            Layout.fillWidth: true
            wrapMode: Text.WordWrap
            text: qsTr("Recommended for serious users. One-time fee, lifetime access to all features.")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 8
            font.letterSpacing: 0.5
            lineHeight: 1.5
        }

        // Option 2: Try First
        Rectangle {
            Layout.fillWidth: true
            height: tryContent.implicitHeight + 24
            radius: 10
            border.width: 1
            border.color: ma2.containsMouse ? Theme.teal : Theme.border
            color: Theme.s2
            MouseArea {
                id: ma2
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: App.getStartedTryFirst()
            }

            Row {
                id: tryContent
                anchors.centerIn: parent
                spacing: 14
                anchors.margins: 16

                Text {
                    font.pixelSize: 28
                    text: "🧪"
                }

                Column {
                    spacing: 2
                    Text {
                        text: qsTr("TRY FIRST — $10")
                        color: Theme.teal
                        font.family: Theme.fontUi
                        font.pixelSize: 15
                        font.bold: true
                        font.letterSpacing: 1.5
                    }
                    Text {
                        text: qsTr("Purchase a Starter Pack with 500 credits and test the platform before activating")
                        color: Theme.dim
                        font.family: Theme.fontMono
                        font.pixelSize: 9
                        font.letterSpacing: 0.5
                        lineHeight: 1.4
                    }
                }
            }

            transform: Translate {
                y: ma2.containsMouse ? -1 : 0
                Behavior on y { NumberAnimation { duration: 200 } }
            }
        }

        Text {
            Layout.fillWidth: true
            wrapMode: Text.WordWrap
            text: qsTr("Starter credits let you stream for ~4 minutes. Once exhausted, you'll need to activate your license to continue.")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 8
            font.letterSpacing: 0.5
            lineHeight: 1.5
        }
    }
}