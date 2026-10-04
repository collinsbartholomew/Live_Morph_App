import QtQuick
import QtQuick.Controls
import SmokeScreen

// #authScreen — exact port of dashboard.html SCREEN 0.
//   backdrop: radial-gradient(ellipse at 50% -10%, rgba(232,197,71,.08) 0%, rgba(4,4,10,1) 60%)
//   single centered .auth-box (NO hero panel, NO social login, NO footer)
//   4 forms: login / signup / reset-request / reset-password
Item {
    id: root

    // Form-mode state machine (Electron: showLoginForm/showResetRequest/
    // showResetPassword/switchTab drive the same visibility set).
    property int mode: 0        // 0 login, 1 signup, 2 reset-request, 3 reset-password
    property string fieldError: ""
    property string fieldSuccess: ""
    property string resetToken: ""

    onFieldErrorChanged: if (fieldError.length > 0) fieldSuccess = ""
    onFieldSuccessChanged: if (fieldSuccess.length > 0) fieldError = ""

    // Deep-link ?token= → reset-password form (Electron showResetPassword)
    Connections {
        target: App
        function onPendingResetTokenChanged() {
            const t = App.pendingResetToken
            if (t && t.length > 0) {
                root.resetToken = t
                root.mode = 3
            }
        }
    }

    // ── Backdrop: gold-tinted radial at 50% -10% fading to solid bg at 60% ──
    Rectangle { anchors.fill: parent; color: Theme.bg }
    Rectangle {
        // Visually equivalent to the reference radial: subtle gold wash
        // concentrated at the top-center, dissolving by ~60% height.
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        height: parent.height * 0.6
        gradient: Gradient {
            GradientStop { position: 0; color: Qt.rgba(232/255, 197/255, 71/255, 0.08) }
            GradientStop { position: 1; color: Qt.rgba(4/255, 4/255, 10/255, 0) }
        }
    }

    // .overlay scroll area → centered card
    Flickable {
        anchors.fill: parent
        contentWidth: width
        contentHeight: authBox.y + authBox.height + 80
        clip: false

        // .auth-box — s1 card, gold-d border, radius 14, padding 36/40,
        // width 92% max 420px, glow 0 0 100px rgba(232,197,71,.06), slideUp .4s
        Rectangle {
            id: authBox
            width: Math.min(parent.width * 0.92, 420)
            height: boxCol.implicitHeight + 72      // padding 36 top + 36 bottom
            anchors.horizontalCenter: parent.horizontalCenter
            y: 40
            radius: 14
            color: Theme.s1
            border.width: 1
            border.color: Theme.goldD

            // box-shadow glow (diffuse, z −1)
            Rectangle {
                anchors.centerIn: parent
                width: parent.width + 80
                height: parent.height + 80
                radius: parent.radius + 40
                color: "transparent"
                z: -1
                border.width: 40
                border.color: Qt.rgba(232/255, 197/255, 71/255, 0.02)
                visible: true
            }

            // slideUp .4s ease entrance
            transform: Translate { id: slide; y: 24 }
            opacity: 0
            Component.onCompleted: {
                slide.y = 24
                anim.start()
            }
            SequentialAnimation {
                id: anim
                ParallelAnimation {
                    NumberAnimation { target: slide; property: "y"; to: 0; duration: 400; easing.type: Easing.OutQuad }
                    NumberAnimation { target: authBox; property: "opacity"; to: 1; duration: 400; easing.type: Easing.OutQuad }
                }
            }

            Column {
                id: boxCol
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                anchors.leftMargin: 40
                anchors.rightMargin: 40
                anchors.topMargin: 36
                spacing: 0

                // ── .auth-logo: gem + wordmark + version ──
                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: 10

                    // .auth-gem — gold pill "S" 130px wide, 18px/800
                    Rectangle {
                        width: 130
                        height: 26
                        radius: 7
                        color: Theme.gold
                        anchors.verticalCenter: parent.verticalCenter
                        Text {
                            anchors.centerIn: parent
                            text: qsTr("S")
                            color: Theme.bg
                            font.family: Theme.fontUi
                            font.pixelSize: 18
                            font.weight: Font.Black
                        }
                    }

                    Text {
                        anchors.verticalCenter: parent.verticalCenter
                        textFormat: Text.RichText
                        // SMOKE<span gold>SCREEN</span><small dim>1.8</small>
                        text: qsTr("SMOKE<span style='color:#e8c547'>SCREEN</span> <span style='color:#606080;font-size:12px'>1.8</span>")
                        color: Theme.text
                        font.family: Theme.fontUi
                        font.pixelSize: 24
                        font.weight: Font.Bold
                        font.letterSpacing: 4
                    }
                }

                // .auth-tagline
                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: qsTr("REAL-TIME AI VIDEO TRANSFORMATION")
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 9
                    font.letterSpacing: 2
                    topPadding: 6
                    bottomPadding: 28
                }

                // ── .auth-tabs — SIGN IN / CREATE ACCOUNT ──
                Rectangle {
                    id: tabBar
                    width: parent.width
                    height: 33        // 2×padding(8) + 17px text
                    radius: 7
                    color: "transparent"
                    border.width: 1
                    border.color: Theme.border
                    clip: true

                    Row {
                        anchors.fill: parent
                        spacing: 0

                        Rectangle {
                            width: parent.width / 2
                            height: parent.height
                            color: root.mode === 0 ? Theme.gold : "transparent"
                            Text {
                                anchors.centerIn: parent
                                text: qsTr("SIGN IN")
                                color: root.mode === 0 ? Theme.bg : Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 10
                                font.letterSpacing: 1.5
                                font.bold: root.mode === 0
                            }
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: root.mode = 0
                            }
                        }
                        Rectangle {
                            width: parent.width / 2
                            height: parent.height
                            color: root.mode === 1 ? Theme.gold : "transparent"
                            Text {
                                anchors.centerIn: parent
                                text: qsTr("CREATE ACCOUNT")
                                color: root.mode === 1 ? Theme.bg : Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 10
                                font.letterSpacing: 1.5
                                font.bold: root.mode === 1
                            }
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: root.mode = 1
                            }
                        }
                    }
                }

                // ── FORM 1: LOGIN ──
                Column {
                    width: parent.width
                    // .auth-tabs { margin-bottom: 24px } — reserve the gap
                    topPadding: 24
                    spacing: 14
                    visible: root.mode === 0

                    Column {
                        width: parent.width
                        spacing: 5
                        Text {
                            text: qsTr("EMAIL ADDRESS")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 1.5
                        }
                        TextField {
                            id: loginEmail
                            width: parent.width
                            height: 32
                            color: Theme.text
                            font.family: Theme.fontMono
                            font.pixelSize: 11
                            placeholderText: qsTr("your@email.com")
                            placeholderTextColor: Theme.dim2
                            background: Rectangle {
                                radius: 7
                                color: Theme.s2
                                border.width: 1
                                border.color: loginEmail.activeFocus ? Theme.goldD : (root.fieldError.length > 0 ? Theme.red : Theme.border)
                            }
                        }
                    }

                    Column {
                        width: parent.width
                        spacing: 5
                        Text {
                            text: qsTr("PASSWORD")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 1.5
                        }
                        TextField {
                            id: loginPass
                            width: parent.width
                            height: 32
                            echoMode: TextInput.Password
                            color: Theme.text
                            font.family: Theme.fontMono
                            font.pixelSize: 11
                            placeholderText: qsTr("••••••••")
                            placeholderTextColor: Theme.dim2
                            background: Rectangle {
                                radius: 7
                                color: Theme.s2
                                border.width: 1
                                border.color: loginPass.activeFocus ? Theme.goldD : (root.fieldError.length > 0 ? Theme.red : Theme.border)
                            }
                            onAccepted: App.login(loginEmail.text, loginPass.text)
                        }
                    }

                    // .auth-err (min-height 14 + mb 10) and .success-msg
                    // (min-height 14 + mb 10) — BOTH always reserve space
                    Text {
                        width: parent.width
                        height: 14
                        horizontalAlignment: Text.AlignHCenter
                        text: root.fieldError
                        color: Theme.red
                        font.family: Theme.fontMono
                        font.pixelSize: 9
                        font.letterSpacing: 0.5
                        wrapMode: Text.WordWrap
                        clip: true
                    }
                    Text {
                        width: parent.width
                        height: 14
                        horizontalAlignment: Text.AlignHCenter
                        text: root.fieldSuccess
                        color: Theme.teal
                        font.family: Theme.fontMono
                        font.pixelSize: 10
                        wrapMode: Text.WordWrap
                        clip: true
                    }

                    // Forgot password? (.auth-help gold link, mb 14 via spacing)
                    Item {
                        width: parent.width
                        height: 16
                        Text {
                            anchors.centerIn: parent
                            text: qsTr("Forgot password?")
                            color: Theme.gold
                            font.family: Theme.fontUi
                            font.pixelSize: 11
                            MouseArea {
                                anchors.fill: parent
                                anchors.margins: -6
                                cursorShape: Qt.PointingHandCursor
                                onClicked: { root.fieldError = ""; root.fieldSuccess = ""; root.mode = 2 }
                            }
                        }
                    }

                    // .auth-submit — SIGN IN
                    Rectangle {
                        width: parent.width
                        height: 35
                        radius: 7
                        color: Theme.gold
                        Text {
                            anchors.centerIn: parent
                            text: qsTr("SIGN IN")
                            color: Theme.bg
                            font.family: Theme.fontUi
                            font.pixelSize: 15
                            font.weight: Font.Bold
                            font.letterSpacing: 3
                        }
                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: App.login(loginEmail.text, loginPass.text)
                        }
                    }
                }

                // ── FORM 2: RESET REQUEST ──
                Column {
                    width: parent.width
                    spacing: 14
                    visible: root.mode === 2

                    Column {
                        width: parent.width
                        spacing: 5
                        Text {
                            text: qsTr("EMAIL ADDRESS")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 1.5
                        }
                        TextField {
                            id: resetEmail
                            width: parent.width
                            height: 32
                            color: Theme.text
                            font.family: Theme.fontMono
                            font.pixelSize: 11
                            placeholderText: qsTr("your@email.com")
                            placeholderTextColor: Theme.dim2
                            background: Rectangle {
                                radius: 7
                                color: Theme.s2
                                border.width: 1
                                border.color: resetEmail.activeFocus ? Theme.goldD : Theme.border
                            }
                        }
                    }

                    Text {
                        width: parent.width
                        horizontalAlignment: Text.AlignHCenter
                        visible: root.fieldError.length > 0
                        text: root.fieldError
                        color: Theme.red
                        font.family: Theme.fontMono
                        font.pixelSize: 9
                        wrapMode: Text.WordWrap
                    }
                    Text {
                        width: parent.width
                        horizontalAlignment: Text.AlignHCenter
                        visible: root.fieldSuccess.length > 0
                        text: root.fieldSuccess
                        color: Theme.teal
                        font.family: Theme.fontMono
                        font.pixelSize: 10
                        wrapMode: Text.WordWrap
                    }

                    Rectangle {
                        width: parent.width
                        height: 35
                        radius: 7
                        color: Theme.gold
                        Text {
                            anchors.centerIn: parent
                            text: qsTr("SEND RESET LINK")
                            color: Theme.bg
                            font.family: Theme.fontUi
                            font.pixelSize: 15
                            font.weight: Font.Bold
                            font.letterSpacing: 3
                        }
                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: App.requestPasswordReset(resetEmail.text)
                        }
                    }

                    Item {
                        width: parent.width
                        height: 16
                        Text {
                            anchors.centerIn: parent
                            text: qsTr("Back to sign in")
                            color: Theme.gold
                            font.family: Theme.fontUi
                            font.pixelSize: 11
                            MouseArea {
                                anchors.fill: parent
                                anchors.margins: -6
                                cursorShape: Qt.PointingHandCursor
                                onClicked: { root.fieldError = ""; root.fieldSuccess = ""; root.mode = 0 }
                            }
                        }
                    }
                }

                // ── FORM 3: RESET PASSWORD ──
                Column {
                    id: resetPasswordForm
                    width: parent.width
                    spacing: 14
                    visible: root.mode === 3
                    property string token: ""

                    Column {
                        width: parent.width
                        spacing: 5
                        Text {
                            text: qsTr("NEW PASSWORD")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 1.5
                        }
                        TextField {
                            id: resetNewPass
                            width: parent.width
                            height: 32
                            echoMode: TextInput.Password
                            color: Theme.text
                            font.family: Theme.fontMono
                            font.pixelSize: 11
                            placeholderText: qsTr("New password")
                            placeholderTextColor: Theme.dim2
                            background: Rectangle {
                                radius: 7
                                color: Theme.s2
                                border.width: 1
                                border.color: resetNewPass.activeFocus ? Theme.goldD : Theme.border
                            }
                        }
                    }

                    Column {
                        width: parent.width
                        spacing: 5
                        Text {
                            text: qsTr("CONFIRM PASSWORD")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 1.5
                        }
                        TextField {
                            id: resetNewPass2
                            width: parent.width
                            height: 32
                            echoMode: TextInput.Password
                            color: Theme.text
                            font.family: Theme.fontMono
                            font.pixelSize: 11
                            placeholderText: qsTr("Confirm password")
                            placeholderTextColor: Theme.dim2
                            background: Rectangle {
                                radius: 7
                                color: Theme.s2
                                border.width: 1
                                border.color: resetNewPass2.activeFocus ? Theme.goldD : Theme.border
                            }
                            onAccepted: doReset()
                        }
                    }

                    Text {
                        width: parent.width
                        horizontalAlignment: Text.AlignHCenter
                        visible: root.fieldError.length > 0
                        text: root.fieldError
                        color: Theme.red
                        font.family: Theme.fontMono
                        font.pixelSize: 9
                        wrapMode: Text.WordWrap
                    }
                    Text {
                        width: parent.width
                        horizontalAlignment: Text.AlignHCenter
                        visible: root.fieldSuccess.length > 0
                        text: root.fieldSuccess
                        color: Theme.teal
                        font.family: Theme.fontMono
                        font.pixelSize: 10
                        wrapMode: Text.WordWrap
                    }

                    Rectangle {
                        width: parent.width
                        height: 35
                        radius: 7
                        color: Theme.gold
                        Text {
                            anchors.centerIn: parent
                            text: qsTr("RESET PASSWORD")
                            color: Theme.bg
                            font.family: Theme.fontUi
                            font.pixelSize: 15
                            font.weight: Font.Bold
                            font.letterSpacing: 3
                        }
                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: doReset()
                        }
                    }

                    Item {
                        width: parent.width
                        height: 16
                        Text {
                            anchors.centerIn: parent
                            text: qsTr("Back to sign in")
                            color: Theme.gold
                            font.family: Theme.fontUi
                            font.pixelSize: 11
                            MouseArea {
                                anchors.fill: parent
                                anchors.margins: -6
                                cursorShape: Qt.PointingHandCursor
                                onClicked: { root.fieldError = ""; root.fieldSuccess = ""; root.mode = 0 }
                            }
                        }
                    }

                    function doReset() {
                        if (resetNewPass.text.length < 8) {
                            root.fieldError = qsTr("Password must be at least 8 characters")
                            return
                        }
                        if (resetNewPass.text !== resetNewPass2.text) {
                            root.fieldError = qsTr("Passwords do not match")
                            return
                        }
                        App.completePasswordReset(root.resetToken, resetNewPass.text, "")
                    }
                }

                // ── FORM 4: SIGNUP ──
                Column {
                    width: parent.width
                    spacing: 14
                    visible: root.mode === 1

                    Column {
                        width: parent.width
                        spacing: 5
                        Text {
                            text: qsTr("FULL NAME")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 1.5
                        }
                        TextField {
                            id: signupName
                            width: parent.width
                            height: 32
                            color: Theme.text
                            font.family: Theme.fontMono
                            font.pixelSize: 11
                            placeholderText: qsTr("Your Name")
                            placeholderTextColor: Theme.dim2
                            background: Rectangle {
                                radius: 7; color: Theme.s2; border.width: 1
                                border.color: signupName.activeFocus ? Theme.goldD : Theme.border
                            }
                        }
                    }

                    Column {
                        width: parent.width
                        spacing: 5
                        Text {
                            text: qsTr("EMAIL ADDRESS")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 1.5
                        }
                        TextField {
                            id: signupEmail
                            width: parent.width
                            height: 32
                            color: Theme.text
                            font.family: Theme.fontMono
                            font.pixelSize: 11
                            placeholderText: qsTr("your@email.com")
                            placeholderTextColor: Theme.dim2
                            background: Rectangle {
                                radius: 7; color: Theme.s2; border.width: 1
                                border.color: signupEmail.activeFocus ? Theme.goldD : Theme.border
                            }
                        }
                    }

                    Column {
                        width: parent.width
                        spacing: 5
                        Text {
                            text: qsTr("PHONE NUMBER (OPTIONAL)")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 1.5
                        }
                        TextField {
                            id: signupPhone
                            width: parent.width
                            height: 32
                            color: Theme.text
                            font.family: Theme.fontMono
                            font.pixelSize: 11
                            placeholderText: qsTr("e.g. 08012345678")
                            placeholderTextColor: Theme.dim2
                            background: Rectangle {
                                radius: 7; color: Theme.s2; border.width: 1
                                border.color: signupPhone.activeFocus ? Theme.goldD : Theme.border
                            }
                        }
                    }

                    Column {
                        width: parent.width
                        spacing: 5
                        Text {
                            text: qsTr("PASSWORD")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 1.5
                        }
                        TextField {
                            id: signupPass
                            width: parent.width
                            height: 32
                            echoMode: TextInput.Password
                            color: Theme.text
                            font.family: Theme.fontMono
                            font.pixelSize: 11
                            placeholderText: qsTr("Min. 6 characters")
                            placeholderTextColor: Theme.dim2
                            background: Rectangle {
                                radius: 7; color: Theme.s2; border.width: 1
                                border.color: signupPass.activeFocus ? Theme.goldD : Theme.border
                            }
                        }
                    }

                    Column {
                        width: parent.width
                        spacing: 5
                        Text {
                            text: qsTr("CONFIRM PASSWORD")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 1.5
                        }
                        TextField {
                            id: signupPass2
                            width: parent.width
                            height: 32
                            echoMode: TextInput.Password
                            color: Theme.text
                            font.family: Theme.fontMono
                            font.pixelSize: 11
                            placeholderText: qsTr("Repeat password")
                            placeholderTextColor: Theme.dim2
                            background: Rectangle {
                                radius: 7; color: Theme.s2; border.width: 1
                                border.color: signupPass2.activeFocus ? Theme.goldD : Theme.border
                            }
                            onAccepted: doSignup()
                        }
                    }

                    // Referral field (Electron: prefill from ?ref= deep link)
                    Column {
                        width: parent.width
                        spacing: 5
                        Text {
                            text: qsTr("REFERRAL CODE (OPTIONAL)")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            font.letterSpacing: 1.5
                        }
                        TextField {
                            id: signupRefCode
                            width: parent.width
                            height: 32
                            text: App.pendingReferralCode || ""
                            color: Theme.text
                            font.family: Theme.fontMono
                            font.pixelSize: 11
                            font.letterSpacing: 2
                            placeholderText: qsTr("Enter friend's referral code")
                            placeholderTextColor: Theme.dim2
                            background: Rectangle {
                                radius: 7; color: Theme.s2; border.width: 1
                                border.color: signupRefCode.activeFocus ? Theme.goldD : Theme.border
                            }
                        }
                    }

                    // .checkbox-field — terms acceptance
                    Rectangle {
                        width: parent.width
                        height: 42
                        radius: 7
                        color: Theme.s2
                        border.width: 1
                        border.color: Theme.border

                        Row {
                            anchors.left: parent.left
                            anchors.leftMargin: 12
                            anchors.verticalCenter: parent.verticalCenter
                            spacing: 10

                            Rectangle {
                                width: 16
                                height: 16
                                anchors.verticalCenter: parent.verticalCenter
                                color: signupTerms.checked ? Theme.gold : "transparent"
                                border.width: 1
                                border.color: signupTerms.checked ? Theme.gold : Theme.dim
                                Text {
                                    visible: signupTerms.checked
                                    anchors.centerIn: parent
                                    text: "✓"
                                    color: Theme.bg
                                    font.pixelSize: 11
                                }
                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: signupTerms.toggle()
                                }
                            }

                            Text {
                                anchors.verticalCenter: parent.verticalCenter
                                textFormat: Text.RichText
                                text: qsTr("I accept the <a href='https://smokescreenapp.com' style='color:#e8c547'>Terms & Conditions</a>")
                                color: Theme.text
                                font.family: Theme.fontMono
                                font.pixelSize: 11
                                onLinkActivated: (link) => Qt.openUrlExternally(link)
                            }
                        }
                        // invisible checkbox holds state
                        CheckBox {
                            id: signupTerms
                            visible: false
                            checked: false
                            function toggle() { checked = !checked }
                        }
                    }

                    Text {
                        width: parent.width
                        horizontalAlignment: Text.AlignHCenter
                        visible: root.fieldError.length > 0
                        text: root.fieldError
                        color: Theme.red
                        font.family: Theme.fontMono
                        font.pixelSize: 9
                        wrapMode: Text.WordWrap
                    }
                    Text {
                        width: parent.width
                        horizontalAlignment: Text.AlignHCenter
                        visible: root.fieldSuccess.length > 0
                        text: root.fieldSuccess
                        color: Theme.teal
                        font.family: Theme.fontMono
                        font.pixelSize: 10
                        wrapMode: Text.WordWrap
                    }

                    Rectangle {
                        width: parent.width
                        height: 35
                        radius: 7
                        color: Theme.gold
                        Text {
                            anchors.centerIn: parent
                            text: qsTr("CREATE ACCOUNT")
                            color: Theme.bg
                            font.family: Theme.fontUi
                            font.pixelSize: 15
                            font.weight: Font.Bold
                            font.letterSpacing: 3
                        }
                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: doSignup()
                        }
                    }

                    function doSignup() {
                        if (signupName.text.trim().length === 0) {
                            root.fieldError = qsTr("Enter your full name")
                            return
                        }
                        if (signupEmail.text.trim().length === 0) {
                            root.fieldError = qsTr("Enter your email address")
                            return
                        }
                        if (signupPass.text.length < 6) {
                            root.fieldError = qsTr("Password must be at least 6 characters")
                            return
                        }
                        if (signupPass.text !== signupPass2.text) {
                            root.fieldError = qsTr("Passwords do not match")
                            return
                        }
                        if (!signupTerms.checked) {
                            root.fieldError = qsTr("You must accept the Terms & Conditions")
                            return
                        }
                        root.fieldError = ""
                        App.registerUser(signupEmail.text, signupPass.text,
                                         signupName.text, signupPhone.text,
                                         signupRefCode.text.trim().toUpperCase())
                    }
                }
            }
        }
    }

    // ── Controller signal wiring ──
    // Inline form errors come straight from ApiClient (Electron shows server
    // errors in #loginErr/#signupErr); AppController surfaces toasts.
    Connections {
        target: Api

        function onLoginFailed(msg) {
            root.fieldSuccess = ""
            root.fieldError = msg
        }
        function onRegisterFailed(msg) {
            root.fieldSuccess = ""
            root.fieldError = msg
        }
        function onRegisterSucceeded(payload) {
            root.fieldError = ""
            root.fieldSuccess = ""
        }
        function onPasswordResetRequested() {
            root.fieldError = ""
            root.fieldSuccess = qsTr("If registered, a reset link has been sent to your email")
            root.mode = 0
        }
        function onPasswordResetSucceeded() {
            root.fieldError = ""
            root.fieldSuccess = qsTr("If registered, a reset link has been sent to your email")
            root.mode = 0
        }
    }

    Connections {
        target: App
        function onPasswordResetCompleted() {
            root.fieldError = ""
            root.fieldSuccess = qsTr("Password reset — you can sign in now")
            root.mode = 0
        }
    }
}
