import QtQuick
import SmokeScreen

// #getStartedModal — z 520. Post-signup choice.
ModalBase {
    open: App.showGetStarted
    modalZ: 520
    panelMaxWidth: 480
    closeOnBackdrop: false
    onClose: {}

    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: "🚀"
        font.pixelSize: 42
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("Welcome to Smoke Screen")
        color: Theme.gold
        font.family: Theme.fontUi
        font.pixelSize: 20
        font.weight: Font.Bold
        font.letterSpacing: 3
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("Choose how you want to get started")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 10
        font.letterSpacing: 1.5
        bottomPadding: 8
    }

    // Option 1: Activate Now (135deg gold gradient)
    Rectangle {
        width: parent.width
        height: opt1Col.implicitHeight + 32
        radius: 10
        gradient: Gradient {
            GradientStop { position: 0; color: "#f7d060" }
            GradientStop { position: 0.55; color: "#f0a830" }
            GradientStop { position: 1; color: "#d4711a" }
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: App.getStartedActivate()
        }
        Row {
            id: opt1Col
            anchors.centerIn: parent
            spacing: 14
            Text {
                anchors.verticalCenter: parent.verticalCenter
                font.pixelSize: 28
                text: "🔓"
            }
            Column {
                anchors.verticalCenter: parent.verticalCenter
                spacing: 2
                Text {
                    text: qsTr("ACTIVATE NOW")
                    color: Theme.goldInk
                    font.family: Theme.fontUi
                    font.pixelSize: 15
                    font.weight: Font.Bold
                    font.letterSpacing: 1.5
                }
                Text {
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
    Text {
        width: parent.width
        text: qsTr("Recommended for serious users. One-time fee, lifetime access to all features.")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 8
        font.letterSpacing: 0.5
        lineHeight: 1.5
        wrapMode: Text.WordWrap
    }

    // Option 2: Try First
    Rectangle {
        width: parent.width
        height: opt2Col.implicitHeight + 24
        radius: 10
        color: Theme.s2
        border.width: 1
        border.color: opt2Hover.containsMouse ? Theme.teal : Theme.border
        MouseArea {
            id: opt2Hover
            anchors.fill: parent
            hoverEnabled: true
            cursorShape: Qt.PointingHandCursor
            onClicked: App.getStartedTryFirst()
        }
        Row {
            id: opt2Col
            anchors.centerIn: parent
            spacing: 14
            Text {
                anchors.verticalCenter: parent.verticalCenter
                font.pixelSize: 28
                text: "🧪"
            }
            Column {
                anchors.verticalCenter: parent.verticalCenter
                spacing: 2
                Text {
                    text: qsTr("TRY FIRST — $10")
                    color: Theme.teal
                    font.family: Theme.fontUi
                    font.pixelSize: 15
                    font.weight: Font.Bold
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
    }
    Text {
        width: parent.width
        text: qsTr("Starter credits let you stream for ~4 minutes. Once exhausted, you'll need to activate your license to continue.")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 8
        font.letterSpacing: 0.5
        lineHeight: 1.5
        wrapMode: Text.WordWrap
    }
}
