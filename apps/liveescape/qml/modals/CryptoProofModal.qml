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
            text: qsTr("CRYPTO PAYMENT")
            color: Theme.gold
            font.family: Theme.fontUi
            font.pixelSize: 16
            font.bold: true
            font.letterSpacing: 2
            Layout.fillWidth: true
        }

        GhostButton {
            text: qsTr("✕")
            onClicked: App.showCryptoProof = false
        }

    }

    Text {
        width: parent.width
        wrapMode: Text.WordWrap
        text: qsTr("Send the exact amount to the wallet below, then submit. Your Payment ID (pre-filled below) is what links your crypto transfer to this order — do not replace it with a blockchain TX hash.")
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
                text: qsTr("WALLET / ADDRESS")
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 9
                font.letterSpacing: 1
            }

            Text {
                width: parent.width
                wrapMode: Text.WrapAnywhere
                text: (App.cryptoCheckout.pay_address || App.cryptoCheckout.wallet_address || App.cryptoCheckout.address || App.cryptoCheckout.wallet || "—").toString()
                color: Theme.gold
                font.family: Theme.fontMono
                font.pixelSize: 12
            }

            Text {
                visible: !!(App.cryptoCheckout.pay_amount || App.cryptoCheckout.amount || App.cryptoCheckout.crypto_amount)
                text: "Amount: " + (App.cryptoCheckout.pay_amount || App.cryptoCheckout.amount || App.cryptoCheckout.crypto_amount || "") + " " + (App.cryptoCheckout.pay_currency || App.cryptoCheckout.currency || App.cryptoCheckout.coin || "")
                color: Theme.text
                font.family: Theme.fontMono
                font.pixelSize: 11
            }

            GhostButton {
                text: qsTr("COPY ADDRESS")
                onClicked: App.copyToClipboard((App.cryptoCheckout.pay_address || App.cryptoCheckout.wallet_address || App.cryptoCheckout.address || App.cryptoCheckout.wallet || "").toString())
            }

        }

    }

    FieldInput {
        id: txField

        width: parent.width
        // Backend matches the order by the checkout's Payment ID (returned as
        // `reference`/`payment_id` at init), NOT the blockchain TX hash — a TX
        // hash never matches any order's provider_ref.
        label: qsTr("PAYMENT ID (PRE-FILLED)")
        placeholderText: qsTr("Auto-filled from your checkout")
        text: (App.cryptoCheckout.reference || App.cryptoCheckout.payment_id
               || App.cryptoCheckout.order_id || "").toString()
    }

    GhostButton {
        width: parent.width
        text: qsTr("📎 ATTACH PROOF IMAGE (OPTIONAL)")
        onClicked: App.pickCryptoProofImage()
    }

    GoldButton {
        width: parent.width
        text: qsTr("SUBMIT PROOF")
        busy: Api.busy
        onClicked: App.submitCryptoProof(txField.text)
    }

    GhostButton {
        width: parent.width
        text: qsTr("CHECK STATUS")
        onClicked: App.pollPaymentStatus()
    }

}
