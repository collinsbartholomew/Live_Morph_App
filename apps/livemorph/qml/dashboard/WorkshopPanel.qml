import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

/**
 * WorkshopPanel — the left panel. Fixed section header (eyebrow + count) and
 * ONE scroll containing: roster pack (+ 3-col grid) → My characters (+ slots)
 * → consent → Customize card. All content is inset by Theme.padContainer so
 * nothing touches the panel borders.
 */
Rectangle {
    id: root
    color: Colors.surfaceBase
    border.width: 0

    // Right edge border (workshop is on the LEFT)
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

        // ── Fixed header: honeycomb band + eyebrow label + live count ──
        // Inset = Theme.padSection (20) so the header aligns exactly with the
        // PresetGrid/CustomizeForm content below (gridPad 20).
        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: headerRow.implicitHeight + 30
            color: Colors.surfaceRaised
            clip: true

            // Honeycomb band behind the eyebrow (spotlight at the left)
            Honeycomb {
                anchors.fill: parent
                cellSize: Theme.honeycombCell
                lineColor: Colors.honeycombLineFaint
                opacity: 0.5
                focusX: 0
                focusY: height / 2
                fadeRadius: width * 0.75
                sparkleEvery: 29
                sparkleAlpha: 0.06
            }
            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.bottom: parent.bottom
                height: 1
                color: Colors.surfaceBorder
            }

            RowLayout {
                id: headerRow
                anchors.fill: parent
                anchors.leftMargin: Theme.padSection
                anchors.rightMargin: Theme.padSection
                spacing: 8

                Hexagon {
                    size: 11
                    lineWidth: 1.5
                    lineColor: Colors.textPrimary
                    Layout.alignment: Qt.AlignVCenter
                }
                Text {
                    text: qsTr("CHARACTERS")
                    color: Colors.textPrimary
                    font: Theme.fontLabel
                }
                Item { Layout.fillWidth: true }
            // Count pill (accent-tinted when the library is non-empty)
            Rectangle {
                height: 20
                width: countLbl.implicitWidth + 14
                radius: Theme.radiusFull
                color: Catalog.count > 0 ? Colors.accent10 : Colors.overlay30
                border.color: Catalog.count > 0 ? Colors.accent30 : Colors.surfaceBorderSubtle
                border.width: 1
                Text {
                    id: countLbl
                    anchors.centerIn: parent
                    text: Catalog.count
                    color: Catalog.count > 0 ? Colors.accentHover : Colors.textMuted
                    font.family: Theme.fontMono.family
                    font.pixelSize: 10
                    font.weight: Font.Bold
                }
            }
        }
        }

        // ── Single scroll: roster + customize disclosure ────────────────
        Flickable {
            Layout.fillWidth: true
            Layout.fillHeight: true
            Layout.topMargin: 16
            contentHeight: scrollCol.height
            contentWidth: width
            clip: true
            boundsBehavior: Flickable.StopAtBounds

            Column {
                id: scrollCol
                width: parent.width

                PresetGrid {
                    width: parent.width
                }

                Item { width: 1; height: 8 }

                CustomizeForm {
                    width: parent.width
                }

                Item { width: 1; height: 20 }
            }

            ScrollBar.vertical: StyledScrollBar { }
        }
    }
}
