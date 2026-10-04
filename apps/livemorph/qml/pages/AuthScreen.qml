import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

Item {
    id: root
    anchors.fill: parent

    property string phase: "email" // email | code
    property string authTab: "social" // social | email
    property string pendingEmail: ""
    property int resendCooldown: 0
    property string otpCode: ""
    readonly property int otpLength: Auth.otpCodeLength > 0 ? Auth.otpCodeLength : 8
    readonly property int minCodeLength: 6
    property bool rateLimited: false
    property int rateLimitSeconds: 0
    property var digits: ["", "", "", "", "", "", "", ""]

    Rectangle {
        anchors.fill: parent
        color: Colors.surfaceBase
        z: -1
    }

    Row {
        anchors.fill: parent
        spacing: 0

        // ── LEFT: form panel ─────────────────────────────────────────
        Item {
            id: formPanel
            width: root.width >= 768 ? Math.min(560, Math.max(420, root.width * 0.42)) : root.width
            height: parent.height

            Rectangle {
                anchors.fill: parent
                color: Colors.surfaceBase
            }

            ColumnLayout {
                anchors.fill: parent
                anchors.leftMargin: 48
                anchors.rightMargin: 48
                anchors.topMargin: 40
                anchors.bottomMargin: 40
                spacing: 0

                // Header
                Row {
                    spacing: 8
                    Layout.alignment: Qt.AlignLeft
                    Image {
                        source: "qrc:/assets/livemorph-icon.png"
                        width: 28
                        height: 28
                        fillMode: Image.PreserveAspectFit
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    Text {
                        text: "LiveMorph"
                        color: Colors.textPrimary
                        font.pixelSize: 26
                        font.bold: true
                        font.letterSpacing: -1.04
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    Rectangle {
                        anchors.verticalCenter: parent.verticalCenter
                        height: 18
                        width: liveLab.implicitWidth + 12
                        radius: 3
                        color: Colors.accentMuted
                        border.color: "#8b5cf64d"
                        border.width: 1
                        Text {
                            id: liveLab
                            anchors.centerIn: parent
                            text: "LIVE"
                            color: Colors.accent
                            font.pixelSize: 9
                            font.family: Theme.fontMono.family
                            font.letterSpacing: 1.35
                        }
                    }
                }

                Item { Layout.preferredHeight: 40; Layout.fillWidth: true }

                // Headline (Electron: same headline in BOTH phases)
                Text {
                    text: qsTr("Step into character.\nLive to OBS.")
                    color: Colors.textPrimary
                    font.pixelSize: 42
                    font.bold: true
                    font.letterSpacing: -1.26
                    wrapMode: Text.WordWrap
                    Layout.fillWidth: true
                    lineHeight: 1.05
                }

                Text {
                    Layout.topMargin: 12
                    Layout.fillWidth: true
                    text: root.phase === "code"
                          ? qsTr("Enter the %1-digit code we sent to %2").arg(root.otpLength).arg(root.pendingEmail)
                          : qsTr("Real-time AI character swap powered by Lucy 2. Bring any character into your stream, for vtubing, gaming, or pure creative play.")
                    color: Colors.textSecondary
                    font.pixelSize: 14
                    wrapMode: Text.WordWrap
                    lineHeight: 1.35
                }

                Item { Layout.preferredHeight: 28; Layout.fillWidth: true }

                // Tabs (social | email)
                RowLayout {
                    Layout.fillWidth: true
                    spacing: 0

                    Item {
                        Layout.fillWidth: true
                        height: 36

                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            anchors.verticalCenter: parent.verticalCenter
                            text: qsTr("Social")
                            color: root.authTab === "social" ? Colors.textPrimary : Colors.textMuted
                            font.pixelSize: 12
                        }
                        Rectangle {
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.bottom: parent.bottom
                            height: 2
                            visible: root.authTab === "social"
                            color: Colors.accent
                        }
                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: root.authTab = "social"
                        }
                    }

                    Item {
                        Layout.fillWidth: true
                        height: 36

                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            anchors.verticalCenter: parent.verticalCenter
                            text: qsTr("Email")
                            color: root.authTab === "email" ? Colors.textPrimary : Colors.textMuted
                            font.pixelSize: 12
                        }
                        Rectangle {
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.bottom: parent.bottom
                            height: 2
                            visible: root.authTab === "email"
                            color: Colors.accent
                        }
                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: root.authTab = "email"
                        }
                    }
                }
                Rectangle {
                    Layout.fillWidth: true
                    height: 1
                    color: Colors.surfaceBorder
                    Layout.bottomMargin: 8
                }

                // ── Social phase ────────────────────────────────────────
                ColumnLayout {
                    visible: root.authTab === "social" && root.phase === "email"
                    Layout.fillWidth: true
                    spacing: 10

                    // Google button
                    Rectangle {
                        visible: Auth.googleAuthAvailable
                        Layout.fillWidth: true
                        Layout.preferredHeight: 48
                        Layout.topMargin: 8
                        radius: Theme.radiusMd
                        color: googleMa.containsMouse ? "#3c4043" : "#1f1f1f"
                        border.color: googleMa.containsMouse ? "#4285F466" : "#5f6368"
                        border.width: 1
                        Row {
                            anchors.centerIn: parent
                            spacing: 10
                            // Google SVG logo
                            Item {
                                width: 20; height: 20
                                anchors.verticalCenter: parent.verticalCenter
                                Canvas {
                                    anchors.fill: parent
                                    onPaint: {
                                        var ctx = getContext("2d")
                                        ctx.clearRect(0, 0, 20, 20)
                                        // G shape
                                        ctx.fillStyle = "#4285F4"
                                        ctx.beginPath()
                                        ctx.arc(10, 10, 8, 0, Math.PI * 2)
                                        ctx.fill()
                                        ctx.fillStyle = "#1f1f1f"
                                        ctx.fillRect(6, 6, 8, 8)
                                        // Red
                                        ctx.fillStyle = "#EA4335"
                                        ctx.beginPath()
                                        ctx.arc(10, 4, 8, -Math.PI * 0.75, -Math.PI * 0.25)
                                        ctx.lineTo(10, 10)
                                        ctx.fill()
                                        // Yellow
                                        ctx.fillStyle = "#FBBC05"
                                        ctx.beginPath()
                                        ctx.arc(10, 10, 8, -Math.PI * 0.25, Math.PI * 0.25)
                                        ctx.lineTo(10, 10)
                                        ctx.fill()
                                        // Green
                                        ctx.fillStyle = "#34A853"
                                        ctx.beginPath()
                                        ctx.arc(10, 10, 8, Math.PI * 0.25, Math.PI * 0.75)
                                        ctx.lineTo(10, 10)
                                        ctx.fill()
                                        // Blue
                                        ctx.fillStyle = "#4285F4"
                                        ctx.beginPath()
                                        ctx.arc(10, 10, 8, Math.PI * 0.75, Math.PI * 1.25)
                                        ctx.lineTo(10, 10)
                                        ctx.fill()
                                    }
                                }
                            }
                            Text {
                                text: qsTr("Continue with Google")
                                color: Colors.textPrimary
                                font.pixelSize: 13
                                font.weight: Font.Medium
                                anchors.verticalCenter: parent.verticalCenter
                            }
                        }
                        MouseArea {
                            id: googleMa
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            enabled: !Auth.isLoading
                            onClicked: Auth.signInWithGoogle()
                        }
                    }

                    // OR CONTINUE WITH divider
                    RowLayout {
                        visible: Auth.googleAuthAvailable
                        Layout.fillWidth: true
                        Layout.topMargin: 4
                        Layout.bottomMargin: 4
                        spacing: 10
                        Rectangle { Layout.fillWidth: true; height: 1; color: Colors.surfaceBorderSubtle }
                        Text {
                            text: qsTr("OR CONTINUE WITH")
                            color: Colors.textMuted
                            font.pixelSize: 9
                            font.family: Theme.fontMono.family
                            font.letterSpacing: 1.35
                        }
                        Rectangle { Layout.fillWidth: true; height: 1; color: Colors.surfaceBorderSubtle }
                    }

                    // Secondary social buttons row (Electron: 44×44 icon-only
                    // squares in a centered row, tooltip "<label> (coming soon)")
                    Row {
                        visible: Auth.googleAuthAvailable
                        Layout.alignment: Qt.AlignHCenter
                        Layout.topMargin: 8
                        spacing: 12

                        Rectangle {
                            width: 44; height: 44
                            radius: Theme.radiusSm
                            color: "#17171f"
                            border.color: Colors.surfaceBorder
                            border.width: 1
                            opacity: 0.4
                            Text {
                                anchors.centerIn: parent
                                text: "\u2764" // Twitch
                                color: "#9146FF"
                                font.pixelSize: 16
                            }
                            Tooltip {
                                anchors.top: parent.bottom
                                anchors.topMargin: 6
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: qsTr("Twitch (coming soon)")
                                shown: twitchMa.containsMouse
                            }
                            MouseArea {
                                id: twitchMa
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor
                                enabled: false
                            }
                        }

                        Rectangle {
                            width: 44; height: 44
                            radius: Theme.radiusSm
                            color: "#17171f"
                            border.color: Colors.surfaceBorder
                            border.width: 1
                            opacity: 0.4
                            Text {
                                anchors.centerIn: parent
                                text: "\u266B" // TikTok
                                color: "#FFFFFF"
                                font.pixelSize: 16
                            }
                            Tooltip {
                                anchors.top: parent.bottom
                                anchors.topMargin: 6
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: qsTr("TikTok (coming soon)")
                                shown: tiktokMa.containsMouse
                            }
                            MouseArea {
                                id: tiktokMa
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor
                                enabled: false
                            }
                        }

                        Rectangle {
                            width: 44; height: 44
                            radius: Theme.radiusSm
                            color: "#17171f"
                            border.color: Colors.surfaceBorder
                            border.width: 1
                            opacity: 0.4
                            Text {
                                anchors.centerIn: parent
                                text: "K" // Kick
                                color: "#53FC18"
                                font.pixelSize: 16
                                font.bold: true
                            }
                            Tooltip {
                                anchors.top: parent.bottom
                                anchors.topMargin: 6
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: qsTr("Kick (coming soon)")
                                shown: kickMa.containsMouse
                            }
                            MouseArea {
                                id: kickMa
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor
                                enabled: false
                            }
                        }
                    }
                }

                // ── Email phase ────────────────────────────────────────
                ColumnLayout {
                    visible: root.authTab === "email" && root.phase === "email"
                    Layout.fillWidth: true
                    spacing: 12

                    Text {
                        text: qsTr("EMAIL ADDRESS")
                        color: Colors.textMuted
                        font.pixelSize: 10
                        font.family: Theme.fontMono.family
                        font.letterSpacing: 1.5
                    }

                    TextField {
                        id: emailField
                        Layout.fillWidth: true
                        Layout.preferredHeight: 48
                        placeholderText: "you@example.com"
                        color: Colors.textPrimary
                        placeholderTextColor: Colors.textMuted
                        font.family: Theme.fontMono.family
                        font.pixelSize: 13
                        leftPadding: 14
                        rightPadding: 14
                        selectByMouse: true
                        background: Rectangle {
                            radius: Theme.radiusSm
                            color: "#17171f80"
                            border.color: emailField.activeFocus ? Colors.accent : Colors.surfaceBorder
                            border.width: emailField.activeFocus ? 1.5 : 1
                        }
                        Keys.onReturnPressed: root.sendMagicLink()
                    }

                    Text {
                        text: qsTr("Works for both new and existing accounts. We'll email you a magic link.")
                        color: Colors.textMuted
                        font.pixelSize: 11
                        wrapMode: Text.WordWrap
                        Layout.fillWidth: true
                    }

                    Text {
                        visible: !Backend.reachable
                        Layout.fillWidth: true
                        Layout.topMargin: 4
                        text: qsTr("Backend offline — set the API URL in Settings to receive codes.")
                        color: Colors.statusWarning
                        font.pixelSize: 11
                        wrapMode: Text.WordWrap
                    }

                    PrimaryButton {
                        Layout.fillWidth: true
                        Layout.preferredHeight: 48
                        text: Auth.isLoading ? qsTr("Sending…") : qsTr("Send Magic Link")
                        busy: Auth.isLoading
                        // Electron enables on non-empty trim; the server
                        // validates the address on submit.
                        enabled: !Auth.isLoading && emailField.text.trim().length > 0 && !root.rateLimited
                        onClicked: root.sendMagicLink()
                    }
                }

                // ── OTP phase ──────────────────────────────────────────
                ColumnLayout {
                    visible: root.phase === "code"
                    Layout.fillWidth: true
                    spacing: 16

                    // Check your email (Electron: paper-plane icon + title)
                    Column {
                        Layout.fillWidth: true
                        spacing: 4

                        Row {
                            spacing: 8
                            anchors.horizontalCenter: parent.horizontalCenter
                            Rectangle {
                                width: 44; height: 44; radius: 22
                                color: Colors.statusSuccessMuted
                                anchors.verticalCenter: parent.verticalCenter
                                Icon {
                                    anchors.centerIn: parent
                                    name: "send"
                                    size: 18
                                    color: Colors.statusSuccess
                                }
                            }
                        }

                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: qsTr("Check your email")
                            color: Colors.textPrimary
                            font.pixelSize: 14
                            font.weight: Font.Medium
                        }
                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            width: parent.width
                            text: qsTr("Enter the %1-digit code we sent to %2").arg(root.otpLength).arg(root.pendingEmail)
                            color: Colors.textSecondary
                            font.pixelSize: 12
                            wrapMode: Text.WordWrap
                            horizontalAlignment: Text.AlignHCenter
                        }
                    }

                    Row {
                        Layout.alignment: Qt.AlignHCenter
                        spacing: 6
                        Repeater {
                            id: digitRepeater
                            model: root.otpLength
                            Rectangle {
                                width: 36
                                height: 48
                                radius: Theme.radiusSm
                                color: Colors.surfaceOverlay
                                border.color: digitInput.activeFocus ? Colors.accent
                                            : (Auth.errorMessage.length > 0 && root.phase === "code" ? Colors.statusError : Colors.surfaceBorder)
                                border.width: digitInput.activeFocus ? 1.5 : 1

                                TextInput {
                                    id: digitInput
                                    anchors.fill: parent
                                    horizontalAlignment: Text.AlignHCenter
                                    verticalAlignment: Text.AlignVCenter
                                    color: Colors.textPrimary
                                    font.pixelSize: 18
                                    font.bold: true
                                    font.family: Theme.fontMono.family
                                    maximumLength: 1
                                    inputMethodHints: Qt.ImhDigitsOnly
                                    validator: RegularExpressionValidator { regularExpression: /[0-9]/ }
                                    onTextChanged: {
                                        var arr = root.digits.slice()
                                        arr[index] = text
                                        root.digits = arr
                                        root.otpCode = arr.join("")
                                        if (text.length === 1 && index < root.otpLength - 1)
                                            digitRepeater.itemAt(index + 1).children[0].forceActiveFocus()
                                        // Electron: auto-submit ONLY when the full code is
                                        // complete (8 digits); the button stays enabled at ≥6.
                                        if (root.otpCode.length === root.otpLength && !Auth.isLoading)
                                            Qt.callLater(root.verifyCode)
                                    }
                                    Keys.onPressed: (e) => {
                                        if (e.key === Qt.Key_Backspace && text.length === 0 && index > 0) {
                                            digitRepeater.itemAt(index - 1).children[0].forceActiveFocus()
                                        }
                                        // Handle Ctrl+V / Cmd+V paste directly in digit inputs
                                        if ((e.key === Qt.Key_V) && (e.modifiers & Qt.ControlModifier)) {
                                            pasteField.forceActiveFocus()
                                            e.accepted = true
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Hidden paste field
                    TextInput {
                        id: pasteField
                        visible: false
                        onTextChanged: {
                            var cleaned = text.replace(/\D/g, "").slice(0, root.otpLength)
                            if (cleaned.length === 0) return
                            var arr = []
                            for (var j = 0; j < root.otpLength; j++) arr.push("")
                            for (var i = 0; i < cleaned.length; i++) arr[i] = cleaned[i]
                            root.digits = arr
                            root.otpCode = cleaned
                            text = ""
                            if (cleaned.length === root.otpLength && !Auth.isLoading) root.verifyCode()
                        }
                    }

                    PrimaryButton {
                        Layout.fillWidth: true
                        Layout.preferredHeight: 48
                        text: Auth.isLoading ? qsTr("Signing in") : qsTr("Sign in")
                        busy: Auth.isLoading
                        enabled: !Auth.isLoading && root.otpCode.length >= root.minCodeLength
                        onClicked: root.verifyCode()
                    }

                    Row {
                        Layout.alignment: Qt.AlignHCenter
                        spacing: 16
                        Text {
                            text: {
                                var sec = Math.max(root.resendCooldown, Auth.otpCooldownSecs || 0)
                                return sec > 0 ? qsTr("Send a new code in %1s").arg(sec) : qsTr("Send a new code")
                            }
                            color: (Math.max(root.resendCooldown, Auth.otpCooldownSecs || 0) > 0) ? Colors.textMuted : Colors.accent
                            font.pixelSize: 12
                            font.weight: Font.Medium
                            MouseArea {
                                anchors.fill: parent
                                enabled: Math.max(root.resendCooldown, Auth.otpCooldownSecs || 0) === 0 && !Auth.isLoading
                                cursorShape: Qt.PointingHandCursor
                                onClicked: {
                                    Auth.requestOtp(root.pendingEmail)
                                    root.resendCooldown = 30
                                    resendTimer.start()
                                }
                            }
                        }
                        Text {
                            text: qsTr("Use a different email")
                            color: Colors.textMuted
                            font.pixelSize: 12
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: {
                                    root.phase = "email"
                                    root.otpCode = ""
                                    root.digits = ["", "", "", "", "", "", "", ""]
                                    Auth.clearError()
                                }
                            }
                        }
                    }

                    // Still works note (Electron copy)
                    Text {
                        Layout.fillWidth: true
                        Layout.topMargin: 4
                        text: qsTr("The link in that email still works too.")
                        color: Colors.textMuted
                        font.pixelSize: 10
                        wrapMode: Text.WordWrap
                        horizontalAlignment: Text.AlignHCenter
                        Layout.alignment: Qt.AlignHCenter
                    }
                }

                // Rate limit / error (Electron: no countdown, plain alert)
                Rectangle {
                    visible: root.rateLimited
                    Layout.fillWidth: true
                    Layout.topMargin: 12
                    height: 40
                    radius: Theme.radiusSm
                    color: Colors.errorSoftBg
                    border.color: "#ef444433"
                    border.width: 1
                    Text {
                        anchors.centerIn: parent
                        text: qsTr("Too many login attempts. Please wait a few minutes.")
                        color: Colors.statusError
                        font.pixelSize: 11
                    }
                }

                Rectangle {
                    visible: Auth.errorMessage.length > 0 && !root.rateLimited
                    Layout.fillWidth: true
                    Layout.topMargin: 12
                    height: errTxt.implicitHeight + 20
                    radius: Theme.radiusSm
                    color: Colors.errorSoftBg
                    border.color: "#ef444433"
                    border.width: 1
                    Text {
                        id: errTxt
                        anchors.centerIn: parent
                        width: parent.width - 24
                        horizontalAlignment: Text.AlignHCenter
                        wrapMode: Text.WordWrap
                        text: Auth.errorMessage
                        color: Colors.statusError
                        font.pixelSize: 11
                    }
                }

                Item { Layout.fillHeight: true }

                // Footer
                Rectangle {
                    Layout.fillWidth: true
                    height: 1
                    color: Colors.surfaceBorder
                    Layout.bottomMargin: 16
                }

                Text {
                    Layout.fillWidth: true
                    color: Colors.textMuted
                    font.pixelSize: 10
                    wrapMode: Text.WordWrap
                    // Electron: "By continuing, you agree to our Terms of
                    // Service, Privacy Policy, and Acceptable Use Policy."
                    text: qsTr("By continuing, you agree to our ") +
                          "<a href=\"" + Constants.urlTerms + "\" style=\"color:" + Colors.accentHover + ";text-decoration:underline\">Terms of Service</a>, " +
                          "<a href=\"" + Constants.urlPrivacy + "\" style=\"color:" + Colors.accentHover + ";text-decoration:underline\">Privacy Policy</a>, " +
                          qsTr("and ") +
                          "<a href=\"" + Constants.urlAup + "\" style=\"color:" + Colors.accentHover + ";text-decoration:underline\">Acceptable Use Policy</a>."
                    onLinkActivated: function(link) { Qt.openUrlExternally(link) }
                }

                RowLayout {
                    Layout.fillWidth: true
                    Layout.topMargin: 12
                    BrandingFooter { Layout.fillWidth: true }
                    Text {
                        text: "v" + App.appVersion
                        color: Colors.textMuted
                        font.pixelSize: 10
                        font.family: Theme.fontMono.family
                    }
                }
            }
        }

        // ── RIGHT: hero ──────────────────────────────────────────────
        Item {
            id: hero
            visible: root.width >= 768
            width: visible ? parent.width - formPanel.width : 0
            height: parent.height
            clip: true

            Rectangle {
                anchors.fill: parent
                color: Colors.surfaceRaised
            }

            Image {
                anchors.fill: parent
                source: "qrc:/assets/auth-hero.jpg"
                fillMode: Image.PreserveAspectCrop
            }

            // Bottom gradient
            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.bottom: parent.bottom
                height: parent.height / 3
                gradient: Gradient {
                    GradientStop { position: 0.0; color: "transparent" }
                    GradientStop { position: 0.5; color: "#08080c33" }
                    GradientStop { position: 1.0; color: "#08080cb3" }
                }
            }

            // Left accent border
            Rectangle {
                anchors.left: parent.left
                anchors.top: parent.top
                anchors.bottom: parent.bottom
                width: 1
                color: "#8b5cf626"
            }

            // Powered-by chip
            Rectangle {
                anchors.top: parent.top
                anchors.right: parent.right
                anchors.margins: 32
                height: 28
                width: powered.implicitWidth + 24
                radius: 4
                color: "#08080cb3"
                border.color: Colors.surfaceBorder
                Text {
                    id: powered
                    anchors.centerIn: parent
                    text: qsTr("Powered by Lucy 2")
                    color: Colors.textMuted
                    font.pixelSize: 9
                    font.family: Theme.fontMono.family
                    font.letterSpacing: 1
                }
            }

            // Live swapping chip
            Rectangle {
                anchors.left: parent.left
                anchors.bottom: parent.bottom
                anchors.margins: 48
                height: 36
                radius: 4
                color: "#08080cd9"
                border.color: "#8b5cf666"
                Row {
                    anchors.verticalCenter: parent.verticalCenter
                    anchors.left: parent.left
                    anchors.leftMargin: 12
                    spacing: 10
                    Rectangle {
                        width: 8; height: 8; radius: 4
                        color: Colors.accent
                        anchors.verticalCenter: parent.verticalCenter
                        SequentialAnimation on opacity {
                            running: Qt.platform.os !== "wasm"
                            loops: Animation.Infinite
                            NumberAnimation { from: 1; to: 0.4; duration: 700 }
                            NumberAnimation { from: 0.4; to: 1; duration: 700 }
                        }
                    }
                    Text {
                        text: qsTr("LIVE")
                        color: Colors.textPrimary
                        font.pixelSize: 10
                        font.family: Theme.fontMono.family
                        font.bold: true
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    Rectangle {
                        width: 1; height: 16
                        color: "#8b5cf640"
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    Text {
                        // Electron: "Currently swapping with <highlighted name>"
                        text: qsTr("Currently swapping with %1").arg("<span style=\"color:#a78bfa\">Cyberpunk Samurai</span>")
                        textFormat: Text.RichText
                        color: Colors.textSecondary
                        font.pixelSize: 11
                        font.family: Theme.fontMono.family
                        anchors.verticalCenter: parent.verticalCenter
                    }
                }
                width: childrenRect.width + 24
            }
        }
    }

    Timer {
        id: resendTimer
        interval: 1000
        repeat: true
        onTriggered: {
            root.resendCooldown = Math.max(0, root.resendCooldown - 1)
            if (root.resendCooldown === 0) stop()
        }
    }
    Timer {
        id: rateLimitTimer
        interval: 1000
        repeat: true
        onTriggered: {
            root.rateLimitSeconds = Math.max(0, root.rateLimitSeconds - 1)
            if (root.rateLimitSeconds === 0) {
                root.rateLimited = false
                stop()
            }
        }
    }

    function sendMagicLink() {
        var email = emailField.text.trim()
        if (email.indexOf("@") < 1) return
        if (Auth.rateLimited) return
        Auth.requestOtp(email)
    }
    function verifyCode() {
        if (Auth.isLoading) return
        if (root.otpCode.length < root.minCodeLength) return
        var email = (root.pendingEmail || Auth.pendingEmail || "").trim()
        if (!email) {
            App.notify(qsTr("Missing email — go back and try again"), "error")
            root.phase = "email"
            return
        }
        Auth.verifyOtp(email, root.otpCode)
    }

    Keys.forwardTo: [pasteField]
    focus: true

    Connections {
        target: Auth
        function onGoogleOAuthStarted(url) {
            App.notify(qsTr("Complete Google sign-in in your browser"), "info")
        }
        function onOtpRequested(email) {
            root.pendingEmail = email
            root.phase = "code"
            root.resendCooldown = 30
            resendTimer.start()
            var n = root.otpLength
            var arr = []
            for (var i = 0; i < n; i++) arr.push("")
            root.digits = arr
            root.otpCode = ""
            Qt.callLater(function() {
                if (digitRepeater.count > 0 && digitRepeater.itemAt(0))
                    digitRepeater.itemAt(0).children[0].forceActiveFocus()
            })
        }
        function onSignedIn() {
            root.phase = "email"
        }
        function onRateLimitedChanged() {
            root.rateLimited = Auth.rateLimited
            root.rateLimitSeconds = Auth.rateLimitSecs
            if (Auth.rateLimited) rateLimitTimer.start()
        }
        function onErrorMessageChanged() {
            if (root.phase === "code" && Auth.errorMessage.length > 0 && !Auth.isLoading) {
                var n = root.otpLength
                var arr = []
                for (var i = 0; i < n; i++) arr.push("")
                root.digits = arr
                root.otpCode = ""
            }
        }
    }
}
