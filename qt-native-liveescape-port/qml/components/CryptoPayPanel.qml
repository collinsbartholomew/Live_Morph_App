import QtQuick
import QtQuick.Controls
import SmokeScreen

// Shared crypto panel — the reference's 5× repeated pattern (§C16):
//   panel  rgba(247,147,26,.06) / border rgba(247,147,26,.25) / radius 10 / padding 16
//   "Select coin & send exact amount" (mono 9 dim2 ls 1.5)
//   coin chips → wallet (QR 120 white + address + COPY) → TX ID → proof image
//   submit  "✓ I HAVE SENT PAYMENT"  gradient 135deg #f7931a→#fbcc5c
//   pending "⏳ PAYMENT SUBMITTED"
Column {
    id: panel
    property string flow: "gate"      // gate | upgrade | credits | starter
    property string planId: ""
    width: parent ? parent.width : 320
    spacing: 10

    readonly property string pendingBody: {
        if (flow === "gate")
            return qsTr("Your payment is under review. Once approved you will receive your license key via email. You can also enter it below when ready.");
        if (flow === "upgrade")
            return qsTr("Your upgrade payment is under review. Your plan will be updated within 24 hours after verification.");
        if (flow === "starter")
            return qsTr("Your payment is under review. Once approved we will activate your 500 credits within 24 hours. You'll get an email when ready — just log back in to start using your starter pack.");
        return qsTr("Your payment is under review. Credits will be added to your account within 24 hours after verification.");
    }

    // ── panel card ──
    Rectangle {
        width: parent.width
        height: panelCol.implicitHeight + 32
        radius: 10
        color: Qt.rgba(247/255, 147/255, 26/255, 0.06)
        border.width: 1
        border.color: Qt.rgba(247/255, 147/255, 26/255, 0.25)
        visible: !App.cryptoPending

        Column {
            id: panelCol
            anchors.fill: parent
            anchors.margins: 16
            spacing: 12

            Text {
                width: parent.width
                horizontalAlignment: Text.AlignHCenter
                text: qsTr("Select coin & send exact amount")
                color: Theme.dim2
                font.family: Theme.fontMono
                font.pixelSize: 9
                font.letterSpacing: 1.5
            }

            // coin chips
            Flow {
                width: parent.width
                spacing: 8
                Repeater {
                    model: App.cryptoCoins
                    delegate: Rectangle {
                        width: coinLabel.implicitWidth + 24
                        height: 28
                        radius: 6
                        readonly property bool sel: App.selectedCryptoCoin === modelData.id
                        color: sel ? Qt.rgba(247/255, 147/255, 26/255, 0.2) : Theme.s2
                        border.width: 1
                        border.color: sel ? Qt.rgba(247/255, 147/255, 26/255, 0.6) : Theme.border
                        Text {
                            id: coinLabel
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

            // wallet
            Column {
                width: parent.width
                spacing: 8
                visible: App.cryptoWalletVisible

                Rectangle {
                    visible: App.cryptoQR.length > 0
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
                        source: App.cryptoQR
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
                        border.width: 1
                        border.color: Theme.border
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
                    }
                }

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
                            border.width: 1
                            border.color: Theme.border
                            Text {
                                id: pickTxt
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

                // submit — 135deg #f7931a→#fbcc5c
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
                        text: qsTr("✓ I HAVE SENT PAYMENT")
                        color: "#1a0a00"
                        font.family: Theme.fontUi
                        font.pixelSize: 13
                        font.weight: Font.Bold
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

    // pending notice
    Rectangle {
        width: parent.width
        height: pendingCol.implicitHeight + 28
        radius: 8
        visible: App.cryptoPending
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
