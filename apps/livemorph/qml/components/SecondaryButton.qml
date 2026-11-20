import QtQuick
import QtQuick.Controls as Controls
import QtQuick.Layouts
import LiveMorph

Controls.Button {
    id: control

    property bool compact: false
    property bool destructive: false
    property string iconName: ""

    implicitHeight: compact ? 32 : 40
    implicitWidth: Math.max(compact ? 84 : 96, contentRow.implicitWidth + leftPadding + rightPadding)
    leftPadding: compact ? 12 : 16
    rightPadding: compact ? 12 : 16
    topPadding: 0
    bottomPadding: 0
    font: Theme.fontUi
    hoverEnabled: true

    background: Rectangle {
        radius: Theme.radiusMd
        color: !control.enabled ? Colors.surfaceRaised
             : control.pressed ? (control.destructive ? Colors.statusError20 : Colors.surfaceHover)
             : control.hovered ? (control.destructive ? Colors.statusError10 : Colors.surfaceElevated)
             : Colors.surfaceRaised
        border.width: 1
        border.color: !control.enabled ? Colors.surfaceBorderSubtle
                    : control.destructive ? Colors.statusError40
                    : control.hovered || control.activeFocus ? Colors.surfaceBorderStrong
                    : Colors.surfaceBorder
        FocusRing { shown: control.activeFocus; ringRadius: Theme.radiusMd }
    }

    contentItem: RowLayout {
        id: contentRow
        spacing: Theme.spacingSm

        Icon {
            visible: control.iconName.length > 0
            name: control.iconName
            size: compact ? Theme.iconXs : Theme.iconSm
            color: !control.enabled ? Colors.textMuted
                 : control.destructive ? Colors.statusError85 : Colors.textSecondary
            Layout.alignment: Qt.AlignVCenter
        }

        Text {
            text: control.text
            color: !control.enabled ? Colors.textMuted
                 : control.destructive ? Colors.statusError85
                 : control.hovered || control.pressed ? Colors.textPrimary
                 : Colors.textSecondary
            font.family: control.font.family
            font.pixelSize: compact ? Theme.fontLabel.pixelSize : Theme.fontSmall.pixelSize
            font.weight: control.compact ? Font.Bold : Font.Medium
            font.capitalization: control.compact ? Font.AllUppercase : Font.MixedCase
            font.letterSpacing: control.compact ? 0.8 : 0
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            elide: Text.ElideRight
            maximumLineCount: 1
            Layout.fillWidth: true
        }
    }

    opacity: control.enabled ? 1.0 : 0.55
}
