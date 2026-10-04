import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveEscape

Item {
    id: root
    anchors.fill: parent

    property int currentTab: 0
    property var outputDir: Settings.outputDir || ""
    property bool includeMicrophone: Settings.includeMicrophone
    property string recordingQuality: Settings.recordingQuality
    property bool autoRecordOnSwap: Settings.autoRecordOnSwap

    readonly property var tabs: ["PROFILE", "ENGINE", "RECORDING", "ADVANCED", "DANGER ZONE"]

    Rectangle { anchors.fill: parent; color: Theme.bg }

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 24
        spacing: 16

        // Header with tabs
        RowLayout {
            Layout.fillWidth: true
            spacing: 0

            Text {
                text: qsTr("SETTINGS")
                color: Theme.gold
                font.family: Theme.fontUi
                font.pixelSize: 20
                font.bold: true
                font.letterSpacing: 3
                Layout.fillWidth: true
            }

            GhostButton {
                text: qsTr("✕ CLOSE")
                onClicked: App.showSettings = false
            }
        }

        // Tab bar (underline style like Electron)
        Rectangle {
            Layout.fillWidth: true
            height: 40
            color: "transparent"

            Rectangle {
                anchors.bottom: parent.bottom
                width: parent.width
                height: 1
                color: Theme.border
            }

            Row {
                anchors.fill: parent
                spacing: 0

                Repeater {
                    model: tabs

                    Rectangle {
                        width: tabLabel.implicitWidth + 40
                        height: parent.height
                        color: "transparent"

                        Text {
                            id: tabLabel
                            anchors.centerIn: parent
                            text: modelData
                            color: root.currentTab === index ? Theme.gold : Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 10
                            font.letterSpacing: 1.5
                        }

                        Rectangle {
                            visible: root.currentTab === index
                            anchors.bottom: parent.bottom
                            width: parent.width
                            height: 2
                            color: Theme.gold
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: root.currentTab = index
                        }
                    }
                }
            }
        }

        // Tab content
        Loader {
            Layout.fillWidth: true
            Layout.fillHeight: true
            sourceComponent: {
                switch (root.currentTab) {
                case 0: return profileTab
                case 1: return engineTab
                case 2: return recordingTab
                case 3: return advancedTab
                case 4: return dangerZoneTab
                default: return profileTab
                }
            }
        }
    }

    // ── Tab 0: PROFILE ──────────────────────────────────────────────────────
    Component {
        id: profileTab
        Flickable {
            anchors.fill: parent
            contentHeight: contentCol.implicitHeight + 24
            clip: true
            flickableDirection: Flickable.VerticalFlick

            Column {
                id: contentCol
                width: parent.width
                spacing: 20

                // Avatar & Name
                Rectangle {
                    width: parent.width
                    height: avatarRow.implicitHeight + 24
                    radius: Theme.radius
                    color: Theme.s2
                    border.color: Theme.border
                    border.width: 1

                    Row {
                        id: avatarRow
                        anchors.centerIn: parent
                        spacing: 16

                        Rectangle {
                            width: 64
                            height: 64
                            radius: 32
                            color: Theme.goldGlow
                            border.color: Theme.gold
                            border.width: 2
                            Text { anchors.centerIn: parent; text: "👤"; font.pixelSize: 28 }
                        }

                        Column {
                            anchors.verticalCenter: parent.verticalCenter
                            spacing: 4
                            Text {
                                text: Session.displayName || Session.email || "User"
                                color: Theme.text
                                font.family: Theme.fontUi
                                font.pixelSize: 18
                                font.bold: true
                            }
                            Text {
                                text: Session.email || "—"
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 11
                            }
                        }
                    }
                }

                // Profile fields
                Rectangle {
                    width: parent.width
                    height: profileFields.implicitHeight + 24
                    radius: Theme.radius
                    color: Theme.s2
                    border.color: Theme.border
                    border.width: 1

                    Column {
                        id: profileFields
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 12

                        SectionLabel { text: "PROFILE" }

                        FieldInput {
                            id: profileName
                            label: qsTr("DISPLAY NAME")
                            placeholderText: qsTr("Your name")
                            text: Session.displayName || ""
                            onAccepted: App.saveProfile(profileName.text, profilePhone.text)
                        }

                        FieldInput {
                            label: qsTr("EMAIL")
                            placeholderText: qsTr("email@example.com")
                            text: Session.email || ""
                            enabled: false
                        }

                        FieldInput {
                            id: profilePhone
                            label: qsTr("PHONE (OPTIONAL)")
                            placeholderText: qsTr("e.g. +2348012345678")
                            text: Session.phone || ""
                            onAccepted: App.saveProfile(profileName.text, profilePhone.text)
                        }

                        Rectangle { width: parent.width; height: 1; color: Theme.border }

                        GhostButton {
                            width: parent.width
                            text: qsTr("SAVE CHANGES")
                            onClicked: App.saveProfile(profileName.text, profilePhone.text)
                        }
                    }
                }

                // Password change
                Rectangle {
                    width: parent.width
                    height: passwordFields.implicitHeight + 24
                    radius: Theme.radius
                    color: Theme.s2
                    border.color: Theme.border
                    border.width: 1

                    Column {
                        id: passwordFields
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 12

                        SectionLabel { text: "CHANGE PASSWORD" }

                        FieldInput {
                            id: currentPass
                            label: qsTr("CURRENT PASSWORD")
                            placeholderText: qsTr("••••••••")
                            echoMode: TextInput.Password
                        }
                        FieldInput {
                            id: newPass
                            label: qsTr("NEW PASSWORD")
                            placeholderText: qsTr("Min. 8 characters")
                            echoMode: TextInput.Password
                        }
                        FieldInput {
                            id: confirmPass
                            label: qsTr("CONFIRM NEW PASSWORD")
                            placeholderText: qsTr("Repeat password")
                            echoMode: TextInput.Password
                        }

                        Text {
                            visible: newPass.text !== confirmPass.text && confirmPass.text.length > 0
                            text: qsTr("Passwords do not match")
                            color: Theme.red
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                        }

                        GoldButton {
                            width: parent.width
                            text: qsTr("UPDATE PASSWORD")
                            enabled: newPass.text.length >= 8 && newPass.text === confirmPass.text && currentPass.text.length > 0
                            onClicked: {
                                App.changePassword(currentPass.text, newPass.text)
                                currentPass.text = ""
                                newPass.text = ""
                                confirmPass.text = ""
                            }
                        }
                    }
                }

                // Language selector
                Rectangle {
                    width: parent.width
                    height: langRow.implicitHeight + 24
                    radius: Theme.radius
                    color: Theme.s2
                    border.color: Theme.border
                    border.width: 1

                    Row {
                        id: langRow
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 12

                        Text {
                            text: qsTr("LANGUAGE")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 1.5
                            Layout.preferredWidth: 72
                        }

                        ComboBox {
                            id: langBox
                            Layout.fillWidth: true
                            model: App.i18nLanguages
                            currentIndex: Math.max(0, App.i18nLanguages.indexOf(App.i18nLanguage))
                            font.family: Theme.fontMono
                            font.pixelSize: 10
                            background: Rectangle {
                                radius: Theme.radius
                                color: Theme.s1
                                border.color: Theme.border
                            }
                            onActivated: App.i18nSetLanguage(App.i18nLanguages[currentIndex])
                        }
                    }
                }

                // App info
                Rectangle {
                    width: parent.width
                    height: infoFields.implicitHeight + 24
                    radius: Theme.radius
                    color: Theme.s2
                    border.color: Theme.border
                    border.width: 1

                    Column {
                        id: infoFields
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 8

                        SectionLabel { text: "APP INFO" }

                        Repeater {
                            model: [
                                {k: "VERSION", v: App.appVersion},
                                {k: "DEVICE ID", v: App.deviceId(), c: Theme.gold},
                                {k: "BUILD", v: "Qt 6 / C++17"},
                            ]

                            RowLayout {
                                width: parent.width
                                spacing: 12

                                Text {
                                    text: modelData.k
                                    color: Theme.dim
                                    font.family: Theme.fontMono
                                    font.pixelSize: 9
                                    font.letterSpacing: 1.5
                                    Layout.preferredWidth: 72
                                }

                                Text {
                                    text: modelData.v
                                    color: modelData.c || Theme.text
                                    font.family: Theme.fontMono
                                    font.pixelSize: 11
                                    elide: Text.ElideMiddle
                                    Layout.fillWidth: true
                                }

                                Item { width: 24 } // copy button space
                            }
                        }
                    }
                }
            }
        }
    }

    // ── Tab 1: ENGINE ───────────────────────────────────────────────────────
    Component {
        id: engineTab
        Flickable {
            anchors.fill: parent
            contentHeight: engineCol.implicitHeight + 24
            clip: true
            flickableDirection: Flickable.VerticalFlick

            Column {
                id: engineCol
                width: parent.width
                spacing: 16

                // Quality selector
                Rectangle {
                    width: parent.width
                    height: qualitySection.implicitHeight + 24
                    radius: Theme.radius
                    color: Theme.s2
                    border.color: Theme.border
                    border.width: 1

                    Column {
                        id: qualitySection
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 12

                        RowLayout {
                            width: parent.width
                            spacing: 10
                            Text {
                                text: qsTr("QUALITY")
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 9
                                font.letterSpacing: 2
                                Layout.fillWidth: true
                            }
                            Text {
                                text: qsTr("LIVE")
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 8
                                Layout.alignment: Qt.AlignVCenter
                            }
                            ToggleSwitch {
                                checked: Stream.liveUpdate
                                onToggled: Stream.liveUpdate = checked
                            }
                        }

                        // Quality dropdown
                        RowLayout {
                            width: parent.width
                            spacing: 10
                            Text {
                                text: qsTr("QUALITY PRESET")
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 9
                                font.letterSpacing: 2
                                Layout.fillWidth: true
                            }
                            ComboBox {
                                id: qualityBox
                                Layout.fillWidth: true
                                model: ["high", "balanced", "performance"]
                                currentIndex: ["high", "balanced", "performance"].indexOf(Stream.quality || "balanced")
                                font.family: Theme.fontMono
                                font.pixelSize: 10
                                background: Rectangle {
                                    radius: Theme.radius
                                    color: Theme.s1
                                    border.color: Theme.border
                                }
                                onActivated: {
                                    Stream.quality = modelData
                                    App.toast("Quality: " + modelData, "ok")
                                }
                            }
                        }

                        // Latency display
                        RowLayout {
                            width: parent.width
                            spacing: 10
                            Text {
                                text: qsTr("LATENCY")
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 9
                                font.letterSpacing: 2
                                Layout.fillWidth: true
                            }
                            Text {
                                id: latencyText
                                text: Stream.latencyText || "—"
                                color: Stream.connectionQuality === "GOOD" ? Theme.teal : (Stream.connectionQuality === "FAIR" ? Theme.gold : Theme.red)
                                font.family: Theme.fontMono
                                font.pixelSize: 11
                                font.bold: true
                                Layout.alignment: Qt.AlignVCenter
                            }
                            Text {
                                text: Stream.connectionQuality || "—"
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 9
                                Layout.alignment: Qt.AlignVCenter
                            }
                        }

                        // Enhance toggle
                        RowLayout {
                            width: parent.width
                            spacing: 10
                            Text {
                                text: qsTr("ENHANCE PROMPTS")
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 9
                                font.letterSpacing: 2
                                Layout.fillWidth: true
                            }
                            ToggleSwitch {
                                checked: Stream.enhance
                                onToggled: Stream.enhance = checked
                            }
                        }
                    }
                }

                // GPU / Camera
                Rectangle {
                    width: parent.width
                    height: gpuSection.implicitHeight + 24
                    radius: Theme.radius
                    color: Theme.s2
                    border.color: Theme.border
                    border.width: 1

                    Column {
                        id: gpuSection
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 12

                        SectionLabel { text: "HARDWARE" }

                        Text {
                            width: parent.width
                            wrapMode: Text.WordWrap
                            text: qsTr("Quality preset maps to encoder ladder:\n• High: 1280×720 @30, 2500 kbps\n• Balanced: 960×540 @30, 1500 kbps\n• Performance: 960×540 @24, 800 kbps")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 10
                            lineHeight: 1.5
                        }
                    }
                }

                // Virtual Camera
                Rectangle {
                    width: parent.width
                    height: vcSection.implicitHeight + 24
                    radius: Theme.radius
                    color: Theme.s2
                    border.color: Theme.border
                    border.width: 1

                    Column {
                        id: vcSection
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 12

                        SectionLabel { text: "VIRTUAL CAMERA" }

                        RowLayout {
                            width: parent.width
                            spacing: 10
                            Text {
                                text: qsTr("ENABLE VIRTUAL CAMERA")
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 9
                                font.letterSpacing: 2
                                Layout.fillWidth: true
                            }
                            ToggleSwitch {
                                id: vcToggle
                                checked: Stream.virtualCameraEnabled || false
                                onToggled: {
                                    if (checked) {
                                        App.showSettings = false
                                        Stream.startVirtualCamera()
                                    } else {
                                        Stream.stopVirtualCamera()
                                    }
                                }
                            }
                        }

                        Text {
                            visible: vcToggle.checked
                            width: parent.width
                            wrapMode: Text.WordWrap
                            text: qsTr("Virtual camera active. Add as camera source in OBS/Zoom/Teams. Status: ") + (Stream.virtualCameraStatus || "starting…")
                            color: Theme.teal
                            font.family: Theme.fontMono
                            font.pixelSize: 10
                        }
                    }
                }
            }
        }
    }

    // ── Tab 2: RECORDING ────────────────────────────────────────────────────
    Component {
        id: recordingTab
        Flickable {
            anchors.fill: parent
            contentHeight: recCol.implicitHeight + 24
            clip: true
            flickableDirection: Flickable.VerticalFlick

            Column {
                id: recCol
                width: parent.width
                spacing: 16

                // Output directory
                Rectangle {
                    width: parent.width
                    height: dirSection.implicitHeight + 24
                    radius: Theme.radius
                    color: Theme.s2
                    border.color: Theme.border
                    border.width: 1

                    Column {
                        id: dirSection
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 12

                        SectionLabel { text: "OUTPUT DIRECTORY" }

                        RowLayout {
                            width: parent.width
                            spacing: 8

                            Text {
                                text: root.outputDir || qsTr("Click to choose folder…")
                                color: root.outputDir ? Theme.text : Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 10
                                elide: Text.ElideLeft
                                Layout.fillWidth: true
                            }

                            GhostButton {
                                text: qsTr("BROWSE")
                                onClicked: {
                                    const dir = QFileDialog.getExistingDirectory(null, qsTr("Choose recording folder"), root.outputDir || QStandardPaths.writableLocation(QStandardPaths.MoviesLocation))
                                    if (dir) {
                                        root.outputDir = dir
                                        Settings.outputDir = dir
                                        App.toast("Recording folder updated", "ok")
                                    }
                                }
                            }
                        }

                        Text {
                            width: parent.width
                            wrapMode: Text.WordWrap
                            text: qsTr("Recordings are saved as MP4 (preferred) or PNG sequence fallback.")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                        }
                    }
                }

                // Recording settings
                Rectangle {
                    width: parent.width
                    height: recSettings.implicitHeight + 24
                    radius: Theme.radius
                    color: Theme.s2
                    border.color: Theme.border
                    border.width: 1

                    Column {
                        id: recSettings
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 12

                        RowLayout {
                            width: parent.width
                            spacing: 10
                            Text {
                                text: qsTr("INCLUDE MICROPHONE")
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 9
                                font.letterSpacing: 2
                                Layout.fillWidth: true
                            }
                            ToggleSwitch {
                                checked: root.includeMicrophone
                                onToggled: {
                                    root.includeMicrophone = checked
                                    Settings.includeMicrophone = checked
                                }
                            }
                        }

                        RowLayout {
                            width: parent.width
                            spacing: 10
                            Text {
                                text: qsTr("QUALITY")
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 9
                                font.letterSpacing: 2
                                Layout.fillWidth: true
                            }
                            ComboBox {
                                id: recQualityBox
                                Layout.fillWidth: true
                                model: ["balanced", "high"]
                                currentIndex: ["balanced", "high"].indexOf(root.recordingQuality)
                                font.family: Theme.fontMono
                                font.pixelSize: 10
                                background: Rectangle {
                                    radius: Theme.radius
                                    color: Theme.s1
                                    border.color: Theme.border
                                }
                                onActivated: {
                                    root.recordingQuality = modelData
                                    Settings.recordingQuality = modelData
                                }
                            }
                        }

                        RowLayout {
                            width: parent.width
                            spacing: 10
                            Text {
                                text: qsTr("AUTO-RECORD ON SWAP")
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 9
                                font.letterSpacing: 2
                                Layout.fillWidth: true
                            }
                            ToggleSwitch {
                                checked: root.autoRecordOnSwap
                                onToggled: {
                                    root.autoRecordOnSwap = checked
                                    Settings.autoRecordOnSwap = checked
                                }
                            }
                        }
                    }
                }

                // Current recording status
                Rectangle {
                    width: parent.width
                    height: recStatus.implicitHeight + 24
                    radius: Theme.radius
                    color: Theme.s2
                    border.color: Theme.border
                    border.width: 1

                    Column {
                        id: recStatus
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 8

                        SectionLabel { text: "SESSION RECORDING" }

                        RowLayout {
                            width: parent.width
                            spacing: 12

                            Rectangle {
                                visible: Stream.recording
                                width: 10; height: 10; radius: 5
                                color: Theme.red
                                SequentialAnimation on opacity {
                                    running: true; loops: Animation.Infinite
                                    NumberAnimation { from: 1; to: 0.4; duration: 700 }
                                    NumberAnimation { from: 0.4; to: 1; duration: 700 }
                                }
                            }

                            Text {
                                text: Stream.recording ? qsTr("● RECORDING") : qsTr("NOT RECORDING")
                                color: Stream.recording ? Theme.red : Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 11
                                font.bold: Stream.recording
                            }

                            Item { Layout.fillWidth: true }

                            GoldButton {
                                visible: Stream.live && !Stream.recording
                                text: qsTr("● REC")
                                onClicked: Stream.toggleRecording()
                            }

                            GoldButton {
                                visible: Stream.recording
                                text: qsTr("■ STOP REC")
                                bg: Theme.red
                                onClicked: Stream.toggleRecording()
                            }
                        }
                    }
                }
            }
        }
    }

    // ── Tab 3: ADVANCED ─────────────────────────────────────────────────────
    Component {
        id: advancedTab
        Flickable {
            anchors.fill: parent
            contentHeight: advCol.implicitHeight + 24
            clip: true
            flickableDirection: Flickable.VerticalFlick

            Column {
                id: advCol
                width: parent.width
                spacing: 16

                // OBS / Stream settings
                Rectangle {
                    width: parent.width
                    height: obsSection.implicitHeight + 24
                    radius: Theme.radius
                    color: Theme.s2
                    border.color: Theme.border
                    border.width: 1

                    Column {
                        id: obsSection
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 12

                        SectionLabel { text: "OBS / STREAM" }

                        RowLayout {
                            width: parent.width
                            spacing: 10
                            Text {
                                text: qsTr("OBS FEED MODE")
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 9
                                font.letterSpacing: 2
                                Layout.fillWidth: true
                            }
                            ComboBox {
                                id: obsModeBox
                                Layout.fillWidth: true
                                model: ["camera", "ai", "both"]
                                currentIndex: ["camera", "ai", "both"].indexOf(Stream.obsMode || "ai")
                                font.family: Theme.fontMono
                                font.pixelSize: 10
                                background: Rectangle {
                                    radius: Theme.radius
                                    color: Theme.s1
                                    border.color: Theme.border
                                }
                                onActivated: Stream.obsMode = modelData
                            }
                        }

                        Text {
                            width: parent.width
                            wrapMode: Text.WordWrap
                            text: qsTr("Camera: raw webcam feed | AI: transformed output | Both: side-by-side")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                        }

                        RowLayout {
                            width: parent.width
                            spacing: 8
                            GoldButton {
                                text: qsTr("📋 COPY OBS URL")
                                enabled: Stream.mjpegRunning
                                onClicked: {
                                    App.copyToClipboard(Stream.mjpegUrl)
                                    App.toast("OBS URL copied: " + Stream.mjpegUrl, "ok")
                                }
                            }
                            GoldButton {
                                visible: !Stream.mjpegRunning
                                text: qsTr("START OBS FEED")
                                onClicked: {
                                    Stream.startMjpegServer(4789)
                                }
                            }
                        }

                        Text {
                            visible: Stream.mjpegRunning
                            width: parent.width
                            wrapMode: Text.WordWrap
                            text: qsTr("OBS URL: ") + Stream.mjpegUrl + qsTr(" (add as Media Source in OBS)")
                            color: Theme.teal
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                        }
                    }
                }

                // Updates
                Rectangle {
                    width: parent.width
                    height: updateSection.implicitHeight + 24
                    radius: Theme.radius
                    color: Theme.s2
                    border.color: Theme.border
                    border.width: 1

                    Column {
                        id: updateSection
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 12

                        SectionLabel { text: "UPDATES" }

                        RowLayout {
                            width: parent.width
                            spacing: 10
                            Text {
                                text: qsTr("CURRENT VERSION")
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 9
                                font.letterSpacing: 2
                                Layout.fillWidth: true
                            }
                            Text {
                                text: "v" + App.appVersion
                                color: Theme.text
                                font.family: Theme.fontMono
                                font.pixelSize: 11
                                Layout.alignment: Qt.AlignVCenter
                            }
                        }

                        GoldButton {
                            width: parent.width
                            text: qsTr("CHECK FOR UPDATES")
                            onClicked: App.checkForUpdates()
                        }

                        Text {
                            visible: App.downloading
                            width: parent.width
                            wrapMode: Text.WordWrap
                            text: qsTr("Downloading update: %1%").arg(App.downloadProgress)
                            color: Theme.gold
                            font.family: Theme.fontMono
                            font.pixelSize: 10
                        }
                    }
                }

                // Debug / Logs
                Rectangle {
                    width: parent.width
                    height: debugSection.implicitHeight + 24
                    radius: Theme.radius
                    color: Theme.s2
                    border.color: Theme.border
                    border.width: 1

                    Column {
                        id: debugSection
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 12

                        SectionLabel { text: "DEBUG" }

                        RowLayout {
                            width: parent.width
                            spacing: 8
                            GhostButton {
                                text: qsTr("COPY DEBUG LOG")
                                Layout.fillWidth: true
                                onClicked: App.copyDebugLog()
                            }
                            GhostButton {
                                text: qsTr("OPEN LOG FOLDER")
                                Layout.fillWidth: true
                                onClicked: App.openLogFolder()
                            }
                        }
                    }
                }
            }
        }
    }

    // ── Tab 4: DANGER ZONE ──────────────────────────────────────────────────
    Component {
        id: dangerZoneTab
        Flickable {
            anchors.fill: parent
            contentHeight: dangerCol.implicitHeight + 24
            clip: true
            flickableDirection: Flickable.VerticalFlick

            Column {
                id: dangerCol
                width: parent.width
                spacing: 16

                // Warning banner
                Rectangle {
                    width: parent.width
                    height: 60
                    radius: Theme.radius
                    color: Qt.rgba(255/255, 77/255, 109/255, 0.1)
                    border.color: Theme.redBorderWash
                    border.width: 1

                    Row {
                        anchors.centerIn: parent
                        spacing: 10
                        Text { text: "⚠"; font.pixelSize: 20 }
                        Text {
                            width: parent.width - 40
                            wrapMode: Text.WordWrap
                            text: qsTr("Danger Zone: These actions are irreversible. Proceed with caution.")
                            color: Theme.red
                            font.family: Theme.fontUi
                            font.pixelSize: 11
                            font.bold: true
                        }
                    }
                }

                // Reset Storage
                Rectangle {
                    width: parent.width
                    height: resetSection.implicitHeight + 24
                    radius: Theme.radius
                    color: Theme.s2
                    border.color: Theme.redBorderWash
                    border.width: 1

                    Column {
                        id: resetSection
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 12

                        SectionLabel { text: "RESET STORAGE" }

                        Text {
                            width: parent.width
                            wrapMode: Text.WordWrap
                            text: qsTr("Clears all local data: session, settings, cache, downloaded assets. You will be signed out and need to sign in again.")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 10
                            lineHeight: 1.5
                        }

                        RowLayout {
                            width: parent.width
                            spacing: 8
                            GhostButton {
                                text: qsTr("CANCEL")
                                Layout.fillWidth: true
                            }
                            Rectangle {
                                width: 140
                                height: 36
                                radius: 7
                                color: Theme.red
                                border.color: Theme.red
                                border.width: 1
                                Text {
                                    anchors.centerIn: parent
                                    text: qsTr("RESET NOW")
                                    color: Theme.bg
                                    font.family: Theme.fontUi
                                    font.pixelSize: 12
                                    font.bold: true
                                    font.letterSpacing: 1
                                }
                                MouseArea {
                                    anchors.fill: parent
                                    onClicked: App.requestStorageReset()
                                }
                            }
                        }
                    }
                }

                // Clear Cache
                Rectangle {
                    width: parent.width
                    height: cacheSection.implicitHeight + 24
                    radius: Theme.radius
                    color: Theme.s2
                    border.color: Theme.border
                    border.width: 1

                    Column {
                        id: cacheSection
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 12

                        SectionLabel { text: "CLEAR CACHE" }

                        Text {
                            width: parent.width
                            wrapMode: Text.WordWrap
                            text: qsTr("Removes cached images, background presets, and temporary files. Does not affect your account or license.")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 10
                            lineHeight: 1.5
                        }

                        GhostButton {
                            width: parent.width
                            text: qsTr("CLEAR CACHE")
                            onClicked: App.clearCache()
                        }
                    }
                }

                // Logout All Devices
                Rectangle {
                    width: parent.width
                    height: logoutSection.implicitHeight + 24
                    radius: Theme.radius
                    color: Theme.s2
                    border.color: Theme.redBorderWash
                    border.width: 1

                    Column {
                        id: logoutSection
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 12

                        SectionLabel { text: "LOGOUT ALL DEVICES" }

                        Text {
                            width: parent.width
                            wrapMode: Text.WordWrap
                            text: qsTr("Invalidates all active sessions across all devices. You will need to sign in again on each device.")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 10
                            lineHeight: 1.5
                        }

                        Rectangle {
                            width: 140
                            height: 36
                            radius: 7
                            color: Theme.red
                            border.color: Theme.red
                            border.width: 1
                            Text {
                                anchors.centerIn: parent
                                text: qsTr("LOGOUT ALL")
                                color: Theme.bg
                                font.family: Theme.fontUi
                                font.pixelSize: 12
                                font.bold: true
                                font.letterSpacing: 1
                            }
                            MouseArea {
                                anchors.fill: parent
                                onClicked: App.logoutAllDevices()
                            }
                        }
                    }
                }

                // Delete Account
                Rectangle {
                    width: parent.width
                    height: deleteSection.implicitHeight + 24
                    radius: Theme.radius
                    color: Theme.s2
                    border.color: Theme.red
                    border.width: 2

                    Column {
                        id: deleteSection
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 12

                        SectionLabel { text: "DELETE ACCOUNT" }

                        Text {
                            width: parent.width
                            wrapMode: Text.WordWrap
                            text: qsTr("Permanently deletes your account, all data, license, and credits. This cannot be undone.")
                            color: Theme.red
                            font.family: Theme.fontMono
                            font.pixelSize: 10
                            font.bold: true
                            lineHeight: 1.5
                        }

                        Rectangle {
                            width: 160
                            height: 40
                            radius: 8
                            color: Theme.red
                            border.color: Theme.red
                            border.width: 1
                            Text {
                                anchors.centerIn: parent
                                text: qsTr("DELETE ACCOUNT")
                                color: Theme.bg
                                font.family: Theme.fontUi
                                font.pixelSize: 13
                                font.bold: true
                                font.letterSpacing: 1
                            }
                            MouseArea {
                                anchors.fill: parent
                                onClicked: App.deleteAccount()
                            }
                        }
                    }
                }
            }
        }
    }
}