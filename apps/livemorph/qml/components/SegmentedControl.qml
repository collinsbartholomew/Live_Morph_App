import QtQuick
import QtQuick.Controls
import LiveMorph

/**
 * Electron engine-toggle radiogroup (ground truth):
 *   container: gap-0.5 rounded-sm(4) bg-surface-overlay/40 p-0.5 — no border
 *   item: px-2 py-0.5 rounded-[3px] text-[10px] font-medium tracking-wide
 *   active: bg-accent/20 text-accent (NO border on the pill)
 *   inactive: text-text-muted hover:text-text-secondary (no fill)
 *   active:scale-[0.97]
 */
Rectangle {
    id: root
    property var model: []          // array of { label, value }
    property string currentValue: ""
    signal activated(string value)

    implicitHeight: 24
    implicitWidth: row.implicitWidth + 4
    radius: Theme.radiusSm
    color: "#17171f66" // surface-overlay/40
    border.width: 0

    Row {
        id: row
        anchors.centerIn: parent
        spacing: 2 // gap-0.5

        Repeater {
            model: root.model
            delegate: Rectangle {
                id: seg
                required property var modelData
                required property int index
                readonly property bool active: root.currentValue === modelData.value
                width: segLabel.implicitWidth + 16 // px-2
                height: 20
                radius: 3 // rounded-[3px]
                color: seg.active ? Colors.accent20
                    : (segMa.containsMouse ? Colors.accent10 : "transparent")
                border.width: 0
                Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }

                Text {
                    id: segLabel
                    anchors.centerIn: parent
                    text: seg.modelData.label
                    color: seg.active ? Colors.accent
                        : (segMa.containsMouse ? Colors.textSecondary : Colors.textMuted)
                    font.pixelSize: 10
                    font.weight: Font.Medium
                    font.letterSpacing: 0.5 // tracking-wide
                    Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
                }

                MouseArea {
                    id: segMa
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    hoverEnabled: true
                    onClicked: {
                        root.currentValue = seg.modelData.value
                        root.activated(seg.modelData.value)
                    }
                    onPressed: seg.scale = 0.97
                    onReleased: seg.scale = 1.0
                    onCanceled: seg.scale = 1.0
                }
                Behavior on scale { NumberAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
            }
        }
    }
}
