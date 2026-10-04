import LiveEscape
import QtMultimedia
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import Qt5Compat.GraphicalEffects

Item {
    id: root

    property bool stageFullscreen: false
    property string stageFillMode: "cover"
    property bool panelCollapsed: false
    readonly property int panelWidth: panelCollapsed ? 48 : 640
    property bool lowCreditDismissed: false

    readonly property bool showLowCreditBar: Session.creditsRemaining < 500
                                             && Session.creditsRemaining > 0
                                             && !lowCreditDismissed

    readonly property int topBarHeight: Theme.responsiveTopBarHeight
    readonly property int controlsBarHeight: Theme.responsiveControlsBarHeight

    Rectangle {
        anchors.fill: parent
        color: Theme.bg
    }

    ColumnLayout {
        anchors.fill: parent
        spacing: 0

        // Expiry / low-credit banner
        Rectangle {
            visible: App.expiryBannerText.length > 0
            Layout.fillWidth: true
            Layout.preferredHeight: 28
            color: App.expiryBannerKind === "urgent" ? "#2a1018" : Theme.goldGlow
            border.color: App.expiryBannerKind === "urgent" ? Theme.red : Theme.goldDim

            Text {
                anchors.centerIn: parent
                text: App.expiryBannerText
                color: App.expiryBannerKind === "urgent" ? Theme.red : Theme.gold
                font.family: Theme.fontMono
                font.pixelSize: 10
                font.letterSpacing: 1
            }

            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: App.showPlanGate = true
            }

        }

        // Low credit bar (Electron #lowCreditBar) — gold-to-red gradient, 1-500 credits
        Rectangle {
            id: lowCreditBar

            Layout.fillWidth: true
            Layout.preferredHeight: visible ? 40 : 0
            visible: root.showLowCreditBar
            color: "transparent"
            clip: true

            // Gradient background: gold to red
            Rectangle {
                anchors.fill: parent
                gradient: Gradient {
                    orientation: Gradient.Horizontal
                    GradientStop { position: 0; color: Theme.goldGlow }
                    GradientStop { position: 0.5; color: "#3a2010" }
                    GradientStop { position: 1; color: Theme.redDim }
                }
            }

            border.color: Theme.goldDim
            border.width: 1

            Row {
                anchors.centerIn: parent
                spacing: 10

                Text {
                    text: "⚠ LOW CREDITS"
                    color: Theme.gold
                    font.family: Theme.fontMono
                    font.pixelSize: 10
                    font.bold: true
                    font.letterSpacing: 1
                }

                Text {
                    anchors.verticalCenter: parent.verticalCenter
                    text: Math.floor(Session.creditsRemaining) + " CR remaining"
                    color: Theme.text
                    font.family: Theme.fontMono
                    font.pixelSize: 10
                }

                Rectangle {
                    width: buyBtn.implicitWidth + 16
                    height: 24
                    radius: 4
                    color: Theme.gold
                    anchors.verticalCenter: parent.verticalCenter

                    Text {
                        id: buyBtn
                        anchors.centerIn: parent
                        text: "BUY CREDITS NOW"
                        color: Theme.bg
                        font.family: Theme.fontMono
                        font.pixelSize: 9
                        font.bold: true
                        font.letterSpacing: 0.5
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: App.showPlanGate = true
                    }
                }

                // Dismiss button
                Rectangle {
                    width: 20
                    height: 20
                    radius: 10
                    color: "transparent"
                    border.color: Theme.dim
                    border.width: 1
                    anchors.verticalCenter: parent.verticalCenter

                    Text {
                        anchors.centerIn: parent
                        text: "✕"
                        color: Theme.dim
                        font.pixelSize: 10
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.lowCreditDismissed = true
                    }
                }
            }

            Behavior on Layout.preferredHeight {
                NumberAnimation { duration: Theme.motionFast }
            }
        }

        // Critical credits overlay — red warning at very low balance
        Rectangle {
            id: criticalCredits

            Layout.fillWidth: true
            Layout.preferredHeight: visible ? 36 : 0
            visible: Session.creditsRemaining < 30 && (Stream.live || Session.connectionStatus === "LIVE")
            color: Theme.redDim
            border.color: Theme.red
            border.width: 1

            Row {
                anchors.centerIn: parent
                spacing: 12

                Text {
                    text: qsTr("Credits running low — session may end soon")
                    color: Theme.red
                    font.family: Theme.fontMono
                    font.pixelSize: 11
                    font.letterSpacing: 0.5
                }

                Text {
                    text: qsTr("Upgrade")
                    color: Theme.gold
                    font.family: Theme.fontUi
                    font.pixelSize: 12
                    font.bold: true
                    font.letterSpacing: 1

                    MouseArea {
                        anchors.fill: parent
                        anchors.margins: -4
                        cursorShape: Qt.PointingHandCursor
                        onClicked: App.showPlanGate = true
                    }
                }
            }

            Behavior on Layout.preferredHeight {
                NumberAnimation { duration: Theme.motionFast }
            }
        }

        // Top bar
        Rectangle {
            id: topBar
            objectName: "topBar"
            Layout.fillWidth: true
            Layout.preferredHeight: 54
            color: Theme.s1

            // Gold gradient hairline at bottom edge (matches Electron .bar::after)
            Rectangle {
                anchors.bottom: parent.bottom
                width: parent.width
                height: 1
                gradient: Gradient {
                    orientation: Gradient.Horizontal
                    GradientStop { position: 0; color: "transparent" }
                    GradientStop { position: 0.5; color: Theme.goldD }
                    GradientStop { position: 1; color: "transparent" }
                }
            }

            Rectangle {
                anchors.bottom: parent.bottom
                width: parent.width
                height: 1
                color: Theme.border
            }

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 14
                anchors.rightMargin: 14
                spacing: 12

                LogoMark {
                    variant: "bar"
                    gemSize: 98
                    gemLetterSize: 12
                    gemRadius: 4
                    gemGap: 8
                    showWordmark: false
                    version: App.appVersion
                    versionSize: 11
                    versionLS: 2
                }

                Item {
                    Layout.fillWidth: true
                }

                StatusPill {
                    live: Stream.live
                    label: Session.connectionStatus
                }

                GhostButton {
                    text: root.panelCollapsed ? qsTr("Panel") : qsTr("« Panel")
                    onClicked: root.panelCollapsed = !root.panelCollapsed
                }

                CreditMeter {
                    id: meterBlock
                    objectName: "meterBlock"
                    used: Session.creditsUsed
                    remaining: Session.creditsRemaining
                }

                IconBarButton {
                    label: Stream.theatreMode ? "⬛ OBS ON" : "⬛ OBS"
                    active: Stream.theatreMode
                    onClicked: {
                        if (Stream.theatreMode) {
                            Stream.exitTheatre();
                            Mjpeg.stop();
                        } else {
                            if (!Mjpeg.running)
                                Mjpeg.start(4789);

                            Mjpeg.feedMode = decartStage.obsMode;
                            Stream.enterTheatre();
                            if (Mjpeg.running) {
                                App.copyToClipboard(Mjpeg.url);
                                App.toast("OBS feed: " + Mjpeg.url + " (copied)", "ok");
                            } else {
                                App.toast("OBS feed failed to start", "error");
                            }
                        }
                    }
                }

                IconBarButton {
                    visible: Stream.theatreMode
                    label: decartStage.obsMode === "camera" ? "SRC CAM" : decartStage.obsMode === "ai" ? "SRC AI" : "SRC AI+CAM"
                    active: decartStage.obsMode !== "camera"
                    onClicked: {
                        decartStage.obsMode = decartStage.obsMode === "camera" ? "ai" : decartStage.obsMode === "ai" ? "both" : "camera";
                    }
                }

                IconBarButton {
                    label: root.stageFillMode === "contain" ? "⛶ FIT" : "⛶ CROP"
                    active: root.stageFillMode === "contain"
                    onClicked: root.stageFillMode = root.stageFillMode === "contain" ? "cover" : "contain"
                }

                IconBarButton {
                    label: Stream.recording ? "■ REC" : "● REC"
                    danger: true
                    active: Stream.recording
                    onClicked: Stream.toggleRecording()
                }

                IconBarButton {
                    label: decartStage.recordAi ? "◉ AI REC" : "◐ AI REC"
                    active: decartStage.recordAi
                    onClicked: decartStage.toggleAiRecording()
                }

                IconBarButton {
                    label: "📷 SNAP"
                    onClicked: Stream.takeSnapshot()
                }

                IconBarButton {
                    label: Stream.frozen ? "❄ UNFREEZE" : "❄ FREEZE"
                    active: Stream.frozen
                    onClicked: Stream.toggleFreeze()
                }

                IconBarButton {
                    objectName: "tourBtn"
                    label: "▶ TOUR"
                    onClicked: App.startTour()
                }

                IconBarButton {
                    objectName: "tutorialsBtn"
                    label: "📚 TUTORIALS"
                    onClicked: App.showTutorials = true
                }

                IconBarButton {
                    objectName: "accountBtn"
                    label: "👤 ACCOUNT"
                    onClicked: App.showAccountModal = true
                }

            }

        }

        // Stage + 3 control columns
        RowLayout {
            Layout.fillWidth: true
            Layout.fillHeight: true
            spacing: 0

            // STAGE
            Item {
                id: stageColumn

                Layout.fillWidth: true
                Layout.fillHeight: true
                Layout.minimumWidth: 360

                Rectangle {
                    id: stageFrame
                    objectName: "stageFrame"

                    // Single shared stage surface: in normal mode it lives inside
                    // the stage column; in Theatre/OBS and Fullscreen modes the
                    // SAME surface (with its single DecartWebPeer, camera and
                    // recorder) is re-parented to fill the window — never a
                    // second viewport, so no duplicate WebRTC session/billing.
                    parent: (Stream.theatreMode || root.stageFullscreen) ? root : stageColumn
                    anchors.fill: parent
                    anchors.margins: (Stream.theatreMode || root.stageFullscreen) ? 0 : 10
                    z: (Stream.theatreMode || root.stageFullscreen) ? 180 : 1
                    radius: (Stream.theatreMode || root.stageFullscreen) ? 0 : 12
                    color: "#000000"
                    border.color: Stream.live ? Theme.teal : Theme.border
                    border.width: 1
                    clip: true

                    // Primary stage surface (camera + AI peer + freeze)
                    DecartViewport {
                        id: decartStage

                        anchors.fill: parent
                        anchors.margins: 2
                        z: 1
                        signalingWsUrl: Stream.signalingUrl
                        userId: Session.userId
                        accessKey: Session.accessKey
                        model: "lucy-2.5"
                        active: Stream.live || Stream.connecting
                        showLocalPip: !Stream.theatreMode
                        stageFillMode: root.stageFillMode
                    }

                    // Scanlines overlay (Electron .stage::after: repeating-linear-gradient)
                    // 3px transparent, 3px rgba(0,0,0,.015) — subtle CRT scanline effect
                    ScanlinesOverlay {
                        anchors.fill: parent
                        z: 3
                        visible: !Stream.theatreMode && !root.stageFullscreen && Theme.responsiveShowScanlines
                    }

                    // Out-glow inner vignette (Electron .out-glow: inset box-shadow teal)
                    Item {
                        anchors.fill: parent
                        z: 2
                        visible: Stream.live

                        // Top vignette
                        Rectangle {
                            anchors.top: parent.top
                            anchors.left: parent.left
                            anchors.right: parent.right
                            height: 80
                            gradient: Gradient {
                                orientation: Gradient.Vertical
                                GradientStop { position: 0; color: Qt.rgba(63/255, 232/255, 184/255, 0.03) }
                                GradientStop { position: 1; color: "transparent" }
                            }
                        }
                        // Bottom vignette
                        Rectangle {
                            anchors.bottom: parent.bottom
                            anchors.left: parent.left
                            anchors.right: parent.right
                            height: 80
                            gradient: Gradient {
                                orientation: Gradient.Vertical
                                GradientStop { position: 0; color: "transparent" }
                                GradientStop { position: 1; color: Qt.rgba(63/255, 232/255, 184/255, 0.03) }
                            }
                        }
                        // Left vignette
                        Rectangle {
                            anchors.top: parent.top
                            anchors.bottom: parent.bottom
                            anchors.left: parent.left
                            width: 80
                            gradient: Gradient {
                                orientation: Gradient.Horizontal
                                GradientStop { position: 0; color: Qt.rgba(63/255, 232/255, 184/255, 0.03) }
                                GradientStop { position: 1; color: "transparent" }
                            }
                        }
                        // Right vignette
                        Rectangle {
                            anchors.top: parent.top
                            anchors.bottom: parent.bottom
                            anchors.right: parent.right
                            width: 80
                            gradient: Gradient {
                                orientation: Gradient.Horizontal
                                GradientStop { position: 0; color: "transparent" }
                                GradientStop { position: 1; color: Qt.rgba(63/255, 232/255, 184/255, 0.03) }
                            }
                        }
                    }

                    // Idle placeholder when not live / not connecting
                    Column {
                        id: stageViz

                        anchors.centerIn: parent
                        z: 2
                        spacing: 12
                        visible: !Stream.live && !Stream.connecting && !Stream.frozen
                        opacity: 1

                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: "◈"
                            color: Theme.gold
                            font.pixelSize: 40
                        }

                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: "AI OUTPUT WILL APPEAR HERE"
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 11
                            font.letterSpacing: 2
                        }

                    }

                    // Connecting loader (matches original spin + text)
                    Rectangle {
                        anchors.centerIn: parent
                        width: Math.max(connectingCol.width + 48, 200)
                        height: connectingCol.height + 36
                        radius: 12
                        color: Qt.rgba(4/255, 4/255, 10/255, 0.9)
                        border.color: Theme.goldDim
                        border.width: 1
                        z: 4
                        visible: Stream.connecting

                        Column {
                            id: connectingCol
                            anchors.centerIn: parent
                            spacing: 14

                            Rectangle {
                                width: 36
                                height: 36
                                radius: 18
                                anchors.horizontalCenter: parent.horizontalCenter
                                color: "transparent"
                                border.color: Theme.gold
                                border.width: 2

                                RotationAnimation on rotation {
                                    running: Stream.connecting
                                    from: 0
                                    to: 360
                                    duration: 900
                                    loops: Animation.Infinite
                                }
                            }

                            Text {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: Stream.loaderText.length ? Stream.loaderText : "CONNECTING TO ENGINE…"
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 10
                                font.letterSpacing: 1
                            }
                        }
                    }

                    // AI LIVE / PAUSED badge (Electron: bg rgba(4,4,10,.82), border rgba(63,232,184,.22), backdrop-filter:blur(6px))
                    Rectangle {
                        visible: Stream.live
                        anchors.top: parent.top
                        anchors.left: parent.left
                        anchors.margins: 12
                        z: 6
                        width: aiLab.implicitWidth + 14
                        height: 22
                        radius: 4
                        color: Qt.rgba(4/255, 4/255, 10/255, 0.82)
                        border.color: Qt.rgba(63/255, 232/255, 184/255, 0.22)
                        border.width: 1

                        Text {
                            id: aiLab

                            anchors.centerIn: parent
                            text: Stream.paused ? "⏸ PAUSED" : "◈ AI LIVE"
                            color: Theme.teal
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 1
                        }

                    }

                    // Connection quality + latency HUD
                    Rectangle {
                        visible: Stream.live && Stream.connectionQuality !== "—"
                        anchors.top: parent.top
                        anchors.left: parent.left
                        anchors.leftMargin: 100
                        anchors.topMargin: 12
                        z: 6
                        width: qLab.implicitWidth + 14
                        height: 22
                        radius: 4
                        color: "#04040ad0"
                        border.color: Theme.goldDim

                        Text {
                            id: qLab

                            anchors.centerIn: parent
                            text: Stream.connectionQuality + "  " + Stream.latencyText
                            color: Theme.gold
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                        }

                    }

                    // Fullscreen toggle (original fs-btn)
                    Rectangle {
                        anchors.top: parent.top
                        anchors.right: parent.right
                        anchors.margins: 10
                        z: 7
                        width: 32
                        height: 28
                        radius: 4
                        color: "#04040acc"
                        border.color: Theme.border
                        layer.enabled: true
                        layer.effect: GaussianBlur {
                            radius: 6
                        }

                        Text {
                            anchors.centerIn: parent
                            text: stageFullscreen ? "✕" : "⛶"
                            color: Theme.dim
                            font.pixelSize: 14
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: stageFullscreen = !stageFullscreen
                        }

                    }

                    // PiP "YOUR CAM" label (Electron .pip-tag)
                    Rectangle {
                        anchors.bottom: parent.bottom
                        anchors.left: parent.left
                        anchors.margins: 10
                        z: 6
                        width: pipTagLabel.implicitWidth + 12
                        height: 18
                        radius: 3
                        color: Qt.rgba(4/255, 4/255, 10/255, 0.7)
                        visible: Stream.live && !Stream.theatreMode && !root.stageFullscreen

                        gradient: Gradient {
                            orientation: Gradient.Vertical
                            GradientStop { position: 0; color: Qt.rgba(4/255, 4/255, 10/255, 0.8) }
                            GradientStop { position: 1; color: Qt.rgba(4/255, 4/255, 10/255, 0.3) }
                        }

                        Text {
                            id: pipTagLabel
                            anchors.centerIn: parent
                            text: "YOUR CAM"
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 7
                            font.letterSpacing: 1.5
                        }
                    }

                }

            }

            // CONTROLS: 3 columns (collapsible)
            Rectangle {
                Layout.preferredWidth: root.panelWidth
                Layout.fillHeight: true
                color: Theme.s1
                border.color: Theme.border

                // Gold gradient hairline at top (Electron .ctrl::before)
                Rectangle {
                    anchors.top: parent.top
                    width: parent.width
                    height: 1
                    gradient: Gradient {
                        orientation: Gradient.Horizontal
                        GradientStop { position: 0; color: "transparent" }
                        GradientStop { position: 0.5; color: Theme.goldD }
                        GradientStop { position: 1; color: "transparent" }
                    }
                }

                // Collapsed rail
                Column {
                    anchors.fill: parent
                    anchors.margins: 8
                    spacing: 12
                    visible: root.panelCollapsed

                    Rectangle {
                        width: 32
                        height: 32
                        radius: Theme.radiusSm
                        anchors.horizontalCenter: parent.horizontalCenter
                        color: Theme.s2
                        border.color: Theme.border

                        Text {
                            anchors.centerIn: parent
                            text: "»"
                            color: Theme.gold
                            font.pixelSize: 14
                            font.bold: true
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: root.panelCollapsed = false
                        }

                    }

                    Text {
                        anchors.horizontalCenter: parent.horizontalCenter
                        rotation: -90
                        transformOrigin: Item.Center
                        text: "CONTROLS"
                        color: Theme.dim
                        font.family: Theme.fontMono
                        font.pixelSize: 9
                        font.letterSpacing: 1
                    }

                }

                RowLayout {
                    anchors.fill: parent
                    anchors.margins: 10
                    spacing: 10
                    visible: !root.panelCollapsed

                    // COL 1 — Face + connect
                    Rectangle {
                        Layout.preferredWidth: 255
                        Layout.fillHeight: true
                        radius: Theme.radius
                        color: Theme.s2
                        border.color: Theme.border

                        ColumnLayout {
                            anchors.fill: parent
                            anchors.margins: 12
                            spacing: 10

                            SectionLabel {
                                text: "REFERENCE FACE"
                            }

                            // Camera device selector (Electron #cameraSelect)
                            SectionLabel {
                                text: "📷 CAMERA"
                            }

                            ComboBox {
                                id: cameraSelect
                                objectName: "cameraSelect"
                                Layout.fillWidth: true
                                model: MediaDevices.videoInputs
                                textRole: "description"
                                currentIndex: 0
                                font.family: Theme.fontMono
                                font.pixelSize: 10
                                onActivated: {
                                    var dev = MediaDevices.videoInputs[currentIndex];
                                    if (dev) {
                                        camera.deviceId = dev.deviceId;
                                    }
                                }

                                background: Rectangle {
                                    radius: Theme.radius
                                    color: Theme.s1
                                    border.color: Theme.border
                                }

                                contentItem: Text {
                                    text: cameraSelect.displayText
                                    color: Theme.text
                                    font: cameraSelect.font
                                    verticalAlignment: Text.AlignVCenter
                                    leftPadding: 8
                                }
                            }

                            // Mode toggle (STYLE / FACE SWAP) - Electron .seg
                            Rectangle {
                                id: modeToggle
                                objectName: "modeToggle"
                                Layout.fillWidth: true
                                height: 30
                                radius: 7
                                color: "transparent"
                                border.color: Theme.border
                                border.width: 1

                                Row {
                                    anchors.fill: parent
                                    anchors.margins: 1

                                    Rectangle {
                                        width: (parent.width - 2) / 2
                                        height: parent.height
                                        radius: 6
                                        color: Stream.mode === "style" ? Theme.gold : "transparent"

                                        Text {
                                            anchors.centerIn: parent
                                            text: qsTr("STYLE")
                                            color: Stream.mode === "style" ? Theme.bg : Theme.dim
                                            font.family: Theme.fontMono
                                            font.pixelSize: 9
                                            font.bold: Stream.mode === "style"
                                            font.letterSpacing: 0.5
                                        }

                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: Stream.mode = "style"
                                        }
                                    }

                                    Rectangle {
                                        width: (parent.width - 2) / 2
                                        height: parent.height
                                        radius: 6
                                        color: Stream.mode === "face" ? Theme.gold : "transparent"

                                        Text {
                                            anchors.centerIn: parent
                                            text: qsTr("FACE SWAP")
                                            color: Stream.mode === "face" ? Theme.bg : Theme.dim
                                            font.family: Theme.fontMono
                                            font.pixelSize: 9
                                            font.bold: Stream.mode === "face"
                                            font.letterSpacing: 0.5
                                        }

                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: Stream.mode = "face"
                                        }
                                    }
                                }
                            }

                            Rectangle {
                                id: referenceFaceUpload
                                Layout.fillWidth: true
                                Layout.preferredHeight: 100
                                radius: Theme.radius
                                color: Theme.s1
                                border.color: Stream.referenceFacePath.length ? Theme.gold : Theme.border
                                border.width: 1
                                clip: true
                                visible: Stream.mode === "face"

                                // Hover effect (Electron .upload-zone:hover)
                                state: uploadMouse.containsMouse ? "hover" : ""
                                states: [
                                    State {
                                        name: "hover"
                                        when: !Stream.referenceFacePath.length && uploadMouse.containsMouse
                                        PropertyChanges { target: referenceFaceUpload; border.color: Theme.gold; color: Theme.goldGlow }
                                    }
                                ]

                                Image {
                                    anchors.fill: parent
                                    anchors.margins: 2
                                    visible: Stream.referenceFacePath.length > 0
                                    source: Stream.referenceFacePath.length > 0 ? (Stream.referenceFacePath.indexOf("file:") === 0 ? Stream.referenceFacePath : ("file://" + Stream.referenceFacePath)) : ""
                                    fillMode: Image.PreserveAspectCrop
                                    asynchronous: true
                                }

                                Column {
                                    anchors.centerIn: parent
                                    spacing: 4
                                    visible: Stream.referenceFacePath.length === 0

                                    Text {
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        text: "⬆"
                                        color: Theme.gold
                                        font.pixelSize: 18
                                    }

                                    Text {
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        text: "UPLOAD REFERENCE FACE"
                                        color: Theme.text
                                        font.family: Theme.fontMono
                                        font.pixelSize: 9
                                    }

                                    Text {
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        text: "JPG / PNG recommended"
                                        color: Theme.dim
                                        font.family: Theme.fontMono
                                        font.pixelSize: 8
                                    }

                                }

                                MouseArea {
                                    id: uploadMouse
                                    anchors.fill: parent
                                    hoverEnabled: true
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: App.pickReferenceFace()
                                }

                            }

                            RowLayout {
                                Layout.fillWidth: true
                                spacing: 6

                                GhostButton {
                                    Layout.fillWidth: true
                                    text: "📁 FILE"
                                    onClicked: App.pickReferenceFace()
                                }

                                GhostButton {
                                    Layout.fillWidth: true
                                    text: "📷 CAMERA"
                                    onClicked: cameraPopup.open()
                                }

                            }

                            // Streaming unavailable banner (Electron #streamingUnavailableBanner)
                            Rectangle {
                                visible: !Session.streamingEnabled
                                Layout.fillWidth: true
                                Layout.preferredHeight: 38
                                radius: 12
                                color: Qt.rgba(255/255, 77/255, 109/255, 0.08)

                                Text {
                                    anchors.centerIn: parent
                                    text: qsTr("Streaming is unavailable at the moment. Please try again later.")
                                    color: Theme.red
                                    font.family: Theme.fontMono
                                    font.pixelSize: 12
                                    horizontalAlignment: Text.AlignHCenter
                                }
                            }

                            // Connect + Stop buttons (Electron: separate always-visible buttons)
                            RowLayout {
                                Layout.fillWidth: true
                                spacing: 6

                                GoldButton {
                                    Layout.fillWidth: true
                                    text: Stream.connecting ? "…" : "▶ CONNECT"
                                    bg: Theme.gold
                                    fg: Theme.bg
                                    enabled: !Stream.connecting && !Stream.live
                                    onClicked: Stream.connectEngine()
                                }

                                Rectangle {
                                    Layout.preferredWidth: 60
                                    Layout.preferredHeight: 30
                                    radius: Theme.radiusSm
                                    color: Stream.live ? Theme.red : "transparent"
                                    border.color: Stream.live ? Theme.red : Theme.border
                                    border.width: 1
                                    opacity: Stream.live ? 1 : 0.4

                                    Text {
                                        anchors.centerIn: parent
                                        text: "■ STOP"
                                        color: Stream.live ? Theme.text : Theme.dim
                                        font.family: Theme.fontMono
                                        font.pixelSize: 10
                                        font.bold: true
                                    }

                                    MouseArea {
                                        anchors.fill: parent
                                        cursorShape: Stream.live ? Qt.PointingHandCursor : Qt.ArrowCursor
                                        enabled: Stream.live
                                        onClicked: Stream.disconnectEngine()
                                    }
                                }
                            }

                            // Pause + Resume buttons (Electron: separate shown as needed)
                            RowLayout {
                                Layout.fillWidth: true
                                spacing: 6
                                visible: Stream.live

                                Rectangle {
                                    Layout.fillWidth: true
                                    Layout.preferredHeight: 30
                                    radius: Theme.radiusSm
                                    color: "transparent"
                                    border.color: !Stream.paused ? Theme.gold : Theme.border
                                    border.width: 1

                                    Text {
                                        anchors.centerIn: parent
                                        text: "⏸ PAUSE"
                                        color: !Stream.paused ? Theme.gold : Theme.dim
                                        font.family: Theme.fontMono
                                        font.pixelSize: 10
                                    }

                                    MouseArea {
                                        anchors.fill: parent
                                        cursorShape: Qt.PointingHandCursor
                                        enabled: !Stream.paused
                                        onClicked: Stream.pauseEffect()
                                    }
                                }

                                Rectangle {
                                    Layout.fillWidth: true
                                    Layout.preferredHeight: 30
                                    radius: Theme.radiusSm
                                    color: "transparent"
                                    border.color: Stream.paused ? Theme.teal : Theme.border
                                    border.width: 1

                                    Text {
                                        anchors.centerIn: parent
                                        text: "▶ RESUME"
                                        color: Stream.paused ? Theme.teal : Theme.dim
                                        font.family: Theme.fontMono
                                        font.pixelSize: 10
                                    }

                                    MouseArea {
                                        anchors.fill: parent
                                        cursorShape: Qt.PointingHandCursor
                                        enabled: Stream.paused
                                        onClicked: Stream.resumeEffect()
                                    }
                                }
                            }

                            GhostButton {
                                Layout.fillWidth: true
                                text: "🖼 BACKGROUND"
                                enabled: Session.hasFeature("backgroundChange") && Stream.live
                                opacity: enabled ? 1 : 0.4
                                onClicked: {
                                    if (!Session.hasFeature("backgroundChange"))
                                        App.openUpgradeFlow();
                                    else
                                        App.showBgPanel = true;
                                }
                            }

                            Item {
                                Layout.fillHeight: true
                            }

                            Rectangle {
                                Layout.fillWidth: true
                                Layout.preferredHeight: 30
                                radius: Theme.radiusSm
                                color: abuseMouse.containsMouse ? Theme.redDim : "transparent"
                                border.color: abuseMouse.containsMouse ? Theme.red : Theme.border
                                border.width: 1

                                Text {
                                    anchors.centerIn: parent
                                    text: "🚨 Report Abuse"
                                    color: abuseMouse.containsMouse ? Theme.red : Theme.dim
                                    font.family: Theme.fontMono
                                    font.pixelSize: 9
                                }

                                MouseArea {
                                    id: abuseMouse
                                    anchors.fill: parent
                                    hoverEnabled: true
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: App.showAbuseReport = true
                                }
                            }

                        }

                    }

                    // COL 2 — Prompt / styles
                    Rectangle {
                        Layout.fillWidth: true
                        Layout.fillHeight: true
                        radius: Theme.radius
                        color: Theme.s2
                        border.color: Theme.border
                        clip: true

                        ColumnLayout {
                            anchors.fill: parent
                            anchors.margins: 12
                            spacing: 8
                            opacity: Session.hasFeature("backgroundChange") ? 1 : 0.35

                            RowLayout {
                                Layout.fillWidth: true

                                SectionLabel {
                                    text: "🖼 BACKGROUND & STYLE"
                                    Layout.fillWidth: true
                                }

                                Text {
                                    text: "LIVE UPDATE"
                                    color: Theme.dim
                                    font.family: Theme.fontMono
                                    font.pixelSize: 8
                                }

                                ToggleSwitch {
                                    checked: Stream.liveUpdate
                                    onToggled: (v) => {
                                        return Stream.liveUpdate = v;
                                    }
                                }

                            }

                            ScrollView {
                                Layout.fillWidth: true
                                Layout.preferredHeight: 90

                                TextArea {
                                    id: promptArea

                                    width: parent.width
                                    wrapMode: TextEdit.Wrap
                                    color: Theme.text
                                    font.family: Theme.fontMono
                                    font.pixelSize: 11
                                    placeholderText: "Type what you want to see — a background, an outfit, a cap, a style... e.g. 'cozy coffee shop background' or 'red baseball cap'"
                                    text: Stream.prompt
                                    onTextChanged: {
                                        if (activeFocus) {
                                            promptDebounce.restart();
                                        }
                                    }

                                    Timer {
                                        id: promptDebounce

                                        interval: 400
                                        onTriggered: Stream.prompt = promptArea.text
                                    }

                                    background: Rectangle {
                                        color: Theme.s1
                                        radius: Theme.radius
                                        border.color: Theme.border
                                    }

                                }

                            }

                            Text {
                                Layout.fillWidth: true
                                wrapMode: Text.WordWrap
                                text: "Changes background live — can also add clothing, accessories, and more."
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 8
                            }

                            RowLayout {
                                SectionLabel {
                                    text: "⚡ PRESETS"
                                    Layout.fillWidth: true
                                }

                                Text {
                                    text: "ENHANCE"
                                    color: Theme.dim
                                    font.family: Theme.fontMono
                                    font.pixelSize: 8
                                }

                                ToggleSwitch {
                                    checked: Stream.enhance
                                    onToggled: (v) => {
                                        return Stream.enhance = v;
                                    }
                                }

                            }

                            Flow {
                                id: presetsFlow
                                objectName: "presetsFlow"
                                Layout.fillWidth: true
                                spacing: 6

                                Repeater {
                                    model: Stream.presets

                                    PresetChip {
                                        label: modelData
                                        onClicked: Stream.applyPreset(modelData)
                                    }

                                }

                            }

                            SectionLabel {
                                text: "📜 RECENT"
                            }

                            Flow {
                                id: historyContent
                                objectName: "historyContent"
                                Layout.fillWidth: true
                                spacing: 6

                                Repeater {
                                    model: Stream.recentPrompts

                                    PresetChip {
                                        label: modelData
                                        onClicked: Stream.applyPreset(modelData)
                                    }

                                }

                            }

                            Item {
                                Layout.fillHeight: true
                            }

                        }

                        // Lock overlay for starter — blocks interaction with the locked controls
                        Rectangle {
                            visible: !Session.hasFeature("backgroundChange")
                            anchors.fill: parent
                            radius: Theme.radius
                            color: "#04040ae0"
                            layer.enabled: true
                            layer.effect: GaussianBlur {
                                radius: 8
                            }

                            // Block clicks so Starter users can't drive locked controls
                            MouseArea {
                                anchors.fill: parent
                            }

                            Column {
                                anchors.centerIn: parent
                                spacing: 10
                                width: parent.width - 40

                                Text {
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    text: "🔒"
                                    font.pixelSize: 28
                                    color: Theme.gold
                                }

                                Text {
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    text: "Creator Plan Required"
                                    color: Theme.text
                                    font.family: Theme.fontUi
                                    font.pixelSize: 14
                                    font.bold: true
                                }

                                Text {
                                    width: parent.width
                                    horizontalAlignment: Text.AlignHCenter
                                    wrapMode: Text.WordWrap
                                    text: "Background & Style transformations are available on Creator and Pro plans."
                                    color: Theme.dim
                                    font.family: Theme.fontMono
                                    font.pixelSize: 9
                                }

                                GoldButton {
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    text: "⚡ UPGRADE PLAN"
                                    onClicked: App.openUpgradeFlow()
                                }

                            }

                        }

                    }

                    // COL 3 — Balance
                    Rectangle {
                        id: balanceCol
                        objectName: "balanceCol"
                        Layout.preferredWidth: 255
                        Layout.fillHeight: true
                        radius: Theme.radius
                        color: Theme.s2
                        border.color: Theme.border

                        ColumnLayout {
                            anchors.fill: parent
                            anchors.margins: 12
                            spacing: 10

                            SectionLabel {
                                text: "💳 SESSION BALANCE"
                            }

                            Column {
                                Layout.fillWidth: true
                                spacing: 8

                                RowLayout {
                                    width: parent.width

                                    Text {
                                        text: "PLAN TOTAL"
                                        color: Theme.dim
                                        font.family: Theme.fontMono
                                        font.pixelSize: 9
                                        Layout.fillWidth: true
                                    }

                                    Text {
                                        text: Math.floor(Session.creditsTotal) + " CR"
                                        color: Theme.text
                                        font.family: Theme.fontMono
                                        font.pixelSize: 10
                                        font.bold: true
                                    }

                                }

                                RowLayout {
                                    width: parent.width

                                    Text {
                                        text: "USED"
                                        color: Theme.dim
                                        font.family: Theme.fontMono
                                        font.pixelSize: 9
                                        Layout.fillWidth: true
                                    }

                                    Text {
                                        text: Math.floor(Session.creditsUsed) + " CR"
                                        color: Theme.red
                                        font.family: Theme.fontMono
                                        font.pixelSize: 10
                                    }

                                }

                                RowLayout {
                                    width: parent.width

                                    Text {
                                        text: "REMAINING"
                                        color: Theme.dim
                                        font.family: Theme.fontMono
                                        font.pixelSize: 9
                                        Layout.fillWidth: true
                                    }

                                    Text {
                                        text: Math.floor(Session.creditsRemaining) + " CR"
                                        color: Theme.teal
                                        font.family: Theme.fontMono
                                        font.pixelSize: 10
                                        font.bold: true
                                    }

                                }

                                Rectangle {
                                    width: parent.width
                                    height: 4
                                    radius: 2
                                    color: Theme.border

                                    Rectangle {
                                        height: parent.height
                                        radius: 2
                                        color: Theme.teal
                                        width: Session.creditsTotal > 0 ? parent.width * Math.max(0, Math.min(1, Session.creditsRemaining / Session.creditsTotal)) : parent.width

                                        Behavior on width {
                                            NumberAnimation {
                                                duration: 250
                                            }

                                        }

                                    }

                                }

                            }

                            Rectangle {
                                visible: Session.plan === "starter"
                                Layout.fillWidth: true
                                Layout.preferredHeight: up.implicitHeight + 16
                                radius: Theme.radius
                                color: Theme.goldGlow
                                border.color: Theme.goldDim

                                Text {
                                    id: up

                                    anchors.left: parent.left
                                    anchors.right: parent.right
                                    anchors.margins: 8
                                    anchors.verticalCenter: parent.verticalCenter
                                    wrapMode: Text.WordWrap
                                    textFormat: Text.RichText
                                    text: "⚡ <b>Starter</b> — upgrade for Backgrounds & more."
                                    color: Theme.gold
                                    font.family: Theme.fontMono
                                    font.pixelSize: 8
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: App.openUpgradeFlow()
                                }

                            }

                            SectionLabel {
                                text: "⚙️ QUALITY"
                            }

                            ComboBox {
                                id: qual
                                objectName: "qualSelector"

                                Layout.fillWidth: true
                                model: [{
                                    "t": "High — Best Output",
                                    "v": "high"
                                }, {
                                    "t": "Balanced — Recommended",
                                    "v": "balanced"
                                }, {
                                    "t": "Performance — Lowest Latency",
                                    "v": "performance"
                                }]
                                textRole: "t"
                                // Match original: high selected by default
                                currentIndex: {
                                    var q = Stream.quality;
                                    if (q === "balanced")
                                        return 1;

                                    if (q === "performance")
                                        return 2;

                                    return 0;
                                }
                                font.family: Theme.fontMono
                                font.pixelSize: 10
                                onActivated: Stream.quality = model[currentIndex].v

                                background: Rectangle {
                                    radius: Theme.radius
                                    color: Theme.s1
                                    border.color: Theme.border
                                }

                                contentItem: Text {
                                    text: qual.displayText
                                    color: Theme.text
                                    font: qual.font
                                    verticalAlignment: Text.AlignVCenter
                                    leftPadding: 8
                                }

                            }

                            RowLayout {
                                Layout.fillWidth: true

                                SectionLabel {
                                    text: "🎥 OUTPUT LATENCY"
                                    Layout.fillWidth: true
                                }

                                Text {
                                    text: Stream.latencyText
                                    color: Theme.dim
                                    font.family: Theme.fontMono
                                    font.pixelSize: 9
                                }

                            }

                            Item {
                                Layout.fillHeight: true
                            }

                            GoldButton {
                                Layout.fillWidth: true
                                text: "🎟️ BUY MORE CREDITS"
                                bg: Theme.goldGlow
                                fg: Theme.gold
                onClicked: App.showAccountModal = true
                            }

                        }

                    }

                }

                Behavior on Layout.preferredWidth {
                    NumberAnimation {
                        duration: Theme.motionNormal
                        easing.type: Easing.OutCubic
                    }

                }

            }

        }

    }

        // Theatre / OBS mode — full-bleed stage
        Rectangle {
            anchors.fill: parent
            color: "transparent"
            visible: Stream.theatreMode
            z: 200

            Text {
                anchors.centerIn: parent
                visible: !Stream.live && !Stream.connecting
                text: "Connect to go live in OBS mode"
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 14
                font.letterSpacing: 2
                z: 3
            }

            // AI badge top-left
            Rectangle {
                visible: Stream.live
                anchors.top: parent.top
                anchors.left: parent.left
                anchors.margins: 16
                z: 3
                width: theatreAi.implicitWidth + 16
                height: 24
                radius: 4
                color: "#0d2a22"
                border.color: Theme.teal

                Text {
                    id: theatreAi
                    anchors.centerIn: parent
                    text: "◈ AI OUTPUT — OBS MODE"
                    color: Theme.teal
                    font.family: Theme.fontMono
                    font.pixelSize: 10
                    font.letterSpacing: 1
                }
            }

            // Exit theatre button (Electron #exitTheatre) — top right pill
            Rectangle {
                id: exitTheatre
                anchors.top: parent.top
                anchors.right: parent.right
                anchors.margins: 16
                z: 4
                width: exitTheatreLabel.implicitWidth + 24
                height: 32
                radius: 16
                color: Qt.rgba(4/255, 4/255, 10/255, 0.85)
                border.color: exitTheatreMouse.containsMouse ? Theme.gold : Theme.border
                border.width: 1

                Text {
                    id: exitTheatreLabel
                    anchors.centerIn: parent
                    text: "✕ EXIT OBS MODE"
                    color: exitTheatreMouse.containsMouse ? Theme.gold : Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 10
                    font.letterSpacing: 1
                }

                MouseArea {
                    id: exitTheatreMouse
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: {
                        Stream.exitTheatre();
                        Mjpeg.stop();
                    }
                }

                Behavior on border.color { ColorAnimation { duration: 200 } }
            }
        }

    // Reconnecting overlay (Electron setReconnectingOverlay)
    Rectangle {
        anchors.fill: parent
        visible: Stream.reconnecting
        z: 210
        color: Qt.rgba(4/255, 4/255, 10/255, 0.85)

        Rectangle {
            anchors.centerIn: parent
            width: reconnectPill.implicitWidth + 36
            height: 42
            radius: 21
            color: "transparent"
            border.color: Theme.gold
            border.width: 1

            Row {
                id: reconnectPill
                anchors.centerIn: parent
                spacing: 10

                Rectangle {
                    width: 16
                    height: 16
                    radius: 8
                    color: "transparent"
                    border.color: Theme.gold
                    border.width: 2
                    anchors.verticalCenter: parent.verticalCenter

                    RotationAnimation on rotation {
                        running: Stream.reconnecting
                        from: 0
                        to: 360
                        duration: 800
                        loops: Animation.Infinite
                    }
                }

                Text {
                    text: "RECONNECTING…"
                    color: Theme.gold
                    font.family: Theme.fontMono
                    font.pixelSize: 11
                    font.letterSpacing: 2
                    anchors.verticalCenter: parent.verticalCenter
                }
            }
        }
    }

    // Stage fullscreen overlay — chrome only; the shared stageFrame fills the
    // window via re-parenting. No second viewport/session created here.
    Rectangle {
        anchors.fill: parent
        color: "transparent"
        visible: root.stageFullscreen && !Stream.theatreMode
        z: 190

        Rectangle {
            anchors.top: parent.top
            anchors.right: parent.right
            anchors.margins: 16
            width: 36
            height: 32
            radius: 4
            color: "#04040acc"
            border.color: Theme.border
            z: 2

            Text {
                anchors.centerIn: parent
                text: "✕"
                color: Theme.text
                font.pixelSize: 14
            }

            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: root.stageFullscreen = false
            }

        }

    }

    // Live camera capture for reference face
    Popup {
        id: cameraPopup

        anchors.centerIn: Overlay.overlay
        width: Math.min(parent.width * 0.7, 520)
        height: Math.min(parent.height * 0.7, 420)
        modal: true
        focus: true
        closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside

        ColumnLayout {
            anchors.fill: parent
            anchors.margins: 16
            spacing: 10

            Text {
                text: "CAPTURE REFERENCE FACE"
                color: Theme.gold
                font.family: Theme.fontUi
                font.bold: true
                font.pixelSize: 14
                font.letterSpacing: 1
            }

            CaptureSession {
                id: captureSession

                videoOutput: preview

                camera: Camera {
                    id: camera

                    active: cameraPopup.opened
                }

                imageCapture: ImageCapture {
                    id: imageCapture

                    onImageSaved: function(id, path) {
                        Stream.setReferenceFace(path);
                        cameraPopup.close();
                        App.toast("Reference face captured", "ok");
                    }
                    onErrorOccurred: function(id, err, str) {
                        App.toast(str || "Capture failed", "error");
                    }
                }

            }

            VideoOutput {
                id: preview

                Layout.fillWidth: true
                Layout.fillHeight: true
                fillMode: VideoOutput.PreserveAspectCrop
            }

            RowLayout {
                Layout.fillWidth: true

                GhostButton {
                    text: "CANCEL"
                    onClicked: cameraPopup.close()
                }

                GoldButton {
                    Layout.fillWidth: true
                    text: "📸 CAPTURE"
                    onClicked: imageCapture.captureToFile()
                }

            }

        }

        background: Rectangle {
            color: Theme.s1
            radius: 12
            border.color: Theme.goldDim
        }

    }

    // FS Hint — bottom center (Electron #fsHint)
    Rectangle {
        id: fsHint
        visible: opacity > 0
        anchors.bottom: parent.bottom
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.margins: 18
        width: fsHintText.implicitWidth + 36
        height: fsHintText.implicitHeight + 12
        radius: 100
        color: Qt.rgba(4/255, 4/255, 10/255, 0.85)
        border.color: Theme.border
        border.width: 1
        opacity: 0

        Text {
            id: fsHintText
            anchors.centerIn: parent
            text: qsTr("PRESS F OR ESC TO EXIT FULLSCREEN")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 9
            font.letterSpacing: 1.5
        }

        Behavior on opacity { NumberAnimation { duration: 400 } }

        // Show when entering fullscreen/theatre, auto-hide after 3s (Electron behavior)
        onVisibleChanged: {
            if (visible) {
                fsHint.opacity = 1;
                fsHintTimer.restart();
            }
        }

        Timer {
            id: fsHintTimer
            interval: 3000
            onTriggered: fsHint.opacity = 0
        }
    }

}

