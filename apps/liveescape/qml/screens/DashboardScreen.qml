import LiveEscape
import QtMultimedia
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

Item {
    id: root

    property bool stageFullscreen: false
    property string stageFillMode: "cover"
    property bool panelCollapsed: false
    readonly property int panelWidth: panelCollapsed ? 48 : 640

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

        // Low credits urgency — stays visible when the balance is exhausted or negative
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
                NumberAnimation {
                    duration: Theme.motionFast
                }

            }

        }

        // Top bar
        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 52
            color: Theme.s1

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
                    gemSize: 22
                    version: App.appVersion
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
                    label: "▶ TOUR"
                    onClicked: App.startTour()
                }

                IconBarButton {
                    label: "📚 TUTORIALS"
                    onClicked: App.showTutorials = true
                }

                IconBarButton {
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
                    color: Theme.s1
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
                    Column {
                        anchors.centerIn: parent
                        spacing: 14
                        z: 5
                        visible: Stream.connecting

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

                    // AI LIVE / PAUSED badge
                    Rectangle {
                        visible: Stream.live
                        anchors.top: parent.top
                        anchors.left: parent.left
                        anchors.margins: 12
                        z: 6
                        width: aiLab.implicitWidth + 14
                        height: 22
                        radius: 4
                        color: "#0d2a22"
                        border.color: Theme.teal

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

                        Text {
                            anchors.centerIn: parent
                            text: stageFullscreen ? "⛶" : "⛶"
                            color: Theme.dim
                            font.pixelSize: 14
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: stageFullscreen = !stageFullscreen
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
                        Layout.preferredWidth: 200
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

                            Rectangle {
                                Layout.fillWidth: true
                                Layout.preferredHeight: 100
                                radius: Theme.radius
                                color: Theme.s1
                                border.color: Stream.referenceFacePath.length ? Theme.gold : Theme.border
                                border.width: 1
                                clip: true

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
                                    anchors.fill: parent
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

                            GoldButton {
                                Layout.fillWidth: true
                                text: Stream.live ? "■ STOP" : (Stream.connecting ? "…" : "▶ CONNECT")
                                bg: Stream.live ? Theme.red : Theme.gold
                                fg: Stream.live ? Theme.text : Theme.bg
                                enabled: !Stream.connecting
                                onClicked: Stream.live ? Stream.disconnectEngine() : Stream.connectEngine()
                            }

                            RowLayout {
                                Layout.fillWidth: true
                                spacing: 6
                                visible: Stream.live

                                GhostButton {
                                    Layout.fillWidth: true
                                    text: Stream.paused ? "▶ PLAY" : "⏸ PAUSE"
                                    onClicked: Stream.paused ? Stream.resumeEffect() : Stream.pauseEffect()
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

                            Text {
                                Layout.fillWidth: true
                                horizontalAlignment: Text.AlignHCenter
                                text: "🚨 Report Abuse"
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 9

                                MouseArea {
                                    anchors.fill: parent
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
                                    placeholderText: "Type what you want to see — background, outfit, style…"
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
                        Layout.preferredWidth: 180
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
                                        color: Theme.gold
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
                                onClicked: App.showPlanGate = true
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

    // Theatre / OBS mode — full-bleed stage. The single shared stageFrame (with
    // its one DecartWebPeer) is re-parented to fill the window; this overlay is
    // chrome only (HUD + exit). No second viewport/session is created here.
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

        GoldButton {
            anchors.top: parent.top
            anchors.right: parent.right
            anchors.margins: 20
            z: 3
            text: "✕ EXIT OBS MODE"
            onClicked: Stream.exitTheatre()
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

}
