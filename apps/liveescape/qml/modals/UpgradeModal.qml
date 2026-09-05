import LiveEscape
import QtQuick
import QtQuick.Layouts

ModalBase {
    open: App.showUpgradeGate
    modalZ: 510
    panelWidth: Math.min(parent.width * 0.92, 520)
    onClose: App.showUpgradeGate = false

    RowLayout {
        width: parent.width

        Text {
            text: "UPGRADE YOUR PLAN"
            color: Theme.gold
            font.family: Theme.fontUi
            font.pixelSize: 18
            font.bold: true
            font.letterSpacing: 2
            Layout.fillWidth: true
        }

        GhostButton {
            text: "✕"
            onClicked: App.showUpgradeGate = false
        }

    }

    Text {
        width: parent.width
        wrapMode: Text.WordWrap
        text: "Unlock advanced features — backgrounds, higher quality, and more credits."
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 11
    }

    Text {
        text: "Current plan: " + (Session.plan || "starter").toUpperCase()
        color: Theme.text
        font.family: Theme.fontMono
        font.pixelSize: 11
    }

    GoldButton {
        width: parent.width
        text: "VIEW CREDIT PLANS"
        onClicked: {
            App.showUpgradeGate = false;
            App.showPlanGate = true;
        }
    }

    GhostButton {
        width: parent.width
        text: "CONTACT SUPPORT"
        onClicked: App.openExternal("https://t.me/liveescapeapp")
    }

}
