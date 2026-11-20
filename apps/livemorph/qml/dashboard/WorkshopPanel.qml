import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

Rectangle {
    id: root
    color: Colors.surfaceRaised

    Rectangle {
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.bottom: parent.bottom
        width: 1
        color: Colors.surfaceBorder
    }

    ColumnLayout {
        anchors.fill: parent
        spacing: 0

        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 72
            color: Colors.surfaceRaised
            clip: true

            Honeycomb {
                anchors.fill: parent
                cellSize: Theme.honeycombCell
                lineColor: Colors.honeycombLineFaint
                focusX: width
                focusY: height / 2
                fadeRadius: width * 0.65
                depthEvery: 5
                circuitEvery: 9
            }

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 20
                anchors.rightMargin: 20
                spacing: Theme.spacingMd

                Column {
                    Layout.fillWidth: true
                    spacing: 4
                    Text {
                        text: qsTr("CHARACTER LIBRARY")
                        color: Colors.textPrimary
                        font.family: Theme.fontLabel.family; font.pixelSize: Theme.fontLabel.pixelSize; font.weight: Theme.fontLabel.weight
                        font.letterSpacing: 1
                    }
                    Text {
                        width: parent.width
                        text: qsTr("Choose your next persona")
                        color: Colors.textMuted
                        font.family: Theme.fontSmall.family; font.pixelSize: Theme.fontSmall.pixelSize
                        elide: Text.ElideRight
                    }
                }

                Rectangle {
                    width: 36
                    height: 32
                    color: Colors.surfaceBase
                    border.color: Colors.surfaceBorder
                    border.width: 1
                    radius: Theme.radiusMd
                    Text {
                        anchors.centerIn: parent
                        text: String(Catalog.count).padStart(2, "0")
                        color: Colors.textPrimary
                        font.family: Theme.fontSmall.family; font.pixelSize: Theme.fontSmall.pixelSize
                        font.weight: Font.Bold
                    }
                }
            }

            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.bottom: parent.bottom
                height: 1
                color: Colors.surfaceBorder
            }
        }

        Flickable {
            Layout.fillWidth: true
            Layout.fillHeight: true
            Layout.topMargin: Theme.spacingLg
            contentHeight: scrollColumn.height
            contentWidth: width
            clip: true
            boundsBehavior: Flickable.StopAtBounds

            Column {
                id: scrollColumn
                width: parent.width
                PresetGrid { width: parent.width }
                Item { width: 1; height: 12 }
                CustomizeForm { width: parent.width }
                Item { width: 1; height: 24 }
            }

            ScrollBar.vertical: StyledScrollBar { thin: true }
        }
    }
}
