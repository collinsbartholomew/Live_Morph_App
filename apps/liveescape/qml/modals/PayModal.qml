import LiveEscape
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ModalBase {
    id: root

    readonly property real dollars: Number(App.selectedPlan.dollars || App.selectedPlan.price || 0)
    readonly property real ngnRate: Number(App.paymentGateway.usd_ngn_rate || 1600)
    readonly property int ngn: Math.round(dollars * ngnRate)
    // Manual crypto flow (Electron credsCryptoPanel) for the selected credits plan
    property bool cryptoOpen: false

    open: App.showPayModal
    modalZ: 520
    onClose: App.showPayModal = false

    RowLayout {
        width: parent.width

        Column {
            Layout.fillWidth: true
            spacing: 2

            RowLayout {
                spacing: 8

                Text {
                    text: "🎟️"
                    font.pixelSize: 32
                }

                Text {
                    text: (App.selectedPlan.name || App.selectedPlan.id || "PRO").toUpperCase() + " PLAN"
                    color: Theme.gold
                    font.family: Theme.fontUi
                    font.pixelSize: 18
                    font.bold: true
                    font.letterSpacing: 2
                    Layout.fillWidth: true
                }
            }

            Text {
                text: "$" + root.dollars.toFixed(0) + " · " + (App.selectedPlan.credits || 0) + " CREDITS"
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 9
                font.letterSpacing: 1.5
            }
        }

        GhostButton {
            text: qsTr("✕")
            onClicked: App.showPayModal = false
        }

    }

    Text {
        width: parent.width
        wrapMode: Text.WordWrap
        text: qsTr("Payment is processed in-app. Funds settle to our merchant account, then your credits unlock after confirmation.")
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

    // 💳 PAY NOW — PAYSTACK (Electron #paystackBtn: gradient #00c3ff→#00e5a0,
    // dark text 16px uppercase)
    Rectangle {
        width: parent.width
        height: 44
        radius: Theme.radius
        gradient: Gradient {
            orientation: Gradient.Horizontal
            GradientStop { position: 0; color: "#00c3ff" }
            GradientStop { position: 1; color: "#00e5a0" }
        }

        Text {
            anchors.centerIn: parent
            text: qsTr("💳 PAY NOW — PAYSTACK")
            color: "#04040a"
            font.family: Theme.fontUi
            font.pixelSize: 16
            font.bold: true
            font.letterSpacing: 1
        }

        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: App.startCheckout("paystack")
        }
    }

    // 🦋 PAY NOW — FLUTTERWAVE (Electron #flutterwaveBtn: gradient #fb8c00→#f7d060)
    Rectangle {
        width: parent.width
        height: 44
        radius: Theme.radius
        visible: App.payFlutterwaveEnabled
        gradient: Gradient {
            orientation: Gradient.Horizontal
            GradientStop { position: 0; color: "#fb8c00" }
            GradientStop { position: 1; color: "#f7d060" }
        }

        Text {
            anchors.centerIn: parent
            text: qsTr("🦋 PAY NOW — FLUTTERWAVE")
            color: "#04040a"
            font.family: Theme.fontUi
            font.pixelSize: 16
            font.bold: true
            font.letterSpacing: 1
        }

        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: App.startCheckout("flutterwave")
        }
    }

    // ₿ PAY WITH CRYPTO (Electron credsCryptoBtnToggle — manual wallet panel)
    Rectangle {
        width: parent.width
        height: 40
        radius: Theme.radius
        visible: App.payCryptoEnabled
        gradient: Gradient {
            orientation: Gradient.Horizontal
            GradientStop { position: 0; color: "#f7931a" }
            GradientStop { position: 1; color: "#fbcc5c" }
        }

        Text {
            anchors.centerIn: parent
            text: qsTr("₿ PAY $%1 · CRYPTO").arg(root.dollars.toFixed(0))
            color: "#1a0a00"
            font.family: Theme.fontUi
            font.pixelSize: 14
            font.bold: true
            font.letterSpacing: 1.5
        }

        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: {
                root.cryptoOpen = !root.cryptoOpen
                if (root.cryptoOpen)
                    App.showCryptoPanel("credits")
            }
        }
    }

    CryptoPayPanel {
        visible: App.payCryptoEnabled && root.cryptoOpen
        flow: "credits"
        planId: (App.selectedPlan.id || "")
    }

    Text {
        width: parent.width
        visible: !App.payFlutterwaveEnabled && !App.payCryptoEnabled
        wrapMode: Text.WordWrap
        text: qsTr("Card checkout uses Paystack only on this build. Other methods appear when the server enables them.")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 10
    }

    GhostButton {
        width: parent.width
        text: qsTr("CANCEL")
        onClicked: App.showPayModal = false
    }

    Rectangle {
        width: parent.width
        height: 1
        color: Theme.border
    }

    Text {
        width: parent.width
        wrapMode: Text.WordWrap
        text: qsTr("OR CONTACT US DIRECTLY")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 9
        font.letterSpacing: 1
    }

    RowLayout {
        width: parent.width
        spacing: 8

        GhostButton {
            Layout.fillWidth: true
            text: qsTr("💬 Telegram")
            onClicked: App.openExternal("https://t.me/liveescapeapp")
        }

        GhostButton {
            Layout.fillWidth: true
            text: qsTr("✉️ Email")
            onClicked: App.openExternal("mailto:support@liveescapeapp.com")
        }

    }

    Column {
        width: parent.width
        spacing: 6

        Text {
            width: parent.width
            wrapMode: Text.WordWrap
            text: qsTr("▸ Already have a manual credit key?")
            color: Theme.gold
            font.family: Theme.fontMono
            font.pixelSize: 10
        }

        TextField {
            id: keyInput

            width: parent.width
            placeholderText: qsTr("CK-XXXX-XXXX")
            font.family: Theme.fontMono
            font.pixelSize: 11
            color: Theme.text
            inputMethodHints: Qt.ImhUppercaseOnly
            maximumLength: 14

            background: Rectangle {
                radius: Theme.radius
                color: Theme.s1
                border.color: App.keyRedeemError !== "" ? Theme.red : Theme.border
            }

            onAccepted: App.redeemCreditKey(keyInput.text)
            onTextChanged: App.clearKeyRedeemError()
        }

        // Electron #keyErr — inline error under credit key input
        Text {
            visible: App.keyRedeemError !== ""
            text: App.keyRedeemError
            width: parent.width
            color: Theme.red
            font.family: Theme.fontMono
            font.pixelSize: 9
            height: visible ? 14 : 0
        }

        GhostButton {
            width: parent.width
            text: qsTr("ACTIVATE KEY")
            onClicked: App.redeemCreditKey(keyInput.text)
        }

    }

}
