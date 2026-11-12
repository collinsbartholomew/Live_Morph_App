import QtQuick
import LiveMorph

/**
 * Hexagon — single flat-top hexagon glyph (outline and/or fill) painted on a
 * Canvas. Used as the brand mark, list bullets, badge backdrops and corner
 * accents across the Obsidian Hex design. Static, no animation.
 */
Item {
    id: root

    property int size: Theme.iconLg             // hex width (flat-top)
    property color lineColor: Colors.textPrimary
    property color fillColor: Colors.transparent
    property real lineWidth: Theme.iconStroke
    property real fillAlpha: 1.0

    width: size
    height: size * Math.sqrt(3) / 2 + lineWidth
    implicitWidth: width
    implicitHeight: height

    onSizeChanged: canvas.requestPaint()
    onLineColorChanged: canvas.requestPaint()
    onFillColorChanged: canvas.requestPaint()
    onLineWidthChanged: canvas.requestPaint()
    onFillAlphaChanged: canvas.requestPaint()

    Canvas {
        id: canvas
        anchors.fill: parent
        onPaint: {
            var ctx = getContext("2d")
            ctx.reset()
            var w = width
            var h = height
            if (w <= 0 || h <= 0)
                return
            var s = (w - root.lineWidth) / 2
            var cx = w / 2
            var cy = h / 2
            ctx.lineWidth = root.lineWidth
            ctx.beginPath()
            for (var i = 0; i < 6; i++) {
                var a = Math.PI / 180 * (60 * i)
                var x = cx + s * Math.cos(a)
                var y = cy + s * Math.sin(a)
                if (i === 0)
                    ctx.moveTo(x, y)
                else
                    ctx.lineTo(x, y)
            }
            ctx.closePath()
            if (root.fillColor !== Colors.transparent) {
                ctx.fillStyle = Qt.rgba(root.fillColor.r, root.fillColor.g, root.fillColor.b, root.fillAlpha)
                ctx.fill()
            }
            if (root.lineWidth > 0) {
                ctx.strokeStyle = root.lineColor
                ctx.stroke()
            }
        }
        Component.onCompleted: requestPaint()
        onWidthChanged: requestPaint()
        onHeightChanged: requestPaint()
    }
}
