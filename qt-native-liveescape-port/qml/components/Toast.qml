import QtQuick
import SmokeScreen

// .toast — fixed bottom 20px centered, bg --s2, 1px border, mono 10px,
// padding 7px 18px, radius 7px, z 9999, transform .3s, hidden translateY(80px).
// .toast.err red · .toast.ok teal · auto-hide 4.5s (Electron TOAST_MS).
Item {
    id: root
    anchors.fill: parent
    z: 9999
    visible: App.toastMessage.length > 0

    property string kind: App.toastKind
    property int displayMs: 4500

    Rectangle {
        id: pill
        anchors.horizontalCenter: parent.horizontalCenter
        // hidden state: translateY(80px) below the resting spot
        y: parent.height - 20 - height + 80
        width: label.implicitWidth + 36
        height: label.implicitHeight + 14
        radius: Theme.radius
        color: Theme.s2
        border.width: 1
        border.color: root.kind === "error" ? Theme.red
                    : root.kind === "ok" ? Theme.teal
                    : Theme.border
        opacity: 0

        Text {
            id: label
            anchors.centerIn: parent
            text: App.toastMessage
            color: root.kind === "error" ? Theme.red
                 : root.kind === "ok" ? Theme.teal
                 : Theme.text
            font.family: Theme.fontMono
            font.pixelSize: 10
        }

        states: State {
            name: "show"
            when: App.toastMessage.length > 0
            PropertyChanges { target: pill; opacity: 1; y: root.height - 20 - pill.height }
        }

        Behavior on opacity { NumberAnimation { duration: 300 } }
        Behavior on y { NumberAnimation { duration: 300; easing.type: Easing.OutCubic } }
    }

    Timer {
        id: hideTimer
        interval: root.displayMs
        running: App.toastMessage.length > 0
        onTriggered: App.clearToast()
    }

    // retrigger on every toast() call
    Connections {
        target: App
        function onToastSeqChanged() { if (App.toastMessage.length > 0) hideTimer.restart() }
    }
}
