import LiveEscape
import QtQuick
import QtQuick.Layouts

ModalBase {
    id: root

    readonly property real dollars: Number(App.selectedPlan.dollars || App.selectedPlan.price || 0)
    readonly property real ngnRate: Number(App.paymentGateway.usd_ngn_rate || 1600)
    readonly property int ngn: Math.round(dollars * ngnRate)

    open: App.showPayModal
    modalZ: 520
    onClose: App.showPayModal = false

    RowLayout {
        width: parent.width

        Text {
            text: "CHECKOUT"
            color: Theme.gold
            font.family: Theme.fontUi
            font.pixelSize: 18
            font.bold: true
            font.letterSpacing: 2
            Layout.fillWidth: true
        }

        GhostButton {
            text: "✕"
            onClicked: App.showPayModal = false
        }

    }

    Text {
        width: parent.width
        wrapMode: Text.WordWrap
        text: "Payment is processed in-app. Funds settle to our merchant account, then your credits unlock after confirmation."
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 10
    }

    Rectangle {
        width: parent.width
        height: rows.implicitHeight + 20
        radius: Theme.radius
        color: Theme.s2
        border.color: Theme.border

        Column {
            id: rows

            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.margins: 12
            spacing: 8

            Repeater {
                model: [{
                    "k": "Plan",
                    "v": App.selectedPlan.name || App.selectedPlan.id || "—"
                }, {
                    "k": "Credits",
                    "v": (App.selectedPlan.credits || 0) + " credits"
                }, {
                    "k": "Stream time",
                    "v": App.selectedPlan.timeLabel || App.selectedPlan.time_label || "—"
                }, {
                    "k": "Amount (USD)",
                    "v": "$" + root.dollars.toFixed(2)
                }, {
                    "k": "Est. (NGN)",
                    "v": "₦" + root.ngn.toLocaleString() + " @ ₦" + root.ngnRate + "/$"
                }]

                RowLayout {
                    width: parent.width

                    Text {
                        text: modelData.k
                        color: Theme.dim
                        font.family: Theme.fontMono
                        font.pixelSize: 10
                        Layout.fillWidth: true
                    }

                    Text {
                        text: "" + modelData.v
                        color: Theme.text
                        font.family: Theme.fontMono
                        font.pixelSize: 11
                        font.bold: true
                    }

                }

            }

        }

    }

    GoldButton {
        width: parent.width
        text: "PAY WITH PAYSTACK"
        busy: Api.busy
        onClicked: App.startCheckout("paystack")
    }

    GoldButton {
        width: parent.width
        visible: App.payFlutterwaveEnabled
        text: "PAY WITH FLUTTERWAVE"
        bg: Theme.teal
        busy: Api.busy
        onClicked: App.startCheckout("flutterwave")
    }

    GhostButton {
        width: parent.width
        visible: App.payCryptoEnabled
        text: "₿ PAY WITH CRYPTO"
        onClicked: App.startCheckout("crypto")
    }

    Text {
        width: parent.width
        visible: !App.payFlutterwaveEnabled && !App.payCryptoEnabled
        wrapMode: Text.WordWrap
        text: "Card checkout uses Paystack only on this build. Other methods appear when the server enables them."
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 10
    }

    GhostButton {
        width: parent.width
        text: "CANCEL"
        onClicked: App.showPayModal = false
    }

}
