import LiveEscape
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ModalBase {
    id: root

    readonly property string st: (App.paymentStatus.status || App.paymentStatus.state || "pending").toString().toLowerCase()
    readonly property bool paid: App.paymentStatus.paid === true || st === "success" || st === "successful" || st === "provisioned" || st === "paid"
    readonly property bool failed: st === "failed" || st === "abandoned" || st === "error"
    readonly property string headline: paid ? "PAYMENT CONFIRMED" : (failed ? "PAYMENT ISSUE" : "VERIFYING PAYMENT…")
    readonly property string detail: paid ? "Your balance has been updated automatically." : (failed ? "We could not confirm this payment. Try again or contact support with your order reference." : "Your credits will load automatically. This usually takes a few seconds.")
    readonly property string planName: (App.paymentStatus.plan || App.selectedPlan.name || App.selectedPlan.id || "").toString().toUpperCase()
    readonly property int creditsAdded: Number(App.paymentStatus.credits || App.selectedPlan.credits || 0)
    readonly property string reference: App.paymentStatus.reference || App.paymentStatus.ref || ""

    open: App.showPaymentStatus
    modalZ: 535
    onClose: App.showPaymentStatus = false
    panelBorderColor: paid ? Theme.teal : (failed ? Theme.red : Theme.goldDim)

    // Celebration styling when paid
    Rectangle {
        visible: root.paid
        anchors.fill: parent
        color: "transparent"
        border.color: Theme.teal
        border.width: 2
        radius: 16
        opacity: 0.3
    }

    // Headline
    Text {
        text: root.headline
        color: root.paid ? Theme.teal : (root.failed ? Theme.red : Theme.gold)
        font.family: Theme.fontUi
        font.pixelSize: 18
        font.bold: true
        font.letterSpacing: 2
    }

    // Big credits number (when paid)
    Column {
        visible: root.paid && root.creditsAdded > 0
        width: parent.width
        spacing: 4

        Text {
            width: parent.width
            horizontalAlignment: Text.AlignHCenter
            text: root.creditsAdded.toLocaleString(Qt.locale(), "f", 0)
            color: Theme.teal
            font.family: Theme.fontMono
            font.pixelSize: 42
            font.bold: true
        }

        Text {
            width: parent.width
            horizontalAlignment: Text.AlignHCenter
            text: "CREDITS ADDED"
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 9
            font.letterSpacing: 2
        }
    }

    // Plan name (when paid)
    Text {
        visible: root.paid && root.planName.length > 0
        width: parent.width
        horizontalAlignment: Text.AlignHCenter
        text: root.planName + " PLAN"
        color: Theme.gold
        font.family: Theme.fontUi
        font.pixelSize: 14
        font.bold: true
    }

    // Detail text
    Text {
        width: parent.width
        wrapMode: Text.WordWrap
        text: root.detail
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 11
        lineHeight: 1.35
    }

    // Reference display (when paid)
    Rectangle {
        visible: root.paid && root.reference.length > 0
        width: parent.width
        height: refCol.implicitHeight + 16
        radius: Theme.radius
        color: Theme.s2
        border.color: Theme.tealDim
        border.width: 1

        Column {
            id: refCol
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.margins: 8
            spacing: 4

            Text {
                text: "ORDER REFERENCE"
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 8
                font.letterSpacing: 1.5
            }

            Text {
                width: parent.width
                text: root.reference
                color: Theme.teal
                font.family: Theme.fontMono
                font.pixelSize: 12
                font.bold: true
            }
        }
    }

    // Status bar (when pending/failed)
    Rectangle {
        visible: !root.paid
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

    // Action button
    GoldButton {
        width: parent.width
        text: root.paid ? "🚀 CONTINUE STREAMING" : "REFRESH STATUS"
        bg: root.paid ? Theme.teal : Theme.gold
        fg: root.paid ? Theme.bg : Theme.bg
        busy: Api.busy
        onClicked: {
            if (root.paid)
                App.showPaymentStatus = false;
            else
                App.pollPaymentStatus();
        }
    }

    GhostButton {
        visible: !root.paid
        width: parent.width
        text: qsTr("CLOSE")
        onClicked: App.showPaymentStatus = false
    }

}
