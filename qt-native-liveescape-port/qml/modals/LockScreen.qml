import QtQuick
import SmokeScreen

// #lockScreen — z 9999. Full-screen red radial; credits exhausted.
Item {
    anchors.fill: parent
    visible: App.showLockScreen
    z: 9999

    Rectangle {
        anchors.fill: parent
        color: Theme.bg
    }
    Rectangle {
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        height: parent.height * 0.55
        gradient: Gradient {
            GradientStop { position: 0; color: Qt.rgba(255/255, 77/255, 109/255, 0.07) }
            GradientStop { position: 1; color: Qt.rgba(4/255, 4/255, 10/255, 0) }
        }
    }

    Column {
        anchors.centerIn: parent
        width: Math.min(parent.width - 64, 500)
        spacing: 14

        Text {
            width: parent.width
            horizontalAlignment: Text.AlignHCenter
            text: "🔒"
            font.pixelSize: 54
        }
        Text {
            width: parent.width
            horizontalAlignment: Text.AlignHCenter
            text: qsTr("CREDITS EXHAUSTED")
            color: Theme.red
            font.family: Theme.fontUi
            font.pixelSize: 24
            font.weight: Font.Bold
            font.letterSpacing: 3
        }
        Text {
            width: parent.width
            horizontalAlignment: Text.AlignHCenter
            textFormat: Text.RichText
            text: qsTr("Your <b style='color:#e8e8f8'>Smoke Screen</b> credit balance has reached zero.<br>All streaming has been stopped automatically.")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 10
            lineHeight: 1.7
        }
        Text {
            width: parent.width
            horizontalAlignment: Text.AlignHCenter
            text: qsTr("You can close this message to continue using the app UI, but streaming will remain blocked until you top up.")
            color: Theme.gold
            font.family: Theme.fontMono
            font.pixelSize: 10
            lineHeight: 1.7
            wrapMode: Text.WordWrap
        }

        Rectangle {
            width: parent.width
            height: 76
            radius: Theme.radius
            color: Theme.s2
            border.width: 1
            border.color: Qt.rgba(255/255, 77/255, 109/255, 0.2)
            Column {
                anchors.fill: parent
                anchors.margins: 12
                spacing: 6
                Row {
                    width: parent.width
                    Text {
                        text: qsTr("PLAN CREDITS")
                        color: Theme.dim
                        font.family: Theme.fontMono
                        font.pixelSize: 9
                        font.letterSpacing: 1
                    }
                    Item { width: parent.width - 160; height: 1 }
                    Text {
                        text: Math.round(Session.creditsTotal) + " CR"
                        color: Theme.gold
                        font.family: Theme.fontMono
                        font.pixelSize: 9
                        font.bold: true
                    }
                }
                Row {
                    width: parent.width
                    Text {
                        text: qsTr("CREDITS USED")
                        color: Theme.dim
                        font.family: Theme.fontMono
                        font.pixelSize: 9
                        font.letterSpacing: 1
                    }
                    Item { width: parent.width - 160; height: 1 }
                    Text {
                        text: Math.round(Session.creditsUsed) + " CR"
                        color: Theme.red
                        font.family: Theme.fontMono
                        font.pixelSize: 9
                        font.bold: true
                    }
                }
                Rectangle {
                    width: parent.width
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

        Rectangle {
            width: parent.width
            height: 42
            radius: Theme.radius
            color: Theme.gold
            Text {
                anchors.centerIn: parent
                text: qsTr("🎟️ BUY MORE CREDITS")
                color: Theme.bg
                font.family: Theme.fontUi
                font.pixelSize: 15
                font.weight: Font.Bold
                font.letterSpacing: 2
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: {
                    App.dismissLockScreen()
                    App.showPlanGate = true
                }
            }
        }
        Rectangle {
            width: parent.width
            height: 38
            radius: Theme.radius
            color: "transparent"
            border.width: 1
            border.color: Qt.rgba(63/255, 232/255, 184/255, 0.3)
            Text {
                anchors.centerIn: parent
                text: qsTr("💬 CONTACT PROVIDER VIA WHATSAPP")
                color: Theme.teal
                font.family: Theme.fontMono
                font.pixelSize: 10
                font.letterSpacing: 1
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: App.openExternal("https://wa.me/2347040981886")
            }
        }
    }

    // ✕ dismiss
    Rectangle {
        anchors.top: parent.top
        anchors.right: parent.right
        anchors.margins: 18
        width: 32
        height: 32
        radius: 16
        color: "transparent"
        border.width: 1
        border.color: Qt.rgba(255, 255, 255, 0.15)
        Text {
            anchors.centerIn: parent
            text: "×"
            color: Theme.dim
            font.pixelSize: 18
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: App.dismissLockScreen()
        }
    }
}
