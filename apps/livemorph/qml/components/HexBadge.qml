import QtQuick
import LiveMorph

/**
 * HexBadge — an icon centered inside a hexagon cell. This is the standard
 * badge across Obsidian Hex panels, empty states, HUD overlays and list rows
 * (replaces the inline Item + Hexagon + Icon triplets).
 * API: size (hex width), iconName, iconSize, lineColor, fillColor, iconColor,
 *      lineWidth. Pure geometry, static (motion is banned project-wide).
 */
Item {
    id: root

    property int size: 30
    property string iconName: ""
    property int iconSize: Theme.iconMd
    property color lineColor: Colors.surfaceBorderSubtle
    property color fillColor: Colors.surfaceElevated
    property color iconColor: Colors.textMuted
    property real lineWidth: 1
    property bool emphasis: false // heavier icon stroke (confirm/dismiss glyphs)

    width: size
    height: size * Math.sqrt(3) / 2 + lineWidth
    implicitWidth: width
    implicitHeight: height

    Hexagon {
        anchors.centerIn: parent
        size: root.size
        lineWidth: root.lineWidth
        lineColor: root.lineColor
        fillColor: root.fillColor
    }
    Icon {
        anchors.centerIn: parent
        visible: root.iconName.length > 0
        name: root.iconName
        size: root.iconSize
        color: root.iconColor
        emphasis: root.emphasis
    }
}
