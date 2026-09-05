import LiveEscape
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

Item {
    id: root

    property int mode: 0 // 0 login 1 signup 2 forgot
    property string fieldError: ""

    onModeChanged: fieldError = ""

    Rectangle {
        anchors.fill: parent

        gradient: Gradient {
            GradientStop {
                position: 0
                color: "#12100a"
            }

            GradientStop {
                position: 0.55
                color: Theme.bg
            }

            GradientStop {
                position: 1
                color: Theme.bg
            }

        }

    }

    Rectangle {
        id: card

        width: Math.min(parent.width * 0.92, 420)
        anchors.centerIn: parent
        height: col.implicitHeight + 64
        radius: Theme.radiusXl
        color: Theme.glass
        border.color: Theme.goldDim
        border.width: 1

        // soft gold rim
        Rectangle {
            anchors.fill: parent
            anchors.margins: -1
            radius: parent.radius + 1
            color: "transparent"
            border.color: Theme.goldGlow
            border.width: 1
            z: -1
        }

        Column {
            id: col

            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.margins: 28
            spacing: 12

            LogoMark {
                anchors.horizontalCenter: parent.horizontalCenter
                gemSize: 32
                version: App.appVersion
            }

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: "REAL-TIME AI VIDEO TRANSFORM"
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 9
                font.letterSpacing: 2
                topPadding: 2
                bottomPadding: 12
            }

            Rectangle {
                width: parent.width
                height: 34
                radius: Theme.radius
                color: "transparent"
                border.color: Theme.border
                border.width: 1
                visible: root.mode !== 2
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
                                font.letterSpacing: 1.2
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
                spacing: 12
                visible: root.mode === 0

                FieldInput {
                    id: loginEmail

                    label: "EMAIL ADDRESS"
                    placeholderText: "your@email.com"
                }

                FieldInput {
                    id: loginPass

                    label: "PASSWORD"
                    placeholderText: "••••••••"
                    echoMode: TextInput.Password
                    onAccepted: App.login(loginEmail.text, loginPass.text)
                }

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Forgot password?"
                    color: Theme.gold
                    font.family: Theme.fontUi
                    font.pixelSize: 12

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.mode = 2
                    }

                }

                GoldButton {
                    width: parent.width
                    text: "SIGN IN"
                    busy: Api.busy
                    onClicked: App.login(loginEmail.text, loginPass.text)
                }

            }

            // SIGNUP
            Column {
                width: parent.width
                spacing: 10
                visible: root.mode === 1

                FieldInput {
                    id: regName

                    label: "FULL NAME"
                    placeholderText: "Your Name"
                }

                FieldInput {
                    id: regEmail

                    label: "EMAIL ADDRESS"
                    placeholderText: "your@email.com"
                }

                FieldInput {
                    id: regPhone

                    label: "PHONE (OPTIONAL)"
                    placeholderText: "e.g. 08012345678"
                }

                FieldInput {
                    id: regPass

                    label: "PASSWORD"
                    placeholderText: "Min. 8 characters"
                    echoMode: TextInput.Password
                    onTextChanged: root.fieldError = ""
                }

                FieldInput {
                    id: regPass2

                    label: "CONFIRM PASSWORD"
                    placeholderText: "Repeat password"
                    echoMode: TextInput.Password
                    onTextChanged: root.fieldError = ""
                }

                FieldInput {
                    id: regRef

                    label: "REFERRAL CODE (OPTIONAL)"
                    placeholderText: "FRIEND CODE"
                }

                Text {
                    width: parent.width
                    visible: root.fieldError.length > 0
                    text: root.fieldError
                    color: Theme.red
                    font.family: Theme.fontMono
                    font.pixelSize: 10
                    wrapMode: Text.WordWrap
                }

                Row {
                    spacing: 8

                    Rectangle {
                        property bool termsOk: termsCheck.checked

                        width: 16
                        height: 16
                        radius: 3
                        color: termsOk ? Theme.gold : Theme.s2
                        border.color: Theme.border

                        Text {
                            anchors.centerIn: parent
                            text: termsCheck.checked ? "✓" : ""
                            color: Theme.bg
                            font.pixelSize: 11
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
                        text: "I accept the Terms & Conditions"
                        color: Theme.dim
                        font.family: Theme.fontMono
                        font.pixelSize: 10
                        anchors.verticalCenter: parent.verticalCenter
                    }

                    Item {
                        id: termsCheck

                        property bool checked: false
                    }

                }

                GoldButton {
                    width: parent.width
                    text: "CREATE ACCOUNT"
                    busy: Api.busy
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

                Text {
                    width: parent.width
                    wrapMode: Text.WordWrap
                    text: "Enter your email and we'll send a password reset link."
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 11
                }

                FieldInput {
                    id: resetEmail

                    label: "EMAIL ADDRESS"
                    placeholderText: "your@email.com"
                }

                GoldButton {
                    width: parent.width
                    text: "SEND RESET LINK"
                    onClicked: {
                        App.requestPasswordReset(resetEmail.text);
                        root.mode = 3;
                    }
                }

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Already have a token?"
                    color: Theme.gold
                    font.family: Theme.fontUi
                    font.pixelSize: 12

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: root.mode = 3
                    }

                }

                GhostButton {
                    width: parent.width
                    text: "BACK TO SIGN IN"
                    onClicked: root.mode = 0
                }

            }

            // FORGOT — complete with token (matches original resetPasswordForm)
            Column {
                width: parent.width
                spacing: 12
                visible: root.mode === 3

                Text {
                    width: parent.width
                    wrapMode: Text.WordWrap
                    text: "Paste the reset token from your email and choose a new password."
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 11
                }

                FieldInput {
                    id: resetToken

                    label: "RESET TOKEN"
                    placeholderText: "Token from email"
                }

                FieldInput {
                    id: resetNewPass

                    label: "NEW PASSWORD"
                    placeholderText: "Min. 8 characters"
                    echoMode: TextInput.Password
                    onTextChanged: root.fieldError = ""
                }

                FieldInput {
                    id: resetNewPass2

                    label: "CONFIRM PASSWORD"
                    placeholderText: "Repeat password"
                    echoMode: TextInput.Password
                    onTextChanged: root.fieldError = ""
                }

                Text {
                    width: parent.width
                    visible: root.fieldError.length > 0
                    text: root.fieldError
                    color: Theme.red
                    font.family: Theme.fontMono
                    font.pixelSize: 10
                    wrapMode: Text.WordWrap
                }

                GoldButton {
                    width: parent.width
                    text: "UPDATE PASSWORD"
                    onClicked: {
                        if (resetNewPass.text !== resetNewPass2.text) {
                            root.fieldError = "Passwords do not match";
                            return ;
                        }
                        root.fieldError = "";
                        App.completePasswordReset(resetToken.text, resetNewPass.text, "");
                        root.mode = 0;
                    }
                }

                GhostButton {
                    width: parent.width
                    text: "BACK TO SIGN IN"
                    onClicked: root.mode = 0
                }

            }

        }

    }

}
