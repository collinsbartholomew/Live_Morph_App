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
                        font.pixelSize: 15
                        font.weight: Font.DemiBold
                        Layout.fillWidth: true
                    }
                    Text {
                        text: "✕"
                        color: Colors.textMuted
                        font.pixelSize: 16
                        MouseArea {
                            anchors.fill: parent
                            anchors.margins: -8
                            cursorShape: Qt.PointingHandCursor
                            onClicked: root.open = false
                        }
                    }
                }
            }

            // Tabs
            RowLayout {
                Layout.fillWidth: true
                Layout.leftMargin: 16
                Layout.rightMargin: 16
                Layout.topMargin: 12
                spacing: 4
                Repeater {
                    model: [
                        { id: "general", label: qsTr("General") },
                        { id: "camera", label: qsTr("Camera") },
                        { id: "stream", label: qsTr("Stream") },
                        { id: "recording", label: qsTr("Recording") },
                        { id: "account", label: qsTr("Account") }
                    ]
                    Rectangle {
                        Layout.fillWidth: true
                        height: 32
                        radius: 4
                        color: root.activeTab === modelData.id ? Colors.accentMuted : "transparent"
                        border.color: root.activeTab === modelData.id ? Colors.accent : "transparent"
                        border.width: 1
                        Text {
                            anchors.centerIn: parent
                            text: modelData.label
                            color: root.activeTab === modelData.id ? Colors.accent : Colors.textMuted
                            font.pixelSize: 11
                            font.family: "monospace"
                        }
                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: root.activeTab = modelData.id
                        }
                    }
                }
            }

            Flickable {
                Layout.fillWidth: true
                Layout.fillHeight: true
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
                            font.family: "monospace"
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
                                        font.family: "monospace"
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
                            font.family: "monospace"
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
                            font.family: "monospace"
                            font.letterSpacing: 1.2
                        }
                        Text {
                            text: Camera.currentDeviceName || qsTr("Default camera")
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
                                checked: Camera.mirrored
                                onToggled: Camera.mirrored = checked
                            }
                        }
                        PrimaryButton {
                            text: Camera.isActive ? qsTr("Stop camera") : qsTr("Start camera")
                            Layout.fillWidth: true
                            onClicked: Camera.isActive ? Camera.stop() : Camera.start()
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
                            font.family: "monospace"
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
                            font.family: "monospace"
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
                            font.family: "monospace"
                            wrapMode: Text.WordWrap
                            Layout.fillWidth: true
                        }
                        Text {
                            text: qsTr("REALTIME (via backend proxy)")
                            color: Colors.textMuted
                            font.pixelSize: 10
                            font.family: "monospace"
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
                            text: qsTr("OUTPUT")
                            color: Colors.textMuted
                            font.pixelSize: 10
                            font.family: "monospace"
                            font.letterSpacing: 1.2
                        }
                        Text {
                            text: Recording.outputDirectory || qsTr("Default videos folder")
                            color: Colors.textPrimary
                            font.pixelSize: 12
                            font.family: "monospace"
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
                                        font.family: "monospace"
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

                    // ── Account ──
                    ColumnLayout {
                        visible: root.activeTab === "account"
                        Layout.fillWidth: true
                        spacing: 14
                        Text {
                            text: qsTr("SESSION")
                            color: Colors.textMuted
                            font.pixelSize: 10
                            font.family: "monospace"
                            font.letterSpacing: 1.2
                        }
                        Text {
                            text: Auth.email || ""
                            color: Colors.textPrimary
                            font.pixelSize: 13
                            font.family: "monospace"
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
                            text: qsTr("ABOUT")
                            color: Colors.textMuted
                            font.pixelSize: 10
                            font.family: "monospace"
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
                            text: root.updateDownloadUrl.length > 0
                                  ? qsTr("Download update %1").arg(root.updateLatestVersion || "")
                                  : qsTr("Download update")
                            Layout.fillWidth: true
                            onClicked: {
                                Backend.installUpdate()
                                App.notify(qsTr("Opening download…"), "info")
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
