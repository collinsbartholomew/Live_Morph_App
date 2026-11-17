import QtQuick
import QtQuick.Layouts
import LiveMorph

Rectangle {
    id: root
    property bool open: false
    anchors.fill: parent
    visible: open
    z: Theme.zSheet
    color: Colors.overlayScrim

    MouseArea {
        anchors.fill: parent
        onClicked: root.open = false
    }

    Rectangle {
        anchors.centerIn: parent
        width: Math.min(parent.width - 48, 420)
        height: Math.min(parent.height - 48, col.implicitHeight + 32)
        radius: Theme.radiusLg
        color: Colors.surfaceGlassStrong
        border.color: Colors.surfaceBorder
        border.width: 1
        clip: true
        Honeycomb {
            anchors.fill: parent
            cellSize: Theme.honeycombCell
            lineColor: Colors.honeycombLineFaint
            opacity: 0.7
        }
        // Top hairline + corner frame (signature Obsidian Hex panel chrome)
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 1
            color: Colors.white35
            z: Theme.zLocal1
        }
        CornerTicks {
            anchors.fill: parent
            inset: 8
            tickSize: 8
            thickness: 1.5
            color: Colors.accent50
            z: Theme.zLocal1
        }
        MouseArea { anchors.fill: parent }

        ColumnLayout {
            id: col
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.margins: Theme.padSection
            spacing: Theme.spacingMd

            RowLayout {
                Layout.fillWidth: true
                Text {
                    text: qsTr("Keyboard shortcuts")
                    color: Colors.textPrimary
                    font.pixelSize: Theme.fontTitle.pixelSize
                    font.weight: Font.Bold
                    Layout.fillWidth: true
                }
                IconButton {
                    name: "x"
                    accessibleName: qsTr("Close")
                    onClicked: root.open = false
                }
            }

            Repeater {
                model: [
                    { keys: "Space", desc: qsTr("Start / stop morph") },
                    { keys: "F12", desc: qsTr("Start / stop recording") },
                    { keys: "Esc", desc: qsTr("Close drawers & this sheet") },
                    { keys: "Ctrl+E", desc: qsTr("Show / hide prompt bar") },
                    { keys: "Ctrl+P", desc: qsTr("Camera preview window") },
                    { keys: "Ctrl+Shift+P", desc: qsTr("Pop-out stage") },
                    { keys: "?", desc: qsTr("Show this help") }
                ]
                delegate: RowLayout {
                    Layout.fillWidth: true
                    spacing: Theme.spacingMd
                    required property var modelData
                    Rectangle {
                        radius: Theme.radiusXs
                        color: Colors.surfaceElevated
                        border.color: Colors.surfaceBorderStrong
                        border.width: 1
                        implicitWidth: keyLbl.implicitWidth + 12
                        implicitHeight: 26
                        Text {
                            id: keyLbl
                            anchors.centerIn: parent
                            text: modelData.keys
                            color: Colors.accentHover
                            font.pixelSize: Theme.fontLabel.pixelSize
                            font.weight: Font.Bold
                            font.family: Theme.fontMono.family
                        }
                    }
                    Text {
                        text: modelData.desc
                        color: Colors.textSecondary
                        font.pixelSize: Theme.fontSmall.pixelSize
                        Layout.fillWidth: true
                    }
                }
            }

            Text {
                Layout.topMargin: Theme.spacingXs
                text: qsTr("Tip: buy credits from the top bar when estimated time turns amber or red.")
                color: Colors.textMuted
                font.pixelSize: Theme.fontLabel.pixelSize
                wrapMode: Text.WordWrap
                Layout.fillWidth: true
            }
        }
    }

    function toggle() { open = !open }
}
