import QtQuick
import QtQuick.Controls as Controls
import QtQuick.Layouts
import LiveMorph

Controls.Button {
    id: control

    property bool busy: false
    property bool cta: false
    property int heightOverride: 0
    property string iconName: ""
    property var stateBg: undefined
    property var stateBorder: undefined
    property var stateFg: undefined

    implicitHeight: heightOverride > 0 ? heightOverride : (cta ? 52 : 40)
    implicitWidth: Math.max(104, contentRow.implicitWidth + leftPadding + rightPadding)
    leftPadding: cta ? 24 : 18
    rightPadding: cta ? 24 : 18
    topPadding: 0
    bottomPadding: 0
    font: Theme.fontUi
    hoverEnabled: true

    background: Item {
        Rectangle {
            anchors.fill: parent
            radius: Theme.radiusMd
            color: control.stateBg !== undefined ? control.stateBg
                 : !control.enabled ? Colors.surfaceElevated
                 : control.pressed ? Colors.brandB
                 : control.hovered ? Colors.white : Colors.accent
            border.width: 1
            border.color: control.stateBorder !== undefined ? control.stateBorder
                        : !control.enabled ? Colors.surfaceBorder : Colors.accent

            Rectangle {
                anchors.left: parent.left
                anchors.top: parent.top
                anchors.bottom: parent.bottom
                width: 3
                color: !control.enabled || control.stateBg !== undefined ? Colors.transparent : Colors.textOnAccent
                opacity: control.hovered || control.activeFocus ? 0.9 : 0.35
            }
        }

        CornerTicks {
            anchors.fill: parent
            visible: control.enabled
            inset: 5
            tickSize: control.cta ? 8 : 6
            thickness: 1
            color: control.stateFg !== undefined ? control.stateFg : Colors.textOnAccent
            opacity: control.hovered || control.activeFocus || control.cta ? 0.8 : 0.3
        }

        FocusRing {
            shown: control.activeFocus
            ringRadius: Theme.radiusMd
        }
    }

    contentItem: RowLayout {
        id: contentRow
        spacing: Theme.spacingSm

        Item { Layout.fillWidth: true; visible: control.cta }

        Hexagon {
            visible: !control.busy && control.iconName.length === 0
            size: control.cta ? 11 : 9
            lineWidth: 1.5
            lineColor: control.stateFg !== undefined ? control.stateFg
                     : !control.enabled ? Colors.textMuted : Colors.textOnAccent
            Layout.alignment: Qt.AlignVCenter
        }

        Icon {
            visible: !control.busy && control.iconName.length > 0
            name: control.iconName
            size: control.cta ? Theme.iconMd : Theme.iconSm
            color: control.stateFg !== undefined ? control.stateFg
                 : !control.enabled ? Colors.textMuted : Colors.textOnAccent
            Layout.alignment: Qt.AlignVCenter
        }

        Hexagon {
            visible: control.busy
            size: 10
            lineWidth: 1.5
            lineColor: control.stateFg !== undefined ? control.stateFg
                     : !control.enabled ? Colors.textMuted : Colors.textOnAccent
            fillColor: Colors.transparent
            Layout.alignment: Qt.AlignVCenter
        }

        Text {
            text: control.text
            color: control.stateFg !== undefined ? control.stateFg
                 : !control.enabled ? Colors.textMuted : Colors.textOnAccent
            font.family: control.font.family
            font.pixelSize: control.cta ? 14 : Theme.fontSmall.pixelSize
            font.weight: Font.Bold
            font.capitalization: control.cta ? Font.AllUppercase : Font.MixedCase
            font.letterSpacing: control.cta ? 1.2 : 0
            horizontalAlignment: Text.AlignHCenter
            verticalAlignment: Text.AlignVCenter
            elide: Text.ElideRight
            maximumLineCount: 1
            Layout.fillWidth: true
            Layout.alignment: Qt.AlignVCenter
        }

        Item { Layout.fillWidth: true; visible: control.cta }
    }
}
