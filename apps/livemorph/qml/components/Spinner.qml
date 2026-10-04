import QtQuick
import LiveMorph

/**
 * Electron spinner (index qT):
 *   sizes sm:14 md:18 lg:22 xl:28 (default md=18)
 *   fixed 2px stroke, quarter arc (90°), round caps
 *   spin 800ms linear · motion-reduce → opacity pulse
 */
Item {
    id: root
    property int size: 18
    property color color: Colors.accent
    property bool running: true // callers can pause the spin explicitly
    width: size
    height: size
    implicitWidth: size
    implicitHeight: size

    // Track circle (opacity 0.2)
    Rectangle {
        anchors.fill: parent
        radius: width / 2
        color: "transparent"
        border.color: Qt.rgba(root.color.r, root.color.g, root.color.b, 0.2)
        border.width: 2
    }

    // Quarter arc (Electron dasharray = circumference/4)
    Canvas {
        id: canvas
        anchors.fill: parent
        onPaint: {
            var ctx = getContext("2d")
            ctx.reset()
            var w = width
            var line = 2 // fixed 2px at all sizes
            ctx.strokeStyle = root.color
            ctx.lineWidth = line
            ctx.lineCap = "round"
            ctx.beginPath()
            var r = (w - line) / 2
            ctx.arc(w / 2, w / 2, r, -Math.PI / 2, -Math.PI / 2 + Math.PI / 2)
            ctx.stroke()
        }
        Component.onCompleted: requestPaint()
        onWidthChanged: requestPaint()
    }

    RotationAnimation on rotation {
        from: 0
        to: 360
        duration: 800
        loops: Animation.Infinite
        running: root.running && root.visible && !root.reduceMotion
    }

    // motion-reduce fallback (Electron): opacity pulse instead of spin
    SequentialAnimation on opacity {
        running: root.visible && root.reduceMotion
        loops: Animation.Infinite
        NumberAnimation { to: 0.3; duration: 1000; easing.type: Easing.InOutQuad }
        NumberAnimation { to: 1.0; duration: 1000; easing.type: Easing.InOutQuad }
    }

    property bool reduceMotion: false
}
