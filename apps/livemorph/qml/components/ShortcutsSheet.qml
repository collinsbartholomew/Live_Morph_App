import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

Rectangle {
    id: root
    property bool open: false
    anchors.fill: parent
    visible: open
    z: 400
    color: Colors.overlayScrim

    MouseArea {
        anchors.fill: parent
        onClicked: root.open = false
    }

    Rectangle {
        anchors.centerIn: parent
        width: Math.min(parent.width - 48, 420)
        height: col.implicitHeight + 32
        radius: Theme.radiusXl
        color: Colors.surfaceGlassStrong
        border.color: Colors.surfaceBorder
        border.width: 1
        MouseArea { anchors.fill: parent }

        ColumnLayout {
            id: col
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.margins: 20
            spacing: 12

            RowLayout {
                Layout.fillWidth: true
                Text {
                    text: qsTr("Keyboard shortcuts")
                    color: Colors.textPrimary
                    font.pixelSize: 16
                    font.weight: Font.DemiBold
                    Layout.fillWidth: true
                }
                IconButton {
                    name: "x"
                    onClicked: root.open = false
                }
            }

            Repeater {
                model: [
                    { keys: "Space", desc: qsTr("Start / stop morph") },
                    { keys: "F12", desc: qsTr("Start / stop recording") },
                    { keys: "Esc", desc: qsTr("Close drawers & this sheet") },
                    { keys: "Ctrl+B", desc: qsTr("Workshop panel / drawer") },
                    { keys: "Ctrl+E", desc: qsTr("Show / hide prompt bar") },
                    { keys: "Ctrl+P", desc: qsTr("Camera preview window") },
                    { keys: "Ctrl+Shift+P", desc: qsTr("Pop-out stage") },
                    { keys: "?", desc: qsTr("Show this help") }
                ]
                delegate: RowLayout {
                    Layout.fillWidth: true
                    spacing: 12
                    required property var modelData
                    Rectangle {
                        radius: Theme.radiusSm
                        color: Colors.surfaceElevated
                        border.color: Colors.surfaceBorder
                        border.width: 1
                        implicitWidth: keyLbl.implicitWidth + 12
                        implicitHeight: 26
                        Text {
                            id: keyLbl
                            anchors.centerIn: parent
                            text: modelData.keys
                            color: Colors.accentHover
                            font.pixelSize: 11
                            font.weight: Font.DemiBold
                            font.family: Theme.fontMono.family
                        }
                    }
                    Text {
                        text: modelData.desc
                        color: Colors.textSecondary
                        font.pixelSize: 13
                        Layout.fillWidth: true
                    }
                }
            }

            Text {
                Layout.topMargin: 4
                text: qsTr("Tip: buy credits from the top bar when estimated time turns amber or red.")
                color: Colors.textMuted
                font.pixelSize: 11
                wrapMode: Text.WordWrap
                Layout.fillWidth: true
            }
        }
    }

    function toggle() { open = !open }
}
