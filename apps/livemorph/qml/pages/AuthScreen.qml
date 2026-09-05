import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

/**
 * AuthScreen — LiveMorph sign-in (email OTP + optional Google)
 *
 * Outer: flex h-full w-full bg-surface-base
 * Left:  form panel md:w-[42%] max 560 min 420, px-12 py-10
 * Right: hero image flex-1 (desktop only)
 *
 * Email OTP + optional Google OAuth.
 */
Item {
    id: root
    anchors.fill: parent

    property string phase: "email" // email | code
    property string pendingEmail: ""
    property int resendCooldown: 0
    property string otpCode: ""
    readonly property int otpLength: Auth.otpCodeLength > 0 ? Auth.otpCodeLength : 8
    property bool rateLimited: false
    property int rateLimitSeconds: 0
    property var digits: ["", "", "", "", "", "", "", ""]

    // Full dark base — never leave transparent (avoids white flash)
    Rectangle {
        anchors.fill: parent
        color: Colors.surfaceBase
        z: -1
    }

    Row {
        anchors.fill: parent
        spacing: 0

        // ── LEFT: form panel (original section) ─────────────────────────
        Item {
            id: formPanel
            width: root.width >= 900 ? Math.min(560, Math.max(420, root.width * 0.42)) : root.width
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

                // Header — LiveMorph product mark
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
                            font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                            font.letterSpacing: 1.35
                        }
                    }
                }

                Item { Layout.preferredHeight: 40; Layout.fillWidth: true }

                // Headline
                Text {
                    text: root.phase === "code" ? qsTr("Check your inbox") : qsTr("Welcome to LiveMorph")
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
                          : qsTr("Live AI character transformation for creators and streamers. Sign in with email — no password needed.")
                    color: Colors.textSecondary
                    font.pixelSize: 14
                    wrapMode: Text.WordWrap
                    lineHeight: 1.35
                }

                Item { Layout.preferredHeight: 28; Layout.fillWidth: true }

                // Tabs (original social | email) — social disabled (backend auth only)
                RowLayout {
                    Layout.fillWidth: true
                    spacing: 0
                    Item {
                        Layout.fillWidth: true
                        height: 36
                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            anchors.verticalCenter: parent.verticalCenter
                            text: qsTr("SOCIAL")
                            color: Colors.textMuted
                            font.pixelSize: 11
                            font.family: "monospace"
                            font.letterSpacing: 1.65
                            opacity: 0.45
                        }
                    }
                    Item {
                        Layout.fillWidth: true
                        height: 36
                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            anchors.verticalCenter: parent.verticalCenter
                            text: qsTr("EMAIL")
                            color: Colors.textPrimary
                            font.pixelSize: 11
                            font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                            font.letterSpacing: 1.65
                        }
                        Rectangle {
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.bottom: parent.bottom
                            height: 2
                            color: Colors.accent
                        }
                    }
                }
                Rectangle {
                    Layout.fillWidth: true
                    height: 1
                    color: Colors.surfaceBorder
                    Layout.bottomMargin: 8
                }

                // ── Email phase ────────────────────────────────────────
                ColumnLayout {
                    visible: root.phase === "email"
                    Layout.fillWidth: true
                    spacing: 12

                    Text {
                        text: qsTr("EMAIL")
                        color: Colors.textMuted
                        font.pixelSize: 10
                        font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                        font.letterSpacing: 1.5
                    }

                    TextField {
                        id: emailField
                        Layout.fillWidth: true
                        Layout.preferredHeight: 48
                        placeholderText: "you@example.com"
                        color: Colors.textPrimary
                        placeholderTextColor: Colors.textMuted
                        font.family: "monospace"
                        font.pixelSize: 13
                        leftPadding: 14
                        rightPadding: 14
                        selectByMouse: true
                        background: Rectangle {
                            radius: Theme.radiusSm
                            color: "#17171f80"  // surface-overlay/50
                            border.color: emailField.activeFocus ? Colors.accent : Colors.surfaceBorder
                            border.width: emailField.activeFocus ? 1.5 : 1
                        }
                        Keys.onReturnPressed: root.sendMagicLink()
                    }

                    Text {
                        text: qsTr("We'll send a one-time code — no password needed.")
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

                    // Continue with Google (enabled when backend has GOOGLE_CLIENT_*)
                    Rectangle {
                        visible: Auth.googleAuthAvailable && root.phase === "email"
                        Layout.fillWidth: true
                        Layout.preferredHeight: 48
                        Layout.topMargin: 8
                        radius: Theme.radiusMd
                        color: googleMa.containsMouse ? "#3c4043" : "#1f1f1f"
                        border.color: "#5f6368"
                        border.width: 1
                        Row {
                            anchors.centerIn: parent
                            spacing: 10
                            Text {
                                text: "G"
                                color: "#4285F4"
                                font.pixelSize: 18
                                font.bold: true
                                anchors.verticalCenter: parent.verticalCenter
                            }
                            Text {
                                text: qsTr("Continue with Google")
                                color: Colors.textPrimary
                                font.pixelSize: 14
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

                    // Divider when Google is available
                    RowLayout {
                        visible: Auth.googleAuthAvailable && root.phase === "email"
                        Layout.fillWidth: true
                        Layout.topMargin: 12
                        Layout.bottomMargin: 4
                        spacing: 10
                        Rectangle { Layout.fillWidth: true; height: 1; color: Colors.surfaceBorder }
                        Text {
                            text: qsTr("or")
                            color: Colors.textMuted
                            font.pixelSize: 11
                        }
                        Rectangle { Layout.fillWidth: true; height: 1; color: Colors.surfaceBorder }
                    }

                    PrimaryButton {
                        Layout.fillWidth: true
                        Layout.preferredHeight: 48
                        Layout.topMargin: Auth.googleAuthAvailable ? 4 : 8
                        text: Auth.isLoading ? qsTr("Sending…") : qsTr("Send magic link")
                        busy: Auth.isLoading
                        enabled: !Auth.isLoading && emailField.text.indexOf("@") > 0 && !root.rateLimited
                        onClicked: root.sendMagicLink()
                    }
                }

                
                // OAuth ticket paste (if browser could not open the app)
                ColumnLayout {
                    visible: Auth.googleAuthAvailable && root.phase === "email"
                    Layout.fillWidth: true
                    Layout.topMargin: 12
                    spacing: 6
                    Text {
                        text: qsTr("Have an OAuth ticket?")
                        color: Colors.textMuted
                        font.pixelSize: 11
                    }
                    RowLayout {
                        Layout.fillWidth: true
                        spacing: 8
                        TextField {
                            id: oauthTicketField
                            Layout.fillWidth: true
                            placeholderText: qsTr("Paste ticket from browser")
                            color: Colors.textPrimary
                        }
                        SecondaryButton {
                            text: qsTr("Redeem")
                            enabled: oauthTicketField.text.trim().length > 10 && !Auth.isLoading
                            onClicked: Auth.exchangeOAuthTicket(oauthTicketField.text.trim())
                        }
                    }
                }

// ── OTP phase ──────────────────────────────────────────
                ColumnLayout {
                    visible: root.phase === "code"
                    Layout.fillWidth: true
                    spacing: 16

                    // Code-sent confirmation
                    Rectangle {
                        Layout.fillWidth: true
                        height: sentCol.implicitHeight + 20
                        radius: Theme.radiusMd
                        color: Colors.statusSuccessMuted
                        border.color: Colors.statusSuccess
                        border.width: 1
                        Column {
                            id: sentCol
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.verticalCenter: parent.verticalCenter
                            anchors.margins: 12
                            spacing: 4
                            Text {
                                text: qsTr("Code sent")
                                color: Colors.statusSuccess
                                font.pixelSize: 13
                                font.weight: Font.DemiBold
                            }
                            Text {
                                width: parent.width
                                text: qsTr("We emailed a %1-digit code to %2").arg(root.otpLength).arg(root.pendingEmail)
                                color: Colors.textSecondary
                                font.pixelSize: 12
                                wrapMode: Text.WordWrap
                            }
                        }
                    }

                    Row {
                        Layout.alignment: Qt.AlignHCenter
                        spacing: 8
                        Repeater {
                            id: digitRepeater
                            model: root.otpLength
                            Rectangle {
                                width: root.otpLength > 6 ? 38 : 44
                                height: 52
                                radius: Theme.radiusMd
                                color: Colors.surfaceElevated
                                border.color: digitInput.activeFocus ? Colors.accent
                                            : (Auth.errorMessage.length > 0 && root.phase === "code" ? Colors.statusError : Colors.surfaceBorder)
                                border.width: digitInput.activeFocus ? 1.5 : 1

                                TextInput {
                                    id: digitInput
                                    anchors.fill: parent
                                    horizontalAlignment: Text.AlignHCenter
                                    verticalAlignment: Text.AlignVCenter
                                    color: Colors.textPrimary
                                    font.pixelSize: root.otpLength > 6 ? 16 : 18
                                    font.bold: true
                                    font.family: "monospace"
                                    maximumLength: 1
                                    inputMask: ""
                                    inputMethodHints: Qt.ImhDigitsOnly
                                    validator: RegularExpressionValidator { regularExpression: /[0-9]/ }
                                    onTextChanged: {
                                        var arr = root.digits.slice()
                                        arr[index] = text
                                        root.digits = arr
                                        root.otpCode = arr.join("")
                                        if (text.length === 1 && index < root.otpLength - 1)
                                            digitRepeater.itemAt(index + 1).children[0].forceActiveFocus()
                                        if (root.otpCode.length >= root.otpLength && !Auth.isLoading)
                                            Qt.callLater(root.verifyCode)
                                    }
                                    Keys.onPressed: (e) => {
                                        if (e.key === Qt.Key_Backspace && text.length === 0 && index > 0) {
                                            digitRepeater.itemAt(index - 1).children[0].forceActiveFocus()
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
                            if (cleaned.length >= root.otpLength && !Auth.isLoading) root.verifyCode()
                        }
                    }

                    PrimaryButton {
                        Layout.fillWidth: true
                        Layout.preferredHeight: 48
                        text: Auth.isLoading ? qsTr("Verifying…") : qsTr("Verify code")
                        busy: Auth.isLoading
                        enabled: !Auth.isLoading && root.otpCode.length >= root.otpLength
                        onClicked: root.verifyCode()
                    }

                    Row {
                        Layout.alignment: Qt.AlignHCenter
                        spacing: 16
                        Text {
                            text: {
                                var sec = Math.max(root.resendCooldown, Auth.otpCooldownSecs || 0)
                                return sec > 0 ? qsTr("Resend in %1s").arg(sec) : qsTr("Resend code")
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
                            text: qsTr("Change email")
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
                }

                // Rate limit / error
                Rectangle {
                    visible: root.rateLimited
                    Layout.fillWidth: true
                    Layout.topMargin: 12
                    height: 40
                    radius: Theme.radiusMd
                    color: Colors.statusErrorMuted
                    border.color: Colors.statusError
                    border.width: 1
                    Text {
                        anchors.centerIn: parent
                        text: qsTr("Too many attempts — try again in %1s").arg(root.rateLimitSeconds)
                        color: Colors.statusError
                        font.pixelSize: 11
                    }
                }

                Rectangle {
                    visible: Auth.errorMessage.length > 0 && !root.rateLimited
                    Layout.fillWidth: true
                    Layout.topMargin: 12
                    height: errTxt.implicitHeight + 20
                    radius: Theme.radiusMd
                    color: Colors.statusErrorMuted
                    border.color: Colors.statusError
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
                    text: qsTr("By continuing, you agree to LiveMorph’s Terms of Service, Privacy Policy, and Acceptable Use guidelines.")
                    color: Colors.textMuted
                    font.pixelSize: 10
                    wrapMode: Text.WordWrap
                }

                RowLayout {
                    Layout.fillWidth: true
                    Layout.topMargin: 12
                    BrandingFooter { Layout.fillWidth: true }
                    Text {
                        text: "v" + App.appVersion
                        color: Colors.textMuted
                        font.pixelSize: 10
                        font.family: "monospace"
                    }
                }
            }
        }

        // ── RIGHT: hero (original aside) ───────────────────────────────
        Item {
            id: hero
            visible: root.width >= 900
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

            // Bottom gradient only (original: from-surface-base/70)
            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.bottom: parent.bottom
                height: parent.height / 3
                gradient: Gradient {
                    GradientStop { position: 0.0; color: "transparent" }
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
                    text: qsTr("POWERED BY LUCY")
                    color: Colors.textMuted
                    font.pixelSize: 9
                    font.family: "monospace"
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
                    }
                    Text {
                        text: qsTr("LIVE")
                        color: Colors.textPrimary
                        font.pixelSize: 10
                        font.family: "monospace"
                        font.bold: true
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    Rectangle {
                        width: 1; height: 16
                        color: "#8b5cf640"
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    Text {
                        text: qsTr("LiveMorph Stage · live session")
                        color: Colors.textSecondary
                        font.pixelSize: 11
                        font.family: "monospace"
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
        if (root.otpCode.length < root.otpLength) return
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
            // Focus first digit after layout
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
            // After failed verify, clear boxes so user can re-enter full code
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
