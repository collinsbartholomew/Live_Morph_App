import QtQuick
import LiveEscape

Rectangle {
    id: root
    property string planId: ""
    property string title: ""
    property real price: 0
    property int credits: 0
    property string timeLabel: ""
    property bool popular: false
    property var features: []
    property bool selected: false
    signal clicked()

    width: 160
    height: 220
    radius: Theme.radiusLg
    color: Theme.s2
    border.width: selected || popular ? 1.5 : 1
    border.color: selected ? Theme.gold : (popular ? Theme.teal : Theme.border)
    scale: selected ? 1.02 : 1.0
    Behavior on scale { NumberAnimation { duration: Theme.motionFast } }
    Behavior on border.color { ColorAnimation { duration: Theme.motionFast } }

    Rectangle {
        visible: root.popular
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.top: parent.top
        anchors.topMargin: -10
        width: badge.implicitWidth + 16
        height: 20
        radius: 10
        color: Theme.teal
        Text {
            id: badge
            anchors.centerIn: parent
            text: "POPULAR"
            color: Theme.bg
            font.family: Theme.fontMono
            font.pixelSize: 8
            font.bold: true
            font.letterSpacing: 1
        }
    }

    Column {
        anchors.fill: parent
        anchors.margins: 16
        spacing: 6

        Text {
            text: root.title.toUpperCase()
            color: Theme.gold
            font.family: Theme.fontUi
            font.pixelSize: 14
            font.bold: true
            font.letterSpacing: 2
        }
        Text {
            text: "$" + root.price
            color: Theme.text
            font.family: Theme.fontUi
            font.pixelSize: 28
            font.bold: true
        }
        Text {
            text: root.credits + " credits · " + root.timeLabel
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 9
        }

        Rectangle { width: parent.width; height: 1; color: Theme.border }

        Repeater {
            model: root.features
            Text {
                text: "•  " + modelData
                color: Theme.text
                font.family: Theme.fontMono
                font.pixelSize: 9
                width: parent.width
                wrapMode: Text.WordWrap
            }
        }
    }

    MouseArea {
        anchors.fill: parent
        cursorShape: Qt.PointingHandCursor
        onClicked: root.clicked()
        hoverEnabled: true
        onEntered: root.border.color = Theme.gold
        onExited: root.border.color = root.selected ? Theme.gold
                                                     : (root.popular ? Theme.teal : Theme.border)
    }
}
