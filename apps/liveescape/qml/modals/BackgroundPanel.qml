import QtQuick
import QtQuick.Layouts
import LiveEscape

Item {
    anchors.fill: parent
    visible: App.showBgPanel
    z: 480
    Rectangle { anchors.fill: parent; color: "#04040ae8"; MouseArea { anchors.fill: parent; onClicked: App.showBgPanel = false } }

    Rectangle {
        width: Math.min(parent.width * 0.9, 560)
        height: Math.min(parent.height * 0.8, 420)
        anchors.centerIn: parent
        radius: 14
        color: Theme.s1
        border.color: Theme.goldDim
        MouseArea { anchors.fill: parent }

        ColumnLayout {
            anchors.fill: parent
            anchors.margins: 20
            spacing: 12
            RowLayout {
                Layout.fillWidth: true
                Text { text: "BACKGROUND"; color: Theme.gold; font.family: Theme.fontUi; font.pixelSize: 16; font.bold: true; font.letterSpacing: 2; Layout.fillWidth: true }
                GhostButton { text: "✕"; onClicked: App.showBgPanel = false }
            }
            Text {
                Layout.fillWidth: true
                wrapMode: Text.WordWrap
                text: "Pick a scene — your stream updates live. Premium scenes require full license activation."
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 10
            }
            GridView {
                Layout.fillWidth: true
                Layout.fillHeight: true
                cellWidth: 120
                cellHeight: 100
                model: App.bgPresets
                clip: true
                delegate: Rectangle {
                    width: 110; height: 90
                    radius: Theme.radius
                    color: Theme.s2
                    border.color: Theme.border
                    Column {
                        anchors.centerIn: parent
                        spacing: 6
                        Text { anchors.horizontalCenter: parent.horizontalCenter; text: "🖼"; font.pixelSize: 22 }
                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: modelData.name
                            color: Theme.text
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                        }
                        Text {
                            visible: modelData.premium === true
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: "PREMIUM"
                            color: Theme.gold
                            font.family: Theme.fontMono
                            font.pixelSize: 8
                        }
                    }
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            Stream.applyPreset(modelData.name)
                            App.showBgPanel = false
                            App.toast("Background: " + modelData.name, "ok")
                        }
                    }
                }
            }
        }
    }
}
