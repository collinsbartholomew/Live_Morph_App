import QtQuick
import QtQuick.Controls
import LiveEscape

Column {
    id: root
    property alias label: lab.text
    property alias text: input.text
    property alias placeholderText: input.placeholderText
    property alias echoMode: input.echoMode
    property bool error: false
    property bool mono: true
    signal accepted()

    spacing: 6
    width: parent ? parent.width : 280

    Text {
        id: lab
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 10
        font.letterSpacing: 1.2
        text: "LABEL"
    }

    TextField {
        id: input
        width: parent.width
        height: 42
        color: Theme.text
        font.family: root.mono ? Theme.fontMono : Theme.fontUi
        font.pixelSize: 13
        leftPadding: 14
        rightPadding: 14
        placeholderTextColor: Theme.dim2
        selectByMouse: true
        selectionColor: Theme.goldGlowStrong
        selectedTextColor: Theme.bg
        onAccepted: root.accepted()

        background: Rectangle {
            radius: Theme.radius
            color: input.activeFocus ? Theme.s3 : Theme.s2
            border.width: input.activeFocus ? 1.5 : 1
            border.color: root.error ? Theme.red
                         : input.activeFocus ? Theme.gold
                         : Theme.border
            Behavior on border.color { ColorAnimation { duration: Theme.motionFast } }
            Behavior on color { ColorAnimation { duration: Theme.motionFast } }
            Rectangle {
                anchors.fill: parent
                anchors.margins: -2
                radius: parent.radius + 2
                color: "transparent"
                border.width: input.activeFocus ? 1 : 0
                border.color: Theme.goldGlow
                z: -1
            }
        }
    }
}
