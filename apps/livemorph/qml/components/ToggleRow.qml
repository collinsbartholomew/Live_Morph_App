import QtQuick
import QtQuick.Layouts
import LiveMorph

/**
 * Nocturne settings row: whole row toggles the switch (not just the knob),
 * title in primary text, BETA as a full-radius accent chip.
 * API: title, desc, beta, checked, toggled(bool).
 */
ColumnLayout {
    id: root

    property string title: ""
    property string desc: ""
    property bool beta: false
    property bool checked: false
    signal toggled(bool checked)

    spacing: 6

    // Item wrapper (not a bare RowLayout child) so the overlay MouseArea can
    // use anchors without the "anchors on layout-managed item" UB.
    Item {
        id: toggleRow
        Layout.fillWidth: true
        Layout.preferredHeight: rowContent.implicitHeight + 8

        // Hover wash behind the whole row
        Rectangle {
            anchors.fill: parent
            anchors.margins: -6
            radius: Theme.radiusMd
            color: rowMa.containsMouse ? Colors.overlay30 : Colors.transparent
            z: Theme.zUnder2
        }

        RowLayout {
            id: rowContent
            anchors.fill: parent
            spacing: 8

            RowLayout {
                spacing: 8
                Layout.fillWidth: true
                Text {
                    text: root.title
                    color: Colors.textPrimary
                    font.family: Theme.fontUi.family
                    font.pixelSize: 13
                    font.weight: Font.Normal
                    elide: Text.ElideRight
                    Layout.fillWidth: true
                }
                Rectangle {
                    visible: root.beta
                    width: betaLbl.implicitWidth + 12
                    height: 16
                    radius: Theme.radiusXs
                    color: Colors.accent10
                    border.color: Colors.accent30
                    border.width: 1
                    Text {
                        id: betaLbl
                        anchors.centerIn: parent
                        text: qsTr("BETA")
                        color: Colors.accentHover
                        font.pixelSize: 9
                        font.family: Theme.fontMono.family
                        font.letterSpacing: 1.2
                    }
                }
            }

            Switch {
                checked: root.checked
                accessibleName: root.title
                onToggled: root.toggled(checked)
            }
        }

        // Whole-row click target (the doc promised this; only the Switch was
        // clickable before). Sits under the content so the Switch still wins.
        MouseArea {
            id: rowMa
            anchors.fill: parent
            anchors.margins: -6
            z: Theme.zUnder
            hoverEnabled: true
            cursorShape: Qt.PointingHandCursor
            onClicked: root.toggled(!root.checked)
        }
    }

    Text {
        visible: root.desc.length > 0
        text: root.desc
        color: Colors.textMuted
        font.pixelSize: 11
        wrapMode: Text.WordWrap
        Layout.fillWidth: true
    }

}
