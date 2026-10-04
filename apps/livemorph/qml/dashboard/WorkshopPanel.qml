import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

Rectangle {
    id: root
    color: Colors.surfaceRaised
    border.color: Colors.surfaceBorder
    border.width: 0

    // Right edge border (workshop is on the LEFT now)
    Rectangle {
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.bottom: parent.bottom
        width: 1
        color: Colors.surfaceBorder
    }

    property string workshopMode: "presets"
    // Collapse API removed (Electron: fixed 360px, always visible)
    property bool collapsed: false

    ColumnLayout {
        anchors.fill: parent
        spacing: 0

        // Header (Electron: single h2 "Characters")
        RowLayout {
            Layout.fillWidth: true
            Layout.leftMargin: 16
            Layout.rightMargin: 12
            Layout.topMargin: 14
            Layout.bottomMargin: 10
            Text {
                text: qsTr("Characters")
                color: Colors.textPrimary
                font.pixelSize: 14
                font.weight: Font.DemiBold
                Layout.fillWidth: true
            }
            Text {
                text: qsTr("%1 saved").arg(Catalog.count)
                color: Colors.textMuted
                font.pixelSize: 10
                font.family: Theme.fontMono.family
            }
        }

        Rectangle {
            Layout.fillWidth: true
            Layout.leftMargin: 16
            Layout.rightMargin: 16
            height: 1
            color: Colors.surfaceBorderSubtle
        }

        // Identity lock (Qt functional extra — Electron keeps this in state only)
        RowLayout {
            Layout.fillWidth: true
            Layout.leftMargin: 16
            Layout.rightMargin: 12
            Layout.topMargin: 8
            spacing: 6
            Switch {
                checked: Session.identityLockEnabled
                onToggled: Session.identityLockEnabled = checked
            }
            Text {
                text: qsTr("Lock my face")
                color: Colors.textSecondary
                font.pixelSize: 11
                Layout.alignment: Qt.AlignVCenter
            }
            Item { Layout.fillWidth: true }
            Text {
                visible: Catalog.count >= 2
                text: qsTr("Sort A\u2192Z")
                color: sortMa.containsMouse ? Colors.accent : Colors.textMuted
                font.family: Theme.fontMono.family
                font.pixelSize: 10
                Layout.alignment: Qt.AlignVCenter
                MouseArea {
                    id: sortMa
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: Catalog.sortAlphabetically()
                }
            }
        }

        // Mode tabs (Qt functional extra: Presets/Upload/Customize)
        RowLayout {
            Layout.fillWidth: true
            Layout.leftMargin: 16
            Layout.rightMargin: 16
            Layout.topMargin: 8
            SegmentedControl {
                Layout.fillWidth: true
                model: [
                    { label: qsTr("Presets"), value: "presets" },
                    { label: qsTr("Upload"), value: "upload" },
                    { label: qsTr("Customize"), value: "customize" }
                ]
                currentValue: root.workshopMode
                onActivated: (v) => root.workshopMode = v
            }
        }

        StackLayout {
            Layout.fillWidth: true
            Layout.fillHeight: true
            currentIndex: root.workshopMode === "presets" ? 0 : root.workshopMode === "upload" ? 1 : 2

            PresetGrid {
                Layout.fillWidth: true
                Layout.fillHeight: true
            }

            UploadTab {
                Layout.fillWidth: true
                Layout.fillHeight: true
                onImageSelected: function(path) {
                    // Apply uploaded image as active character reference
                    Session.setActiveCharacter("", "Upload", path, "")
                    App.notify("Reference image loaded", "success")
                }
            }

            CustomizeForm {
                Layout.fillWidth: true
                Layout.fillHeight: true
            }
        }
    }
}
