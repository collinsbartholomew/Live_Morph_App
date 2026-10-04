import QtQuick
import QtQuick.Layouts
import LiveEscape

Rectangle {
    id: root
    property int used: 0
    property int remaining: 0
    property int total: used + remaining

    implicitWidth: col.implicitWidth + 24
    implicitHeight: col.implicitHeight + 14
    radius: 7
    color: Theme.s2
    border.color: Theme.border
    border.width: 1

    Column {
        id: col
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.verticalCenter: parent.verticalCenter
        anchors.margins: 8
        spacing: 4

        RowLayout {
            width: parent.width
            spacing: 10

            Text {
                text: "USED  "
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 9
                font.letterSpacing: 1
            }
            Text {
                text: Math.floor(root.used) + " CR"
                color: Theme.red
                font.family: Theme.fontMono
                font.pixelSize: 9
                font.letterSpacing: 1
            }
            Rectangle { Layout.preferredWidth: 1; Layout.preferredHeight: 10; color: Theme.border; Layout.alignment: Qt.AlignVCenter }
            Text {
                text: "LEFT  "
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 9
                font.letterSpacing: 1
            }
            Text {
                text: (root.remaining >= 0 ? Math.floor(root.remaining) : "—") + " CR"
                color: Theme.teal
                font.family: Theme.fontMono
                font.pixelSize: 9
                font.letterSpacing: 1
            }
        }

        Rectangle {
            width: parent.width
            height: 3
            radius: 2
            color: Theme.border

            Rectangle {
                height: parent.height
                radius: 2
                color: Theme.teal
                width: root.total > 0 ? parent.width * Math.max(0, Math.min(1, root.remaining / root.total)) : parent.width
                Behavior on width { NumberAnimation { duration: 500 } }
            }
        }
    }
}
