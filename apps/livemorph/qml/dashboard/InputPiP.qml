import QtQuick
import QtQuick.Controls
import QtMultimedia
import LiveMorph

/**
 * Picture-in-picture of local camera (Electron f1/d1 ground truth):
 *   rounded-sm(2) + 1px border + shadow-depth-lg · label pill "INPUT"
 *   drag + snap to nearest of 4 corners (persists pipCorner)
 *   pip-enter animation on show · INPUT LOST state after 1.5s w/o track
 *   visibility: always | whileSwapping | never (forced "always" until the
 *   first completed swap — Electron store semantics)
 */
Rectangle {
    id: root
    radius: Theme.radiusXs // rounded-sm = 2px (Electron PiP shape)
    color: "#000000"
    border.color: root.inputLost ? Colors.statusError : Colors.surfaceBorder
    border.width: root.inputLost ? 2 : 1
    clip: true
    z: 20

    // shadow-depth-lg: 0 8px 24px rgba(0,0,0,.5)
    Rectangle {
        anchors.fill: parent
        anchors.margins: -3
        anchors.topMargin: -5
        anchors.bottomMargin: -1
        radius: parent.radius + 2
        color: "#00000080"
        z: -1
    }

    // Visibility policy (Electron): forced "always" until the first completed
    // swap; "always" shows whenever the camera runs; "whileSwapping" shows
    // through connect/warm/live; "never" hides.
    readonly property bool firstSwapDone: Config.hasOwnProperty("onboardingDone") && Session.framesProcessed > 0
    visible: {
        const policy = Config.pipVisibility || "whileSwapping"
        if (policy === "never") return false
        if (policy === "always") return CameraCtrl.isActive
        return CameraCtrl.isActive
            && (Session.isActive || Session.connectionStatus === "connecting")
    }
    opacity: visible ? 1 : 0
    scale: visible ? 1 : 1.4 // pip-enter: 1.4→1
    transform: Translate { x: visible ? 0 : -root.width * 0.1 }
    Behavior on opacity { NumberAnimation { duration: 200; easing.type: Easing.OutCubic } }
    Behavior on scale { NumberAnimation { duration: 400; easing.type: Easing.OutCubic } }

    // Input-lost watchdog: no live frames for 1.5s → red border + pill
    property bool inputLost: false
    property real lastFrameTime: 0
    onVisibleChanged: if (visible) { inputLost = false; lastFrameTime = Date.now(); snapToNearestCorner() }
    Timer {
        running: root.visible && CameraCtrl.isActive
        interval: 500
        repeat: true
        onTriggered: {
            const stale = CameraCtrl.lastFrameMs <= 0
                || (Date.now() - CameraCtrl.lastFrameMs > 1500)
            root.inputLost = stale
        }
    }

    VideoOutput {
        id: pipOut
        anchors.fill: parent
        anchors.margins: 1
        fillMode: VideoOutput.PreserveAspectCrop
        transform: Scale {
            origin.x: pipOut.width / 2
            xScale: CameraCtrl.mirrored ? -1 : 1
        }
        // Bind the MIRROR sink via the C++ helper — VideoOutput.videoSink is
        // read-only from QML (AOT verified); direct assignment errors out.
        function refreshBank() {
            if (visible)
                CameraCtrl.bindMirrorVideoOutput(pipOut)
        }
        onVisibleChanged: pipOut.refreshBank()
        Component.onCompleted: pipOut.refreshBank()
    }

    // INPUT pill (Electron inputPiP.inputPill) — 8px mono uppercase
    Rectangle {
        anchors.left: parent.left
        anchors.top: parent.top
        anchors.margins: 6
        width: lab.implicitWidth + 10
        height: 14
        radius: 2
        color: "#08080cb3" // surface-base/70
        Text {
            id: lab
            anchors.centerIn: parent
            text: "INPUT"
            color: Colors.textPrimary
            font.pixelSize: 8
            font.weight: Font.Bold
            font.family: Theme.fontMono.family
            font.letterSpacing: 1.2
        }
    }

    // INPUT LOST pill (Electron inputPiP.inputLost)
    Rectangle {
        visible: root.inputLost
        anchors.centerIn: parent
        width: lostLab.implicitWidth + 12
        height: 18
        radius: 2
        color: "#ef444466"
        border.color: "#ef444466"
        border.width: 1
        Text {
            id: lostLab
            anchors.centerIn: parent
            text: qsTr("INPUT LOST")
            color: Colors.statusError
            font.pixelSize: 10
            font.family: Theme.fontMono.family
            font.letterSpacing: 1.2
        }
    }

    // Drag + corner snap (Electron h1): grab, live-translate, snap on release
    MouseArea {
        id: dragMa
        anchors.fill: parent
        cursorShape: Qt.SizeAllCursor
        property point dragStart
        property point pressPos
        onPressed: function(mouse) {
            pressPos = Qt.point(mouse.x, mouse.y)
            dragStart = Qt.point(root.x, root.y)
        }
        onPositionChanged: function(mouse) {
            if (pressed) {
                root.anchors.left = undefined
                root.anchors.top = undefined
                // Clamp to the parent bounds — an unclamped PiP could be
                // dragged over the prompt bar, workshop, or off-stage.
                const pw = root.parent ? root.parent.width : 0
                const ph = root.parent ? root.parent.height : 0
                root.x = Math.max(0, Math.min(pw - root.width, dragStart.x + mouse.x - pressPos.x))
                root.y = Math.max(0, Math.min(ph - root.height, dragStart.y + mouse.y - pressPos.y))
            }
        }
        onReleased: snapToNearestCorner()
    }

    function snapToNearestCorner() {
        const pw = parent ? parent.width : 0
        const ph = parent ? parent.height : 0
        if (pw <= 0 || ph <= 0) return
        const cx = root.x + root.width / 2
        const cy = root.y + root.height / 2
        const left = cx < pw / 2
        const top = cy < ph / 2
        // Re-establish corner ANCHORS (not fixed x/y) so any later resize
        // repositions the PiP instead of leaving it at stale coordinates.
        root.anchors.right = undefined
        root.anchors.bottom = undefined
        root.anchors.left = left ? parent.left : undefined
        root.anchors.top = top ? parent.top : undefined
        root.anchors.right = !left ? parent.right : undefined
        root.anchors.bottom = !top ? parent.bottom : undefined
        root.anchors.margins = 16 // Electron top-4 = 16px inset
    }

    // Re-snap when the stage resizes (window resize, banner appear, prompt toggle)
    Connections {
        function onWidthChanged() { if (root.visible) root.snapToNearestCorner() }
        function onHeightChanged() { if (root.visible) root.snapToNearestCorner() }
        target: root.parent
    }
}
