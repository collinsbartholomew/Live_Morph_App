import LiveEscape
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ModalBase {
    open: App.showPlanGate
    modalZ: 500
    panelWidth: Math.min(parent.width * 0.94, 920)
    panelImplicitHeight: Math.min(parent.height * 0.9, 540)
    panelRadius: 16
    onClose: App.showPlanGate = false

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: 4
        spacing: 12

        RowLayout {
            Layout.fillWidth: true

            LogoMark {
                gemSize: 26
                version: App.appVersion
                Layout.fillWidth: true
            }

            GhostButton {
                text: "✕ CLOSE"
                onClicked: App.showPlanGate = false
            }

        }

        Text {
            text: "SELECT A CREDIT PLAN"
            color: Theme.text
            font.family: Theme.fontUi
            font.pixelSize: 22
            font.bold: true
        }

        Text {
            Layout.fillWidth: true
            wrapMode: Text.WordWrap
            text: "Credits power live AI sessions at ~120 credits/minute. Purchase once — credits never expire."
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 11
        }

        Flickable {
            Layout.fillWidth: true
            Layout.fillHeight: true
            contentWidth: plansRow.implicitWidth
            contentHeight: height
            clip: true
            flickableDirection: Flickable.HorizontalFlick

            Row {
                id: plansRow

                spacing: 14
                anchors.verticalCenter: parent.verticalCenter

                Repeater {
                    model: App.plans

                    PlanCard {
                        planId: modelData.id
                        title: modelData.name
                        price: modelData.dollars
                        credits: modelData.credits
                        timeLabel: modelData.timeLabel
                        popular: modelData.popular === true
                        features: modelData.features
                        onClicked: App.selectPlan(modelData.id)
                    }

                }

            }

        }

    }

}
