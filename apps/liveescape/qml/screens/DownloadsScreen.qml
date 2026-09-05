import QtQuick
import QtQuick.Layouts
import LiveEscape

Item {
    id: root
    anchors.fill: parent

    Component.onCompleted: {
        App.loadDownloads()
    }

    Rectangle { anchors.fill: parent; color: Theme.bg }

    Column {
        anchors.fill: parent
        anchors.margins: 24
        spacing: 16

        Text {
            text: "DOWNLOADS"
            color: Theme.gold
            font.family: Theme.fontUi
            font.pixelSize: 24
            font.bold: true
        }

        ListView {
            id: listView
            Layout.fillWidth: true
            Layout.fillHeight: true
            clip: true
            model: App.downloadsModel || []
            delegate: Rectangle {
                width: parent.width
                height: 56
                color: index % 2 ? "#0b0b12" : "#0a0a10"
                radius: Theme.radius
                Row {
                    anchors.fill: parent
                    anchors.margins: 12
                    spacing: 12
                    Text {
                        text: modelData.name || modelData.filename || "File"
                        color: Theme.text
                        font.family: Theme.fontMono
                        font.pixelSize: 12
                        elide: Text.ElideMiddle
                        Layout.fillWidth: true
                    }
                    Text {
                        text: modelData.size || ""
                        color: Theme.dim
                        font.family: Theme.fontMono
                        font.pixelSize: 11
                    }
                    GoldButton {
                        text: "GET"
                        onClicked: {
                            if (modelData.url) ApiClient.openUrl(modelData.url)
                        }
                    }
                }
            }
        }

        Text {
            visible: (App.downloadsModel && App.downloadsModel.length === 0)
            text: "No downloads available."
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 12
            anchors.horizontalCenter: parent.horizontalCenter
        }

        GoldButton {
            text: "CLOSE"
            anchors.horizontalCenter: parent.horizontalCenter
            onClicked: App.closeDownloads()
        }
    }
}
