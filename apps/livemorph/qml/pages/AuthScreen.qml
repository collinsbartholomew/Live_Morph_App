import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

/**
 * AuthScreen — Obsidian Hex redesign: a single full-bleed honeycomb field
 * (radial spotlight + sparkle cells) with one centered hex-framed card.
 * No photo hero, no split panes — the brand mark, wordmark and LIVE chip sit
 * above the card; the OTP phase renders the code as a row of hex cells.
 * All logic (magic link, OTP distribute/auto-submit/paste, rate limit,
 * resend cooldown) is unchanged.
 */
Item {
    id: root
    anchors.fill: parent

    property string phase: "email" // email | code
    property string authTab: "social" // social | email
    property string pendingEmail: ""
    property int resendCooldown: 0
    property string otpCode: ""
    readonly property int otpLength: Auth.otpCodeLength > 0 ? Auth.otpCodeLength : Constants.otpLength
    readonly property int minCodeLength: root.otpLength // backend requires the FULL code
    property bool rateLimited: false
    property int rateLimitSeconds: 0
    property var digits: {
        var a = []
        for (var i = 0; i < root.otpLength; i++) a.push("")
        return a
    }

    // ── Canvas: true black + spotlight honeycomb (the whole backdrop) ──
    Rectangle {
        anchors.fill: parent
        color: Colors.surfaceBase
        z: Theme.zUnder2
    }
    Honeycomb {
        anchors.fill: parent
        cellSize: Theme.honeycombCellLg
        cellSize2: Theme.honeycombCellLg * 3
        cellSize2Alpha: 0.45
        lineColor: Colors.honeycombOnBlack
        // Spotlight + soft light pool on the brand block, fading to the edges
        focusX: width / 2
        focusY: height * 0.30
        fadeRadius: Math.max(width, height) * 0.85
        glowAlpha: 0.05
        sparkleEvery: 21
        sparkleAlpha: 0.08
        emphasisEvery: 6
        constellationEvery: 47
        constellationAlpha: 0.22
        // Large feature hex frame at the spotlight center (premium brand frame)
        featureHex: 210
        featureHexAlpha: 0.55
        highlightCells: ["5,2", "6,2", "5,3", "7,3", "6,4"]
        z: Theme.zUnder2
    }

    Flickable {
        anchors.fill: parent
        contentWidth: width
        contentHeight: contentCol.height + 48
        clip: true
        boundsBehavior: Flickable.StopAtBounds
        ScrollBar.vertical: StyledScrollBar { thin: true }

        Column {
            id: contentCol
            x: (parent.width - width) / 2
            y: Math.max(24, (parent.height - height) / 2)
            width: Math.min(440, parent.width - 48)
            spacing: 0

            // ── Brand block: layered hex monogram + wordmark + LIVE chip ──
            Column {
                width: parent.width
                spacing: 16

                // Monogram in a double hex frame (outer faint ring + mark)
                Item {
                    width: 92; height: 92
                    anchors.horizontalCenter: parent.horizontalCenter
                    Hexagon {
                        anchors.centerIn: parent
                        size: 88
                        lineWidth: 1
                        lineColor: Colors.accent15
                    }
                    Hexagon {
                        anchors.centerIn: parent
                        size: 80
                        lineWidth: 1
                        lineColor: Colors.accent30
                    }
                    BrandMark {
                        anchors.centerIn: parent
                        size: 64
                        letter: "LM"
                    }
                }

                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: 10
                    Text {
                        text: Constants.appName
                        color: Colors.textPrimary
                        font.family: Theme.fontHeadline.family
                        font.pixelSize: Theme.fontHeadline.pixelSize
                        font.weight: Font.Bold
                        font.letterSpacing: Theme.trackingDisplay
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    Rectangle {
                        anchors.verticalCenter: parent.verticalCenter
                        height: 20
                        width: liveLab.implicitWidth + 14
                        radius: Theme.radiusFull
                        color: Colors.accent12
                        border.color: Colors.accent30
                        border.width: 1
                        Text {
                            id: liveLab
                            anchors.centerIn: parent
                            text: qsTr("LIVE")
                            color: Colors.accentHover
                            font.pixelSize: 9
                            font.family: Theme.fontMono.family
                            font.weight: Font.Bold
                            font.letterSpacing: 1.35
                        }
                    }
                }

                Text {
                    width: parent.width
                    horizontalAlignment: Text.AlignHCenter
                    text: qsTr("Step into character.\nLive to OBS.")
                    color: Colors.textPrimary
                    font.family: Theme.fontAuthHeadline.family
                    font.pixelSize: Theme.fontAuthHeadline.pixelSize
                    font.weight: Theme.fontAuthHeadline.weight
                    font.letterSpacing: Theme.trackingDisplay
                    wrapMode: Text.WordWrap
                    lineHeight: 1.05
                }

                Text {
                    width: parent.width
                    horizontalAlignment: Text.AlignHCenter
                    text: qsTr("Real-time AI character swap powered by Lucy 2. Bring any character into your stream, for vtubing, gaming, or pure creative play.")
                    color: Colors.textSecondary
                    font.pixelSize: 13
                    wrapMode: Text.WordWrap
                    lineHeight: 1.625
                }
            }

            Item { width: 1; height: 28 }

            // ── Hex-framed card holding the auth flow ────────────────────
            Rectangle {
                width: parent.width
                implicitHeight: cardCol.implicitHeight + 56
                radius: Theme.radiusLg
                color: Colors.surfaceRaised
                border.color: Colors.surfaceBorder
                border.width: 1
                clip: true

                // Honeycomb wash inside the card (small cells, own spotlight)
                Honeycomb {
                    anchors.fill: parent
                    cellSize: Theme.honeycombCell
                    lineColor: Colors.honeycombLineFaint
                    focusX: width / 2
                    focusY: 0
                    fadeRadius: width * 0.9
                    sparkleEvery: 31
                    sparkleAlpha: 0.06
                    opacity: 0.7
                }
                Rectangle {
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    height: 1
                    color: Colors.insetHighlightSoft
                }
                CornerTicks {
                    anchors.fill: parent
                    inset: 10
                    tickSize: 9
                    thickness: 1.5
                    color: Colors.accent40
                }

                ColumnLayout {
                    id: cardCol
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    anchors.margins: 28
                    spacing: 0

                    // Tabs (social | email)
                    SegmentedControl {
                        Layout.fillWidth: true
                        Layout.bottomMargin: 16
                        equalWidths: true
                        model: [
                            { "label": qsTr("Social"), "value": "social" },
                            { "label": qsTr("Email"), "value": "email" }
                        ]
                        currentValue: root.authTab
                        onActivated: (v) => { root.authTab = v }
                    }

                    // ── Social phase ────────────────────────────────────
                    ColumnLayout {
                        visible: root.authTab === "social" && root.phase === "email"
                        Layout.fillWidth: true
                        spacing: 10

                        // Google button: white icon tile + bold label on a bordered card
                        Rectangle {
                            visible: Auth.googleAuthAvailable
                            Layout.fillWidth: true
                            Layout.preferredHeight: 48
                            radius: Theme.radiusMd
                            color: googleMa.containsMouse ? Colors.surfaceHover : Colors.surfaceElevated
                            border.color: googleMa.containsMouse ? Colors.brandGoogleBorder : Colors.surfaceBorder
                            border.width: 1
                            CornerTicks {
                                anchors.fill: parent
                                visible: googleMa.containsMouse
                                inset: 4
                                tickSize: 6
                                thickness: 1
                                color: Colors.brandGoogleBorder
                            }
                            Row {
                                anchors.centerIn: parent
                                spacing: 12
                                Rectangle {
                                    width: 32; height: 32
                                    radius: Theme.radiusSm
                                    color: Colors.white
                                    anchors.verticalCenter: parent.verticalCenter
                                    Text {
                                        anchors.centerIn: parent
                                        text: "G"
                                        color: Colors.brandGoogle
                                        font.pixelSize: 14
                                        font.weight: Font.Bold
                                    }
                                }
                                Text {
                                    text: qsTr("Continue with Google")
                                    color: Colors.textPrimary
                                    font.pixelSize: 13
                                    font.weight: Font.Bold
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

                        // OR CONTINUE WITH divider (hex-bulleted)
                        RowLayout {
                            visible: Auth.googleAuthAvailable
                            Layout.fillWidth: true
                            Layout.topMargin: 4
                            Layout.bottomMargin: 4
                            spacing: 10
                            Rectangle { Layout.fillWidth: true; height: 1; color: Colors.surfaceBorderSubtle }
                            Hexagon {
                                size: 7
                                lineWidth: 0
                                fillColor: Colors.surfaceBorderStrong
                                Layout.alignment: Qt.AlignVCenter
                            }
                            Text {
                                text: qsTr("OR CONTINUE WITH")
                                color: Colors.textMuted
                                font.pixelSize: 10
                                font.family: Theme.fontMono.family
                                font.letterSpacing: 1.35
                            }
                            Hexagon {
                                size: 7
                                lineWidth: 0
                                fillColor: Colors.surfaceBorderStrong
                                Layout.alignment: Qt.AlignVCenter
                            }
                            Rectangle { Layout.fillWidth: true; height: 1; color: Colors.surfaceBorderSubtle }
                        }

                        Text {
                            visible: Auth.googleAuthAvailable
                            Layout.fillWidth: true
                            Layout.topMargin: 6
                            horizontalAlignment: Text.AlignHCenter
                            text: qsTr("More sign-in providers (Twitch, TikTok, Kick) coming soon.")
                            color: Colors.textMuted
                            font.pixelSize: 11
                        }
                    }

                    // ── Email phase ─────────────────────────────────────
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

                        Text {
                            text: qsTr("Works for both new and existing accounts. We'll email you a magic link.")
                            color: Colors.textMuted
                            font.pixelSize: 10
                            wrapMode: Text.WordWrap
                            Layout.fillWidth: true
                        }

                        TextField {
                            id: emailField
                            Layout.fillWidth: true
                            Layout.preferredHeight: 44
                            placeholderText: qsTr("you@example.com")
                            font.family: Theme.fontMono.family
                            font.pixelSize: 13
                            Keys.onReturnPressed: root.sendMagicLink()
                        }

                        Text {
                            visible: Backend.reachableKnown && !Backend.reachable
                            Layout.fillWidth: true
                            Layout.topMargin: 4
                            text: qsTr("Backend offline — set the API URL in Settings to receive codes.")
                            color: Colors.statusWarning
                            font.pixelSize: 11
                            wrapMode: Text.WordWrap
                        }

                        PrimaryButton {
                            Layout.fillWidth: true
                            Layout.preferredHeight: 44
                            text: Auth.isLoading ? qsTr("Sending…") : qsTr("Send Magic Link")
                            busy: Auth.isLoading
                            enabled: !Auth.isLoading && emailField.text.trim().length > 0 && !root.rateLimited
                            onClicked: root.sendMagicLink()
                        }
                    }

                    // ── OTP phase: the code as a row of hex cells ───────
                    ColumnLayout {
                        visible: root.phase === "code"
                        Layout.fillWidth: true
                        spacing: 16

                        Column {
                            Layout.fillWidth: true
                            spacing: 12

                            HexBadge {
                                size: 48
                                iconName: "send"
                                iconSize: 18
                                lineWidth: 1.5
                                lineColor: Colors.statusSuccess30
                                fillColor: Colors.statusSuccessMuted
                                iconColor: Colors.statusSuccess
                                anchors.horizontalCenter: parent.horizontalCenter
                            }

                            Text {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: qsTr("Check your email")
                                color: Colors.textPrimary
                                font.pixelSize: 14
                            }
                            Text {
                                anchors.horizontalCenter: parent.horizontalCenter
                                width: parent.width
                                horizontalAlignment: Text.AlignHCenter
                                text: qsTr("Enter the %1-digit code we sent to %2").arg(root.otpLength).arg(root.pendingEmail)
                                color: Colors.textSecondary
                                font.pixelSize: 12
                                wrapMode: Text.WordWrap
                            }
                        }

                        Row {
                            id: otpRow
                            Layout.alignment: Qt.AlignHCenter
                            Layout.fillWidth: true
                            Layout.maximumWidth: 448
                            spacing: 6
                            Repeater {
                                id: digitRepeater
                                model: root.otpLength
                                Item {
                                    id: digitCell
                                    required property int index
                                    property alias digitField: digitInput
                                    readonly property real cell: Math.max(30, (otpRow.width - (root.otpLength - 1) * otpRow.spacing) / root.otpLength)
                                    width: cell
                                    height: cell * Math.sqrt(3) / 2 + 2

                                    Hexagon {
                                        anchors.centerIn: parent
                                        size: cell
                                        lineWidth: digitInput.activeFocus ? 2 : 1
                                        lineColor: digitInput.activeFocus ? Colors.accent
                                            : (Auth.errorMessage.length > 0 && root.phase === "code" ? Colors.statusError : Colors.surfaceBorder)
                                        fillColor: digitInput.text.length > 0 ? Colors.accent10
                                            : digitInput.activeFocus ? Colors.surfaceFocus
                                            : Colors.surfaceRaised
                                    }

                                    TextInput {
                                        id: digitInput
                                        anchors.fill: parent
                                        horizontalAlignment: Text.AlignHCenter
                                        verticalAlignment: Text.AlignVCenter
                                        color: text.length > 0 ? Colors.accentHover : Colors.textPrimary
                                        font.pixelSize: 18
                                        font.bold: true
                                        font.family: Theme.fontMono.family
                                        maximumLength: 1
                                        inputMethodHints: Qt.ImhDigitsOnly
                                        validator: RegularExpressionValidator { regularExpression: /[0-9]/ }
                                        text: root.digits[index] || ""
                                        onTextChanged: {
                                            if (text.length > 1) {
                                                // pasted multi-digit code — distribute across cells
                                                var cleaned = text.replace(/\D/g, "").slice(0, root.otpLength)
                                                var arr = []
                                                for (var j = 0; j < root.otpLength; j++) arr.push("")
                                                for (var k = 0; k < cleaned.length; k++) arr[k] = cleaned[k]
                                                root.digits = arr
                                                root.otpCode = cleaned
                                                if (cleaned.length === root.otpLength && !Auth.isLoading)
                                                    Qt.callLater(root.verifyCode)
                                                return
                                            }
                                            if (text === (root.digits[index] || "")) return
                                            var arr = root.digits.slice()
                                            arr[index] = text
                                            root.digits = arr
                                            root.otpCode = arr.join("")
                                            if (text.length === 1 && index < root.otpLength - 1) {
                                                const next = digitRepeater.itemAt(index + 1)
                                                if (next && next.digitField)
                                                    next.digitField.forceActiveFocus()
                                            }
                                            if (root.otpCode.length === root.otpLength && !Auth.isLoading)
                                                Qt.callLater(root.verifyCode)
                                        }
                                        Keys.onPressed: (e) => {
                                            if (e.key === Qt.Key_Backspace && text.length === 0 && index > 0) {
                                                const prev = digitRepeater.itemAt(index - 1)
                                                if (prev && prev.digitField)
                                                    prev.digitField.forceActiveFocus()
                                            }
                                            if (e.matches(StandardKey.Paste)) {
                                                e.accepted = true
                                                pasteField.text = ""
                                                pasteField.forceActiveFocus()
                                                pasteField.paste()
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
                            spacing: 8
                            // Resend chip
                            Rectangle {
                                property bool cooling: Math.max(root.resendCooldown, Auth.otpCooldownSecs || 0) > 0
                                height: 28
                                width: resendLbl.implicitWidth + 14
                                radius: Theme.radiusFull
                                color: cooling ? Colors.surfaceElevated : (resendMa.containsMouse ? Colors.accent12 : Colors.accent10)
                                border.width: 1
                                border.color: cooling ? Colors.surfaceBorderSubtle : Colors.accent30
                                Text {
                                    id: resendLbl
                                    anchors.centerIn: parent
                                    text: {
                                        var sec = Math.max(root.resendCooldown, Auth.otpCooldownSecs || 0)
                                        return sec > 0 ? qsTr("RESEND IN %1S").arg(sec) : qsTr("SEND NEW CODE")
                                    }
                                    color: parent.cooling ? Colors.textMuted : Colors.accentHover
                                    font.pixelSize: 9
                                    font.family: Theme.fontMono.family
                                    font.weight: Font.Bold
                                    font.letterSpacing: 1.0
                                }
                                MouseArea {
                                    id: resendMa
                                    anchors.fill: parent
                                    enabled: !parent.cooling && !Auth.isLoading
                                    hoverEnabled: true
                                    cursorShape: enabled ? Qt.PointingHandCursor : Qt.ArrowCursor
                                    onClicked: {
                                        Auth.requestOtp(root.pendingEmail)
                                        root.resendCooldown = Constants.resendCooldownSecs
                                        resendTimer.start()
                                    }
                                }
                            }
                            // Different-email chip
                            Rectangle {
                                height: 28
                                width: diffLbl.implicitWidth + 14
                                radius: Theme.radiusFull
                                color: diffMa.containsMouse ? Colors.overlay50 : Colors.surfaceElevated
                                border.width: 1
                                border.color: diffMa.containsMouse ? Colors.surfaceBorderStrong : Colors.surfaceBorderSubtle
                                Text {
                                    id: diffLbl
                                    anchors.centerIn: parent
                                    text: qsTr("DIFFERENT EMAIL")
                                    color: diffMa.containsMouse ? Colors.textPrimary : Colors.textMuted
                                    font.pixelSize: 9
                                    font.family: Theme.fontMono.family
                                    font.weight: Font.Bold
                                    font.letterSpacing: 1.0
                                }
                                MouseArea {
                                    id: diffMa
                                    anchors.fill: parent
                                    hoverEnabled: true
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: {
                                        root.phase = "email"
                                        root.otpCode = ""
                                        root.digits = (function () {
                                            var a = []
                                            for (var j = 0; j < root.otpLength; j++) a.push("")
                                            return a
                                        })()
                                        Auth.clearError()
                                        Auth.resetOtpFlow()
                                    }
                                }
                            }
                        }

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

                    // Rate limit (live countdown) / error banner
                    Rectangle {
                        visible: root.rateLimited
                        Layout.fillWidth: true
                        Layout.topMargin: 12
                        height: rlRow.implicitHeight + 16
                        radius: Theme.radiusMd
                        color: Colors.errorSoftBg
                        border.color: Colors.statusError30
                        border.width: 1
                        RowLayout {
                            id: rlRow
                            anchors.fill: parent
                            anchors.leftMargin: 10
                            anchors.rightMargin: 10
                            spacing: 8
                            Icon {
                                name: "alert-circle"
                                size: 14
                                color: Colors.statusError
                                Layout.alignment: Qt.AlignTop
                                Layout.topMargin: 2
                            }
                            Text {
                                Layout.fillWidth: true
                                wrapMode: Text.WordWrap
                                text: root.rateLimitSeconds > 0
                                      ? qsTr("Too many login attempts. Try again in %n second.", "Too many login attempts. Try again in %n seconds.", root.rateLimitSeconds)
                                      : qsTr("Too many login attempts. Please wait a few minutes.")
                                color: Colors.statusError
                                font.pixelSize: 11
                            }
                        }
                    }

                    Rectangle {
                        visible: Auth.errorMessage.length > 0 && !root.rateLimited
                        Layout.fillWidth: true
                        Layout.topMargin: 12
                        height: errRow.implicitHeight + 16
                        radius: Theme.radiusMd
                        color: Colors.errorSoftBg
                        border.color: Colors.statusError30
                        border.width: 1
                        RowLayout {
                            id: errRow
                            anchors.fill: parent
                            anchors.leftMargin: 10
                            anchors.rightMargin: 10
                            spacing: 8
                            Icon {
                                name: "alert-circle"
                                size: 14
                                color: Colors.statusError
                                Layout.alignment: Qt.AlignTop
                                Layout.topMargin: 2
                            }
                            Text {
                                Layout.fillWidth: true
                                wrapMode: Text.WordWrap
                                text: Auth.errorMessage
                                color: Colors.statusError
                                font.pixelSize: 11
                            }
                        }
                    }
                }
            }

            Item { width: 1; height: 20 }

            // ── Footer: terms + builder ──────────────────────────────
            Text {
                width: parent.width
                color: Colors.textMuted
                font.pixelSize: 10
                wrapMode: Text.WordWrap
                horizontalAlignment: Text.AlignHCenter
                text: qsTr("By continuing, you agree to our ") +
                      "<a href=\"" + Constants.urlTerms + "\" style=\"color:" + Colors.accent85 + ";text-decoration:none\">" + qsTr("Terms of Service") + "</a>, " +
                      "<a href=\"" + Constants.urlPrivacy + "\" style=\"color:" + Colors.accent85 + ";text-decoration:none\">" + qsTr("Privacy Policy") + "</a>, " +
                      qsTr("and ") +
                      "<a href=\"" + Constants.urlAup + "\" style=\"color:" + Colors.accent85 + ";text-decoration:none\">" + qsTr("Acceptable Use Policy") + "</a>."
                onLinkActivated: function(link) { Qt.openUrlExternally(link) }
            }

            RowLayout {
                width: parent.width
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
        if (!Auth.isValidEmail(email)) {
            App.notify(qsTr("Please enter a valid email address."), "error")
            return
        }
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

    Component.onCompleted: {
        // The lockout flag lives on Auth and can already be set when this
        // screen mounts — Connections only fires on CHANGE, so sync once here.
        root.rateLimited = Auth.rateLimited
        root.rateLimitSeconds = Auth.rateLimitSecs
        if (Auth.rateLimited) rateLimitTimer.start()
    }

    Connections {
        target: Auth
        function onGoogleOAuthStarted(url) {
            App.notify(qsTr("Complete Google sign-in in your browser"), "info")
        }
        function onOtpRequested(email) {
            root.pendingEmail = email
            root.phase = "code"
            root.resendCooldown = Constants.resendCooldownSecs
            resendTimer.start()
            var n = root.otpLength
            var arr = []
            for (var i = 0; i < n; i++) arr.push("")
            root.digits = arr
            root.otpCode = ""
            Qt.callLater(function() {
                var first = digitRepeater.count > 0 ? digitRepeater.itemAt(0) : null
                if (first && first.digitField)
                    first.digitField.forceActiveFocus()
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
            // Don't wipe the entered digits on every error — let the user
            // correct a typo. (The backend rejects wrong codes with an error.)
        }
    }

    NotificationToastHost {
        id: toastHost
        z: Theme.zToast
        pageChrome: false
    }
}
