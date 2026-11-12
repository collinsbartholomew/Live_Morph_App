import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import QtMultimedia
import LiveMorph

/**
 * Picture-in-picture of local camera (Electron f1/d1 ground truth):
 *   rounded-sm(4) + shadow-depth-lg · top-LEFT camera chip (name + chevron,
 *   px-1.5 py-0.5 rounded-sm bg-surface-base/70 border) replaces the INPUT
 *   pill whenever cameras exist · drag + 4-corner snap (bounds = the STAGE
 *   BOX because Dashboard parents this inside stageBox) · pip-enter ·
 *   INPUT LOST = full scrim + centered bordered box + alert icon ·
 *   first-swap-forced "always".
 */
Rectangle {
    id: root
    radius: Theme.radiusMd
    color: Colors.black
    clip: true
    border.color: root.inputLost ? Colors.statusError : Colors.surfaceBorder
    border.width: root.inputLost ? 2 : 1
    z: Theme.zCatcher

    // (Shadow layers removed project-wide — flat design; the PiP reads via
    // its 1px border only.)

    readonly property bool camPopupOpen: pipCamPopup.visible
    function closeCamPopup() {
        if (pipCamPopup.visible)
            pipCamPopup.close()
    }

    // Visibility policy (Electron): FORCED "always" until the first
    // completed swap; "always" shows whenever the camera runs;
    // "whileSwapping" shows through connect/warm/live; "never" hides.
    // Plain property (a binding here would be destroyed by the imperative
    // write in onFramesChanged below). Loaded once on completion.
    property bool firstSwapDone: false
    Component.onCompleted: {
        var v = Config.value("session/firstSwapDone", false)
        firstSwapDone = (v === true || v === "true")
    }
    readonly property string pipPolicy: Config.pipVisibility || "whileSwapping"
    visible: {
        if (!CameraCtrl.isActive) return !firstSwapDone || pipPolicy === "always"
        if (!firstSwapDone) return true // Electron: forced until first swap
        if (pipPolicy === "never") return false
        if (pipPolicy === "always") return true
        return Session.isActive || Session.connectionStatus === "connecting"
    }

    // Mark first-swap-done ONCE when decoded frames flow — the plain JS
    // guard stops the per-frame QSettings write + configChanged storm.
    Connections {
        target: Session
        function onFramesChanged() {
            if (Session.framesProcessed > 0 && !root.firstSwapDone) {
                Config.setValue("session/firstSwapDone", true)
                root.firstSwapDone = true
            }
        }
    }

    opacity: visible ? 1 : 0
    scale: visible ? 1 : 1.4 // pip-enter: 1.4→1
    transform: Translate { x: visible ? 0 : -root.width * 0.1 }

    // Input-lost watchdog: no live frames for 1.5s (or camera off) → lost state
    property bool inputLost: false
    Timer {
        running: root.visible
        interval: 500
        repeat: true
        onTriggered: {
            // camera off counts as lost too (timer no longer stops on camera loss)
            const stale = !CameraCtrl.isActive
                || CameraCtrl.lastFrameMs <= 0
                || (Date.now() - CameraCtrl.lastFrameMs > 1500)
            root.inputLost = stale
        }
    }

    // Drag + corner snap (Electron h1): grab, live-translate, snap on release.
    // Bounds = the parent (stageBox) — clamped in both axes.
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
                // Clear ALL four anchor edges before writing x/y — leaving
                // right/bottom set after a corner snap conflicts on drag.
                root.anchors.left = undefined
                root.anchors.top = undefined
                root.anchors.right = undefined
                root.anchors.bottom = undefined
                const pw = root.parent ? root.parent.width : 0
                const ph = root.parent ? root.parent.height : 0
                root.x = Math.max(0, Math.min(pw - root.width, dragStart.x + mouse.x - pressPos.x))
                root.y = Math.max(0, Math.min(ph - root.height, dragStart.y + mouse.y - pressPos.y))
            }
        }
        onReleased: snapToNearestCorner()
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

    // Corner brackets on the PiP frame (hex-tech framing, state-colored)
    CornerTicks {
        anchors.fill: parent
        inset: 4
        tickSize: 10
        thickness: 2
        color: root.inputLost ? Colors.statusError60 : Colors.white35
        z: Theme.zLocal6
    }

    // INPUT pill (Electron: when no camera exists but "always" wants the PIP)
    Rectangle {
        visible: !CameraCtrl.isActive && pipPolicy === "always"
        anchors.left: parent.left
        anchors.top: parent.top
        anchors.margins: 6
        height: 18
        width: inputPillLbl.implicitWidth + 12
        radius: Theme.radiusSm
        color: Colors.base70 // surface-base/70
        border.color: Colors.surfaceBorder
        border.width: 1
        Text {
            id: inputPillLbl
            anchors.centerIn: parent
            text: qsTr("INPUT")
            color: Colors.textSecondary
            font.pixelSize: 10
            font.family: Theme.fontMono.family
            font.letterSpacing: 1.2
        }
    }

    // Top-LEFT camera chip (Electron: replaces the INPUT pill whenever
    // cameras exist; shows the camera NAME + chevron; click = picker).
    Rectangle {
        visible: CameraCtrl.currentDeviceName.length > 0
        anchors.left: parent.left
        anchors.top: parent.top
        anchors.margins: 6
        height: 20
        width: camChipRow.implicitWidth + 12
        radius: Theme.radiusFull
        color: chipMa.containsMouse ? Colors.base40 : Colors.base70 // base/70 → hover wash
        border.color: chipMa.containsMouse ? Colors.surfaceBorderStrong : Colors.surfaceBorder
        border.width: 1

        Row {
            id: camChipRow
            anchors.centerIn: parent
            spacing: 4
            Icon {
                name: "video"
                size: 11
                color: chipMa.containsMouse ? Colors.textPrimary : Colors.textSecondary
                anchors.verticalCenter: parent.verticalCenter
            }
            Text {
                text: CameraCtrl.currentDeviceName
                width: 72 // Electron max-w — keeps the chip inside the PiP at min width
                elide: Text.ElideRight
                color: chipMa.containsMouse ? Colors.textPrimary : Colors.textSecondary
                font.pixelSize: 10
                font.family: Theme.fontMono.family
                anchors.verticalCenter: parent.verticalCenter
            }
            Icon {
                name: "chevron-down"
                size: 11
                color: Colors.textMuted50
                rotation: pipCamPopup.visible ? 180 : 0
                anchors.verticalCenter: parent.verticalCenter
            }
        }

        MouseArea {
            id: chipMa
            anchors.fill: parent
            hoverEnabled: true
            // No camera switching mid-swap (restarts the pipeline → frame gap)
            enabled: !Session.isActive
            opacity: enabled ? 1.0 : 0.5
            cursorShape: enabled ? Qt.PointingHandCursor : Qt.ArrowCursor
            onClicked: pipCamPopup.visible ? pipCamPopup.close() : pipCamPopup.open()
        }

        Popup {
            id: pipCamPopup
            // The PiP is docked at the stage's BOTTOM corner — the picker must
            // open UPWARD or it renders under the stage-controls strip.
            y: -height - 8
            x: 0
            width: 260
            // Count-based height: ColumnLayout+Repeater implicitHeight is 0.
            height: Math.min(300, 26 + CameraCtrl.availableDevices.length * 34
                             + Math.max(0, CameraCtrl.availableDevices.length - 1) * 2 + 16)
            padding: 8
            closePolicy: Popup.CloseOnEscape
            background: Rectangle {
                color: Colors.surfaceOverlay
                border.color: Colors.surfaceBorder
                border.width: 1
                radius: Theme.radiusMd
                clip: true
                Honeycomb {
                    anchors.fill: parent
                    cellSize: Theme.honeycombCell
                    lineColor: Colors.honeycombLineFaint
                    opacity: 0.5
                }
                Rectangle {
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    height: 1
                    color: Colors.insetHighlightSoft
                    z: Theme.zLocal1
                }
                CornerTicks {
                    anchors.fill: parent
                    inset: 5
                    tickSize: 7
                    thickness: 1
                    color: Colors.accent30
                    z: Theme.zLocal1
                }
            }

            ColumnLayout {
                id: pipCamCol
                anchors.fill: parent
                spacing: 2

                // Header eyebrow
                Text {
                    Layout.leftMargin: 4
                    Layout.topMargin: 2
                    Layout.bottomMargin: 2
                    text: qsTr("CAMERA SOURCE")
                    color: Colors.textMuted
                    font.family: Theme.fontMono.family
                    font.pixelSize: 9
                    font.weight: Font.Bold
                    font.letterSpacing: 1.2
                }

                Flickable {
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    contentHeight: devCol.implicitHeight
                    clip: true
                    boundsBehavior: Flickable.StopAtBounds
                    ScrollBar.vertical: StyledScrollBar { thin: true }
                    ColumnLayout {
                        id: devCol
                        width: parent.width
                        spacing: 2
                Repeater {
                    model: CameraCtrl.availableDevices
                    delegate: Rectangle {
                        required property string modelData
                        required property int index
                        Layout.fillWidth: true
                        height: 30
                        radius: Theme.radiusSm
                        color: pdMa.containsMouse ? Colors.surfaceOverlay
                             : (CameraCtrl.currentDeviceName === modelData ? Colors.accent10 : Colors.transparent)
                        RowLayout {
                            anchors.fill: parent
                            anchors.leftMargin: 8
                            spacing: 8
                            Hexagon {
                                size: 7
                                lineWidth: 0
                                fillColor: CameraCtrl.currentDeviceName === modelData ? Colors.accent
                                     : Colors.textMuted30
                            }
                            Text {
                                text: modelData
                                color: CameraCtrl.currentDeviceName === modelData ? Colors.textPrimary
                                             : (pdMa.containsMouse ? Colors.textPrimary : Colors.textSecondary)
                                font.pixelSize: 11
                                elide: Text.ElideRight
                                Layout.fillWidth: true
                            }
                            Icon {
                                visible: CameraCtrl.currentDeviceName === modelData
                                name: "check"
                                size: 12
                                color: Colors.accentHover
                                emphasis: true
                            }
                        }
                        MouseArea {
                            id: pdMa
                            anchors.fill: parent
                            enabled: !Session.isActive
                            hoverEnabled: true
                            cursorShape: enabled ? Qt.PointingHandCursor : Qt.ArrowCursor
                            onClicked: {
                                CameraCtrl.currentDeviceId = CameraCtrl.deviceIdAt(index)
                                pipCamPopup.close()
                            }
                        }
                    }
                    } // devCol
                } // Flickable
            }
        }
    }
    }

    // INPUT LOST (redesigned): full scrim + centered elevated card with icon
    // disc, bold title and a clear hint — reads as a state, not a debug box.
    Rectangle {
        visible: root.inputLost
        anchors.fill: parent
        color: Colors.scrimHeavy
        z: Theme.zLocal5

        Rectangle {
            anchors.centerIn: parent
            width: lostCol.implicitWidth + 40
            implicitHeight: lostCol.implicitHeight + 32
            radius: Theme.radiusLg
            color: Colors.surfaceOverlay
            border.color: Colors.statusError40
            border.width: 1

            Column {
                id: lostCol
                anchors.centerIn: parent
                spacing: 8
                Item {
                    width: 48; height: 48
                    anchors.horizontalCenter: parent.horizontalCenter
                    Hexagon {
                        anchors.centerIn: parent
                        size: 48
                        lineWidth: 1.5
                        lineColor: Colors.statusError40
                        fillColor: Colors.errorFaintBg
                    }
                    Icon {
                        anchors.centerIn: parent
                        name: "alert-circle"
                        size: 22
                        color: Colors.statusError
                        emphasis: true
                    }
                }
                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: qsTr("INPUT LOST")
                    color: Colors.statusError
                    font.pixelSize: 12
                    font.weight: Font.Bold
                    font.family: Theme.fontMono.family
                    font.letterSpacing: 1.0
                }
                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: qsTr("Check your camera in Settings")
                    color: Colors.textSecondary
                    font.pixelSize: 11
                }
            }
        }
    }


    // Keep the PiP fully inside the stage box without moving it unless needed.
    function clampIntoBounds() {
        const pw = parent ? parent.width : 0
        const ph = parent ? parent.height : 0
        if (pw <= 0 || ph <= 0) return
        if (root.x < 0 || root.y < 0 || root.x + root.width > pw || root.y + root.height > ph)
            snapToNearestCorner()
    }

    function snapToNearestCorner() {
        const pw = parent ? parent.width : 0
        const ph = parent ? parent.height : 0
        if (pw <= 0 || ph <= 0) return
        const cx = root.x + root.width / 2
        const cy = root.y + root.height / 2
        const left = cx < pw / 2
        const top = cy < ph / 2
        root.anchors.right = undefined
        root.anchors.bottom = undefined
        root.anchors.left = left ? parent.left : undefined
        root.anchors.top = top ? parent.top : undefined
        root.anchors.right = !left ? parent.right : undefined
        root.anchors.bottom = !top ? parent.bottom : undefined
        root.anchors.margins = 16 // Electron top-4 = 16px inset
    }

    onVisibleChanged: if (visible) { inputLost = false; snapToNearestCorner() }
    Connections {
        function onWidthChanged() { if (root.visible) root.clampIntoBounds() }
        function onHeightChanged() { if (root.visible) root.clampIntoBounds() }
        target: root.parent
    }
}
