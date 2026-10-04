import LiveEscape
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

/**
 * NotificationModal — server-pushed announcement / dashboard notification.
 * API unchanged: App.showNotification, App.notificationTitle/Message, dismissNotification().
 * Modern chrome: glass card, icon badge, inset highlight, subtle entrance.
 */
Item {
    id: root

    readonly property bool open: App.showNotification

    anchors.fill: parent
    visible: false
    z: 560
    focus: root.open
    Keys.onEscapePressed: App.dismissNotification()
    onOpenChanged: {
        if (root.open) {
            forceActiveFocus();
        }
    }
    // Entrance gated on open; no idle animation
    opacity: 0
    state: root.open ? "open" : "hidden"
    states: [
        State {
            name: "hidden"

            PropertyChanges {
                target: root
                visible: false
                opacity: 0
            }

        },
        State {
            name: "open"

            PropertyChanges {
                target: root
                visible: true
                opacity: 1
            }

        }
    ]

    // Auto-dismiss after a while so an announcement never blocks the UI forever
    Timer {
        running: root.open
        interval: 10000
        onTriggered: App.dismissNotification()
    }

    Rectangle {
        anchors.fill: parent
        color: Theme.scrim

        MouseArea {
            anchors.fill: parent
            onClicked: App.dismissNotification()
        }

    }

    Rectangle {
        id: card

        width: Math.min(parent.width * 0.9, 420)
        implicitHeight: col.implicitHeight + 32
        anchors.centerIn: parent
        radius: Theme.radiusXl
        color: Theme.glass
        border.color: Theme.goldDim
        border.width: 1
        scale: root.open ? 1 : 0.96
        transformOrigin: Item.Center

        MouseArea {
            anchors.fill: parent
        }

        // Inset top highlight
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 1
            color: Theme.insetHighlight
            radius: Theme.radiusXl
        }

        Column {
            id: col

            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.margins: 24
            spacing: 14

            RowLayout {
                spacing: 12
                anchors.left: parent.left
                anchors.right: parent.right

                Rectangle {
                    Layout.preferredWidth: 40
                    Layout.preferredHeight: 40
                    radius: 20
                    color: Theme.goldGlow
                    border.color: Theme.goldDim
                    border.width: 1

                    Text {
                        anchors.centerIn: parent
                        text: qsTr("✦")
                        color: Theme.gold
                        font.pixelSize: 18
                    }

                }

                Column {
                    spacing: 2
                    Layout.fillWidth: true
                    Layout.alignment: Qt.AlignVCenter

                    Text {
                        text: App.notificationTitle
                        color: Theme.gold
                        font.family: Theme.fontUi
                        font.pixelSize: 16
                        font.bold: true
                        font.letterSpacing: 2
                        elide: Text.ElideRight
                        width: parent.width
                    }

                    Text {
                        text: qsTr("Announcement")
                        color: Theme.dim
                        font.family: Theme.fontMono
                        font.pixelSize: 10
                        font.letterSpacing: 1
                    }

                }

            }

            Text {
                width: parent.width
                wrapMode: Text.WordWrap
                text: App.notificationMessage
                color: Theme.text
                font.family: Theme.fontMono
                font.pixelSize: 11
                lineHeight: 1.4
            }

            Rectangle {
                width: parent.width
                height: 1
                color: Theme.divider
            }

            Row {
                spacing: 10
                anchors.right: parent.right

                GoldButton {
                    text: qsTr("GOT IT")
                    onClicked: App.dismissNotification()
                }

            }

        }

        Behavior on scale {
            NumberAnimation {
                duration: Theme.motionNormal
                easing.type: Easing.OutCubic
            }

        }

    }

    Behavior on opacity {
        NumberAnimation {
            duration: Theme.motionNormal
        }

    }

}
