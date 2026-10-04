import LiveEscape
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ModalBase {
    id: root
    open: App.showStarterPay
    modalZ: 525
    panelWidth: Math.min(parent.width * 0.92, 440)
    panelImplicitHeight: Math.min(parent.height * 0.9, 520)
    closeOnBackdrop: false
    onClose: App.showStarterPay = false

    property var cryptoData: null
    property bool showCryptoPanel: false

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 4
        spacing: 12

        Text {
            Layout.alignment: Qt.AlignHCenter
            text: "🧪"
            font.pixelSize: 36
        }

        Text {
            Layout.alignment: Qt.AlignHCenter
            text: qsTr("Starter Pack — $10")
            color: Theme.teal
            font.family: Theme.fontUi
            font.pixelSize: 18
            font.bold: true
            font.letterSpacing: 3
        }

        Text {
            Layout.alignment: Qt.AlignHCenter
            text: qsTr("500 credits · choose payment method")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 9
            font.letterSpacing: 1.5
        }

        Text {
            visible: App.starterPayError.length > 0
            Layout.fillWidth: true
            height: visible ? Math.max(implicitHeight, 14) : 0
            text: App.starterPayError
            color: Theme.red
            font.family: Theme.fontMono
            font.pixelSize: 9
            horizontalAlignment: Text.AlignHCenter
        }

        // Paystack
        Rectangle {
            id: paystackBtn
            Layout.fillWidth: true
            height: 44
            radius: 8
            visible: App.payStackEnabled
            gradient: Gradient {
                GradientStop { position: 0; color: "#00c3f7" }
                GradientStop { position: 1; color: "#0fa0ce" }
            }
            Text {
                anchors.centerIn: parent
                text: qsTr("💳 PAY $10 · PAYSTACK")
                color: "#031a23"
                font.family: Theme.fontUi
                font.pixelSize: 13
                font.bold: true
                font.letterSpacing: 2
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: App.starterPayPaystack()
            }
            Behavior on opacity { NumberAnimation { duration: 200 } }
        }

        // Flutterwave
        Rectangle {
            id: flutterwaveBtn
            Layout.fillWidth: true
            height: 44
            radius: 8
            visible: App.payFlutterwaveEnabled
            gradient: Gradient {
                GradientStop { position: 0; color: "#fb8c00" }
                GradientStop { position: 1; color: "#f7d060" }
            }
            Text {
                anchors.centerIn: parent
                text: qsTr("🦋 PAY $10 · FLUTTERWAVE")
                color: Theme.bg
                font.family: Theme.fontUi
                font.pixelSize: 13
                font.bold: true
                font.letterSpacing: 2
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: App.starterPayFlutterwave()
            }
        }

        // Crypto
        Rectangle {
            id: cryptoBtn
            Layout.fillWidth: true
            height: 44
            radius: 8
            visible: App.payCryptoEnabled
            gradient: Gradient {
                GradientStop { position: 0; color: "#f7931a" }
                GradientStop { position: 1; color: "#fbcc5c" }
            }
            Text {
                anchors.centerIn: parent
                text: qsTr("₿ PAY $10 · CRYPTO")
                color: Theme.bg
                font.family: Theme.fontUi
                font.pixelSize: 13
                font.bold: true
                font.letterSpacing: 2
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: {
                    root.showCryptoPanel = true
                    App.showStarterCryptoPanel()
                }
            }
        }

        // Crypto Panel (inline, expands)
        Item {
            Layout.fillWidth: true
            height: cryptoPanel.implicitHeight
            visible: root.showCryptoPanel
            clip: true

            Rectangle {
                id: cryptoPanel
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                color: Qt.rgba(247/255, 147/255, 26/255, 0.06)
                border.color: Qt.rgba(247/255, 147/255, 26/255, 0.25)
                border.width: 1
                radius: 10

                Column {
                    anchors.fill: parent
                    anchors.margins: 16
                    spacing: 12

                    Text {
                        width: parent.width
                        horizontalAlignment: Text.AlignHCenter
                        text: qsTr("Select coin & send exact amount")
                        color: Theme.dim
                        font.family: Theme.fontMono
                        font.pixelSize: 9
                        font.letterSpacing: 1.5
                    }

                    // Coin selector
                    Row {
                        spacing: 8
                        anchors.horizontalCenter: parent.horizontalCenter
                        Repeater {
                            model: App.cryptoCoins
                            Rectangle {
                                width: coinRect.implicitWidth + 16
                                height: 32
                                radius: 16
                                color: App.selectedCryptoCoin === modelData.id ? Theme.gold : Theme.s2
                                border.color: App.selectedCryptoCoin === modelData.id ? Theme.gold : Theme.border
                                border.width: 1
                                Text {
                                    id: coinRect
                                    anchors.centerIn: parent
                                    text: modelData.symbol
                                    color: App.selectedCryptoCoin === modelData.id ? Theme.bg : Theme.gold
                                    font.family: Theme.fontMono
                                    font.pixelSize: 10
                                    font.bold: App.selectedCryptoCoin === modelData.id
                                }
                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: App.selectCryptoCoin(modelData.id)
                                }
                            }
                        }
                    }

                    // Wallet display
                    Rectangle {
                        id: walletBox
                        visible: App.starterCryptoWalletVisible
                        width: parent.width
                        height: walletContent.implicitHeight + 20
                        color: "transparent"

                        Column {
                            id: walletContent
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.top: parent.top
                            anchors.margins: 12
                            spacing: 10

                            // QR Code
                            Image {
                                visible: App.starterCryptoQR.length > 0
                                anchors.horizontalCenter: parent.horizontalCenter
                                source: App.starterCryptoQR
                                width: 120
                                height: 120
                                fillMode: Image.PreserveAspectFit
                            }

                            Text {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: "WALLET ADDRESS"
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 8
                                font.letterSpacing: 1
                            }

                            Row {
                                anchors.horizontalCenter: parent.horizontalCenter
                                spacing: 6
                                Text {
                                    text: App.starterCryptoAddress
                                    color: Theme.gold
                                    font.family: Theme.fontMono
                                    font.pixelSize: 10
                                    elide: Text.ElideMiddle
                                    // Fixed width — parent.width would loop with Row implicitWidth
                                    width: 260
                                }
                                GhostButton {
                                    text: "COPY"
                                    onClicked: App.copyToClipboard(App.starterCryptoAddress)
                                }
                            }

                            Text {
                                text: "TRANSACTION / TX ID *"
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 9
                                font.letterSpacing: 1
                            }

                            TextField {
                                id: txIdInput
                                width: parent.width
                                placeholderText: qsTr("Paste your transaction ID here")
                                font.family: Theme.fontMono
                                font.pixelSize: 10
                                color: Theme.text
                                background: Rectangle {
                                    radius: 6
                                    color: Theme.s2
                                    border.color: Theme.border
                                }
                            }

                            Text {
                                text: "PAYMENT PROOF IMAGE *"
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 9
                                font.letterSpacing: 1
                            }

                            Row {
                                spacing: 8
                                GhostButton {
                                    text: "📎 CHOOSE FILE"
                                    onClicked: App.pickCryptoProofImage()
                                }
                                Text {
                                    text: App.starterCryptoProofName || "No file chosen"
                                    color: Theme.dim
                                    font.family: Theme.fontMono
                                    font.pixelSize: 9
                                    elide: Text.ElideRight
                                    // Fixed width — binding to parent.width here would loop
                                    // with the Row's implicitWidth (polish() loop).
                                    width: 200
                                }
                            }

                            Text {
                                visible: App.starterCryptoSubStatus.length > 0
                                text: App.starterCryptoSubStatus
                                color: Theme.dim
                                font.family: Theme.fontMono
                                font.pixelSize: 9
                                horizontalAlignment: Text.AlignHCenter
                            }

                            GoldButton {
                                width: parent.width
                                text: qsTr("SUBMIT FOR REVIEW")
                                bg: "#f7931a"
                                onClicked: App.submitStarterCryptoProof(txIdInput.text)
                            }
                        }
                    }

                    // Pending notice
                    Rectangle {
                        visible: App.starterCryptoPending
                        width: parent.width
                        color: Qt.rgba(63/255, 232/255, 184/255, 0.06)
                        border.color: Qt.rgba(63/255, 232/255, 184/255, 0.25)
                        border.width: 1
                        radius: 8
                        Text {
                            anchors.fill: parent
                            anchors.margins: 12
                            wrapMode: Text.WordWrap
                            horizontalAlignment: Text.AlignHCenter
                            text: qsTr("✓ Payment submitted. We'll verify your transaction and activate your <b>500 credits</b> within 24 hours.\nYou'll get an email when ready — just log back in to start using your starter pack.")
                            color: Theme.teal
                            font.family: Theme.fontMono
                            font.pixelSize: 9
                            lineHeight: 1.6
                        }
                    }
                }
            }
        }

        // Disabled message
        Text {
            visible: !App.payStackEnabled && !App.payFlutterwaveEnabled && !App.payCryptoEnabled
            Layout.fillWidth: true
            wrapMode: Text.WordWrap
            text: qsTr("⚠ No payment method is currently configured. Please contact support, or choose <span style='color:" + Theme.gold + "'>Activate Now</span> on the previous screen.")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 9
            font.letterSpacing: 1
        }

        // Loading message
        Text {
            visible: App.starterPayLoading
            Layout.fillWidth: true
            horizontalAlignment: Text.AlignHCenter
            text: qsTr("Loading payment options…")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 9
            font.letterSpacing: 1
        }

        // Back button
        GhostButton {
            width: parent.width
            text: qsTr("← BACK")
            onClicked: {
                App.showStarterPay = false
                App.showGetStarted = true
            }
        }

        Text {
            Layout.fillWidth: true
            horizontalAlignment: Text.AlignHCenter
            text: qsTr("Card & bank payments are instant. Crypto is reviewed within 24 hours.")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 8
            font.letterSpacing: 0.5
            lineHeight: 1.5
        }
    }
}