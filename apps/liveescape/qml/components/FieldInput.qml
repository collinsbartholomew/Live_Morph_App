import QtQuick
import QtQuick.Controls
import LiveEscape

Column {
    id: root
    property alias label: lab.text
    property alias text: input.text
    property alias placeholderText: input.placeholderText
    property alias echoMode: input.echoMode
    property alias font: input.font
    property bool error: false
    property bool mono: true
    property string accessibleName: lab.text
    property string accessibleDescription: ""
    signal accepted()

    spacing: 5
    width: parent ? parent.width : 280

    Text {
        id: lab
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 9
        font.letterSpacing: 1.5
        text: qsTr("LABEL")
    }

    TextField {
        id: input
        width: parent.width
        height: 38
        color: Theme.text
        font.family: root.mono ? Theme.fontMono : Theme.fontUi
        font.pixelSize: 11
        leftPadding: 11
        rightPadding: 11
        placeholderTextColor: Theme.dim2
        selectByMouse: true
        selectionColor: Theme.goldGlowStrong
        selectedTextColor: Theme.bg
        onAccepted: root.accepted()

        Accessible.role: Accessible.EditableText
        Accessible.name: root.accessibleName
        Accessible.description: root.accessibleDescription

        background: Rectangle {
            radius: Theme.radius
            color: Theme.s2
            border.width: 1
            border.color: root.error ? Theme.red
                         : input.activeFocus ? Theme.goldD
                         : Theme.border
            Behavior on border.color { ColorAnimation { duration: Theme.motionFast } }
            Rectangle {
                anchors.fill: parent
                anchors.margins: -2
                radius: parent.radius + 2
                color: "transparent"
                border.width: 2
                border.color: input.activeFocus && !root.error ? Theme.goldG : "transparent"
                z: -1
            }
        }
    }
}
