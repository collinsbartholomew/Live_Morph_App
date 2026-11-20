import QtQuick
import QtQuick.Controls as Controls
import QtQuick.Layouts
import LiveMorph

Controls.Button {
    id: control

    property string iconName: ""

    implicitHeight: 36
    implicitWidth: contentRow.implicitWidth + leftPadding + rightPadding
    leftPadding: control.text.length ? 12 : 8
    rightPadding: control.text.length ? 12 : 8
    topPadding: 0
    bottomPadding: 0
    font.family: Theme.fontSmall.family; font.pixelSize: Theme.fontSmall.pixelSize
    hoverEnabled: true

    background: Rectangle {
        radius: Theme.radiusMd
        color: !control.enabled ? Colors.transparent
             : control.pressed ? Colors.surfaceElevated
             : control.hovered ? Colors.surfaceRaised
             : Colors.transparent
        border.width: 1
        border.color: control.hovered && control.enabled ? Colors.surfaceBorderSubtle : Colors.transparent
        FocusRing { shown: control.activeFocus; ringRadius: Theme.radiusMd }
    }

    contentItem: RowLayout {
        id: contentRow
        spacing: Theme.spacingSm

        Icon {
            visible: control.iconName.length > 0
            name: control.iconName
            size: Theme.iconSm
            color: !control.enabled ? Colors.textMuted
                 : control.hovered ? Colors.textPrimary : Colors.textSecondary
            Layout.alignment: Qt.AlignVCenter
        }

        Text {
            text: control.text
            color: !control.enabled ? Colors.textMuted
                 : control.hovered || control.pressed ? Colors.textPrimary
                 : Colors.textSecondary
            font.family: Theme.fontSmall.family; font.pixelSize: Theme.fontSmall.pixelSize
            elide: Text.ElideRight
            maximumLineCount: 1
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            Layout.fillWidth: true
        }
    }

    opacity: !control.enabled ? 0.5 : (control.pressed ? 0.75 : 1.0)
}
