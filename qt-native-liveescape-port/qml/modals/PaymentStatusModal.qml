import QtQuick
import SmokeScreen

// Crypto checkout / proof submission status (supports the payment flows).
ModalBase {
    id: root
    open: App.showCryptoProof || App.showPaymentStatus
    modalZ: 540
    centered: true
    onClose: {
        App.showCryptoProof = false
        App.showPaymentStatus = false
    }

    readonly property var st: App.paymentStatus || ({})

    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: {
            const s = (root.st.state || root.st.status || "pending").toString().toLowerCase()
            if (s === "finished" || s === "confirmed" || s === "paid" || s === "success") return "✅"
            if (s === "failed" || s === "expired") return "❌"
            return "⏳"
        }
        font.pixelSize: 44
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: {
            const s = (root.st.state || root.st.status || "pending").toString().toLowerCase()
            if (s === "finished" || s === "confirmed" || s === "paid" || s === "success") return qsTr("PAYMENT CONFIRMED")
            if (s === "failed" || s === "expired") return qsTr("PAYMENT FAILED")
            return qsTr("AWAITING PAYMENT")
        }
        color: Theme.gold
        font.family: Theme.fontUi
        font.pixelSize: 18
        font.weight: Font.Bold
        font.letterSpacing: 2
    }
    Rectangle {
        width: parent.width
        height: 56
        radius: Theme.radius
        color: Theme.s2
        border.width: 1
        border.color: Theme.border
        Column {
            anchors.centerIn: parent
            spacing: 6
            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: root.st.address || root.st.pay_address || ""
                color: Theme.gold
                font.family: Theme.fontMono
                font.pixelSize: 10
                visible: text.length > 0
            }
            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                text: root.st.pay_amount ? (root.st.pay_amount + " " + (root.st.pay_currency || "")) : ""
                color: Theme.text
                font.family: Theme.fontMono
                font.pixelSize: 11
                visible: text.length > 0
            }
        }
    }
    Text {
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: qsTr("Complete the payment, then this window updates automatically. Crypto is reviewed within 24 hours.")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 9
        lineHeight: 1.6
        wrapMode: Text.WordWrap
    }
    Rectangle {
        width: parent.width
        height: 36
        radius: Theme.radius
        color: "transparent"
        border.width: 1
        border.color: Theme.border
        Text {
            anchors.centerIn: parent
            text: qsTr("CLOSE")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 10
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: {
                App.showCryptoProof = false
                App.showPaymentStatus = false
            }
        }
    }
}
