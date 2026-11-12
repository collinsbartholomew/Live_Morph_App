import QtQuick
import LiveMorph

/**
 * Obsidian Hex segmented control: bordered track, active segment = solid
 * white with black label. API: model [{label,value,icon?,tip?}],
 * currentValue (read), activated(value), equalWidths (segments split the
 * explicit width evenly — use inside fillWidth rows).
 * NOTE: clicking only emits activated() — it never writes currentValue, so a
 * caller binding on currentValue is never destroyed.
 */
Rectangle {
    id: root
    property var model: []
    property string currentValue: ""
    property bool equalWidths: false
    signal activated(string value)

    activeFocusOnTab: true
    Keys.onLeftPressed: root.move(-1)
    Keys.onRightPressed: root.move(1)
    function move(dir) {
        if (root.model.length === 0)
            return
        var vals = []
        for (var i = 0; i < root.model.length; i++) vals.push(root.model[i].value)
        var idx = vals.indexOf(root.currentValue)
        idx = Math.max(0, Math.min(vals.length - 1, (idx < 0 ? 0 : idx) + dir))
        root.activated(vals[idx])
    }

    implicitHeight: 36
    implicitWidth: row.implicitWidth + 8
    radius: Theme.radiusSm
    color: Colors.surfaceBase
    border.width: 1
    border.color: Colors.surfaceBorder
    // No clip: the FocusRing floats OUTSIDE the track (ring-offset-2) and a
    // clip on this root would cut it off.

    FocusRing { shown: root.activeFocus; ringRadius: Theme.radiusSm }
    Accessible.focusable: true

    Row {
        id: row
        anchors.centerIn: parent
        spacing: 2

        Repeater {
            model: root.model
            delegate: Rectangle {
                id: seg
                required property var modelData
                required property int index
                readonly property bool active: root.currentValue === modelData.value
                readonly property string itemIcon: seg.modelData.icon || ""
                readonly property string itemTip: seg.modelData.tip || ""
                z: segMa.containsMouse ? Theme.zLocal1 : Theme.zLocal0
                width: root.equalWidths
                       ? (root.width - 8 - (root.model.length - 1) * 2) / root.model.length
                       : segRow.implicitWidth + 20
                height: 30
                radius: Theme.radiusXs
                color: seg.active ? Colors.accent
                     : (segMa.containsMouse ? Colors.overlay50 : Colors.transparent)
                border.width: seg.active ? 1 : 0
                border.color: seg.active ? Colors.accent : Colors.transparent

                Row {
                    id: segRow
                    anchors.centerIn: parent
                    spacing: 5
                    // Active segment gets a solid hex glyph when it has no
                    // icon (with an icon, the icon itself marks the selection;
                    // swapping glyphs would shift the segment width on select).
                    Hexagon {
                        visible: seg.active && seg.itemIcon.length === 0
                        size: 8
                        lineWidth: 0
                        fillColor: Colors.textOnAccent
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    Icon {
                        visible: seg.itemIcon.length > 0
                        name: seg.itemIcon
                        size: Theme.iconXs
                        color: seg.active ? Colors.textOnAccent : Colors.textMuted
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    Text {
                        text: seg.modelData.label
                        color: seg.active ? Colors.textOnAccent
                            : (segMa.containsMouse ? Colors.textSecondary : Colors.textMuted)
                        font.family: Theme.fontLabel.family
                        font.pixelSize: 11
                        font.weight: Font.Bold
                        elide: Text.ElideRight
                        // Content-sized by default; only elides when the parent
                        // constrains the segment (equalWidths).
                        width: root.equalWidths ? seg.width - 20 : implicitWidth
                        horizontalAlignment: Text.AlignHCenter
                        anchors.verticalCenter: parent.verticalCenter
                    }
                }

                Tooltip {
                    anchors.bottom: parent.top
                    anchors.bottomMargin: 6
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: seg.itemTip
                    shown: segMa.containsMouse && seg.itemTip.length > 0
                }

                MouseArea {
                    id: segMa
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    hoverEnabled: true
                    onClicked: root.activated(seg.modelData.value)
                }
            }
        }
    }
}
