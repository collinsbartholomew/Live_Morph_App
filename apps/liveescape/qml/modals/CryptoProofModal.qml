import LiveEscape
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ModalBase {
    open: App.showCryptoProof
    modalZ: 540
    panelWidth: Math.min(parent.width * 0.92, 460)
    onClose: App.showCryptoProof = false

    RowLayout {
        width: parent.width

        Text {
            text: "CRYPTO PAYMENT"
            color: Theme.gold
            font.family: Theme.fontUi
            font.pixelSize: 16
            font.bold: true
            font.letterSpacing: 2
            Layout.fillWidth: true
        }

        GhostButton {
            text: "✕"
            onClicked: App.showCryptoProof = false
        }

    }

    Text {
        width: parent.width
        wrapMode: Text.WordWrap
        text: "Send the exact amount to the wallet below, then paste your transaction ID. Status is polled automatically."
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 10
    }

    Rectangle {
        width: parent.width
        height: walletCol.implicitHeight + 20
        radius: Theme.radius
        color: Theme.s2
        border.color: Theme.border

        Column {
            id: walletCol

            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.margins: 12
            spacing: 8

            Text {
                text: "WALLET / ADDRESS"
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 9
                font.letterSpacing: 1
            }

            Text {
                width: parent.width
                wrapMode: Text.WrapAnywhere
                text: (App.cryptoCheckout.wallet_address || App.cryptoCheckout.address || App.cryptoCheckout.wallet || "—").toString()
                color: Theme.gold
                font.family: Theme.fontMono
                font.pixelSize: 12
            }

            Text {
                visible: !!(App.cryptoCheckout.amount || App.cryptoCheckout.crypto_amount)
                text: "Amount: " + (App.cryptoCheckout.amount || App.cryptoCheckout.crypto_amount || "") + " " + (App.cryptoCheckout.currency || App.cryptoCheckout.coin || "")
                color: Theme.text
                font.family: Theme.fontMono
                font.pixelSize: 11
            }

            GhostButton {
                text: "COPY ADDRESS"
                onClicked: App.copyToClipboard((App.cryptoCheckout.wallet_address || App.cryptoCheckout.address || App.cryptoCheckout.wallet || "").toString())
            }

        }

    }

    FieldInput {
        id: txField

        width: parent.width
        label: "TRANSACTION ID (TXID)"
        placeholderText: "Paste blockchain TX hash"
    }

    GhostButton {
        width: parent.width
        text: "📎 ATTACH PROOF IMAGE (OPTIONAL)"
        onClicked: App.pickCryptoProofImage()
    }

    GoldButton {
        width: parent.width
        text: "SUBMIT PROOF"
        busy: Api.busy
        onClicked: App.submitCryptoProof(txField.text)
    }

    GhostButton {
        width: parent.width
        text: "CHECK STATUS"
        onClicked: App.pollPaymentStatus()
    }

}
