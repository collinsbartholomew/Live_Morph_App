import Qt5Compat.GraphicalEffects
import LiveEscape
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

Item {
    id: root

    property int mode: 0
    property string fieldError: ""
    property bool resetRequested: false

    onModeChanged: fieldError = ""

    // Deep-link reset token → jump straight to the reset form (Electron
    // showResetPassword(token) parity).
    Connections {
        target: App
        function onPendingResetTokenChanged() {
            if (App.pendingResetToken.length > 0) {
                root.mode = 3;
                root.fieldError = "";
            }
        }
        // Reset accepted server-side → back to the login form (Electron
        // doResetPassword success path calls showLoginForm()).
        function onPasswordResetCompleted() {
            if (root.mode === 3) {
                root.mode = 0;
                root.resetRequested = false;
                root.fieldError = "";
            }
        }
    }

    Rectangle {
        anchors.fill: parent
        gradient: Gradient {
            GradientStop { position: 0; color: Qt.rgba(232/255, 197/255, 71/255, 0.08) }
            GradientStop { position: 0.6; color: Theme.bg }
            GradientStop { position: 1; color: Theme.bg }
        }
    }

    // Radial gradient overlay to match Electron's radial-gradient(ellipse at 50% -10%, ...)
    Rectangle {
        anchors.fill: parent
        gradient: Gradient {
            orientation: Gradient.Vertical
            GradientStop { position: 0; color: Qt.rgba(232/255, 197/255, 71/255, 0.06) }
            GradientStop { position: 0.3; color: "transparent" }
        }
    }

    RowLayout {
        anchors.fill: parent
        spacing: 0

        // Left panel - Auth form (42% width, max 560px, min 420px)
        Item {
            Layout.fillWidth: true
            Layout.maximumWidth: 560
            Layout.minimumWidth: 420
            Layout.preferredWidth: Math.min(parent.width * 0.42, 560)

            ColumnLayout {
                anchors.fill: parent
                spacing: 0

                // Header
                Rectangle {
                    Layout.fillWidth: true
                    Layout.preferredHeight: 70
                    color: "transparent"

                    Row {
                        anchors.verticalCenter: parent.verticalCenter
                        anchors.left: parent.left
                        anchors.leftMargin: 40
                        spacing: 10

                        Image {
                            source: "../../icons/icon.png"
                            width: 28; height: 28
                        }
                        Text {
                            text: "Live Escape"
                            color: Theme.text
                            font.family: Theme.fontSans
                            font.pixelSize: 22
                            font.bold: true
                        }
                        Rectangle {
                            width: 44; height: 20
                            radius: 10
                            color: Theme.gold
                            Text {
                                anchors.centerIn: parent
                                text: "Live"
                                color: Theme.bg
                                font.family: Theme.fontMono
                                font.pixelSize: 9
                                font.bold: true
                                font.letterSpacing: 1.5
                            }
                        }
                    }
                }

                Layout.fillHeight: true

                // Auth form card
                Rectangle {
                    id: card
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    Layout.alignment: Qt.AlignVCenter
                    Layout.margins: 40
                    radius: 14
                    color: Theme.s1
                    border.color: Theme.goldD
                    border.width: 1

                    // Gold glow shadow matching Electron box-shadow: 0 0 100px rgba(232,197,71,.06)
                    Rectangle {
                        anchors.fill: parent
                        anchors.margins: -20
                        radius: parent.radius + 20
                        color: "transparent"
                        border.width: 1
                        border.color: "transparent"
                        z: -2
                        layer.enabled: true
                        layer.effect: DropShadow {
                            horizontalOffset: 0
                            verticalOffset: 0
                            radius: 50
                            samples: 50
                            color: Qt.rgba(232/255, 197/255, 71/255, 0.06)
                            transparentBorder: true
                        }
                    }

                    Rectangle {
                        anchors.fill: parent
                        anchors.margins: -44
                        radius: parent.radius + 44
                        color: "transparent"
                        border.width: 1
                        border.color: Theme.gold
                        opacity: 0.06
                        z: -1
                    }

                    Column {
                        id: col
                        anchors.fill: parent
                        anchors.margins: 40
                        spacing: 20

                        // Logo
                        Item {
                            width: parent.width
                            height: logoAuth.implicitHeight
                            Layout.alignment: Qt.AlignHCenter

                            LogoMark {
                                id: logoAuth
                                anchors.horizontalCenter: parent.horizontalCenter
                                variant: "authWide"
                                gemSize: 130
                                wordmarkSize: 24
                                version: App.appVersion
                            }
                        }

                        Text {
                            width: parent.width
                            horizontalAlignment: Text.AlignHCenter
                            text: qsTr("REAL-TIME AI VIDEO TRANSFORMATION")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 2
                            bottomPadding: 28
                        }

                        Text {
                            width: parent.width
                            horizontalAlignment: Text.AlignHCenter
                            wrapMode: Text.WordWrap
                            text: qsTr("Become anyone. Live. Transform your webcam feed in real-time with advanced neural rendering.")
                            color: Theme.text
                            font.family: Theme.fontUi
                            font.pixelSize: 14
                            lineHeight: 1.5
                            bottomPadding: 28
                        }

                        // Tabs
                        Rectangle {
                            width: parent.width
                            height: 30
                            radius: Theme.radius
                            color: "transparent"
                            border.color: Theme.border
                            border.width: 1
                            visible: root.mode !== 2 && root.mode !== 3
                            clip: true

                            Row {
                                anchors.fill: parent

                                Repeater {
                                    model: ["SIGN IN", "CREATE ACCOUNT"]

                                    Rectangle {
                                        width: parent.width / 2
                                        height: parent.height
                                        color: root.mode === index ? Theme.gold : "transparent"

                                        Text {
                                            anchors.centerIn: parent
                                            text: modelData
                                            color: root.mode === index ? Theme.bg : Theme.dim
                                            font.family: Theme.fontMono
                                            font.pixelSize: 10
                                            font.letterSpacing: 1.5
                                            font.bold: root.mode === index
                                        }

                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: root.mode = index
                                        }
                                    }
                                }
                            }
                        }

                        // LOGIN
                        Column {
                            width: parent.width
                            spacing: 14
                            visible: root.mode === 0

                            FieldInput {
                                id: loginEmail
                                label: qsTr("EMAIL ADDRESS")
                                placeholderText: qsTr("your@email.com")
                            }

                            FieldInput {
                                id: loginPass
                                label: qsTr("PASSWORD")
                                placeholderText: qsTr("••••••••")
                                echoMode: TextInput.Password
                                onAccepted: App.login(loginEmail.text, loginPass.text)
                            }

                            Text {
                                width: parent.width
                                height: 20
                                horizontalAlignment: Text.AlignHCenter
                                text: qsTr("Forgot password?")
                                color: Theme.gold
                                font.family: Theme.fontUi
                                font.pixelSize: 11
                                font.letterSpacing: 1
                                verticalAlignment: Text.AlignVCenter

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: root.mode = 2
                                }
                            }

                            Item { width: 1; height: 4 }

                            GoldButton {
                                width: parent.width
                                text: qsTr("SIGN IN")
                                busy: Api.busy
                                fontPixelSize: 15
                                fontLS: 3
                                onClicked: App.login(loginEmail.text, loginPass.text)
                            }
                        }

                        // Social Login Section (mode 0 only)
                        Column {
                            width: parent.width
                            spacing: 12
                            visible: root.mode === 0

                            // Google (primary, enabled)
                            Rectangle {
                                width: parent.width
                                height: 48
                                radius: 8
                                border.color: Theme.border
                                border.width: 1
                                color: Theme.s1

                                Row {
                                    anchors.fill: parent
                                    anchors.leftMargin: 16
                                    anchors.rightMargin: 16
                                    spacing: 12

                                    Rectangle {
                                        width: 28; height: 28
                                        radius: 4
                                        color: Theme.s2
                                        border.color: Theme.border
                                        Text {
                                            anchors.centerIn: parent
                                            text: "G"
                                            color: "#4285F4"
                                            font.family: Theme.fontSans
                                            font.pixelSize: 14
                                            font.bold: true
                                        }
                                    }

                                    Text {
                                        text: qsTr("Continue with Google")
                                        color: Theme.text
                                        font.family: Theme.fontSans
                                        font.pixelSize: 14
                                    }
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: App.socialLogin("google")
                                }
                            }

                            // Divider
                            Rectangle {
                                width: parent.width
                                height: 1
                                color: Theme.border
                            }

                            Row {
                                anchors.horizontalCenter: parent.horizontalCenter
                                spacing: 16

                                Text {
                                    text: qsTr("OR CONTINUE WITH")
                                    color: Theme.dim
                                    font.family: Theme.fontMono
                                    font.pixelSize: 9
                                    font.letterSpacing: 1.5
                                }
                            }

                            // Secondary providers (disabled - coming soon)
                            Row {
                                anchors.horizontalCenter: parent.horizontalCenter
                                spacing: 12

                                // Twitch
                                Rectangle {
                                    width: 44; height: 44
                                    radius: 8
                                    color: Theme.s2
                                    border.color: Theme.border
                                    border.width: 1
                                    opacity: 0.5

                                    ToolTip.visible: ma1.containsMouse
                                    ToolTip.delay: 500
                                    ToolTip.text: qsTr("Twitch login coming soon")
                                    ToolTip.timeout: 3000

                                    Rectangle {
                                        width: 24; height: 24
                                        anchors.centerIn: parent
                                        color: "#9146FF"
                                        radius: 4
                                        Text {
                                            anchors.centerIn: parent
                                            text: "T"
                                            color: "#000"
                                            font.family: Theme.fontSans
                                            font.pixelSize: 12
                                            font.bold: true
                                        }
                                    }

                                    MouseArea {
                                        id: ma1
                                        anchors.fill: parent
                                        hoverEnabled: true
                                    }
                                }

                                // TikTok
                                Rectangle {
                                    width: 44; height: 44
                                    radius: 8
                                    color: Theme.s2
                                    border.color: Theme.border
                                    border.width: 1
                                    opacity: 0.5

                                    ToolTip.visible: ma2.containsMouse
                                    ToolTip.delay: 500
                                    ToolTip.text: qsTr("TikTok login coming soon")
                                    ToolTip.timeout: 3000

                                    Rectangle {
                                        width: 24; height: 24
                                        anchors.centerIn: parent
                                        color: "#FFFFFF"
                                        radius: 4
                                        border.color: Theme.border
                                        border.width: 1
                                        Text {
                                            anchors.centerIn: parent
                                            text: "T"
                                            color: "#000"
                                            font.family: Theme.fontSans
                                            font.pixelSize: 12
                                            font.bold: true
                                        }
                                    }

                                    MouseArea {
                                        id: ma2
                                        anchors.fill: parent
                                        hoverEnabled: true
                                    }
                                }

                                // Kick
                                Rectangle {
                                    width: 44; height: 44
                                    radius: 8
                                    color: "#53FC18"
                                    border.color: Theme.border
                                    border.width: 1
                                    opacity: 0.5

                                    ToolTip.visible: ma3.containsMouse
                                    ToolTip.delay: 500
                                    ToolTip.text: qsTr("Kick login coming soon")
                                    ToolTip.timeout: 3000

                                    Rectangle {
                                        width: 24; height: 24
                                        anchors.centerIn: parent
                                        color: "#000"
                                        radius: 4
                                        Text {
                                            anchors.centerIn: parent
                                            text: "K"
                                            color: "#53FC18"
                                            font.family: Theme.fontSans
                                            font.pixelSize: 12
                                            font.bold: true
                                        }
                                    }

                                    MouseArea {
                                        id: ma3
                                        anchors.fill: parent
                                        hoverEnabled: true
                                    }
                                }
                            }
                        }

                        // SIGNUP
                        Column {
                            width: parent.width
                            spacing: 14
                            visible: root.mode === 1

                            FieldInput {
                                id: regName
                                label: qsTr("FULL NAME")
                                placeholderText: qsTr("Your Name")
                            }

                            FieldInput {
                                id: regEmail
                                label: qsTr("EMAIL ADDRESS")
                                placeholderText: qsTr("your@email.com")
                            }

                            FieldInput {
                                id: regPhone
                                label: qsTr("PHONE (OPTIONAL)")
                                placeholderText: qsTr("e.g. 08012345678")
                            }

                            FieldInput {
                                id: regPass
                                label: qsTr("PASSWORD")
                                placeholderText: qsTr("Min. 6 characters")
                                echoMode: TextInput.Password
                                onTextChanged: root.fieldError = ""
                            }

                            FieldInput {
                                id: regPass2
                                label: qsTr("CONFIRM PASSWORD")
                                placeholderText: qsTr("Repeat password")
                                echoMode: TextInput.Password
                                onTextChanged: root.fieldError = ""
                                onAccepted: {
                                    if (!termsCheck.checked) { root.fieldError = "Accept Terms & Conditions"; return }
                                    if (regPass.text !== regPass2.text) { root.fieldError = "Passwords do not match"; return }
                                    root.fieldError = "";
                                    App.registerUser(regEmail.text, regPass.text, regName.text, regPhone.text, regRef.text);
                                }
                            }

                            FieldInput {
                                id: regRef
                                label: qsTr("REFERRAL CODE (OPTIONAL)")
                                placeholderText: qsTr("Enter friend's referral code")
                                text: App.pendingReferralCode
                            }

                            Text {
                                width: parent.width
                                visible: root.fieldError.length > 0
                                text: root.fieldError
                                color: Theme.red
                                font.family: Theme.fontMono
                                font.pixelSize: 9
                                font.letterSpacing: 0.5
                                horizontalAlignment: Text.AlignHCenter
                                height: visible ? 14 : 0
                                wrapMode: Text.WordWrap
                            }

                            Rectangle {
                                width: parent.width
                                height: termsRow.implicitHeight + 24
                                radius: Theme.radius
                                color: Theme.s2
                                border.color: Theme.border

                                Row {
                                    id: termsRow
                                    anchors.fill: parent
                                    anchors.margins: 12
                                    spacing: 12

                                    Rectangle {
                                        property bool termsOk: termsCheck.checked
                                        width: 16
                                        height: 16
                                        radius: 3
                                        color: termsOk ? Theme.gold : Theme.s1
                                        border.color: termsOk ? Theme.gold : Theme.border
                                        anchors.top: parent.top
                                        anchors.topMargin: 2

                                        Text {
                                            anchors.centerIn: parent
                                            text: termsCheck.checked ? "✓" : ""
                                            color: Theme.bg
                                            font.pixelSize: 11
                                            font.bold: true
                                        }

                                        MouseArea {
                                            anchors.fill: parent
                                            onClicked: {
                                                termsCheck.checked = !termsCheck.checked;
                                                root.fieldError = "";
                                            }
                                        }
                                    }

                                    Text {
                                        width: parent.width - 40
                                        height: implicitHeight
                                        wrapMode: Text.WordWrap
                                        textFormat: Text.RichText
                                        text: qsTr("I accept the <a style='color:" + Theme.gold + ";text-decoration:underline' href=''>Terms & Conditions</a>")
                                        color: Theme.text
                                        font.family: Theme.fontMono
                                        font.pixelSize: 11
                                        lineHeight: 1.5

                                        onLinkActivated: Qt.openUrlExternally("https://liveescape.app/terms.html")
                                    }

                                    Item {
                                        id: termsCheck
                                        property bool checked: false
                                    }
                                }
                            }

                            Item { width: 1; height: 4 }

                            GoldButton {
                                width: parent.width
                                text: qsTr("CREATE ACCOUNT")
                                busy: Api.busy
                                fontPixelSize: 15
                                fontLS: 3
                                onClicked: {
                                    if (!termsCheck.checked) {
                                        root.fieldError = "Accept Terms & Conditions";
                                        return ;
                                    }
                                    if (regPass.text !== regPass2.text) {
                                        root.fieldError = "Passwords do not match";
                                        return ;
                                    }
                                    root.fieldError = "";
                                    App.registerUser(regEmail.text, regPass.text, regName.text, regPhone.text, regRef.text);
                                }
                            }
                        }

                        // FORGOT — request link
                        Column {
                            width: parent.width
                            spacing: 12
                            visible: root.mode === 2

                            FieldInput {
                                id: resetEmail
                                label: qsTr("EMAIL ADDRESS")
                                placeholderText: qsTr("your@email.com")
                            }

                            Text {
                                width: parent.width
                                visible: root.resetRequested
                                text: qsTr("If your email is registered, a reset link has been sent.")
                                color: Theme.teal
                                font.family: Theme.fontMono
                                font.pixelSize: 10
                                horizontalAlignment: Text.AlignHCenter
                                wrapMode: Text.WordWrap
                                height: visible ? 14 : 0
                            }

                            Text {
                                width: parent.width
                                visible: root.fieldError.length > 0
                                text: root.fieldError
                                color: Theme.red
                                font.family: Theme.fontMono
                                font.pixelSize: 9
                                font.letterSpacing: 0.5
                                horizontalAlignment: Text.AlignHCenter
                                height: visible ? 14 : 0
                                wrapMode: Text.WordWrap
                            }

                            GoldButton {
                                width: parent.width
                                text: qsTr("SEND RESET LINK")
                                fontPixelSize: 15
                                fontLS: 3
                                onClicked: {
                                    if (resetEmail.text.trim().length === 0) {
                                        root.fieldError = "Please enter your email";
                                        return ;
                                    }
                                    root.fieldError = "";
                                    App.requestPasswordReset(resetEmail.text);
                                    root.resetRequested = true;
                                }
                            }

                            GoldButton {
                                width: parent.width
                                visible: root.resetRequested
                                text: qsTr("I HAVE A RESET TOKEN →")
                                fontPixelSize: 13
                                fontLS: 2
                                onClicked: root.mode = 3
                            }

                            GhostButton {
                                width: parent.width
                                text: qsTr("Back to sign in")
                                onClicked: root.mode = 0
                            }
                        }

                        // FORGOT — complete with token
                        Column {
                            width: parent.width
                            spacing: 12
                            visible: root.mode === 3

                            FieldInput {
                                id: resetTokenField
                                label: qsTr("RESET TOKEN")
                                placeholderText: qsTr("Paste the token from your email")
                                text: App.pendingResetToken
                                onTextChanged: root.fieldError = ""
                            }

                            FieldInput {
                                id: resetNewPass
                                label: qsTr("NEW PASSWORD")
                                placeholderText: qsTr("New password")
                                echoMode: TextInput.Password
                                onTextChanged: root.fieldError = ""
                            }

                            FieldInput {
                                id: resetNewPass2
                                label: qsTr("CONFIRM PASSWORD")
                                placeholderText: qsTr("Confirm password")
                                echoMode: TextInput.Password
                                onTextChanged: root.fieldError = ""
                            }

                            Text {
                                width: parent.width
                                visible: root.fieldError.length > 0
                                text: root.fieldError
                                color: Theme.red
                                font.family: Theme.fontMono
                                font.pixelSize: 9
                                font.letterSpacing: 0.5
                                horizontalAlignment: Text.AlignHCenter
                                height: visible ? 14 : 0
                                wrapMode: Text.WordWrap
                            }

                            GoldButton {
                                width: parent.width
                                text: qsTr("RESET PASSWORD")
                                fontPixelSize: 15
                                fontLS: 3
                                onClicked: {
                                    if (resetTokenField.text.trim().length === 0) {
                                        root.fieldError = "Paste the reset token from your email";
                                        return ;
                                    }
                                    if (resetNewPass.text.length < 8) {
                                        root.fieldError = "Password must be at least 8 characters";
                                        return ;
                                    }
                                    if (resetNewPass.text !== resetNewPass2.text) {
                                        root.fieldError = "Passwords do not match";
                                        return ;
                                    }
                                    root.fieldError = "";
                                    App.completePasswordReset(resetTokenField.text, resetNewPass.text, resetEmail.text);
                                }
                            }

                            GhostButton {
                                width: parent.width
                                text: qsTr("Back to sign in")
                                onClicked: root.mode = 0
                            }
                        }
                    }
                }

                // Footer
                ColumnLayout {
                    Layout.fillWidth: true
                    Layout.preferredHeight: 60
                    spacing: 8

                    Text {
                        Layout.alignment: Qt.AlignHCenter
                        textFormat: Text.RichText
                        text: qsTr("By continuing, you agree to our <a style='color:" + Theme.gold + ";text-decoration:underline' href='terms'>Terms of Service</a> and <a style='color:" + Theme.gold + ";text-decoration:underline' href='privacy'>Privacy Policy</a>")
                        color: Theme.dim
                        font.family: Theme.fontMono
                        font.pixelSize: 10
                        lineHeight: 1.6
                        onLinkActivated: (link) => {
                            if (link === "terms") Qt.openUrlExternally("https://liveescape.app/terms.html")
                            else if (link === "privacy") Qt.openUrlExternally("https://liveescape.app/privacy.html")
                        }
                    }

                    RowLayout {
                        Layout.fillWidth: true
                        spacing: 12

                        GhostButton {
                            Layout.fillWidth: true
                            text: qsTr("← BACK TO OPTIONS")
                            visible: false
                        }

                        Text {
                            Layout.alignment: Qt.AlignHCenter
                            text: qsTr("Built by TheTools Hub · Powered by Lucy 2")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 10
                        }
                    }
                }
            }
        }

        // Right hero panel (58% width, hidden on mobile)
        Item {
            visible: parent.width >= 768
            Layout.fillWidth: true
            Layout.alignment: Qt.AlignVCenter

            Rectangle {
                anchors.fill: parent
                color: Theme.s1

                // Left border
                Rectangle {
                    width: 1; height: parent.height
                    anchors.left: parent.left
                    color: Theme.goldD
                }

                // Hero image
                Image {
                    id: heroImage
                    anchors.fill: parent
                    source: "../assets/auth-streamer-v1.jpg"
                    fillMode: Image.PreserveAspectCrop
                    opacity: 0.35
                }

                // Gradient overlay
                Rectangle {
                    anchors.fill: parent
                    color: "transparent"
                    gradient: Gradient {
                        GradientStop { position: 0; color: Theme.bg }
                        GradientStop { position: 1; color: Theme.bg }
                    }
                }

                // LIVE badge
                Rectangle {
                    anchors.bottom: parent.bottom
                    anchors.left: parent.left
                    anchors.margins: 32
                    width: 180
                    height: 44
                    radius: 6
                    color: Theme.s1
                    border.color: Theme.gold
                    border.width: 1
                    opacity: 0.85

                    Row {
                        anchors.centerIn: parent
                        spacing: 8

                        Rectangle {
                            width: 8; height: 8; radius: 4
                            color: Theme.gold
                            SequentialAnimation on opacity {
                                running: true; loops: Animation.Infinite
                                NumberAnimation { from: 1; to: 0.4; duration: 1000 }
                                NumberAnimation { from: 0.4; to: 1; duration: 1000 }
                            }
                        }
                        Text {
                            text: qsTr("LIVE")
                            color: Theme.gold
                            font.family: Theme.fontMono
                            font.pixelSize: 12
                            font.bold: true
                            font.letterSpacing: 2
                        }
                    }
                }

                // Powered by
                Rectangle {
                    anchors.top: parent.top
                    anchors.right: parent.right
                    anchors.margins: 24
                    width: 200
                    height: 36
                    radius: 6
                    color: Qt.rgba(4/255, 4/255, 10/255, 0.7)
                    border.color: Theme.border

                    Text {
                        anchors.centerIn: parent
                        text: qsTr("Powered by Decart Lucy 2")
                        color: Theme.dim
                        font.family: Theme.fontMono
                        font.pixelSize: 9
                        font.letterSpacing: 1.5
                    }
                }
            }
        }
    }
}