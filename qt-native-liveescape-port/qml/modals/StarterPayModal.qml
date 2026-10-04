import QtQuick
import QtQuick.Controls
import SmokeScreen

// #starterPayModal — z 525. Starter Pack — $10 payment picker.
ModalBase {
    id: starterPay
    open: App.showStarterPay
    modalZ: 525
    panelMaxWidth: 440
    panelPaddingH: 28
    onClose: App.showStarterPay = false

    property bool cryptoOpen: false

    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: "🧪"
        font.pixelSize: 36
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("Starter Pack — $10")
        color: Theme.teal
        font.family: Theme.fontUi
        font.pixelSize: 20
        font.weight: Font.Bold
        font.letterSpacing: 2
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("500 credits · choose payment method")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 10
        bottomPadding: 6
    }
    Text {
        width: parent.width
        height: 14
        horizontalAlignment: Text.AlignHCenter
        text: App.starterPayError
        color: Theme.red
        font.family: Theme.fontMono
        font.pixelSize: 9
        clip: true
    }

    Rectangle {
        width: parent.width
        height: 40
        radius: Theme.radius
        visible: App.payStackEnabled
        gradient: Gradient {
            orientation: Gradient.Horizontal
            GradientStop { position: 0; color: "#00c3f7" }
            GradientStop { position: 1; color: "#0fa0ce" }
        }
        Text {
            anchors.centerIn: parent
            text: qsTr("💳 PAY $10 · PAYSTACK")
            color: Theme.bg
            font.family: Theme.fontUi
            font.pixelSize: 14
            font.weight: Font.Bold
            font.letterSpacing: 2
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: App.starterPayPaystack()
        }
    }
    Rectangle {
        width: parent.width
        height: 40
        radius: Theme.radius
        visible: App.payFlutterwaveEnabled
        gradient: Gradient {
            orientation: Gradient.Horizontal
            GradientStop { position: 0; color: "#fb8c00" }
            GradientStop { position: 1; color: "#f7d060" }
        }
        Text {
            anchors.centerIn: parent
            text: qsTr("🦋 PAY $10 · FLUTTERWAVE")
            color: Theme.goldInk
            font.family: Theme.fontUi
            font.pixelSize: 14
            font.weight: Font.Bold
            font.letterSpacing: 2
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: App.starterPayFlutterwave()
        }
    }
    Rectangle {
        width: parent.width
        height: 40
        radius: Theme.radius
        visible: App.payCryptoEnabled
        gradient: Gradient {
            GradientStop { position: 0; color: "#f7931a" }
            GradientStop { position: 1; color: "#fbcc5c" }
        }
        Text {
            anchors.centerIn: parent
            text: qsTr("₿ PAY $10 · CRYPTO")
            color: Theme.goldInk
            font.family: Theme.fontUi
            font.pixelSize: 14
            font.weight: Font.Bold
            font.letterSpacing: 2
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: {
                starterPay.cryptoOpen = !starterPay.cryptoOpen
                if (starterPay.cryptoOpen)
                    App.showStarterCryptoPanel()
            }
        }
    }

    // starter crypto panel (uses the dedicated starterCrypto* state)
    Column {
        width: parent.width
        spacing: 10
        visible: starterPay.cryptoOpen && App.payCryptoEnabled && !App.starterCryptoPending

        Rectangle {
            width: parent.width
            height: starterCryptoCol.implicitHeight + 32
            radius: 10
            color: Qt.rgba(247/255, 147/255, 26/255, 0.06)
            border.width: 1
            border.color: Qt.rgba(247/255, 147/255, 26/255, 0.25)

            Column {
                id: starterCryptoCol
                anchors.fill: parent
                anchors.margins: 16
                spacing: 10

                Text {
                    width: parent.width
                    horizontalAlignment: Text.AlignHCenter
                    text: qsTr("Select coin & send exact amount")
                    color: Theme.dim2
                    font.family: Theme.fontMono
                    font.pixelSize: 9
                    font.letterSpacing: 1.5
                }

                Flow {
                    width: parent.width
                    spacing: 8
                    Repeater {
                        model: App.cryptoCoins
                        delegate: Rectangle {
                            width: coinTxt.implicitWidth + 24
                            height: 28
                            radius: 6
                            readonly property bool sel: App.selectedCryptoCoin === modelData.id
                            color: sel ? Qt.rgba(247/255, 147/255, 26/255, 0.2) : Theme.s2
                            border.width: 1
                            border.color: sel ? Qt.rgba(247/255, 147/255, 26/255, 0.6) : Theme.border
                            Text {
                                id: coinTxt
                                anchors.centerIn: parent
                                text: modelData.symbol
                                color: sel ? Theme.gold : Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 10
                                font.bold: sel
                            }
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: App.selectCryptoCoin(modelData.id)
                            }
                        }
                    }
                }

                Column {
                    width: parent.width
                    spacing: 8
                    visible: App.starterCryptoWalletVisible

                    Rectangle {
                        visible: App.starterCryptoQR.length > 0
                        width: 140
                        height: 140
                        radius: 12
                        color: "#ffffff"
                        border.width: 1
                        border.color: Qt.rgba(240/255, 168/255, 48/255, 0.45)
                        anchors.horizontalCenter: parent.horizontalCenter
                        Image {
                            anchors.fill: parent
                            anchors.margins: 10
                            source: App.starterCryptoQR
                            fillMode: Image.PreserveAspectFit
                        }
                    }
                    Text {
                        width: parent.width
                        horizontalAlignment: Text.AlignHCenter
                        text: qsTr("WALLET ADDRESS")
                        color: Theme.dim2
                        font.family: Theme.fontMono
                        font.pixelSize: 8
                        font.letterSpacing: 1
                    }
                    Row {
                        spacing: 6
                        anchors.horizontalCenter: parent.horizontalCenter
                        Text {
                            width: Math.min(implicitWidth, starterPay.width - 160)
                            text: App.starterCryptoAddress
                            color: Theme.gold
                            font.family: Theme.fontMono
                            font.pixelSize: 10
                            wrapMode: Text.WrapAnywhere
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        Rectangle {
                            width: starterCopyTxt.implicitWidth + 16
                            height: 20
                            radius: 4
                            color: Theme.s2
                            border.width: 1
                            border.color: Theme.border
                            anchors.verticalCenter: parent.verticalCenter
                            Text {
                                id: starterCopyTxt
                                anchors.centerIn: parent
                                text: qsTr("COPY")
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 8
                            }
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: App.copyToClipboard(App.starterCryptoAddress)
                            }
                        }
                    }

                    Text {
                        text: qsTr("TRANSACTION / TX ID *")
                        color: Theme.dim2
                        font.family: Theme.fontMono
                        font.pixelSize: 9
                        font.letterSpacing: 1
                    }
                    TextField {
                        id: starterTx
                        width: parent.width
                        height: 34
                        color: Theme.text
                        font.family: Theme.fontMono
                        font.pixelSize: 10
                        placeholderText: qsTr("Paste your transaction ID here")
                        placeholderTextColor: Theme.dim2
                        background: Rectangle {
                            radius: 6
                            color: Theme.s2
                            border.width: 1
                            border.color: starterTx.activeFocus ? Qt.rgba(247/255, 147/255, 26/255, 0.6) : Theme.border
                        }
                    }
                    Text {
                        text: qsTr("PAYMENT PROOF IMAGE *")
                        color: Theme.dim2
                        font.family: Theme.fontMono
                        font.pixelSize: 9
                        font.letterSpacing: 1
                    }
                    Row {
                        spacing: 8
                        Rectangle {
                            width: starterPick.implicitWidth + 20
                            height: 26
                            radius: 6
                            color: Theme.s2
                            border.width: 1
                            border.color: Theme.border
                            Text {
                                id: starterPick
                                anchors.centerIn: parent
                                text: qsTr("📎 CHOOSE FILE")
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 9
                            }
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: App.pickCryptoProofImage()
                            }
                        }
                        Text {
                            text: App.starterCryptoProofName.length > 0 ? App.starterCryptoProofName : qsTr("No file chosen")
                            color: App.starterCryptoProofName.length > 0 ? Theme.text : Theme.dim2
                            font.family: Theme.fontMono
                            font.pixelSize: 8
                            elide: Text.ElideMiddle
                            width: starterPay.width - 160
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }
                    Text {
                        width: parent.width
                        visible: App.starterCryptoSubStatus.length > 0
                        text: App.starterCryptoSubStatus
                        color: Theme.dim2
                        font.family: Theme.fontMono
                        font.pixelSize: 9
                        horizontalAlignment: Text.AlignHCenter
                        wrapMode: Text.WordWrap
                    }
                    Rectangle {
                        width: parent.width
                        height: 40
                        radius: 8
                        gradient: Gradient {
                            GradientStop { position: 0; color: "#f7931a" }
                            GradientStop { position: 1; color: "#fbcc5c" }
                        }
                        Text {
                            anchors.centerIn: parent
                            text: qsTr("SUBMIT FOR REVIEW")
                            color: Theme.goldInk
                            font.family: Theme.fontUi
                            font.pixelSize: 13
                            font.weight: Font.Bold
                            font.letterSpacing: 1.5
                        }
                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: App.submitStarterCryptoProof(starterTx.text)
                        }
                    }
                }
            }
        }
    }

    // pending notice
    Rectangle {
        width: parent.width
        height: pendingCol.implicitHeight + 28
        radius: 8
        visible: App.starterCryptoPending
        color: Qt.rgba(240/255, 168/255, 48/255, 0.06)
        border.width: 1
        border.color: Qt.rgba(240/255, 168/255, 48/255, 0.25)
        Column {
            id: pendingCol
            anchors.fill: parent
            anchors.margins: 14
            spacing: 6
            Text {
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                text: qsTr("✓ PAYMENT SUBMITTED")
                color: Theme.gold
                font.family: Theme.fontMono
                font.pixelSize: 10
                font.letterSpacing: 1
            }
            Text {
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                wrapMode: Text.WordWrap
                text: qsTr("We'll verify your transaction and activate your 500 credits within 24 hours. You'll get an email when ready — just log back in to start using your starter pack.")
                color: Theme.dim2
                font.family: Theme.fontMono
                font.pixelSize: 9
                lineHeight: 1.6
            }
        }
    }

    Rectangle {
        width: parent.width
        height: 42
        radius: Theme.radius
        visible: !App.payStackEnabled && !App.payFlutterwaveEnabled && !App.payCryptoEnabled
        color: Theme.s1
        border.width: 1
        border.color: Theme.border
        Text {
            anchors.centerIn: parent
            width: parent.width - 16
            horizontalAlignment: Text.AlignHCenter
            text: qsTr("⚠ No payment method is currently configured. Please contact support, or choose Activate Now on the previous screen.")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 9
            wrapMode: Text.WordWrap
        }
    }

    Rectangle {
        width: parent.width
        height: 32
        radius: Theme.radius
        color: "transparent"
        border.width: 1
        border.color: Theme.border
        Text {
            anchors.centerIn: parent
            text: qsTr("← BACK")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 10
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: App.showStarterPay = false
        }
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("Card & bank payments are instant. Crypto is reviewed within 24 hours.")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 8
    }
}
