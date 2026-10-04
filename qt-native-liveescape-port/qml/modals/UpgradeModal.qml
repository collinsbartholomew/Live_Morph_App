import QtQuick
import SmokeScreen

// #upgradeGate — z 650. Plan-tier upgrade.
ModalBase {
    id: upgrade
    open: App.showUpgradeGate
    modalZ: 650
    panelMaxWidth: 520
    closeOnBackdrop: true
    onClose: App.showUpgradeGate = false

    property string method: "card"
    property bool cryptoOpen: false

    Row {
        width: parent.width
        Text {
            text: qsTr("UPGRADE YOUR PLAN")
            color: Theme.gold
            font.family: Theme.fontUi
            font.pixelSize: 18
            font.weight: Font.Bold
            font.letterSpacing: 2
            width: parent.width - 40
        }
        Rectangle {
            width: 32
            height: 32
            radius: 16
            color: "transparent"
            border.width: 1
            border.color: Qt.rgba(255, 255, 255, 0.15)
            Text {
                anchors.centerIn: parent
                text: "×"
                color: Theme.dim
                font.pixelSize: 18
            }
            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.PointingHandCursor
                onClicked: App.showUpgradeGate = false
            }
        }
    }

    Text {
        width: parent.width
        wrapMode: Text.WordWrap
        text: qsTr("Upgrade anytime — every credit you haven't used yet carries over. The upgrade price below is discounted because you've already paid for your current plan.")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 10
        lineHeight: 1.7
    }

    Repeater {
        model: App.upgradeTargets
        delegate: Rectangle {
            width: parent.width
            height: 96
            radius: Theme.radiusLg
            color: Theme.s2
            border.width: 1
            border.color: Theme.border
            Column {
                anchors.fill: parent
                anchors.margins: 14
                spacing: 6
                Text {
                    text: (modelData.name || modelData.id || "").toString().toUpperCase()
                    color: Theme.gold
                    font.family: Theme.fontUi
                    font.pixelSize: 15
                    font.weight: Font.Bold
                    font.letterSpacing: 2
                }
                Text {
                    width: parent.width
                    text: modelData.features && modelData.features.length ? "✓ " + modelData.features.join(" · ")
                                                                          : (modelData.desc || "")
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 9
                    wrapMode: Text.WordWrap
                }
                Row {
                    spacing: 8
                    Rectangle {
                        width: (parent.parent.width - 8) * 0.55
                        height: 30
                        radius: 8
                        color: Theme.gold
                        Text {
                            anchors.centerIn: parent
                            text: qsTr("💳 UPGRADE — PAY $%1").arg(Number(modelData.dollars || 0).toFixed(0))
                            color: Theme.bg
                            font.family: Theme.fontUi
                            font.pixelSize: 12
                            font.weight: Font.Bold
                            font.letterSpacing: 1
                        }
                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: {
                                upgrade.method = "card"
                                App.selectUpgradePlan(modelData.id)
                            }
                        }
                    }
                    Rectangle {
                        width: (parent.parent.width - 8) * 0.45
                        height: 30
                        radius: 8
                        visible: App.payCryptoEnabled
                        gradient: Gradient {
                            GradientStop { position: 0; color: "#f7931a" }
                            GradientStop { position: 1; color: "#fbcc5c" }
                        }
                        Text {
                            anchors.centerIn: parent
                            text: qsTr("₿ CRYPTO")
                            color: Theme.goldInk
                            font.family: Theme.fontUi
                            font.pixelSize: 12
                            font.weight: Font.Bold
                            font.letterSpacing: 1
                        }
                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: {
                                upgrade.method = "crypto"
                                upgrade.cryptoOpen = true
                                upgrade.cryptoPlanId = modelData.id
                                App.showCryptoPanel("upgrade")
                            }
                        }
                    }
                }
            }
        }
    }
    property string cryptoPlanId: ""

    CryptoPayPanel {
        visible: App.payCryptoEnabled && upgrade.cryptoOpen
        flow: "upgrade"
        planId: upgrade.cryptoPlanId
    }

    Text {
        width: parent.width
        visible: App.upgradeTargets.length === 0
        wrapMode: Text.WordWrap
        text: qsTr("YOU'RE ALREADY ON ") + (Session.plan.length ? Session.plan.toUpperCase() : "PRO") + qsTr("\nYou already have access to every feature. No further upgrades available.")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 11
    }

    Rectangle {
        width: parent.width
        height: 30
        radius: Theme.radius
        color: "transparent"
        border.width: 1
        border.color: Theme.border
        Text {
            anchors.centerIn: parent
            text: qsTr("💬 CONTACT SUPPORT")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 10
        }
        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: App.openExternal("https://t.me/smokescreenapp")
        }
    }
}
