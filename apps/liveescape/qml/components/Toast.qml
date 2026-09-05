import LiveEscape
import QtQuick

/**
 * Toast — transient severity toast (gold/teal theme).
 * API unchanged: `message` + `kind` (info | ok | warn | error).
 *
 * Auto-dismiss restarts on every new toast (including identical messages,
 * tracked via App.toastSeq), so a rapid sequence can't truncate or vanish.
 * Entrance and exit are both animated; no idle animation.
 */
Item {
    id: root

    property string message: ""
    property string kind: "info" // info | ok | warn | error
    readonly property bool active: message.length > 0
    readonly property color accentColor: {
        if (kind === "error")
            return Theme.red;

        if (kind === "warn")
            return Theme.gold;

        if (kind === "ok")
            return Theme.teal;

        return Theme.text;
    }
    readonly property color accentBg: {
        if (kind === "error")
            return Theme.redDim;

        if (kind === "warn")
            return Theme.warnDim;

        if (kind === "ok")
            return Theme.tealDim;

        return Theme.s1;
    }
    readonly property string icon: {
        if (kind === "error")
            return "✕";

        if (kind === "warn")
            return "!";

        if (kind === "ok")
            return "✓";

        return "◦";
    }

    visible: false
    anchors.horizontalCenter: parent.horizontalCenter
    anchors.bottom: parent.bottom
    anchors.bottomMargin: 28
    width: Math.min(parent.width - 40, Math.max(240, card.implicitWidth + 36))
    height: card.implicitHeight + 8
    z: 1000
    state: active ? "shown" : "hidden"
    onMessageChanged: {
        if (root.active) {
            dismissTimer.restart();
        }
    }
    onKindChanged: {
        if (root.active) {
            dismissTimer.restart();
        }
    }
    states: [
        State {
            name: "shown"

            PropertyChanges {
                target: root
                visible: true
                opacity: 1
                scale: 1
            }

        },
        State {
            name: "hidden"

            PropertyChanges {
                target: root
                opacity: 0
                scale: 0.96
            }

        }
    ]
    transitions: [
        Transition {
            from: "hidden"
            to: "shown"

            NumberAnimation {
                properties: "opacity,scale"
                duration: Theme.motionNormal
                easing.type: Easing.OutCubic
            }

        },
        Transition {
            from: "shown"
            to: "hidden"

            SequentialAnimation {
                NumberAnimation {
                    properties: "opacity,scale"
                    duration: 180
                    easing.type: Easing.InQuad
                }

                PropertyAction {
                    target: root
                    property: "visible"
                    value: false
                }

            }

        }
    ]

    Rectangle {
        id: card

        anchors.fill: parent
        radius: Theme.radiusLg
        color: root.accentBg
        border.color: Qt.rgba(root.accentColor.r, root.accentColor.g, root.accentColor.b, 0.4)
        border.width: 1

        // Left accent bar
        Rectangle {
            width: 3
            anchors.left: parent.left
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            anchors.margins: 1
            radius: 2
            color: root.accentColor
        }

        Row {
            spacing: 10
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.verticalCenter: parent.verticalCenter
            anchors.leftMargin: 16
            anchors.rightMargin: 16

            Rectangle {
                width: 22
                height: 22
                radius: 11
                color: Qt.rgba(root.accentColor.r, root.accentColor.g, root.accentColor.b, 0.18)

                Text {
                    anchors.centerIn: parent
                    text: root.icon
                    color: root.accentColor
                    font.family: Theme.fontMono
                    font.pixelSize: 12
                    font.bold: true
                }

            }

            Text {
                id: msg

                width: parent.width - 34
                text: root.message
                color: root.accentColor === Theme.text ? Theme.text : root.accentColor
                font.family: Theme.fontMono
                font.pixelSize: 11
                wrapMode: Text.WordWrap
                anchors.verticalCenter: parent.verticalCenter
            }

            Text {
                text: "×"
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 14
                anchors.verticalCenter: parent.verticalCenter

                MouseArea {
                    anchors.fill: parent
                    anchors.margins: -6
                    cursorShape: Qt.PointingHandCursor
                    onClicked: App.clearToast()
                }

            }

        }

    }

    Timer {
        id: dismissTimer

        interval: 3200
        onTriggered: App.clearToast()
    }

    // Restart the countdown on every new toast, including identical messages
    Connections {
        function onToastSeqChanged() {
            if (root.active)
                dismissTimer.restart();

        }

        target: App
    }

}
