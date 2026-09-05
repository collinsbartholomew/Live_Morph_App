import LiveEscape
import QtQuick
import QtQuick.Layouts

ModalBase {
    open: App.showAccountModal
    modalZ: 500
    panelWidth: Math.min(parent.width * 0.9, 480)
    panelImplicitHeight: contentCol.implicitHeight + 48
    onClose: App.showAccountModal = false

    RowLayout {
        width: parent.width

        Text {
            text: "ACCOUNT"
            color: Theme.gold
            font.family: Theme.fontUi
            font.pixelSize: 18
            font.bold: true
            font.letterSpacing: 2
            Layout.fillWidth: true
        }

        GhostButton {
            text: "✕"
            onClicked: App.showAccountModal = false
        }

    }

    Rectangle {
        width: parent.width
        height: 1
        color: Theme.border
    }

    Repeater {
        model: [{
            "k": "EMAIL",
            "v": Session.email || "—"
        }, {
            "k": "USER ID",
            "v": Session.userId || "—"
        }, {
            "k": "PLAN",
            "v": (Session.plan || "starter").toUpperCase()
        }, {
            "k": "STATUS",
            "v": Session.licenseStatus || "—"
        }, {
            "k": "CREDITS",
            "v": Math.floor(Session.creditsRemaining) + " remaining / " + Math.floor(Session.creditsUsed) + " used"
        }, {
            "k": "DEVICE",
            "v": App.deviceId()
        }]

        RowLayout {
            width: parent.width
            spacing: 12

            Text {
                text: modelData.k
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 9
                font.letterSpacing: 1.5
                Layout.preferredWidth: 72
            }

            Text {
                text: modelData.v
                color: Theme.text
                font.family: Theme.fontMono
                font.pixelSize: 11
                elide: Text.ElideMiddle
                Layout.fillWidth: true
            }

        }

    }

    Rectangle {
        width: parent.width
        height: creatorCol.implicitHeight + 20
        radius: Theme.radius
        color: Theme.s2
        border.color: Theme.border

        Column {
            id: creatorCol

            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.margins: 10
            spacing: 8

            Text {
                text: "CREATOR PROGRAM"
                color: Theme.gold
                font.family: Theme.fontMono
                font.pixelSize: 10
                font.letterSpacing: 1.5
                font.bold: true
            }

            Text {
                width: parent.width
                wrapMode: Text.WordWrap
                text: "Share your referral code. Friends who activate earn you bonus credits when eligible."
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 10
            }

            RowLayout {
                width: parent.width

                Text {
                    text: Session.referralCode || "— loading —"
                    color: Theme.text
                    font.family: Theme.fontMono
                    font.pixelSize: 12
                    font.bold: true
                    Layout.fillWidth: true
                }

                GhostButton {
                    text: "COPY"
                    enabled: Session.referralCode && Session.referralCode.length > 0
                    onClicked: {
                        App.copyToClipboard(Session.referralCode);
                        App.toast("Referral code copied", "ok");
                    }
                }

            }

            Text {
                text: "Earned: " + (Session.referralEarned !== undefined ? Session.referralEarned : "0") + " credits"
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 10
            }

        }

    }

    GoldButton {
        width: parent.width
        text: "BUY CREDITS"
        onClicked: {
            App.showAccountModal = false;
            App.showPlanGate = true;
        }
    }

    GhostButton {
        width: parent.width
        text: "UPGRADE PLAN"
        onClicked: {
            App.showAccountModal = false;
            App.openUpgradeFlow();
        }
    }

    GhostButton {
        width: parent.width
        text: "SIGN OUT"
        onClicked: {
            App.showAccountModal = false;
            App.logout();
        }
    }

}
