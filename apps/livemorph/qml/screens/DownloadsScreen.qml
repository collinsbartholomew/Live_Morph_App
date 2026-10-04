import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

Item {
    id: root
    anchors.fill: parent

    Component.onCompleted: {
        Backend.fetchDownloads()
    }

    Rectangle {
        anchors.fill: parent
        color: Colors.surfaceBase
    }

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 24
        spacing: 16

        RowLayout {
            Layout.fillWidth: true

            Text {
                text: qsTr("DOWNLOADS")
                color: Colors.accent
                font.pixelSize: 24
                font.weight: Font.Bold
                Layout.fillWidth: true
            }

            GhostButton {
                text: qsTr("CLOSE")
                onClicked: App.closeDownloads()
            }
        }

        ListView {
            id: listView
            Layout.fillWidth: true
            Layout.fillHeight: true
            clip: true
            model: Backend.downloadsModel || []
            delegate: Rectangle {
                width: parent.width
                height: 56
                color: index % 2 ? Colors.surfaceOverlay : Colors.surfaceRaised
                radius: Theme.radiusMd

                RowLayout {
                    anchors.fill: parent
                    anchors.margins: 12
                    spacing: 12

                    Text {
                        text: modelData.name || modelData.filename || "File"
                        color: Colors.textPrimary
                        font.pixelSize: 12
                        elide: Text.ElideMiddle
                        Layout.fillWidth: true
                    }

                    Text {
                        text: modelData.size || ""
                        color: Colors.textMuted
                        font.pixelSize: 11
                    }

                    PrimaryButton {
                        text: qsTr("GET")
                        implicitHeight: 32
                        Layout.preferredWidth: 60
                        onClicked: {
                            if (modelData.url) Backend.openExternal(modelData.url)
                        }
                    }
                }
            }
        }

        Text {
            visible: (Backend.downloadsModel && Backend.downloadsModel.length === 0)
            text: qsTr("No downloads available.")
            color: Colors.textMuted
            font.pixelSize: 12
            Layout.alignment: Qt.AlignHCenter
        }

        PrimaryButton {
            text: qsTr("CLOSE")
            Layout.alignment: Qt.AlignHCenter
            onClicked: App.closeDownloads()
        }
    }
}
