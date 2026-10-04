import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveEscape

Item {
    id: root
    anchors.fill: parent

    // Load on-demand when the screen becomes visible — the eager
    // Component.onCompleted fetch fired an unauthenticated request at app
    // boot (Main.qml instantiates this screen before auth).
    onVisibleChanged: {
        if (visible && Session.authenticated)
            App.loadDownloads()
    }

    Rectangle { anchors.fill: parent; color: Theme.bg }

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 24
        spacing: 16

        Text {
            text: qsTr("DOWNLOADS")
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
                RowLayout {
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
                        text: qsTr("GET")
                        onClicked: {
                            if (modelData.url) App.openExternal(modelData.url)
                        }
                    }
                }
            }
        }

        Text {
            visible: (App.downloadsModel && App.downloadsModel.length === 0)
            text: qsTr("No downloads available.")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 12
            Layout.alignment: Qt.AlignHCenter
        }

        GoldButton {
            text: qsTr("CLOSE")
            Layout.alignment: Qt.AlignHCenter
            onClicked: App.closeDownloads()
        }
    }
}
