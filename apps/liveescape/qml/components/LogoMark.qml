import QtQuick
import LiveEscape

Item {
    id: root
    property int gemSize: 28
    property bool showWordmark: true
    property string version: "1.8"
    implicitWidth: row.implicitWidth
    implicitHeight: Math.max(gemSize, 28)

    Row {
        id: row
        spacing: 10
        anchors.verticalCenter: parent.verticalCenter

        Item {
            width: root.gemSize
            height: root.gemSize
            Rectangle {
                anchors.centerIn: parent
                width: root.gemSize * 0.72
                height: root.gemSize * 0.72
                radius: 6
                rotation: 45
                gradient: Gradient {
                    GradientStop { position: 0.0; color: Theme.gold }
                    GradientStop { position: 0.55; color: "#d4a017" }
                    GradientStop { position: 1.0; color: Theme.teal }
                }
            }
        }

        Column {
            visible: root.showWordmark
            anchors.verticalCenter: parent.verticalCenter
            spacing: 0
            Row {
                spacing: 2
                Text {
                    text: "LIVE"
                    color: Theme.text
                    font.family: Theme.fontUi
                    font.pixelSize: 16
                    font.bold: true
                    font.letterSpacing: 2
                }
                Text {
                    text: "ESCAPE"
                    color: Theme.gold
                    font.family: Theme.fontUi
                    font.pixelSize: 16
                    font.bold: true
                    font.letterSpacing: 2
                }
            }
            Text {
                text: "v" + root.version
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 9
                font.letterSpacing: 1
            }
        }
    }
}
