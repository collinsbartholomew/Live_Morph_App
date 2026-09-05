import LiveEscape
import QtQuick
import QtQuick.Layouts

ModalBase {
    id: root

    readonly property string st: (App.paymentStatus.status || App.paymentStatus.state || "pending").toString().toLowerCase()
    readonly property bool paid: App.paymentStatus.paid === true || st === "success" || st === "successful" || st === "provisioned" || st === "paid"
    readonly property bool failed: st === "failed" || st === "abandoned" || st === "error"
    readonly property string headline: paid ? "PAYMENT CONFIRMED" : (failed ? "PAYMENT ISSUE" : "PAYMENT IN PROGRESS")
    readonly property string detail: paid ? "Your payment was confirmed. Credits and plan access are unlocked — you can close this and continue." : (failed ? "We could not confirm this payment. Try again or contact support with your order reference." : "Finish checkout in the secure in-app window. Live Escape checks the server every few seconds and will update this status automatically.")

    open: App.showPaymentStatus
    modalZ: 535
    onClose: App.showPaymentStatus = false
    panelBorderColor: paid ? Theme.teal : (failed ? Theme.red : Theme.goldDim)

    Text {
        text: root.headline
        color: root.paid ? Theme.teal : (root.failed ? Theme.red : Theme.gold)
        font.family: Theme.fontUi
        font.pixelSize: 16
        font.bold: true
        font.letterSpacing: 2
    }

    Text {
        width: parent.width
        wrapMode: Text.WordWrap
        text: root.detail
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 11
        lineHeight: 1.35
    }

    Rectangle {
        width: parent.width
        height: 36
        radius: Theme.radius
        color: Theme.s2
        border.color: Theme.border

        Text {
            anchors.centerIn: parent
            text: "Status: " + (root.paid ? "confirmed" : (root.st || "pending"))
            color: Theme.text
            font.family: Theme.fontMono
            font.pixelSize: 12
            font.bold: true
        }

    }

    GoldButton {
        width: parent.width
        text: root.paid ? "CONTINUE" : "REFRESH STATUS"
        busy: Api.busy
        onClicked: {
            if (root.paid)
                App.showPaymentStatus = false;
            else
                App.pollPaymentStatus();
        }
    }

    GhostButton {
        width: parent.width
        text: "CLOSE"
        onClicked: App.showPaymentStatus = false
    }

}
