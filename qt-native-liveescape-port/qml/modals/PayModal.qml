import QtQuick
import QtQuick.Controls
import SmokeScreen

// #payModal — credit-pack checkout. Exact reference structure §16.
ModalBase {
    id: pay
    open: App.showPayModal
    modalZ: 600
    panelMaxWidth: 460
    panelPaddingH: 36
    onClose: App.showPayModal = false

    component SummaryRow: Row {
        property string label: ""
        property string value: ""
        property bool total: false
        width: parent.width
        Text {
            text: parent.label
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 9
        }
        Item { width: parent.width - 220; height: 1 }
        Text {
            text: parent.value
            color: parent.total ? Theme.gold : Theme.text
            font.family: Theme.fontMono
            font.pixelSize: parent.total ? 11 : 9
            font.bold: true
        }
    }

    readonly property real dollars: Number(App.selectedPlan.dollars || App.selectedPlan.price || 0)
    readonly property int credits: Number(App.selectedPlan.credits || 0)
    property string method: "card"
    property bool cryptoOpen: false

    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: "🎟️"
        font.pixelSize: 32
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: (App.selectedPlan.name || App.selectedPlan.id || "PRO").toString().toUpperCase() + " PLAN"
        color: Theme.gold
        font.family: Theme.fontUi
        font.pixelSize: 20
        font.weight: Font.Bold
        font.letterSpacing: 3
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: "$" + pay.dollars.toFixed(0) + " · " + pay.credits.toLocaleString() + " CREDITS"
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 10
        bottomPadding: 8
    }

    Rectangle {
        width: parent.width
        height: summaryCol.implicitHeight + 24
        radius: Theme.radius
        color: Theme.s2
        border.width: 1
        border.color: Theme.border
        Column {
            id: summaryCol
            anchors.centerIn: parent
            width: parent.width - 28
            spacing: 7
            SummaryRow { label: qsTr("Plan"); value: App.selectedPlan.name || App.selectedPlan.id || "—" }
            SummaryRow { label: qsTr("Credits"); value: pay.credits.toLocaleString() + " credits" }
            SummaryRow { label: qsTr("Stream time"); value: App.selectedPlan.timeLabel || App.selectedPlan.time_label || "—" }
            SummaryRow { label: qsTr("Total"); value: "$" + pay.dollars.toFixed(2); total: true }
        }
    }

    // method toggle
    Rectangle {
        width: parent.width
        height: 44
        radius: 11
        color: Theme.s2
        border.width: 1
        border.color: Theme.border
        Row {
            anchors.fill: parent
            anchors.margins: 4
            spacing: 4
            Rectangle {
                width: (parent.width - 4) / 2
                height: parent.height
                radius: 8
                color: pay.method === "card" ? Theme.gold : "transparent"
                Text {
                    anchors.centerIn: parent
                    text: qsTr("💳 Card / Transfer")
                    color: pay.method === "card" ? Theme.goldInk : Theme.dim
                    font.family: Theme.fontUi
                    font.pixelSize: 12
                    font.weight: Font.Bold
                }
                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: pay.method = "card"
                }
            }
            Rectangle {
                width: (parent.width - 4) / 2
                height: parent.height
                radius: 8
                color: pay.method === "crypto" ? Theme.gold : "transparent"
                Text {
                    anchors.centerIn: parent
                    text: qsTr("₿ Crypto")
                    color: pay.method === "crypto" ? Theme.goldInk : Theme.dim
                    font.family: Theme.fontUi
                    font.pixelSize: 12
                    font.weight: Font.Bold
                }
                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: pay.method = "crypto"
                }
            }
        }
    }

    // card panel
    Column {
        width: parent.width
        spacing: 8
        visible: pay.method === "card"

        Rectangle {
            width: parent.width
            height: 42
            radius: Theme.radius
            visible: App.payStackEnabled
            gradient: Gradient {
                orientation: Gradient.Horizontal
                GradientStop { position: 0; color: "#00c3ff" }
                GradientStop { position: 1; color: "#00e5a0" }
            }
            Text {
                anchors.centerIn: parent
                text: qsTr("💳 PAY NOW — PAYSTACK")
                color: Theme.bg
                font.family: Theme.fontUi
                font.pixelSize: 15
                font.weight: Font.Bold
                font.letterSpacing: 2
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: App.startCheckout("paystack")
            }
        }
        Rectangle {
            width: parent.width
            height: 42
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
                color: Theme.goldInk
                font.family: Theme.fontUi
                font.pixelSize: 15
                font.weight: Font.Bold
                font.letterSpacing: 2
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: App.startCheckout("flutterwave")
            }
        }
        Rectangle {
            width: parent.width
            height: 44
            radius: Theme.radius
            visible: !App.payStackEnabled && !App.payFlutterwaveEnabled
            color: Theme.s1
            border.width: 1
            border.color: Theme.border
            Text {
                anchors.centerIn: parent
                horizontalAlignment: Text.AlignHCenter
                text: qsTr("ONLINE PAYMENT UNAVAILABLE\nPlease contact customer care below.")
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 9
            }
        }
    }

    // crypto panel
    Column {
        width: parent.width
        spacing: 8
        visible: pay.method === "crypto"
        Rectangle {
            width: parent.width
            height: 40
            radius: 8
            visible: App.payCryptoEnabled
            gradient: Gradient {
                GradientStop { position: 0; color: "#f7931a" }
                GradientStop { position: 1; color: "#fbcc5c" }
            }
            Text {
                anchors.centerIn: parent
                text: qsTr("₿ PAY WITH CRYPTO")
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
                    pay.cryptoOpen = !pay.cryptoOpen
                    if (pay.cryptoOpen)
                        App.showCryptoPanel("credits")
                }
            }
        }
        CryptoPayPanel {
            visible: App.payCryptoEnabled && pay.cryptoOpen
            flow: "credits"
            planId: (App.selectedPlan.id || "")
        }
    }

    // OR CONTACT US DIRECTLY
    Item {
        width: parent.width
        height: 14
        Rectangle {
            width: (parent.width - 160) / 2
            height: 1
            y: 7
            color: Theme.border
        }
        Text {
            anchors.centerIn: parent
            text: qsTr("OR CONTACT US DIRECTLY")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 9
        }
        Rectangle {
            x: parent.width - width
            width: (parent.width - 160) / 2
            height: 1
            y: 7
            color: Theme.border
        }
    }
    Row {
        width: parent.width
        spacing: 8
        Rectangle {
            width: (parent.width - 8) / 2
            height: 36
            radius: Theme.radius
            color: Qt.rgba(34/255, 158/255, 217/255, 0.12)
            border.width: 1
            border.color: Qt.rgba(34/255, 158/255, 217/255, 0.4)
            Text {
                anchors.centerIn: parent
                text: qsTr("💬 Telegram")
                color: "#229ed9"
                font.family: Theme.fontUi
                font.pixelSize: 12
                font.weight: Font.Bold
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: App.openExternal("https://t.me/smokescreenapp")
            }
        }
        Rectangle {
            width: (parent.width - 8) / 2
            height: 36
            radius: Theme.radius
            color: Theme.goldG
            border.width: 1
            border.color: Theme.goldD
            Text {
                anchors.centerIn: parent
                text: qsTr("✉️ Email")
                color: Theme.gold
                font.family: Theme.fontUi
                font.pixelSize: 12
                font.weight: Font.Bold
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: App.openExternal("mailto:support@smokescreenapp.com")
            }
        }
    }

    // manual credit key
    Text {
        text: qsTr("▸ Already have a manual credit key?")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 9
        topPadding: 6
    }
    TextField {
        id: keyInput
        width: parent.width
        height: 34
        color: Theme.text
        font.family: Theme.fontMono
        font.pixelSize: 11
        font.letterSpacing: 2
        placeholderText: qsTr("Enter your Credit Key")
        placeholderTextColor: Theme.dim2
        inputMethodHints: Qt.ImhUppercaseOnly
        background: Rectangle {
            radius: Theme.radius
            color: Theme.s2
            border.width: 1
            border.color: App.keyRedeemError.length > 0 ? Theme.red : (keyInput.activeFocus ? Theme.goldD : Theme.border)
        }
        onAccepted: App.redeemCreditKey(keyInput.text)
        onTextEdited: App.clearKeyRedeemError()
    }
    Text {
        width: parent.width
        height: 14
        text: App.keyRedeemError
        color: Theme.red
        font.family: Theme.fontMono
        font.pixelSize: 9
        clip: true
    }
    Rectangle {
        width: parent.width
        height: 36
        radius: Theme.radius
        color: Theme.gold
        Text {
            anchors.centerIn: parent
            text: qsTr("ACTIVATE KEY")
            color: Theme.bg
            font.family: Theme.fontUi
            font.pixelSize: 14
            font.weight: Font.Bold
            font.letterSpacing: 2
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: App.redeemCreditKey(keyInput.text)
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
            text: qsTr("← BACK TO PLANS")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 10
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: {
                App.showPayModal = false
                App.showPlanGate = true
            }
        }
    }
}
