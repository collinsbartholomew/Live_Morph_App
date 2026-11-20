import QtQuick
import QtQuick.Controls
import QtQuick.Controls as Controls
import QtQuick.Layouts
import LiveMorph

Item {
    id: root
    anchors.fill: parent

    property string phase: "email"
    property string authTab: "email"
    property bool usePassword: false
    property bool passwordVisible: false
    property string pendingEmail: ""
    property int resendCooldown: 0
    property alias otpCode: otpInput.text
    readonly property int otpLength: Auth.otpCodeLength > 0 ? Auth.otpCodeLength : Constants.otpLength
    readonly property int minCodeLength: root.otpLength
    property bool rateLimited: false
    property int rateLimitSeconds: 0
    property string fieldError: ""
    property string resetFeedback: ""
    property bool resetInFlight: false
    readonly property bool showHero: width >= 940
    readonly property int heroWidth: showHero ? Math.max(390, width * 0.44) : 0

    function submitEmail() {
        if (Auth.isLoading || root.rateLimited)
            return
        root.fieldError = ""
        root.resetFeedback = ""
        if (root.usePassword)
            root.signInWithPassword()
        else
            root.sendMagicLink()
    }

    function sendMagicLink() {
        if (Auth.isLoading || root.rateLimited)
            return
        var email = emailField.text.trim()
        if (!Auth.isValidEmail(email)) {
            root.fieldError = qsTr("Enter a valid email address to continue.")
            emailField.forceActiveFocus()
            return
        }
        root.fieldError = ""
        Auth.requestOtp(email)
    }

    function signInWithPassword() {
        if (Auth.isLoading || root.rateLimited)
            return
        var email = emailField.text.trim()
        if (!Auth.isValidEmail(email)) {
            root.fieldError = qsTr("Enter a valid email address to continue.")
            emailField.forceActiveFocus()
            return
        }
        if (passwordField.text.length < 8) {
            root.fieldError = qsTr("Password must be at least 8 characters.")
            passwordField.forceActiveFocus()
            return
        }
        root.fieldError = ""
        Auth.signInWithEmail(email, passwordField.text)
    }

    function forgotPassword() {
        if (Auth.isLoading || root.rateLimited)
            return
        var email = emailField.text.trim()
        if (!Auth.isValidEmail(email)) {
            root.fieldError = qsTr("Enter your account email first, then request a reset.")
            emailField.forceActiveFocus()
            return
        }
        root.fieldError = ""
        root.resetFeedback = ""
        root.resetInFlight = true
        Auth.requestPasswordReset(email)
    }

    function verifyCode() {
        if (Auth.isLoading || root.otpCode.length < root.minCodeLength || root.rateLimited)
            return
        var email = (root.pendingEmail || Auth.pendingEmail || "").trim()
        if (!email) {
            root.phase = "email"
            root.authTab = "email"
            root.fieldError = qsTr("Your email is missing. Enter it again to request a new code.")
            return
        }
        Auth.verifyOtp(email, root.otpCode)
    }

    function returnToEmail() {
        root.phase = "email"
        root.authTab = "email"
        root.otpCode = ""
        root.fieldError = ""
        Auth.clearError()
        Auth.resetOtpFlow()
        Qt.callLater(emailField.forceActiveFocus)
    }

    Rectangle {
        anchors.fill: parent
        color: Colors.surfaceBase
    }

    Item {
        id: hero
        anchors.left: parent.left
        anchors.top: parent.top
        anchors.bottom: parent.bottom
        width: root.heroWidth
        visible: root.showHero
        clip: true

        Rectangle {
            anchors.fill: parent
            color: Colors.surfaceRaised
        }

        Honeycomb {
            anchors.fill: parent
            cellSize: Theme.honeycombCellLg
            cellSize2: Theme.honeycombCellLg * 3
            cellSize2Alpha: 0.32
            lineColor: Colors.honeycombOnBlack
            focusX: width * 0.62
            focusY: height * 0.62
            fadeRadius: Math.max(width, height) * 0.8
            sparkleEvery: 19
            sparkleAlpha: 0.08
            emphasisEvery: 6
            constellationEvery: 41
            constellationAlpha: 0.22
            depthEvery: 13
            circuitEvery: 17
        }

        Rectangle {
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            width: 1
            color: Colors.surfaceBorder
        }

        Row {
            anchors.left: parent.left
            anchors.top: parent.top
            anchors.margins: 32
            spacing: Theme.spacingMd
            BrandMark {
                size: 30
                letter: "LM"
                anchors.verticalCenter: parent.verticalCenter
            }
            Text {
                text: Constants.appName.toUpperCase()
                color: Colors.textPrimary
                font.family: Theme.fontTitle.family
                font.pixelSize: Theme.fontTitle.pixelSize
                font.weight: Font.Bold
                font.letterSpacing: 0.5
                anchors.verticalCenter: parent.verticalCenter
            }
            Rectangle {
                width: liveText.implicitWidth + 12
                height: 22
                color: Colors.accent
                radius: Theme.radiusXs
                anchors.verticalCenter: parent.verticalCenter
                Text {
                    id: liveText
                    anchors.centerIn: parent
                    text: qsTr("LIVE")
                    color: Colors.textOnAccent
                    font.family: Theme.fontMicro.family; font.pixelSize: Theme.fontMicro.pixelSize
                    font.weight: Font.Bold
                    font.letterSpacing: 1
                }
            }
        }

        Column {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.leftMargin: 32
            anchors.rightMargin: 32
            anchors.topMargin: Math.max(100, hero.height * 0.16)
            spacing: Theme.spacingLg

            Text {
                text: qsTr("REAL-TIME CHARACTER ENGINE")
                color: Colors.textMuted
                font.family: Theme.fontLabel.family; font.pixelSize: Theme.fontLabel.pixelSize; font.weight: Theme.fontLabel.weight
                font.letterSpacing: 1.4
            }

            Text {
                width: parent.width
                text: qsTr("Your face.\nAny universe.")
                color: Colors.textPrimary
                font.family: Theme.fontAuthHeadline.family
                font.pixelSize: hero.width < 460 ? 38 : Theme.fontAuthHeadline.pixelSize
                font.weight: Font.Bold
                font.letterSpacing: -1.2
                lineHeight: 1.02
                wrapMode: Text.WordWrap
            }

            Text {
                width: Math.min(parent.width, 400)
                text: qsTr("A live AI character studio for streams, scenes, and every reality you can imagine.")
                color: Colors.textSecondary
                font.family: Theme.fontUi.family; font.pixelSize: Theme.fontUi.pixelSize
                lineHeight: 1.45
                wrapMode: Text.WordWrap
            }
        }

        HexSculpture {
            anchors.horizontalCenter: parent.horizontalCenter
            anchors.horizontalCenterOffset: parent.width * 0.08
            anchors.bottom: parent.bottom
            anchors.bottomMargin: Math.max(92, parent.height * 0.12)
            size: Math.min(parent.width * 0.7, parent.height * 0.38, 300)
            illuminated: true
        }

        RowLayout {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.bottom: parent.bottom
            anchors.margins: 32
            spacing: Theme.spacingLg
            Repeater {
                model: [
                    { value: qsTr("P2P"), label: qsTr("MEDIA") },
                    { value: qsTr("30"), label: qsTr("FPS HD") },
                    { value: qsTr("OBS"), label: qsTr("READY") }
                ]
                delegate: Column {
                    required property var modelData
                    Layout.fillWidth: true
                    spacing: 2
                    Text {
                        text: modelData.value
                        color: Colors.textPrimary
                        font: Theme.fontTitle
                    }
                    Text {
                        text: modelData.label
                        color: Colors.textMuted
                        font.family: Theme.fontMicro.family; font.pixelSize: Theme.fontMicro.pixelSize
                        font.letterSpacing: 1
                    }
                }
            }
        }
    }

    Item {
        id: accessPane
        anchors.left: hero.right
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.bottom: parent.bottom

        Rectangle {
            anchors.fill: parent
            color: Colors.surfaceBase
        }

        Honeycomb {
            visible: !root.showHero
            anchors.fill: parent
            cellSize: Theme.honeycombCellLg
            lineColor: Colors.honeycombLineFaint
            focusX: width / 2
            focusY: height * 0.3
            fadeRadius: Math.max(width, height) * 0.7
            depthEvery: 19
            opacity: 0.55
        }

        Flickable {
            anchors.fill: parent
            contentWidth: width
            contentHeight: accessColumn.height + 48
            clip: true
            boundsBehavior: Flickable.StopAtBounds
            ScrollBar.vertical: StyledScrollBar { thin: true }

            Column {
                id: accessColumn
                x: (parent.width - width) / 2
                y: Math.max(24, (parent.height - height) / 2)
                width: Math.min(432, parent.width - 48)
                spacing: Theme.spacingXl

                Row {
                    visible: !root.showHero
                    spacing: Theme.spacingMd
                    BrandMark { size: 32; letter: "LM" }
                    Text {
                        text: Constants.appName
                        color: Colors.textPrimary
                        font: Theme.fontHeading
                        anchors.verticalCenter: parent.verticalCenter
                    }
                }

                Column {
                    width: parent.width
                    spacing: Theme.spacingSm
                    Text {
                        text: root.phase === "code" ? qsTr("VERIFICATION / 02") : qsTr("SECURE ACCESS / 01")
                        color: Colors.textMuted
                        font.family: Theme.fontLabel.family; font.pixelSize: Theme.fontLabel.pixelSize; font.weight: Theme.fontLabel.weight
                        font.letterSpacing: 1.4
                    }
                    Text {
                        width: parent.width
                        text: root.phase === "code" ? qsTr("Verify it's you") : qsTr("Enter the studio")
                        color: Colors.textPrimary
                        font.family: Theme.fontHeadline.family; font.pixelSize: Theme.fontHeadline.pixelSize; font.weight: Theme.fontHeadline.weight
                        font.letterSpacing: -0.8
                        wrapMode: Text.WordWrap
                    }
                    Text {
                        width: parent.width
                        text: root.phase === "code"
                              ? qsTr("Your account is one code away from the stage.")
                              : qsTr("Sign in to create, stream, and save your character library.")
                        color: Colors.textSecondary
                        font.family: Theme.fontUi.family; font.pixelSize: Theme.fontUi.pixelSize
                        lineHeight: 1.4
                        wrapMode: Text.WordWrap
                    }
                }

                Rectangle {
                    width: parent.width
                    height: formColumn.implicitHeight + 48
                    color: Colors.surfaceRaised
                    border.color: Colors.surfaceBorder
                    border.width: 1
                    radius: Theme.radiusLg

                    Rectangle {
                        anchors.left: parent.left
                        anchors.top: parent.top
                        width: 72
                        height: 2
                        color: Colors.accent
                    }

                    CornerTicks {
                        anchors.fill: parent
                        inset: 8
                        tickSize: 8
                        thickness: 1
                        color: Colors.accent30
                    }

                    ColumnLayout {
                        id: formColumn
                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.top: parent.top
                        anchors.margins: 24
                        spacing: Theme.spacingLg

                        SegmentedControl {
                            visible: root.phase === "email"
                            Layout.fillWidth: true
                            equalWidths: true
                            model: Auth.googleAuthAvailable
                                   ? [
                                       { label: qsTr("Email"), value: "email" },
                                       { label: qsTr("Social"), value: "social" }
                                     ]
                                   : [{ label: qsTr("Email"), value: "email" }]
                            currentValue: root.authTab
                            onActivated: function(value) {
                                root.authTab = value
                                root.fieldError = ""
                                Auth.clearError()
                            }
                        }

                        RowLayout {
                            visible: root.phase === "code"
                            Layout.fillWidth: true
                            spacing: Theme.spacingMd
                            IconButton {
                                name: "chevron-left"
                                accessibleName: qsTr("Use a different email")
                                onClicked: root.returnToEmail()
                            }
                            Column {
                                Layout.fillWidth: true
                                spacing: 2
                                Text {
                                    text: qsTr("CODE DELIVERED")
                                    color: Colors.textPrimary
                                    font.family: Theme.fontLabel.family; font.pixelSize: Theme.fontLabel.pixelSize; font.weight: Theme.fontLabel.weight
                                }
                                Text {
                                    width: parent.width
                                    text: root.pendingEmail || Auth.pendingEmail
                                    color: Colors.textMuted
                                    font.family: Theme.fontSmall.family; font.pixelSize: Theme.fontSmall.pixelSize
                                    elide: Text.ElideMiddle
                                }
                            }
                            HexBadge {
                                size: 34
                                iconName: "mail"
                                iconSize: 16
                                lineColor: Colors.accent30
                                fillColor: Colors.accent10
                                iconColor: Colors.accent
                            }
                        }

                        ColumnLayout {
                            visible: root.phase === "email" && root.authTab === "social"
                            Layout.fillWidth: true
                            spacing: Theme.spacingLg

                            Text {
                                Layout.fillWidth: true
                                text: qsTr("Use your existing account. LiveMorph never sees your provider password.")
                                color: Colors.textSecondary
                                font.family: Theme.fontSmall.family; font.pixelSize: Theme.fontSmall.pixelSize
                                wrapMode: Text.WordWrap
                                lineHeight: 1.4
                            }

                            Controls.Button {
                                id: googleButton
                                text: qsTr("Continue with Google")
                                Layout.fillWidth: true
                                implicitHeight: 48
                                enabled: !Auth.isLoading && Auth.googleAuthAvailable
                                hoverEnabled: true
                                onClicked: Auth.signInWithGoogle()
                                background: Rectangle {
                                    color: !googleButton.enabled ? Colors.surfaceElevated
                                         : googleButton.hovered ? Colors.surfaceHover : Colors.surfaceElevated
                                    border.color: googleButton.hovered || googleButton.activeFocus ? Colors.accent : Colors.surfaceBorder
                                    border.width: 1
                                    radius: Theme.radiusMd
                                    FocusRing { shown: googleButton.activeFocus; ringRadius: Theme.radiusMd }
                                }
                                contentItem: RowLayout {
                                    spacing: Theme.spacingMd
                                    Rectangle {
                                        width: 30
                                        height: 30
                                        color: Colors.white
                                        radius: Theme.radiusSm
                                        Layout.alignment: Qt.AlignVCenter
                                        Text {
                                            anchors.centerIn: parent
                                            text: "G"
                                            color: Colors.brandGoogle
                                            font: Theme.fontTitle
                                        }
                                    }
                                    Text {
                                        text: googleButton.text
                                        color: Colors.textPrimary
                                        font.family: Theme.fontUi.family; font.pixelSize: Theme.fontUi.pixelSize
                                        font.weight: Font.Bold
                                        horizontalAlignment: Text.AlignHCenter
                                        elide: Text.ElideRight
                                        Layout.fillWidth: true
                                    }
                                }
                            }

                            Text {
                                Layout.fillWidth: true
                                text: qsTr("More providers are being added. Email sign-in is always available.")
                                color: Colors.textMuted
                                font.family: Theme.fontSmall.family; font.pixelSize: Theme.fontSmall.pixelSize
                                wrapMode: Text.WordWrap
                            }
                        }

                        ColumnLayout {
                            visible: root.phase === "email" && root.authTab === "email"
                            Layout.fillWidth: true
                            spacing: Theme.spacingMd

                            ColumnLayout {
                                Layout.fillWidth: true
                                spacing: Theme.spacingSm
                                Text {
                                    text: qsTr("EMAIL ADDRESS")
                                    color: Colors.textMuted
                                    font.family: Theme.fontLabel.family; font.pixelSize: Theme.fontLabel.pixelSize; font.weight: Theme.fontLabel.weight
                                    font.letterSpacing: 1
                                }
                                TextField {
                                    id: emailField
                                    Layout.fillWidth: true
                                    Layout.preferredHeight: 48
                                    placeholderText: qsTr("you@example.com")
                                    inputMethodHints: Qt.ImhEmailCharactersOnly | Qt.ImhNoPredictiveText
                                    Accessible.name: qsTr("Email address")
                                    Keys.onReturnPressed: root.submitEmail()
                                    onTextChanged: {
                                        root.fieldError = ""
                                        root.resetFeedback = ""
                                    }
                                }
                            }

                            ColumnLayout {
                                visible: root.usePassword
                                Layout.fillWidth: true
                                spacing: Theme.spacingSm
                                Text {
                                    text: qsTr("PASSWORD")
                                    color: Colors.textMuted
                                    font.family: Theme.fontLabel.family; font.pixelSize: Theme.fontLabel.pixelSize; font.weight: Theme.fontLabel.weight
                                    font.letterSpacing: 1
                                }
                                TextField {
                                    id: passwordField
                                    Layout.fillWidth: true
                                    Layout.preferredHeight: 48
                                    echoMode: root.passwordVisible ? TextInput.Normal : TextInput.Password
                                    placeholderText: qsTr("At least 8 characters")
                                    rightPadding: 48
                                    Accessible.name: qsTr("Password")
                                    Keys.onReturnPressed: root.submitEmail()
                                    onTextChanged: root.fieldError = ""
                                    IconButton {
                                        anchors.right: parent.right
                                        anchors.rightMargin: 6
                                        anchors.verticalCenter: parent.verticalCenter
                                        name: root.passwordVisible ? "eye-off" : "eye"
                                        accessibleName: root.passwordVisible ? qsTr("Hide password") : qsTr("Show password")
                                        iconSize: Theme.iconSm
                                        onClicked: root.passwordVisible = !root.passwordVisible
                                    }
                                }
                            }

                            Text {
                                visible: !root.usePassword
                                Layout.fillWidth: true
                                text: qsTr("New and existing accounts use the same secure email code. No password required.")
                                color: Colors.textMuted
                                font.family: Theme.fontSmall.family; font.pixelSize: Theme.fontSmall.pixelSize
                                wrapMode: Text.WordWrap
                                lineHeight: 1.35
                            }

                            PrimaryButton {
                                Layout.fillWidth: true
                                Layout.preferredHeight: 48
                                iconName: "arrow-right"
                                text: Auth.isLoading && !root.resetInFlight
                                      ? qsTr("Please wait") : root.usePassword
                                      ? qsTr("Sign in to LiveMorph") : qsTr("Send secure sign-in code")
                                busy: Auth.isLoading && !root.resetInFlight
                                enabled: !Auth.isLoading && !root.rateLimited
                                         && emailField.text.trim().length > 0
                                         && (!root.usePassword || passwordField.text.length >= 8)
                                onClicked: root.submitEmail()
                            }

                            RowLayout {
                                Layout.fillWidth: true
                                spacing: Theme.spacingSm
                                GhostButton {
                                    Layout.fillWidth: true
                                    text: root.usePassword ? qsTr("Use email code instead") : qsTr("Use password instead")
                                    onClicked: {
                                        root.usePassword = !root.usePassword
                                        root.fieldError = ""
                                        root.resetFeedback = ""
                                        Auth.clearError()
                                    }
                                }
                                GhostButton {
                                    visible: root.usePassword
                                    Layout.fillWidth: true
                                    text: root.resetInFlight ? qsTr("Sending reset") : qsTr("Forgot password?")
                                    enabled: !root.resetInFlight && !root.rateLimited
                                    onClicked: root.forgotPassword()
                                }
                            }

                            Text {
                                visible: root.resetFeedback.length > 0
                                Layout.fillWidth: true
                                text: root.resetFeedback
                                color: Colors.statusSuccess
                                font.family: Theme.fontSmall.family; font.pixelSize: Theme.fontSmall.pixelSize
                                wrapMode: Text.WordWrap
                            }
                        }

                        ColumnLayout {
                            visible: root.phase === "code"
                            Layout.fillWidth: true
                            spacing: Theme.spacingLg

                            Text {
                                Layout.fillWidth: true
                                text: qsTr("Enter the %1-digit code from your email. The sign-in link also works.").arg(root.otpLength)
                                color: Colors.textSecondary
                                font.family: Theme.fontSmall.family; font.pixelSize: Theme.fontSmall.pixelSize
                                wrapMode: Text.WordWrap
                                lineHeight: 1.4
                            }

                            Item {
                                id: otpRow
                                Layout.fillWidth: true
                                implicitHeight: otpCells.height
                                readonly property real cellWidth: Math.min(44, (width - (root.otpLength - 1) * 6) / root.otpLength)

                                Row {
                                    id: otpCells
                                    width: parent.width
                                    spacing: 6
                                    Repeater {
                                        model: root.otpLength
                                        delegate: Item {
                                            required property int index
                                            width: otpRow.cellWidth
                                            height: width * 0.9 + 12
                                            Hexagon {
                                                anchors.centerIn: parent
                                                size: Math.floor(width)
                                                lineWidth: otpInput.activeFocus && root.otpCode.length === index ? 2 : 1
                                                lineColor: Auth.errorMessage.length > 0 ? Colors.statusError
                                                         : root.otpCode.length > index ? Colors.accent
                                                         : otpInput.activeFocus && root.otpCode.length === index ? Colors.accent
                                                         : Colors.surfaceBorderStrong
                                                fillColor: root.otpCode.length > index ? Colors.accent10 : Colors.surfaceBase
                                            }
                                            Text {
                                                anchors.centerIn: parent
                                                text: root.otpCode.charAt(index)
                                                color: Colors.textPrimary
                                                font.family: Theme.fontMono.family
                                                font.pixelSize: Math.min(22, Math.max(14, parent.width * 0.46))
                                                font.weight: Font.Bold
                                            }
                                        }
                                    }
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.IBeamCursor
                                    onClicked: {
                                        otpInput.forceActiveFocus()
                                        otpInput.cursorPosition = otpInput.text.length
                                    }
                                }

                                TextInput {
                                    id: otpInput
                                    width: 1
                                    height: 1
                                    opacity: 0
                                    activeFocusOnTab: true
                                    maximumLength: root.otpLength
                                    inputMethodHints: Qt.ImhDigitsOnly | Qt.ImhNoPredictiveText
                                    validator: RegularExpressionValidator { regularExpression: /[0-9]*/ }
                                    Accessible.role: Accessible.EditableText
                                    Accessible.name: qsTr("%1-digit email verification code").arg(root.otpLength)
                                    onTextChanged: {
                                        Auth.clearError()
                                        if (text.length === root.otpLength && !Auth.isLoading)
                                            Qt.callLater(root.verifyCode)
                                    }
                                    Keys.onReturnPressed: root.verifyCode()
                                }
                            }

                            PrimaryButton {
                                Layout.fillWidth: true
                                Layout.preferredHeight: 48
                                text: Auth.isLoading ? qsTr("Verifying") : qsTr("Verify and enter the studio")
                                busy: Auth.isLoading
                                enabled: !Auth.isLoading && root.otpCode.length === root.minCodeLength && !root.rateLimited
                                onClicked: root.verifyCode()
                            }

                            RowLayout {
                                Layout.fillWidth: true
                                spacing: Theme.spacingSm
                                GhostButton {
                                    Layout.fillWidth: true
                                    text: {
                                        var seconds = Math.max(root.resendCooldown, Auth.otpCooldownSecs || 0)
                                        return seconds > 0 ? qsTr("New code in %1s").arg(seconds) : qsTr("Send a new code")
                                    }
                                    enabled: Math.max(root.resendCooldown, Auth.otpCooldownSecs || 0) === 0
                                             && !Auth.isLoading && !root.rateLimited
                                    onClicked: Auth.requestOtp(root.pendingEmail || Auth.pendingEmail)
                                }
                                GhostButton {
                                    Layout.fillWidth: true
                                    text: qsTr("Different email")
                                    onClicked: root.returnToEmail()
                                }
                            }
                        }

                        Rectangle {
                            visible: root.rateLimited
                            Layout.fillWidth: true
                            implicitHeight: rateText.implicitHeight + 20
                            color: Colors.errorFaintBg
                            border.color: Colors.errorFaintBorder
                            border.width: 1
                            radius: Theme.radiusMd
                            Text {
                                id: rateText
                                anchors.fill: parent
                                anchors.margins: 10
                                text: root.rateLimitSeconds > 0
                                      ? qsTr("Too many attempts. Try again in %n second.", "Too many attempts. Try again in %n seconds.", root.rateLimitSeconds)
                                      : qsTr("Too many attempts. Wait a few minutes and try again.")
                                color: Colors.statusError
                                font.family: Theme.fontSmall.family; font.pixelSize: Theme.fontSmall.pixelSize
                                wrapMode: Text.WordWrap
                                verticalAlignment: Text.AlignVCenter
                            }
                        }

                        Rectangle {
                            visible: Auth.errorMessage.length > 0 && !root.rateLimited
                            Layout.fillWidth: true
                            implicitHeight: serverError.implicitHeight + 20
                            color: Colors.errorFaintBg
                            border.color: Colors.errorFaintBorder
                            border.width: 1
                            radius: Theme.radiusMd
                            Text {
                                id: serverError
                                anchors.fill: parent
                                anchors.margins: 10
                                text: Auth.errorMessage
                                textFormat: Text.PlainText
                                color: Colors.statusError
                                font.family: Theme.fontSmall.family; font.pixelSize: Theme.fontSmall.pixelSize
                                wrapMode: Text.WordWrap
                                verticalAlignment: Text.AlignVCenter
                            }
                        }

                        Rectangle {
                            visible: root.fieldError.length > 0
                            Layout.fillWidth: true
                            implicitHeight: fieldErrorText.implicitHeight + 16
                            color: Colors.statusError10
                            border.color: Colors.statusError30
                            border.width: 1
                            radius: Theme.radiusMd
                            Text {
                                id: fieldErrorText
                                anchors.fill: parent
                                anchors.margins: 8
                                text: root.fieldError
                                color: Colors.statusError
                                font.family: Theme.fontSmall.family; font.pixelSize: Theme.fontSmall.pixelSize
                                wrapMode: Text.WordWrap
                                verticalAlignment: Text.AlignVCenter
                            }
                        }

                        Text {
                            visible: Backend.reachableKnown && !Backend.reachable
                            Layout.fillWidth: true
                            text: qsTr("The LiveMorph service is offline. Check your connection or API address in Settings.")
                            color: Colors.statusWarning
                            font.family: Theme.fontSmall.family; font.pixelSize: Theme.fontSmall.pixelSize
                            wrapMode: Text.WordWrap
                        }
                    }
                }

                Column {
                    width: parent.width
                    spacing: Theme.spacingSm
                    Text {
                        width: parent.width
                        text: qsTr("By continuing, you agree to the LiveMorph policies.")
                        color: Colors.textMuted
                        font.family: Theme.fontSmall.family; font.pixelSize: Theme.fontSmall.pixelSize
                        wrapMode: Text.WordWrap
                    }
                    Flow {
                        width: parent.width
                        spacing: 4
                        Repeater {
                            model: [
                                { label: qsTr("Terms"), url: Constants.urlTerms },
                                { label: qsTr("Privacy"), url: Constants.urlPrivacy },
                                { label: qsTr("Acceptable use"), url: Constants.urlAup }
                            ]
                            delegate: Text {
                                required property var modelData
                                text: modelData.label
                                color: policyMa.containsMouse || activeFocus ? Colors.textPrimary : Colors.textSecondary
                                font.family: Theme.fontSmall.family; font.pixelSize: Theme.fontSmall.pixelSize
                                font.underline: true
                                activeFocusOnTab: true
                                Accessible.role: Accessible.Link
                                Accessible.name: modelData.label
                                Keys.onReturnPressed: policyMa.openLink()
                                Keys.onSpacePressed: policyMa.openLink()
                                MouseArea {
                                    id: policyMa
                                    anchors.fill: parent
                                    anchors.margins: -6
                                    hoverEnabled: true
                                    cursorShape: Qt.PointingHandCursor
                                    function openLink() {
                                        if (String(modelData.url).startsWith("https://"))
                                            Qt.openUrlExternally(modelData.url)
                                    }
                                    onClicked: openLink()
                                }
                            }
                        }
                    }
                }

                RowLayout {
                    width: parent.width
                    BrandingFooter { Layout.fillWidth: true }
                    Text {
                        text: "v" + App.appVersion
                        color: Colors.textMuted
                        font: Theme.fontMonoTiny
                    }
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
            if (root.resendCooldown === 0)
                stop()
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

    Component.onCompleted: {
        root.rateLimited = Auth.rateLimited
        root.rateLimitSeconds = Auth.rateLimitSecs
        if (Auth.rateLimited)
            rateLimitTimer.start()
        if (!Auth.googleAuthAvailable)
            root.authTab = "email"
    }

    Connections {
        target: Auth
        function onGoogleAvailableChanged() {
            if (!Auth.googleAuthAvailable)
                root.authTab = "email"
        }
        function onGoogleOAuthStarted(url) {
            App.notify(qsTr("Complete Google sign-in in your browser"), "info")
        }
        function onOtpRequested(email) {
            root.pendingEmail = email
            root.phase = "code"
            root.authTab = "email"
            root.otpCode = ""
            root.resendCooldown = Constants.resendCooldownSecs
            resendTimer.restart()
            Qt.callLater(otpInput.forceActiveFocus)
        }
        function onPasswordResetRequested() {
            root.resetInFlight = false
            root.resetFeedback = qsTr("Reset instructions were sent to %1. Check your inbox.").arg(emailField.text.trim())
        }
        function onSignedIn() {
            root.phase = "email"
            root.otpCode = ""
        }
        function onRateLimitedChanged() {
            root.rateLimited = Auth.rateLimited
            root.rateLimitSeconds = Auth.rateLimitSecs
            if (Auth.rateLimited)
                rateLimitTimer.restart()
        }
        function onErrorMessageChanged() {
            root.resetInFlight = false
        }
    }

    NotificationToastHost {
        z: Theme.zToast
        pageChrome: false
    }
}
