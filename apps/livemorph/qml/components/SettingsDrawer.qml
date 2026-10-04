import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import QtQuick.Dialogs
import LiveMorph

/**
 * Settings drawer — original Settings-*.js uses:
 *   fixed inset-0 z-panel + bg-black/60 backdrop
 *   panel-drawer w-[480px] slide-in-right
 */
Item {
    id: root
    anchors.fill: parent
    visible: open || closing
    z: 200

    property bool open: false
    property string updateDownloadUrl: ""
    property string updateLatestVersion: ""
    property bool closing: false
    property string activeTab: "general"

    onOpenChanged: {
        if (open) {
            closing = false
            drawer.x = root.width - drawer.width
        } else if (visible) {
            closing = true
            drawer.x = root.width
            closeTimer.start()
        }
    }

    Timer {
        id: closeTimer
        interval: 220
        onTriggered: { root.closing = false }
    }

    // Scrim
    Rectangle {
        anchors.fill: parent
        color: Colors.overlayScrim
        opacity: root.open ? 1 : 0
        Behavior on opacity { NumberAnimation { duration: 180 } }
        MouseArea {
            anchors.fill: parent
            onClicked: root.open = false
        }
    }

    // Drawer panel
    Rectangle {
        id: drawer
        width: Math.min(Theme.settingsDrawerWidth, root.width * 0.92)
        height: parent.height
        x: root.open ? root.width - width : root.width
        y: 0
        color: Colors.surfaceOverlay
        border.color: Colors.surfaceBorder
        border.width: 0

        // Panel hairline — accent gradient at top (matches Electron)
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 1
            z: 1
            gradient: Gradient {
                GradientStop { position: 0.0; color: "transparent" }
                GradientStop { position: 0.5; color: Colors.accent60 }
                GradientStop { position: 1.0; color: "transparent" }
            }
        }

        // Panel drawer shadow — layered depth
        Rectangle {
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            anchors.right: parent.right
            anchors.rightMargin: -8
            width: 8
            color: Colors.shadow
            opacity: 0.35
        }

        // panel-drawer left edge
        Rectangle {
            anchors.left: parent.left
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            width: 1
            color: Colors.surfaceBorder
        }
        Rectangle {
            anchors.left: parent.left
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            anchors.leftMargin: 1
            width: 1
            color: Colors.insetHighlightSoft
            opacity: 0.5
        }

        Behavior on x { NumberAnimation { duration: Theme.motionNormal; easing.type: Easing.OutCubic } }

        ColumnLayout {
            anchors.fill: parent
            spacing: 0

            // Sticky header
            Rectangle {
                Layout.fillWidth: true
                height: 56
                color: Colors.surfaceRaised
                Rectangle {
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.bottom: parent.bottom
                    height: 1
                    color: Colors.surfaceBorder
                }
                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 24
                    anchors.rightMargin: 16
                    Text {
                        text: qsTr("Settings")
                        color: Colors.textPrimary
                        font.pixelSize: 16
                        font.weight: Font.DemiBold
                        Layout.fillWidth: true
                    }
                    // Help button
                    Rectangle {
                        width: 28
                        height: 28
                        radius: Theme.radiusSm
                        color: helpHeaderMa.containsMouse ? Colors.surfaceOverlay : "transparent"
                        Icon {
                            anchors.centerIn: parent
                            name: "circle-question-mark"
                            size: Theme.iconMd
                            color: Colors.textSecondary
                        }
                        MouseArea {
                            id: helpHeaderMa
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: root.open = false
                        }
                    }
                    // Close button (icon style)
                    Rectangle {
                        width: 28
                        height: 28
                        radius: Theme.radiusSm
                        color: closeHeaderMa.containsMouse ? Colors.surfaceOverlay : "transparent"
                        Icon {
                            anchors.centerIn: parent
                            name: "x"
                            size: Theme.iconMd
                            color: Colors.textSecondary
                        }
                        MouseArea {
                            id: closeHeaderMa
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: root.open = false
                        }
                    }
                }
            }

            // Sidebar nav (vertical)
            Item {
                Layout.fillWidth: true
                Layout.fillHeight: true

                RowLayout {
                    anchors.fill: parent

                    // Sidebar
                    Rectangle {
                        Layout.preferredWidth: 140
                        Layout.fillHeight: true
                        color: Qt.rgba(Colors.surfaceBase.r, Colors.surfaceBase.g, Colors.surfaceBase.b, 0.4)

                        Rectangle {
                            anchors.left: parent.left
                            anchors.top: parent.top
                            anchors.bottom: parent.bottom
                            width: 1
                            color: Colors.surfaceBorderSubtle
                        }

                        ColumnLayout {
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.top: parent.top
                            anchors.topMargin: 8
                            anchors.leftMargin: 8
                            anchors.rightMargin: 8
                            spacing: 2

                            // Studio section
                            Text {
                                text: qsTr("STUDIO")
                                color: Colors.textMuted
                                font.pixelSize: 9
                                font.family: Theme.fontMono.family
                                font.letterSpacing: 1.35
                                Layout.leftMargin: 8
                                Layout.topMargin: 4
                                Layout.bottomMargin: 4
                            }

                            Repeater {
                                model: [
                                    { id: "general", label: qsTr("General"), icon: "settings" },
                                    { id: "camera", label: qsTr("Camera"), icon: "video" },
                                    { id: "stream", label: qsTr("Stream"), icon: "radio" },
                                    { id: "recording", label: qsTr("Recording"), icon: "circle-dot" }
                                ]
                                Rectangle {
                                    Layout.fillWidth: true
                                    height: 32
                                    radius: Theme.radiusSm
                                    color: root.activeTab === modelData.id ? Colors.surfaceOverlay : "transparent"
                                    border.color: root.activeTab === modelData.id ? Colors.surfaceBorder : "transparent"
                                    border.width: 1

                                    // Inset top highlight for active
                                    Rectangle {
                                        visible: root.activeTab === modelData.id
                                        anchors.left: parent.left
                                        anchors.right: parent.right
                                        anchors.top: parent.top
                                        height: 1
                                        color: Colors.surfaceBorder
                                    }

                                    Row {
                                        anchors.left: parent.left
                                        anchors.leftMargin: 8
                                        anchors.verticalCenter: parent.verticalCenter
                                        spacing: 8

                                        Icon {
                                            name: modelData.icon
                                            size: 14
                                            color: root.activeTab === modelData.id ? Colors.textPrimary : Colors.textMuted
                                            anchors.verticalCenter: parent.verticalCenter
                                        }

                                        Text {
                                            text: modelData.label
                                            color: root.activeTab === modelData.id ? Colors.textPrimary : Colors.textMuted
                                            font.pixelSize: 12
                                            anchors.verticalCenter: parent.verticalCenter
                                        }
                                    }

                                    MouseArea {
                                        anchors.fill: parent
                                        cursorShape: Qt.PointingHandCursor
                                        onClicked: root.activeTab = modelData.id
                                    }
                                }
                            }

                            // Account section
                            Item { Layout.preferredHeight: 12 }

                            Text {
                                text: qsTr("ACCOUNT")
                                color: Colors.textMuted
                                font.pixelSize: 9
                                font.family: Theme.fontMono.family
                                font.letterSpacing: 1.35
                                Layout.leftMargin: 8
                                Layout.bottomMargin: 4
                            }

                            Rectangle {
                                Layout.fillWidth: true
                                height: 32
                                radius: Theme.radiusSm
                                color: root.activeTab === "billing" ? Colors.surfaceOverlay : "transparent"
                                border.color: root.activeTab === "billing" ? Colors.surfaceBorder : "transparent"
                                border.width: 1

                                Rectangle {
                                    visible: root.activeTab === "billing"
                                    anchors.left: parent.left
                                    anchors.right: parent.right
                                    anchors.top: parent.top
                                    height: 1
                                    color: Colors.surfaceBorder
                                }

                                Row {
                                    anchors.left: parent.left
                                    anchors.leftMargin: 8
                                    anchors.verticalCenter: parent.verticalCenter
                                    spacing: 8

                                    Icon {
                                        name: "coins"
                                        size: 14
                                        color: root.activeTab === "billing" ? Colors.textPrimary : Colors.textMuted
                                        anchors.verticalCenter: parent.verticalCenter
                                    }

                                    Text {
                                        text: qsTr("Billing")
                                        color: root.activeTab === "billing" ? Colors.textPrimary : Colors.textMuted
                                        font.pixelSize: 12
                                        anchors.verticalCenter: parent.verticalCenter
                                    }
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: root.activeTab = "billing"
                                }
                            }

                            Item { Layout.fillHeight: true }

                            // About (pinned to bottom)
                            Rectangle {
                                Layout.fillWidth: true
                                height: 32
                                radius: Theme.radiusSm
                                color: root.activeTab === "about" ? Colors.surfaceOverlay : "transparent"
                                border.color: root.activeTab === "about" ? Colors.surfaceBorder : "transparent"
                                border.width: 1

                                Rectangle {
                                    visible: root.activeTab === "about"
                                    anchors.left: parent.left
                                    anchors.right: parent.right
                                    anchors.top: parent.top
                                    height: 1
                                    color: Colors.surfaceBorder
                                }

                                Row {
                                    anchors.left: parent.left
                                    anchors.leftMargin: 8
                                    anchors.verticalCenter: parent.verticalCenter
                                    spacing: 8

                                    Icon {
                                        name: "info"
                                        size: 14
                                        color: root.activeTab === "about" ? Colors.textPrimary : Colors.textMuted
                                        anchors.verticalCenter: parent.verticalCenter
                                    }

                                    Text {
                                        text: qsTr("About")
                                        color: root.activeTab === "about" ? Colors.textPrimary : Colors.textMuted
                                        font.pixelSize: 12
                                        anchors.verticalCenter: parent.verticalCenter
                                    }
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: root.activeTab = "about"
                                }
                            }

                            Item { Layout.preferredHeight: 8 }
                        }
                    }

                    // Content area
                    Rectangle {
                        Layout.fillWidth: true
                        Layout.fillHeight: true
                        color: "transparent"

                        Rectangle {
                            anchors.left: parent.left
                            anchors.top: parent.top
                            anchors.bottom: parent.bottom
                            width: 1
                            color: Colors.surfaceBorderSubtle
                        }

                        Flickable {
                            anchors.fill: parent
                            contentWidth: width
                            contentHeight: body.implicitHeight + 32
                            clip: true
                            boundsBehavior: Flickable.StopAtBounds

                ColumnLayout {
                    id: body
                    width: parent.width
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.margins: 24
                    spacing: 20

                    // ── General ──
                    ColumnLayout {
                        visible: root.activeTab === "general"
                        Layout.fillWidth: true
                        spacing: 14

                        Text {
                            text: qsTr("LANGUAGE")
                            color: Colors.textMuted
                            font.pixelSize: 10
                            font.family: Theme.fontMono.family
                            font.letterSpacing: 1.2
                        }
                        Flow {
                            Layout.fillWidth: true
                            spacing: 8
                            Repeater {
                                model: I18n.availableLanguages
                                Rectangle {
                                    width: Math.max(36, lab.implicitWidth + 16)
                                    height: 28
                                    radius: 4
                                    color: I18n.language === modelData ? Colors.accent : Colors.surfaceOverlay
                                    border.color: Colors.surfaceBorder
                                    Text {
                                        id: lab
                                        anchors.centerIn: parent
                                        text: modelData.toUpperCase()
                                        color: I18n.language === modelData ? Colors.white : Colors.textPrimary
                                        font.pixelSize: 11
                                        font.family: Theme.fontMono.family
                                    }
                                    MouseArea {
                                        anchors.fill: parent
                                        onClicked: I18n.setLanguage(modelData)
                                    }
                                }
                            }
                        }

                        Text {
                            text: qsTr("STARTUP")
                            color: Colors.textMuted
                            font.pixelSize: 10
                            font.family: Theme.fontMono.family
                            font.letterSpacing: 1.2
                            Layout.topMargin: 8
                        }
                        RowLayout {
                            Layout.fillWidth: true
                            Text {
                                text: qsTr("Start with camera")
                                color: Colors.textSecondary
                                font.pixelSize: 13
                                Layout.fillWidth: true
                            }
                            Switch {
                                checked: Config.startWithCamera
                                onToggled: Config.startWithCamera = checked
                            }
                        }
                        RowLayout {
                            Layout.fillWidth: true
                            Text {
                                text: qsTr("Mirror camera")
                                color: Colors.textSecondary
                                font.pixelSize: 13
                                Layout.fillWidth: true
                            }
                            Switch {
                                checked: Config.mirrorCamera
                                onToggled: Config.mirrorCamera = checked
                            }
                        }
                        RowLayout {
                            Layout.fillWidth: true
                            Text {
                                text: qsTr("Compact chrome")
                                color: Colors.textSecondary
                                font.pixelSize: 13
                                Layout.fillWidth: true
                            }
                            Switch {
                                checked: Config.compactChrome
                                onToggled: Config.compactChrome = checked
                            }
                        }
                        Text {
                            text: qsTr("Shorter action bar; also auto-enables when the window is short.")
                            color: Colors.textMuted
                            font.pixelSize: 11
                            wrapMode: Text.WordWrap
                            Layout.fillWidth: true
                        }
                        RowLayout {
                            Layout.fillWidth: true
                            Text {
                                text: qsTr("Show built-in characters")
                                color: Colors.textSecondary
                                font.pixelSize: 13
                                Layout.fillWidth: true
                            }
                            Switch {
                                checked: Config.showBuiltinCharacters
                                onToggled: Config.showBuiltinCharacters = checked
                            }
                        }
                        RowLayout {
                            Layout.fillWidth: true
                            Text {
                                text: qsTr("Show camera before swap")
                                color: Colors.textSecondary
                                font.pixelSize: 13
                                Layout.fillWidth: true
                            }
                            Switch {
                                checked: Config.showCameraBeforeSwap
                                onToggled: Config.showCameraBeforeSwap = checked
                            }
                        }
                        RowLayout {
                            Layout.fillWidth: true
                            Text {
                                text: qsTr("Identity lock by default")
                                color: Colors.textSecondary
                                font.pixelSize: 13
                                Layout.fillWidth: true
                            }
                            Switch {
                                checked: Config.identityLockDefault
                                onToggled: Config.identityLockDefault = checked
                            }
                        }
                        RowLayout {
                            Layout.fillWidth: true
                            Text {
                                text: qsTr("Product notifications")
                                color: Colors.textSecondary
                                font.pixelSize: 13
                                Layout.fillWidth: true
                            }
                            Switch {
                                checked: Config.productNotifications
                                onToggled: Config.productNotifications = checked
                            }
                        }
                        RowLayout {
                            Layout.fillWidth: true
                            Text {
                                text: qsTr("Auto-record when morph starts")
                                color: Colors.textSecondary
                                font.pixelSize: 13
                                Layout.fillWidth: true
                            }
                            Switch {
                                checked: Config.autoRecord
                                onToggled: Config.autoRecord = checked
                            }
                        }
                        RowLayout {
                            Layout.fillWidth: true
                            Text {
                                text: qsTr("Smooth output")
                                color: Colors.textSecondary
                                font.pixelSize: 13
                                Layout.fillWidth: true
                            }
                            Switch {
                                checked: Config.smoothOutput
                                onToggled: Config.smoothOutput = checked
                            }
                        }
                        Text {
                            text: qsTr("Doubles frame smoothing for more fluid motion (uses slightly more resources).")
                            color: Colors.textMuted
                            font.pixelSize: 11
                            wrapMode: Text.WordWrap
                            Layout.fillWidth: true
                        }
                        Text {
                            text: qsTr("PIP VISIBILITY")
                            color: Colors.textMuted
                            font.pixelSize: 10
                            font.family: Theme.fontMono.family
                            font.letterSpacing: 1.2
                            Layout.topMargin: 8
                        }
                        Flow {
                            Layout.fillWidth: true
                            spacing: 6
                            Repeater {
                                model: [
                                    { label: "Always", value: "always" },
                                    { label: "While Swapping", value: "whileSwapping" },
                                    { label: "Never", value: "never" }
                                ]
                                Rectangle {
                                    width: Math.max(80, pipLabel.implicitWidth + 16)
                                    height: 28
                                    radius: 4
                                    color: Config.pipVisibility === modelData.value ? Colors.accent : Colors.surfaceOverlay
                                    border.color: Colors.surfaceBorder
                                    border.width: 1
                                    Text {
                                        id: pipLabel
                                        anchors.centerIn: parent
                                        text: modelData.label
                                        color: Config.pipVisibility === modelData.value ? Colors.white : Colors.textPrimary
                                        font.pixelSize: 11
                                        font.family: Theme.fontMono.family
                                    }
                                    MouseArea {
                                        anchors.fill: parent
                                        onClicked: Config.pipVisibility = modelData.value
                                    }
                                }
                            }
                        }
                    }

                    // ── Camera ──
                    ColumnLayout {
                        visible: root.activeTab === "camera"
                        Layout.fillWidth: true
                        spacing: 14

                        Text {
                            text: qsTr("DEVICE")
                            color: Colors.textMuted
                            font.pixelSize: 10
                            font.family: Theme.fontMono.family
                            font.letterSpacing: 1.2
                        }
                        Text {
                            text: CameraCtrl.currentDeviceName || qsTr("Default camera")
                            color: Colors.textPrimary
                            font.pixelSize: 13
                            Layout.fillWidth: true
                        }
                        RowLayout {
                            Layout.fillWidth: true
                            Text {
                                text: qsTr("Mirror input")
                                color: Colors.textSecondary
                                font.pixelSize: 13
                                Layout.fillWidth: true
                            }
                            Switch {
                                checked: CameraCtrl.mirrored
                                onToggled: CameraCtrl.mirrored = checked
                            }
                        }
                        PrimaryButton {
                            text: CameraCtrl.isActive ? qsTr("Stop camera") : qsTr("Start camera")
                            Layout.fillWidth: true
                            onClicked: CameraCtrl.isActive ? CameraCtrl.stop() : CameraCtrl.start()
                        }
                        Text {
                            text: qsTr("AUDIO INPUT")
                            color: Colors.textMuted
                            font.pixelSize: 10
                            font.family: Theme.fontMono.family
                            font.letterSpacing: 1.2
                            Layout.topMargin: 12
                        }
                        Text {
                            text: CameraCtrl.currentMicName || qsTr("Default microphone")
                            color: Colors.textPrimary
                            font.pixelSize: 12
                        }
                    }

                    // ── Stream ──
                    ColumnLayout {
                        visible: root.activeTab === "stream"
                        Layout.fillWidth: true
                        spacing: 14
                        Text {
                            text: qsTr("OBS / VIRTUAL CAMERA")
                            color: Colors.textMuted
                            font.pixelSize: 10
                            font.family: Theme.fontMono.family
                            font.letterSpacing: 1.2
                        }
                        Text {
                            text: qsTr("Use OBS Studio’s built-in Virtual Camera (open source, maintained). LiveMorph feeds a local MJPEG URL into an OBS Browser Source.")
                            color: Colors.textSecondary
                            font.pixelSize: 11
                            wrapMode: Text.WordWrap
                            Layout.fillWidth: true
                        }
                        Text {
                            text: VirtualCamera.platformHint
                            color: Colors.textMuted
                            font.pixelSize: 10
                            wrapMode: Text.WordWrap
                            Layout.fillWidth: true
                        }
                        Text {
                            text: VirtualCamera.obsInstalled
                                 ? (qsTr("OBS detected") + ": " + VirtualCamera.obsInstallPath)
                                 : qsTr("OBS not detected on this machine")
                            color: VirtualCamera.obsInstalled ? Colors.statusSuccess : Colors.statusWarning
                            font.pixelSize: 10
                            wrapMode: Text.WordWrap
                            Layout.fillWidth: true
                        }
                        Text {
                            visible: StreamServer.running
                            text: qsTr("Browser Source URL: %1").arg(StreamServer.url || VirtualCamera.obsBrowserSourceUrl)
                            color: Colors.accent
                            font.pixelSize: 11
                            font.family: Theme.fontMono.family
                            wrapMode: Text.WordWrap
                            Layout.fillWidth: true
                        }
                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 8
                            PrimaryButton {
                                text: qsTr("Start for OBS")
                                Layout.fillWidth: true
                                onClicked: {
                                    StreamServer.port = Config.streamPort
                                    VirtualCamera.startForObs()
                                    App.notify(VirtualCamera.statusMessage || qsTr("OBS feed started"), "success")
                                }
                            }
                            SecondaryButton {
                                text: StreamServer.running ? qsTr("Stop stream") : qsTr("Stream only")
                                onClicked: {
                                    StreamServer.port = Config.streamPort
                                    StreamServer.toggle()
                                    App.notify(StreamServer.running ? qsTr("MJPEG stream on") : qsTr("Stream stopped"), "info")
                                }
                            }
                        }
                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 8
                            SecondaryButton {
                                text: qsTr("Copy OBS URL")
                                Layout.fillWidth: true
                                onClicked: {
                                    VirtualCamera.copyObsUrl()
                                    App.notify(qsTr("URL copied — paste into OBS Browser Source"), "success")
                                }
                            }
                            SecondaryButton {
                                text: StreamServer.paused ? qsTr("Resume") : qsTr("Pause")
                                enabled: StreamServer.running
                                onClicked: {
                                    if (StreamServer.paused) StreamServer.resume()
                                    else StreamServer.pause()
                                }
                            }
                        }
                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 8
                            SecondaryButton {
                                text: VirtualCamera.obsInstalled ? qsTr("Open OBS") : qsTr("Get OBS")
                                Layout.fillWidth: true
                                onClicked: {
                                    if (VirtualCamera.obsInstalled)
                                        VirtualCamera.tryLaunchObs()
                                    else
                                        VirtualCamera.openObsDownloadPage()
                                    App.notify(VirtualCamera.statusMessage, "info")
                                }
                            }
                            SecondaryButton {
                                text: qsTr("Refresh detect")
                                onClicked: VirtualCamera.refreshObsDetection()
                            }
                        }
                        Column {
                            Layout.fillWidth: true
                            spacing: 4
                            Repeater {
                                model: VirtualCamera.setupSteps
                                Text {
                                    width: parent.width
                                    text: modelData
                                    color: Colors.textSecondary
                                    font.pixelSize: 10
                                    wrapMode: Text.WordWrap
                                }
                            }
                        }
                        Text {
                            visible: VirtualCamera.active || VirtualCamera.statusMessage.length > 0
                            text: VirtualCamera.statusMessage
                            color: Colors.textMuted
                            font.pixelSize: 10
                            font.family: Theme.fontMono.family
                            wrapMode: Text.WordWrap
                            Layout.fillWidth: true
                        }
                        Text {
                            text: qsTr("REALTIME (via backend proxy)")
                            color: Colors.textMuted
                            font.pixelSize: 10
                            font.family: Theme.fontMono.family
                            font.letterSpacing: 1.2
                            Layout.topMargin: 12
                        }
                        Text {
                            text: qsTr("Auth, credits, and Decart API keys stay on your Rust service. The app opens a session WebSocket to the proxy with your JWT; media is WebRTC in Stage.")
                            color: Colors.textSecondary
                            font.pixelSize: 11
                            wrapMode: Text.WordWrap
                            Layout.fillWidth: true
                        }
                        Text {
                            text: qsTr("Model id (sent to proxy)")
                            color: Colors.textMuted
                            font.pixelSize: 11
                        }
                        TextField {
                            Layout.fillWidth: true
                            text: Config.defaultModel
                            placeholderText: "lucy-2.1"
                            onEditingFinished: Config.defaultModel = text.length ? text : "lucy-2.1"
                        }
                        Text {
                            text: qsTr("Backend API base URL")
                            color: Colors.textMuted
                            font.pixelSize: 11
                            Layout.topMargin: 8
                        }
                        TextField {
                            Layout.fillWidth: true
                            text: Config.apiBaseUrl
                            placeholderText: "http://127.0.0.1:PORT"
                            onEditingFinished: {
                                Config.apiBaseUrl = text
                                Backend.baseUrl = text
                            }
                        }
                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 8
                            Rectangle {
                                width: 8; height: 8; radius: 4
                                color: Backend.reachable ? Colors.statusSuccess : Colors.statusError
                            }
                            Text {
                                Layout.fillWidth: true
                                text: Backend.reachable
                                      ? qsTr("API reachable")
                                      : qsTr("API offline — check URL and that the backend is running")
                                color: Backend.reachable ? Colors.statusSuccess : Colors.statusError
                                font.pixelSize: 11
                                wrapMode: Text.WordWrap
                            }
                            GhostButton {
                                text: qsTr("Ping")
                                onClicked: Backend.ping()
                            }
                        }
                    }

                    // ── Recording ──
                    ColumnLayout {
                        visible: root.activeTab === "recording"
                        Layout.fillWidth: true
                        spacing: 14
                        Text {
                            text: qsTr("QUALITY")
                            color: Colors.textMuted
                            font.pixelSize: 10
                            font.family: Theme.fontMono.family
                            font.letterSpacing: 1.2
                        }
                        Flow {
                            Layout.fillWidth: true
                            spacing: 6
                            Repeater {
                                model: [
                                    { label: "Balanced (2.5 Mbps)", value: "balanced" },
                                    { label: "High (4 Mbps)", value: "high" }
                                ]
                                Rectangle {
                                    width: Math.max(120, recQualLabel.implicitWidth + 16)
                                    height: 28
                                    radius: 4
                                    color: Config.recordingQuality === modelData.value ? Colors.accent : Colors.surfaceOverlay
                                    border.color: Colors.surfaceBorder
                                    border.width: 1
                                    Text {
                                        id: recQualLabel
                                        anchors.centerIn: parent
                                        text: modelData.label
                                        color: Config.recordingQuality === modelData.value ? Colors.white : Colors.textPrimary
                                        font.pixelSize: 11
                                        font.family: Theme.fontMono.family
                                    }
                                    MouseArea {
                                        anchors.fill: parent
                                        onClicked: Config.recordingQuality = modelData.value
                                    }
                                }
                            }
                        }
                        RowLayout {
                            Layout.fillWidth: true
                            Text {
                                text: qsTr("Include microphone audio")
                                color: Colors.textSecondary
                                font.pixelSize: 13
                                Layout.fillWidth: true
                            }
                            Switch {
                                checked: Config.micAudioEnabled
                                onToggled: Config.micAudioEnabled = checked
                            }
                        }
                        Text {
                            text: qsTr("OUTPUT")
                            color: Colors.textMuted
                            font.pixelSize: 10
                            font.family: Theme.fontMono.family
                            font.letterSpacing: 1.2
                            Layout.topMargin: 8
                        }
                        Text {
                            text: Recording.outputDirectory || qsTr("Default videos folder")
                            color: Colors.textPrimary
                            font.pixelSize: 12
                            font.family: Theme.fontMono.family
                            wrapMode: Text.WrapAnywhere
                            Layout.fillWidth: true
                        }
                        SecondaryButton {
                            text: qsTr("Choose folder…")
                            Layout.fillWidth: true
                            onClicked: dirDialog.open()
                        }
                        SecondaryButton {
                            text: qsTr("Scan orphan recordings")
                            Layout.fillWidth: true
                            onClicked: {
                                Recording.scanOrphans()
                                App.notify(Recording.hasOrphans ? qsTr("Orphans found") : qsTr("No orphans"),
                                           Recording.hasOrphans ? "warning" : "success")
                            }
                        }
                        Repeater {
                            model: Recording.orphanRecordings
                            delegate: Rectangle {
                                Layout.fillWidth: true
                                height: 52
                                radius: Theme.radiusSm
                                color: Colors.surfaceRaised
                                border.color: Colors.surfaceBorder
                                border.width: 1
                                RowLayout {
                                    anchors.fill: parent
                                    anchors.margins: 8
                                    spacing: 8
                                    Text {
                                        text: modelData.path || modelData || ""
                                        color: Colors.textSecondary
                                        font.pixelSize: 10
                                        font.family: Theme.fontMono.family
                                        elide: Text.ElideMiddle
                                        Layout.fillWidth: true
                                    }
                                    GhostButton {
                                        text: qsTr("Recover")
                                        onClicked: {
                                            Recording.recoverOrphan(modelData.path || modelData)
                                            App.notify(qsTr("Recovering orphan…"), "info")
                                        }
                                    }
                                    GhostButton {
                                        text: qsTr("Dismiss")
                                        onClicked: Recording.dismissOrphan(modelData.path || modelData)
                                    }
                                }
                            }
                        }
                        SecondaryButton {
                            text: qsTr("List recent recordings")
                            Layout.fillWidth: true
                            onClicked: Recording.listRecent()
                        }
                    }

                    // ── Billing / Account ──
                    ColumnLayout {
                        visible: root.activeTab === "billing"
                        Layout.fillWidth: true
                        spacing: 14
                        Text {
                            text: qsTr("SESSION")
                            color: Colors.textMuted
                            font.pixelSize: 10
                            font.family: Theme.fontMono.family
                            font.letterSpacing: 1.2
                        }
                        Text {
                            text: Auth.email || ""
                            color: Colors.textPrimary
                            font.pixelSize: 13
                            font.family: Theme.fontMono.family
                        }
                        Text {
                            text: qsTr("%1 credits").arg(Number(Auth.creditBalance + Auth.bonusBalance).toFixed(0))
                            color: Colors.accent
                            font.pixelSize: 13
                        }
                        PrimaryButton {
                            text: qsTr("Buy credits")
                            Layout.fillWidth: true
                            onClicked: { root.open = false; App.openBuyCredits() }
                        }
                        SecondaryButton {
                            text: qsTr("Sign out")
                            Layout.fillWidth: true
                            onClicked: { root.open = false; Auth.signOut() }
                        }
                        GhostButton {
                            text: qsTr("Sign out all devices")
                            Layout.fillWidth: true
                            onClicked: Auth.logoutAllDevices()
                        }
                        Rectangle {
                            Layout.fillWidth: true
                            height: 1
                            color: Colors.surfaceBorder
                            Layout.topMargin: 8
                        }
                        Text {
                            text: qsTr("DATA")
                            color: Colors.textMuted
                            font.pixelSize: 10
                            font.family: Theme.fontMono.family
                            font.letterSpacing: 1.2
                        }
                        GhostButton {
                            text: qsTr("Export my data")
                            Layout.fillWidth: true
                            onClicked: {
                                Auth.exportData()
                                App.notify(qsTr("Preparing data export…"), "info")
                            }
                        }
                        SecondaryButton {
                            text: qsTr("Delete account")
                            Layout.fillWidth: true
                            onClicked: deleteAccountDialog.open()
                        }
                        Rectangle {
                            Layout.fillWidth: true
                            height: 1
                            color: Colors.surfaceBorder
                            Layout.topMargin: 8
                        }
                        Text {
                            text: qsTr("ABOUT")
                            color: Colors.textMuted
                            font.pixelSize: 10
                            font.family: Theme.fontMono.family
                            font.letterSpacing: 1.2
                        }
                        Text {
                            text: "LiveMorph v" + App.appVersion
                            color: Colors.textSecondary
                            font.pixelSize: 12
                        }
                        GhostButton {
                            text: qsTr("What's new")
                            Layout.fillWidth: true
                            onClicked: { root.open = false; App.showWhatsNew = true }
                        }
                        GhostButton {
                            text: qsTr("Check for updates")
                            Layout.fillWidth: true
                            onClicked: {
                                Backend.checkUpdates()
                                App.notify(qsTr("Checking for updates…"), "info")
                            }
                        }
                        PrimaryButton {
                            visible: root.updateDownloadUrl.length > 0
                            text: Backend.updateDownloading
                                  ? qsTr("Downloading… %1%").arg(Backend.updateProgress)
                                  : (Backend.updateProgress >= 100
                                     ? qsTr("Install %1").arg(root.updateLatestVersion || "update")
                                     : qsTr("Download update %1").arg(root.updateLatestVersion || ""))
                            Layout.fillWidth: true
                            enabled: !Backend.updateDownloading
                            onClicked: {
                                Backend.downloadUpdate()
                                App.notify(qsTr("Downloading update…"), "info")
                            }
                        }
                        Rectangle {
                            visible: Backend.updateProgress > 0
                            Layout.fillWidth: true
                            height: 6
                            radius: 3
                            color: Colors.surfaceBorder

                            Rectangle {
                                anchors.left: parent.left
                                width: parent.width * (Backend.updateProgress / 100.0)
                                height: parent.height
                                radius: 3
                                color: Colors.accent
                            }
                        }
                        GhostButton {
                            text: qsTr("Refresh account / balance")
                            Layout.fillWidth: true
                            onClicked: {
                                Auth.refreshProfile()
                                App.notify(qsTr("Refreshing profile…"), "info")
                            }
                        }
                        GhostButton {
                            text: qsTr("Replay onboarding tour")
                            Layout.fillWidth: true
                            onClicked: {
                                Config.onboardingDone = false
                                root.open = false
                                App.showTour = true
                            }
                        }
                        Rectangle {
                            Layout.fillWidth: true
                            height: 1
                            color: Colors.surfaceBorder
                            Layout.topMargin: 8
                        }
                        Text {
                            text: qsTr("COMMUNITY")
                            color: Colors.textMuted
                            font.pixelSize: 10
                            font.family: Theme.fontMono.family
                            font.letterSpacing: 1.2
                        }
                        GhostButton {
                            text: qsTr("Join our Discord")
                            Layout.fillWidth: true
                            onClicked: Qt.openUrlExternally(Constants.urlDiscord)
                        }
                    }

                    // ── About ──
                    ColumnLayout {
                        visible: root.activeTab === "about"
                        Layout.fillWidth: true
                        spacing: 14

                        // Centered icon
                        Rectangle {
                            Layout.preferredWidth: 64
                            Layout.preferredHeight: 64
                            Layout.alignment: Qt.AlignHCenter
                            radius: Theme.radiusMd
                            color: Colors.surfaceOverlay
                            border.color: Colors.surfaceBorder
                            border.width: 1
                            Image {
                                anchors.centerIn: parent
                                source: "qrc:/assets/livemorph-icon.png"
                                width: 48
                                height: 48
                                fillMode: Image.PreserveAspectFit
                            }
                        }

                        Text {
                            text: "LiveMorph"
                            color: Colors.textPrimary
                            font.pixelSize: 18
                            font.weight: Font.DemiBold
                            Layout.alignment: Qt.AlignHCenter
                        }

                        Text {
                            text: qsTr("Visit site")
                            color: Colors.accent
                            font.pixelSize: 12
                            Layout.alignment: Qt.AlignHCenter
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: Qt.openUrlExternally(Constants.urlWebsite || "https://livemorph.app")
                            }
                        }

                        Text {
                            text: "v" + App.appVersion
                            color: Colors.textMuted
                            font.pixelSize: 10
                            font.family: Theme.fontMono.family
                            Layout.alignment: Qt.AlignHCenter
                        }

                        Rectangle {
                            Layout.fillWidth: true
                            height: 1
                            color: Colors.surfaceBorder
                            Layout.topMargin: 8
                        }

                        GhostButton {
                            text: qsTr("What's new")
                            Layout.fillWidth: true
                            onClicked: { root.open = false; App.showWhatsNew = true }
                        }

                        GhostButton {
                            text: qsTr("Check for updates")
                            Layout.fillWidth: true
                            onClicked: {
                                Backend.checkUpdates()
                                App.notify(qsTr("Checking for updates…"), "info")
                            }
                        }

                        PrimaryButton {
                            visible: root.updateDownloadUrl.length > 0
                            text: Backend.updateDownloading
                                  ? qsTr("Downloading… %1%").arg(Backend.updateProgress)
                                  : (Backend.updateProgress >= 100
                                     ? qsTr("Install %1").arg(root.updateLatestVersion || "update")
                                     : qsTr("Download update %1").arg(root.updateLatestVersion || ""))
                            Layout.fillWidth: true
                            enabled: !Backend.updateDownloading
                            onClicked: {
                                Backend.downloadUpdate()
                                App.notify(qsTr("Downloading update…"), "info")
                            }
                        }

                        Rectangle {
                            visible: Backend.updateProgress > 0
                            Layout.fillWidth: true
                            height: 6
                            radius: 3
                            color: Colors.surfaceOverlay

                            Rectangle {
                                anchors.left: parent.left
                                width: parent.width * (Backend.updateProgress / 100.0)
                                height: parent.height
                                radius: 3
                                color: Colors.accent
                            }
                        }

                        GhostButton {
                            text: qsTr("Replay onboarding tour")
                            Layout.fillWidth: true
                            onClicked: {
                                Config.onboardingDone = false
                                root.open = false
                                App.showTour = true
                            }
                        }

                        BrandingFooter {
                            Layout.fillWidth: true
                            Layout.topMargin: 12
                        }
                    }
                }
            }
        }
            }
        }
        }
    }

    FolderDialog {
        id: dirDialog
        title: qsTr("Recording output folder")
        onAccepted: {
            var path = selectedFolder.toString().replace("file://", "")
            Recording.pickOutputDirectory(path)
            App.notify(qsTr("Output folder updated"), "success")
        }
    }

    ConfirmDialog {
        id: deleteAccountDialog
        title: qsTr("Delete account")
        confirmText: qsTr("Delete permanently")
        cancelText: qsTr("Cancel")
        message: qsTr("This permanently deletes your account and anonymizes your data. This cannot be undone.")
        onAccepted: {
            Auth.deleteAccount()
            App.notify(qsTr("Account deletion requested"), "warn")
        }
    }

    Connections {
        target: Auth
        function onDataExported(path) {
            if (path.length)
                App.notify(qsTr("Export saved to %1").arg(path), "success")
            else
                App.notify(qsTr("Export completed (see secure vault)"), "success")
        }
    }

    Connections {
        target: Backend
        function onUpdateCheckResult(result) {
            var avail = result.available === true || result.update_available === true
            if (avail) {
                root.updateDownloadUrl = result.download_url || result.url || ""
                root.updateLatestVersion = result.latest_version || result.version || ""
            } else {
                root.updateDownloadUrl = ""
                root.updateLatestVersion = ""
            }
        }
    }
}
