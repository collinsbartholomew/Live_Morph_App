import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

Rectangle {
    id: root
    color: Colors.surfaceRaised
    border.color: Colors.surfaceBorder
    border.width: 0

    Rectangle {
        anchors.left: parent.left
        anchors.top: parent.top
        anchors.bottom: parent.bottom
        width: 1
        color: Colors.surfaceBorder
    }

    property string workshopMode: "presets"
    property bool collapsed: false
    signal toggleCollapsed()

    // Collapsed icon rail
    Column {
        anchors.fill: parent
        anchors.margins: 8
        spacing: 12
        visible: root.collapsed
        width: parent.width

        Rectangle {
            width: 32
            height: 32
            radius: Theme.radiusSm
            anchors.horizontalCenter: parent.horizontalCenter
            color: expandMa.containsMouse ? Colors.surfaceElevated : Colors.surfaceOverlay
            border.color: Colors.surfaceBorder
            border.width: 1
            Text {
                anchors.centerIn: parent
                text: "«"
                color: Colors.textPrimary
                font.pixelSize: 14
                font.weight: Font.DemiBold
            }
            MouseArea {
                id: expandMa
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: root.toggleCollapsed()
            }
            Tooltip {
                anchors.left: parent.right
                anchors.leftMargin: 8
                anchors.verticalCenter: parent.verticalCenter
                text: qsTr("Expand workshop")
                shown: expandMa.containsMouse
            }
        }

        Rectangle {
            width: 32
            height: 32
            radius: Theme.radiusSm
            anchors.horizontalCenter: parent.horizontalCenter
            color: Colors.accent15
            border.color: Colors.accent30
            border.width: 1
            Text {
                anchors.centerIn: parent
                text: Session.activeCharacterName.length
                      ? Session.activeCharacterName.charAt(0).toUpperCase()
                      : "◇"
                color: Colors.accent
                font.pixelSize: 13
                font.weight: Font.Bold
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: root.toggleCollapsed()
            }
        }

        Text {
            anchors.horizontalCenter: parent.horizontalCenter
            rotation: -90
            transformOrigin: Item.Center
            text: qsTr("Workshop")
            color: Colors.textMuted
            font.pixelSize: 10
            font.weight: Font.Medium
        }
    }

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 12
        spacing: 10
        visible: !root.collapsed

        RowLayout {
            Layout.fillWidth: true
            Text {
                text: qsTr("Workshop")
                color: Colors.textPrimary
                font.pixelSize: 14
                font.weight: Font.DemiBold
                Layout.fillWidth: true
                MouseArea {
                    id: workshopTitleMa
                    anchors.fill: parent
                    hoverEnabled: true
                    acceptedButtons: Qt.NoButton
                }
                Tooltip {
                    anchors.top: parent.bottom
                    anchors.topMargin: 4
                    text: qsTr("Character catalog & presets")
                    shown: workshopTitleMa.containsMouse
                }
            }
            Text {
                text: Catalog.count + " chars"
                color: Colors.textMuted
                font.pixelSize: 10
                font.family: "monospace"
            }
            Rectangle {
                width: 28
                height: 28
                radius: Theme.radiusSm
                color: collapseMa.containsMouse ? Colors.surfaceElevated : "transparent"
                border.color: collapseMa.containsMouse ? Colors.surfaceBorder : "transparent"
                border.width: 1
                Text {
                    anchors.centerIn: parent
                    text: "»"
                    color: Colors.textSecondary
                    font.pixelSize: 13
                }
                MouseArea {
                    id: collapseMa
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: root.toggleCollapsed()
                }
                Tooltip {
                    anchors.top: parent.bottom
                    anchors.topMargin: 4
                    text: qsTr("Collapse workshop")
                    shown: collapseMa.containsMouse
                }
            }
        }

        // Identity lock + scene toggles
        RowLayout {
            Layout.fillWidth: true
            spacing: 12
            Row {
                spacing: 6
                Switch {
                    checked: Session.identityLockEnabled
                    onToggled: Session.identityLockEnabled = checked
                }
                Text {
                    text: "ID lock"
                    color: Colors.textSecondary
                    font.pixelSize: 11
                    anchors.verticalCenter: parent.verticalCenter
                }
            }
            Row {
                spacing: 6
                Switch {
                    checked: App.swapMode === "scene"
                    onToggled: App.swapMode = checked ? "scene" : "character"
                }
                Text {
                    text: "Scene mode"
                    color: Colors.textSecondary
                    font.pixelSize: 11
                    anchors.verticalCenter: parent.verticalCenter
                }
            }
        }

        SegmentedControl {
            Layout.fillWidth: true
            model: [
                { label: "Presets", value: "presets" },
                { label: "Customize", value: "customize" }
            ]
            currentValue: root.workshopMode
            onActivated: (v) => root.workshopMode = v
        }

        StackLayout {
            Layout.fillWidth: true
            Layout.fillHeight: true
            currentIndex: root.workshopMode === "presets" ? 0 : 1

            PresetGrid {
                Layout.fillWidth: true
                Layout.fillHeight: true
            }

            CustomizeForm {
                Layout.fillWidth: true
                Layout.fillHeight: true
            }
        }
    }
}
