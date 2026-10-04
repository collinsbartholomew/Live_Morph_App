import LiveEscape
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ModalBase {
    id: upgradeRoot
    // Crypto flow (Electron upgradeCryptoPanel): selected plan id while open
    property string cryptoPlan: ""
    open: App.showUpgradeGate
    modalZ: 510
    panelWidth: Math.min(parent.width * 0.92, 520)
    onClose: App.showUpgradeGate = false

    RowLayout {
        width: parent.width

        Text {
            text: qsTr("UPGRADE YOUR PLAN")
            color: Theme.gold
            font.family: Theme.fontUi
            font.pixelSize: 18
            font.bold: true
            font.letterSpacing: 2
            Layout.fillWidth: true
        }

        GhostButton {
            text: qsTr("✕")
            onClicked: App.showUpgradeGate = false
        }

    }

    Text {
        width: parent.width
        wrapMode: Text.WordWrap
        text: qsTr("Upgrade anytime — every credit you haven't used yet carries over. The upgrade price below is discounted because you've already paid for your current plan.")
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 11
    }

    Repeater {
        model: App.upgradeTargets

        Rectangle {
            width: parent.width
            height: cardCol.implicitHeight + 20
            radius: Theme.radius
            color: Theme.s2
            border.color: Theme.goldDim
            border.width: 1

            Column {
                id: cardCol

                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                anchors.margins: 12
                spacing: 8

                RowLayout {
                    width: parent.width

                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 2

                        Text {
                            text: modelData.name.toUpperCase()
                            color: Theme.gold
                            font.family: Theme.fontUi
                            font.pixelSize: 15
                            font.bold: true
                        }

                        Text {
                            visible: modelData.desc && modelData.desc.length > 0
                            text: modelData.desc
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 10
                        }

                    }

                    ColumnLayout {
                        spacing: 2

                        Text {
                            text: "$" + Number(modelData.dollars).toFixed(0)
                            color: Theme.text
                            font.family: Theme.fontMono
                            font.pixelSize: 18
                            font.bold: true
                        }

                        Text {
                            visible: modelData.original_dollars && modelData.original_dollars > modelData.dollars
                            text: "<s>$" + Number(modelData.original_dollars).toFixed(0) + "</s>"
                            color: Theme.dim
                            font.family: Theme.fontMono
                            font.pixelSize: 10
                            textFormat: Text.RichText
                        }

                    }

                }

                Text {
                    visible: modelData.features && modelData.features.length > 0
                    width: parent.width
                    wrapMode: Text.WordWrap
                    text: "✓ " + modelData.features.join(" · ")
                    color: Theme.dim
                    font.family: Theme.fontMono
                    font.pixelSize: 10
                }

                GoldButton {
                    width: parent.width
                    text: "💳 UPGRADE — PAY $" + Number(modelData.dollars).toFixed(0)
                    onClicked: App.selectUpgradePlan(modelData.id)
                }

                // ₿ Crypto (Electron upgradePayBtnCrypto — opens shared panel)
                Rectangle {
                    visible: App.payCryptoEnabled
                    width: parent.width
                    height: 34
                    radius: 8
                    gradient: Gradient {
                        orientation: Gradient.Horizontal
                        GradientStop { position: 0; color: "#f7931a" }
                        GradientStop { position: 1; color: "#fbcc5c" }
                    }

                    Text {
                        anchors.centerIn: parent
                        text: qsTr("₿ PAY $%1 · CRYPTO").arg(Number(modelData.dollars).toFixed(0))
                        color: "#1a0a00"
                        font.family: Theme.fontUi
                        font.pixelSize: 12
                        font.bold: true
                        font.letterSpacing: 1.5
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            upgradeRoot.cryptoPlan = modelData.id
                            App.showCryptoPanel("upgrade")
                        }
                    }
                }

            }

        }

    }

    // Shared crypto panel for the selected upgrade plan (Electron upgradeCryptoPanel)
    CryptoPayPanel {
        visible: App.payCryptoEnabled && upgradeRoot.cryptoPlan.length > 0
        flow: "upgrade"
        planId: upgradeRoot.cryptoPlan
    }

    Text {
        width: parent.width
        wrapMode: Text.WordWrap
        visible: App.upgradeTargets.length === 0
        text: "YOU'RE ALREADY ON " + (Session.plan || "PRO").toUpperCase() + "\nYou already have access to every feature. No further upgrades available."
        color: Theme.dim
        font.family: Theme.fontMono
        font.pixelSize: 11
    }

    GhostButton {
        width: parent.width
        text: qsTr("CONTACT SUPPORT")
        onClicked: App.openExternal("https://t.me/liveescapeapp")
    }

}