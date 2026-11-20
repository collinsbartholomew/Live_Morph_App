import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

Rectangle {
    id: root

    property bool compact: false
    property var tourObs: quickRepeater.itemAt(1)
    readonly property bool reconnecting: Session.reconnecting
    readonly property bool warmingUp: Session.isActive
        && (Session.connectionStatus === "connecting"
            || root.reconnecting
            || ((Session.connectionStatus === "connected" || Session.connectionStatus === "generating")
                && !Session.hasFrames))
    readonly property string warmupText: {
        if (root.reconnecting)
            return qsTr("Reconnecting")
        var seconds = Session.elapsedSec
        if (seconds < 4)
            return qsTr("Contacting engine")
        if (seconds < 14)
            return qsTr("Warming character")
        return qsTr("First frames incoming")
    }
    readonly property bool actionable: Session.isActive
        || (!Session.cooldownActive && Auth.isAuthenticated && CameraCtrl.isActive)
    readonly property bool lowCredits: Auth.isAuthenticated && !Session.isActive
        && (Auth.creditBalance + Auth.bonusBalance) < Session.creditsPerSecond * 60

    color: Colors.surfaceRaised
    implicitHeight: compact ? Theme.actionBarHeightCompact : Theme.actionBarHeight

    function formatNumber(value) {
        return Math.round(value).toLocaleString(Qt.locale(I18n.uiLocaleName()), "f", 0)
    }

    function elapsedText() {
        var seconds = Math.floor(Session.elapsedSec)
        var minutes = Math.floor(seconds / 60)
        var remainder = seconds % 60
        return (minutes < 10 ? "0" : "") + minutes + ":" + (remainder < 10 ? "0" : "") + remainder
    }

    function recordingElapsedText() {
        var seconds = Math.floor(Recording.elapsedMs / 1000)
        var minutes = Math.floor(seconds / 60)
        var remainder = seconds % 60
        return (minutes < 10 ? "0" : "") + minutes + ":" + (remainder < 10 ? "0" : "") + remainder
    }

    function activateSwap() {
        if (Session.isActive) {
            App.toggleSwap()
            return
        }
        if (!Auth.isAuthenticated) {
            App.notify(qsTr("Sign in to start a swap"), "warning")
            App.navigateTo("auth")
            return
        }
        if (!CameraCtrl.isActive) {
            App.notify(qsTr("Enable a camera before starting the swap"), "warning")
            App.openSettings()
            return
        }
        if (Session.cooldownActive) {
            App.notify(qsTr("Please wait %n second before trying again", "Please wait %n seconds before trying again", Session.cooldownRemainingSec), "warning")
            return
        }
        if (root.lowCredits) {
            App.notify(qsTr("You need at least %1 credits to start. Choose a top-up to continue.").arg(Math.ceil(Session.creditsPerSecond * 60)), "warning")
            App.openBuyCredits()
            return
        }
        App.toggleSwap()
    }

    Rectangle {
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        height: 1
        color: Colors.surfaceBorder
    }

    RowLayout {
        anchors.fill: parent
        anchors.leftMargin: 20
        anchors.rightMargin: 20
        spacing: Theme.spacingLg

        RowLayout {
            Layout.preferredWidth: root.compact ? 196 : 244
            Layout.maximumWidth: 244
            Layout.fillHeight: true
            spacing: Theme.spacingMd

            IconButton {
                name: "settings"
                accessibleName: qsTr("Open settings")
                iconSize: Theme.iconMd
                width: 36
                height: 36
                Layout.alignment: Qt.AlignVCenter
                onClicked: App.openSettings()
            }

            Rectangle {
                Layout.preferredWidth: 1
                Layout.preferredHeight: 32
                color: Colors.surfaceBorder
            }

            HexBadge {
                                visible: !root.warmingUp
                size: 30
                iconName: Session.isActive ? "gauge" : "zap"
                iconSize: 14
                lineColor: Colors.accent20
                fillColor: Colors.accent06
                iconColor: Colors.textSecondary
                Layout.alignment: Qt.AlignVCenter
            }

            Spinner {
                visible: root.warmingUp
                running: root.warmingUp
                size: 24
                color: Colors.accent
                Layout.alignment: Qt.AlignVCenter
            }

            Column {
                Layout.fillWidth: true
                Layout.alignment: Qt.AlignVCenter
                spacing: 3
                Text {
                    width: parent.width
                    text: Backend.updateDownloading ? qsTr("DOWNLOADING UPDATE")
                          : Backend.updateDownloadedPath.length > 0 ? qsTr("UPDATE READY")
                          : root.warmingUp ? root.warmupText
                          : Session.isActive && Session.hasFrames ? qsTr("SESSION COST")
                          : qsTr("ENGINE READY")
                    color: Colors.textMuted
                    font.family: Theme.fontMicro.family; font.pixelSize: Theme.fontMicro.pixelSize
                    font.capitalization: Font.AllUppercase
                    font.letterSpacing: 0.8
                    elide: Text.ElideRight
                }
                Text {
                    width: parent.width
                    text: Backend.updateDownloading ? Math.round(Backend.updateProgress) + "%"
                          : Backend.updateDownloadedPath.length > 0 ? qsTr("Restart to install")
                          : root.warmingUp ? qsTr("No credits used yet")
                          : Session.isActive && Session.hasFrames
                            ? qsTr("%1 cr").arg(root.formatNumber(Math.floor(Session.elapsedSec) * Session.creditsPerSecond))
                            : qsTr("%1 / %2 cr per sec").arg(App.swapTier.toUpperCase()).arg(Session.creditsPerSecond.toFixed(0))
                    color: Colors.textPrimary
                    font.family: Theme.fontSmall.family; font.pixelSize: Theme.fontSmall.pixelSize
                    font.weight: Font.Bold
                    elide: Text.ElideRight
                }
            }

        }

        PrimaryButton {
            id: swapButton
            Layout.fillWidth: true
            Layout.maximumWidth: 400
            Layout.preferredHeight: 52
            Layout.alignment: Qt.AlignCenter
            cta: true
            iconName: Session.isActive ? "square" : "play"
            text: Session.isActive ? qsTr("Stop swap  %1").arg(root.elapsedText())
                  : Session.cooldownActive ? qsTr("Cooldown  %1s").arg(Session.cooldownRemainingSec)
                  : !Auth.isAuthenticated ? qsTr("Sign in to begin")
                  : !CameraCtrl.isActive ? qsTr("Enable camera to begin")
                  : root.lowCredits ? qsTr("Top up to begin swap")
                  : qsTr("Begin swap")
            stateBg: root.actionable ? undefined : Colors.surfaceElevated
            stateBorder: root.actionable ? undefined : Colors.surfaceBorder
            stateFg: root.actionable ? undefined : Colors.textSecondary
            onClicked: root.activateSwap()
            Tooltip {
                anchors.bottom: parent.top
                anchors.bottomMargin: 8
                anchors.horizontalCenter: parent.horizontalCenter
                text: Session.cooldownActive ? qsTr("The engine needs a short cooldown")
                      : !Auth.isAuthenticated ? qsTr("Sign in to start")
                      : !CameraCtrl.isActive ? qsTr("Turn on or connect a camera")
                      : root.lowCredits ? qsTr("Choose a credit pack to continue")
                      : Session.isActive ? qsTr("Stop the current swap") : qsTr("Start the live transformation")
                shown: parent.hovered
            }
        }

        Row {
            Layout.alignment: Qt.AlignVCenter
            spacing: Theme.spacingSm

            Repeater {
                id: quickRepeater
                model: [
                    { key: "record", icon: Recording.isRecording ? "square" : "record", label: Recording.transitioning ? qsTr("WORK") : Recording.isRecording ? root.recordingElapsedText() : qsTr("REC"), active: Recording.isRecording },
                    { key: "obs", icon: "radio", label: StreamServer.running ? StreamServer.paused ? qsTr("PAUSED") : qsTr("LIVE") : qsTr("OBS"), active: StreamServer.running },
                    { key: "preview", icon: "eye", label: qsTr("PREVIEW"), active: false },
                    { key: "popout", icon: "external-link", label: qsTr("POPOUT"), active: false }
                ]

                delegate: Button {
                    id: quickButton
                    required property var modelData
                    required property int index
                    width: 64
                    height: 52
                    hoverEnabled: true
                    enabled: modelData.key !== "record" || !Recording.transitioning
                    Accessible.name: modelData.key === "record" ? qsTr("Toggle recording")
                             : modelData.key === "obs" ? qsTr("Toggle OBS stream output")
                             : modelData.key === "preview" ? qsTr("Open preview window") : qsTr("Open popout window")
                    onClicked: {
                        if (modelData.key === "record") {
                            if (Recording.isRecording)
                                Recording.stopRecording()
                            else
                                Recording.startRecording(Session.activeCharacterId)
                        } else if (modelData.key === "obs") {
                            if (StreamServer.running)
                                StreamServer.stop()
                            else
                                StreamServer.start()
                        } else if (modelData.key === "preview") {
                            App.previewRequested()
                        } else {
                            App.popoutRequested()
                        }
                    }
                    background: Rectangle {
                        color: modelData.active ? (modelData.key === "record" ? Colors.statusError10 : Colors.statusSuccess10)
                             : quickButton.hovered ? Colors.surfaceElevated : Colors.surfaceBase
                        border.color: modelData.active ? (modelData.key === "record" ? Colors.statusError40 : Colors.successFaintBorder)
                                    : quickButton.activeFocus ? Colors.accent : Colors.surfaceBorderSubtle
                        border.width: 1
                        radius: Theme.radiusMd
                        FocusRing { shown: quickButton.activeFocus; ringRadius: Theme.radiusMd }
                    }
                    contentItem: Column {
                        anchors.centerIn: parent
                        spacing: 5
                        Icon {
                            anchors.horizontalCenter: parent.horizontalCenter
                            name: modelData.icon
                            size: 18
                            color: modelData.active ? modelData.key === "record" ? Colors.statusError : Colors.statusSuccess
                                 : quickButton.hovered ? Colors.textPrimary : Colors.textMuted
                        }
                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: modelData.label
                            color: modelData.active ? modelData.key === "record" ? Colors.statusError : Colors.statusSuccess
                                 : quickButton.hovered ? Colors.textPrimary : Colors.textMuted
                            font.family: Theme.fontMicro.family; font.pixelSize: Theme.fontMicro.pixelSize
                            font.weight: Font.Bold
                            font.letterSpacing: 0.6
                        }
                    }
                    Tooltip {
                        anchors.bottom: parent.top
                        anchors.bottomMargin: 8
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: modelData.key === "record" ? Recording.isRecording ? qsTr("Stop recording (F12)") : qsTr("Start recording (F12)")
                              : modelData.key === "obs" ? StreamServer.running ? StreamServer.urlDisplay : qsTr("Start OBS stream output")
                              : modelData.key === "preview" ? qsTr("Open a clean preview window") : qsTr("Pop out the live stage")
                        shown: quickButton.hovered
                    }
                }
            }
        }
    }
}
