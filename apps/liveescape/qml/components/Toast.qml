import QtQuick
import QtQuick.Controls
import LiveEscape

Item {
    id: root
    anchors.fill: parent
    visible: message.length > 0
    z: 9999

    property string message: App.toastMessage
    property string kind: App.toastKind
    property int animationDuration: 300
    property int displayDuration: 4500

    Rectangle {
        id: toastRect
        anchors.horizontalCenter: parent.horizontalCenter
        y: parent.height - 20 - height
        width: Math.min(messageText.implicitWidth + 36, parent.width - 40)
        height: messageText.implicitHeight + 20
        radius: Theme.radius
        color: Theme.s2
        border.color: root.kind === "error" ? Theme.red : (root.kind === "ok" ? Theme.teal : Theme.border)
        border.width: 1
        opacity: 0
        transform: Translate { y: 80 }

        Text {
            id: messageText
            anchors.centerIn: parent
            width: parent.width - 20
            wrapMode: Text.WordWrap
            text: root.message
            color: root.kind === "error" ? Theme.red : (root.kind === "ok" ? Theme.teal : Theme.text)
            font.family: Theme.fontMono
            font.pixelSize: 10
            horizontalAlignment: Text.AlignHCenter
        }

        Behavior on opacity { NumberAnimation { duration: root.animationDuration } }
        Behavior on transform { NumberAnimation { duration: root.animationDuration; easing.type: Easing.OutCubic } }

        states: [
            State {
                name: "show"
                when: root.message.length > 0
                PropertyChanges { target: toastRect; opacity: 1; transform.y: 0 }
            }
        ]
    }

    Timer {
        id: hideTimer
        interval: root.displayDuration
        running: root.message.length > 0
        repeat: false
        onTriggered: App.clearToast()
    }

    Connections {
        target: App
        function onToastChanged() {
            if (App.toastMessage.length > 0) {
                hideTimer.restart()
            }
        }
    }
}
