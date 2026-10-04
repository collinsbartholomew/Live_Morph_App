import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveEscape

// Crypto payment panel — Electron gateCryptoPanel / starterCryptoPanel parity.
// One shared component for the manual-crypto flow used by gate / upgrade /
// credits (starter keeps its dedicated inline panel in StarterPayModal):
// coin selector → wallet (QR + address + copy) → TX ID → proof image → submit.
Column {
    id: panel

    property string flow: "gate"   // starter | gate | upgrade | credits
    property string planId: ""

    readonly property string pendingBody: {
        if (flow === "gate")
            return qsTr("Your payment is under review. Once approved you will receive your license key via email.");
        if (flow === "upgrade")
            return qsTr("Your payment is under review. Once approved your upgrade will be applied to your account.");
        if (flow === "starter")
            return qsTr("Your payment is under review. Once approved your 500 starter credits will be activated.");
        return qsTr("Your payment is under review. Once approved the credits will be added to your balance.");
    }

    spacing: 10
    width: parent ? parent.width : 320

    // ── Panel card (Electron: bg rgba(247,147,26,.06), border .25, radius 10) ──
    Rectangle {
        width: parent.width
        height: panelCol.implicitHeight + 32
        radius: 10
        color: Qt.rgba(247/255, 147/255, 26/255, 0.06)
        border.color: Qt.rgba(247/255, 147/255, 26/255, 0.25)
        border.width: 1
        visible: !App.cryptoPending

        Column {
            id: panelCol
            anchors.fill: parent
            anchors.margins: 16
            spacing: 12

            // Header (Electron gateCryptoAmountInfo)
            Text {
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                text: qsTr("Select coin & send exact amount")
                color: Theme.dim2
                font.family: Theme.fontMono
                font.pixelSize: 9
                font.letterSpacing: 1.5
            }

            // Coin selector row
            Flow {
                width: parent.width
                spacing: 8

                Repeater {
                    model: App.cryptoCoins

                    delegate: Rectangle {
                        width: coinLabel.implicitWidth + 24
                        height: 28
                        radius: 6
                        readonly property bool selected: App.selectedCryptoCoin === modelData.id
                        color: selected ? Qt.rgba(247/255, 147/255, 26/255, 0.2) : Theme.s2
                        border.color: selected ? Qt.rgba(247/255, 147/255, 26/255, 0.6) : Theme.border
                        border.width: 1

                        Text {
                            id: coinLabel
                            anchors.centerIn: parent
                            text: modelData.symbol
                            color: selected ? Theme.gold : Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 10
                            font.bold: selected
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: App.selectCryptoCoin(modelData.id)
                        }
                    }
                }
            }

            // Wallet display (Electron gateCryptoWalletBox)
            Column {
                width: parent.width
                spacing: 8
                visible: App.cryptoWalletVisible

                // QR image (Electron: 120px, white bg, padding 10, radius 12)
                Rectangle {
                    visible: App.cryptoQR.length > 0
                    width: 140
                    height: 140
                    radius: 12
                    color: "#ffffff"
                    border.color: Qt.rgba(240/255, 168/255, 48/255, 0.45)
                    border.width: 1
                    anchors.horizontalCenter: parent.horizontalCenter

                    Image {
                        anchors.fill: parent
                        anchors.margins: 10
                        source: App.cryptoQR
                        fillMode: Image.PreserveAspectFit
                        smooth: true
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
                        width: Math.min(implicitWidth, panel.width - 120)
                        text: App.cryptoAddress
                        color: Theme.gold
                        font.family: Theme.fontMono
                        font.pixelSize: 10
                        wrapMode: Text.WrapAnywhere
                        anchors.verticalCenter: parent.verticalCenter
                    }

                    Rectangle {
                        width: copyTxt.implicitWidth + 16
                        height: 20
                        radius: 4
                        color: Theme.s2
                        border.color: Theme.border
                        border.width: 1
                        anchors.verticalCenter: parent.verticalCenter

                        Text {
                            id: copyTxt
                            anchors.centerIn: parent
                            text: qsTr("COPY")
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 8
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: App.copyToClipboard(App.cryptoAddress)
                        }
                    }
                }

                // TX ID input (Electron gateCryptoTxId)
                Column {
                    width: parent.width
                    spacing: 4

                    Text {
                        text: qsTr("TRANSACTION / TX ID *")
                        color: Theme.dim2
                        font.family: Theme.fontMono
                        font.pixelSize: 9
                        font.letterSpacing: 1
                    }

                    TextField {
                        id: txInput
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
                            border.color: txInput.activeFocus ? Qt.rgba(247/255, 147/255, 26/255, 0.6) : Theme.border
                        }
                        onAccepted: App.submitCryptoProofFor(panel.flow, text, panel.planId)
                    }
                }

                // Proof image picker (Electron gateCryptoProofFile)
                Column {
                    width: parent.width
                    spacing: 4

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
                            width: pickTxt.implicitWidth + 20
                            height: 26
                            radius: 6
                            color: Theme.s2
                            border.color: Theme.border
                            border.width: 1

                            Text {
                                id: pickTxt
                                anchors.centerIn: parent
                                text: qsTr("📁 CHOOSE FILE")
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
                            text: App.cryptoProofName.length > 0 ? App.cryptoProofName : qsTr("No file chosen")
                            color: App.cryptoProofName.length > 0 ? Theme.text : Theme.dim2
                            font.family: Theme.fontMono
                            font.pixelSize: 8
                            elide: Text.ElideMiddle
                            width: panel.width - 120
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }
                }

                // Sub status (Electron gateCryptoSubStatus)
                Text {
                    width: parent.width
                    visible: App.cryptoSubStatus.length > 0
                    text: App.cryptoSubStatus
                    color: Theme.dim2
                    font.family: Theme.fontMono
                    font.pixelSize: 9
                    horizontalAlignment: Text.AlignHCenter
                    wrapMode: Text.WordWrap
                }

                // Submit (Electron gateSubmitCrypto: gradient #f7931a→#fbcc5c)
                Rectangle {
                    width: parent.width
                    height: 40
                    radius: 8
                    gradient: Gradient {
                        orientation: Gradient.Horizontal
                        GradientStop { position: 0; color: "#f7931a" }
                        GradientStop { position: 1; color: "#fbcc5c" }
                    }

                    Text {
                        anchors.centerIn: parent
                        text: qsTr("✓ I HAVE SENT PAYMENT")
                        color: "#1a0a00"
                        font.family: Theme.fontUi
                        font.pixelSize: 13
                        font.bold: true
                        font.letterSpacing: 1.5
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: App.submitCryptoProofFor(panel.flow, txInput.text, panel.planId)
                    }
                }
            }
        }
    }

    // Pending notice (Electron gateCryptoPendingNotice)
    Rectangle {
        width: parent.width
        height: pendingCol.implicitHeight + 28
        radius: 8
        visible: App.cryptoPending
        color: Qt.rgba(240/255, 168/255, 48/255, 0.06)
        border.color: Qt.rgba(240/255, 168/255, 48/255, 0.25)
        border.width: 1

        Column {
            id: pendingCol
            anchors.fill: parent
            anchors.margins: 14
            spacing: 6

            Text {
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                text: qsTr("⏳ PAYMENT SUBMITTED")
                color: Theme.gold
                font.family: Theme.fontMono
                font.pixelSize: 10
                font.letterSpacing: 1
            }

            Text {
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                wrapMode: Text.WordWrap
                text: panel.pendingBody
                color: Theme.dim2
                font.family: Theme.fontMono
                font.pixelSize: 9
                lineHeight: 1.6
            }
        }
    }
}
