import QtQuick
import QtQuick.Controls
import SmokeScreen

// #accountModal — z 600. Exact reference structure §21.
ModalBase {
    id: acc
    open: App.showAccountModal
    modalZ: 600
    panelMaxWidth: 440
    panelPaddingH: 32
    onClose: App.showAccountModal = false

    readonly property string initial: {
        const n = Session.displayName.length ? Session.displayName : Session.email
        return n.length ? n.charAt(0).toUpperCase() : "?"
    }
    readonly property bool creatorTier: {
        const p = (Session.plan || "").toLowerCase()
        return p === "creator" || p === "pro"
    }

    component InfoRow: Item {
        property string label: ""
        property string value: ""
        property color valueColor: Theme.text
        width: parent.width
        height: 34
        Text {
            anchors.left: parent.left
            anchors.verticalCenter: parent.verticalCenter
            text: parent.label
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 9
            font.letterSpacing: 1.5
        }
        Text {
            anchors.right: parent.right
            anchors.verticalCenter: parent.verticalCenter
            text: parent.value
            color: parent.valueColor
            font.family: Theme.fontMono
            font.pixelSize: 9
            font.weight: Font.Bold
            elide: Text.ElideRight
        }
        Rectangle {
            anchors.bottom: parent.bottom
            width: parent.width
            height: 1
            color: Theme.border
        }
    }

    component AccBtn: Rectangle {
        property string label: ""
        property color fg: Theme.dim
        height: 30
        radius: Theme.radius
        color: "transparent"
        border.width: 1
        border.color: fg === Theme.red ? Qt.rgba(255/255, 77/255, 109/255, 0.3) : Theme.border
        Text {
            anchors.centerIn: parent
            text: parent.label
            color: parent.fg
            font.family: Theme.fontMono
            font.pixelSize: 9
            font.letterSpacing: 1
        }
    }

    // ── header ──
    Row {
        width: parent.width
        spacing: 14
        Rectangle {
            width: 48
            height: 48
            radius: 24
            color: Theme.goldD
            border.width: 2
            border.color: Theme.gold
            anchors.verticalCenter: parent.verticalCenter
            Text {
                anchors.centerIn: parent
                text: acc.initial
                color: Theme.gold
                font.family: Theme.fontMono
                font.pixelSize: 22
                font.weight: Font.Bold
            }
        }
        Column {
            anchors.verticalCenter: parent.verticalCenter
            spacing: 2
            Text {
                text: Session.displayName.length ? Session.displayName : "—"
                color: Theme.text
                font.family: Theme.fontUi
                font.pixelSize: 18
                font.weight: Font.Bold
                font.letterSpacing: 2
            }
            Text {
                text: Session.email.length ? Session.email : "—"
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 9
                font.letterSpacing: 1
            }
        }
    }

    // ── info rows ──
    Column {
        width: parent.width
        spacing: 0

        InfoRow { label: qsTr("DEVICE ID"); value: App.deviceId(); valueColor: Theme.gold }
        InfoRow { label: qsTr("LICENSE STATUS"); value: Session.licenseStatus; valueColor: Theme.teal }
        InfoRow { label: qsTr("LICENSE EXPIRES"); value: Session.licenseExpiry.length ? Session.licenseExpiry : "—" }
        InfoRow { label: qsTr("CREDITS REMAINING"); value: Math.round(Session.creditsRemaining).toLocaleString(); valueColor: Theme.teal }
        InfoRow { label: qsTr("CREDITS USED"); value: Math.round(Session.creditsUsed).toLocaleString(); valueColor: Theme.red }
        InfoRow { label: qsTr("PLAN"); value: Session.plan.length ? Session.plan.toUpperCase() : "—"; valueColor: Theme.gold }
    }

    // ── referral program ──
    Rectangle {
        width: parent.width
        height: refCol.implicitHeight + 24
        radius: Theme.radius
        color: Qt.rgba(63/255, 232/255, 184/255, 0.05)
        border.width: 1
        border.color: Qt.rgba(63/255, 232/255, 184/255, 0.15)
        Column {
            id: refCol
            anchors.centerIn: parent
            width: parent.width - 24
            spacing: 6
            Text {
                text: qsTr("🎁 REFERRAL PROGRAM")
                color: Theme.teal
                font.family: Theme.fontMono
                font.pixelSize: 9
                font.letterSpacing: 1.5
            }
            Row {
                spacing: 8
                Text {
                    anchors.verticalCenter: parent.verticalCenter
                    text: qsTr("YOUR CODE:")
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 9
                }
                Text {
                    anchors.verticalCenter: parent.verticalCenter
                    text: Session.referralCode.length ? Session.referralCode : "—"
                    color: Theme.gold
                    font.family: Theme.fontMono
                    font.pixelSize: 12
                    font.weight: Font.Bold
                    font.letterSpacing: 2
                }
                Rectangle {
                    anchors.verticalCenter: parent.verticalCenter
                    width: copyRefTxt.implicitWidth + 16
                    height: 20
                    radius: 4
                    color: Theme.s2
                    border.width: 1
                    border.color: Theme.border
                    Text {
                        id: copyRefTxt
                        anchors.centerIn: parent
                        text: qsTr("COPY")
                        color: Theme.dim
                        font.family: Theme.fontMono
                        font.pixelSize: 8
                    }
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: App.copyToClipboard(Session.referralCode)
                    }
                }
            }
            Text {
                width: parent.width
                textFormat: Text.RichText
                text: qsTr("Share your code with friends. When they sign up & buy credits, you both earn <b style='color:#3fe8b8'>100 free credits</b>.<br>Referral credits earned: <b style='color:#3fe8b8'>%1</b>").arg(Math.round(Session.referralEarned))
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 9
                lineHeight: 1.6
                wrapMode: Text.WordWrap
            }
        }
    }

    // ── creator payout (creator/pro) ──
    Column {
        width: parent.width
        spacing: 6
        visible: acc.creatorTier

        Text {
            text: qsTr("🏦 CREATOR PROGRAM — PAYOUT DETAILS")
            color: Theme.gold
            font.family: Theme.fontMono
            font.pixelSize: 9
            font.letterSpacing: 1.5
        }
        TextField {
            id: payoutName
            width: parent.width
            height: 30
            text: App.payoutDetails.account_name || ""
            color: Theme.text
            font.family: Theme.fontMono
            font.pixelSize: 10
            placeholderText: qsTr("Full name on account")
            placeholderTextColor: Theme.dim2
            background: Rectangle { radius: Theme.radius; color: Theme.s2; border.width: 1; border.color: Theme.border }
        }
        TextField {
            id: payoutBank
            width: parent.width
            height: 30
            text: App.payoutDetails.bank_name || ""
            color: Theme.text
            font.family: Theme.fontMono
            font.pixelSize: 10
            placeholderText: qsTr("e.g. GTBank, Zenith, UBA")
            placeholderTextColor: Theme.dim2
            background: Rectangle { radius: Theme.radius; color: Theme.s2; border.width: 1; border.color: Theme.border }
        }
        TextField {
            id: payoutNumber
            width: parent.width
            height: 30
            text: App.payoutDetails.account_number || ""
            color: Theme.text
            font.family: Theme.fontMono
            font.pixelSize: 10
            placeholderText: qsTr("10-digit account number")
            placeholderTextColor: Theme.dim2
            background: Rectangle { radius: Theme.radius; color: Theme.s2; border.width: 1; border.color: Theme.border }
        }
        Rectangle {
            width: parent.width
            height: 32
            radius: Theme.radius
            color: Theme.gold
            Text {
                anchors.centerIn: parent
                text: qsTr("SAVE PAYOUT DETAILS")
                color: Theme.bg
                font.family: Theme.fontUi
                font.pixelSize: 13
                font.weight: Font.Bold
                font.letterSpacing: 2
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: App.savePayoutDetails(payoutName.text, payoutBank.text, payoutNumber.text, "", "")
            }
        }
    }

    // ── buttons ──
    Row {
        width: parent.width
        spacing: 8
        AccBtn {
            width: (parent.width - 16) / 3
            label: qsTr("← BACK")
            MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: App.showAccountModal = false }
        }
        AccBtn {
            width: (parent.width - 16) / 3
            label: qsTr("📈 UPGRADE")
            fg: Theme.gold
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: { App.showAccountModal = false; App.openUpgradeFlow() }
            }
        }
        AccBtn {
            width: (parent.width - 16) / 3
            label: qsTr("🎟️ CREDITS")
            fg: Theme.teal
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: { App.showAccountModal = false; App.showPlanGate = true }
            }
        }
    }
    Row {
        width: parent.width
        spacing: 8
        Rectangle {
            width: (parent.width - 8) / 2
            height: 30
            radius: Theme.radius
            color: Qt.rgba(255/255, 77/255, 109/255, 0.08)
            border.width: 1
            border.color: Qt.rgba(255/255, 77/255, 109/255, 0.3)
            Text {
                anchors.centerIn: parent
                text: qsTr("⏏ SIGN OUT")
                color: Theme.red
                font.family: Theme.fontMono
                font.pixelSize: 9
                font.letterSpacing: 1
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: { App.showAccountModal = false; App.logout() }
            }
        }
        Rectangle {
            width: (parent.width - 8) / 2
            height: 30
            radius: Theme.radius
            color: "transparent"
            border.width: 1
            border.color: Theme.border
            Text {
                anchors.centerIn: parent
                text: qsTr("💬 SUPPORT")
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 9
                font.letterSpacing: 1
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: App.openExternal("https://t.me/smokescreenapp")
            }
        }
    }

    Component.onCompleted: if (Session.authenticated) App.loadPayoutDetails()
}
