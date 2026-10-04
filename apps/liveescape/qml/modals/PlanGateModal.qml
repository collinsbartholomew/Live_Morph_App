import LiveEscape
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ModalBase {
    open: App.showPlanGate
    modalZ: 500
    panelWidth: Math.min(parent.width * 0.96, 900)
    panelImplicitHeight: Math.min(parent.height * 0.9, 580)
    panelRadius: 24
    onClose: App.showPlanGate = false

    // Use ResponsiveHelper for breakpoints (matches Electron: 900px, 768px, 480px, 360px)
    readonly property int planGridColumns: ResponsiveHelper.planGridColumns

    ColumnLayout {
        anchors.fill: parent
        anchors.margins: ResponsiveHelper.spacingLg
        spacing: ResponsiveHelper.spacingMd

        RowLayout {
            Layout.fillWidth: true

            LogoMark {
                gemSize: 26
                version: App.appVersion
                Layout.fillWidth: true
            }

            GhostButton {
                text: qsTr("✕ CLOSE")
                onClicked: App.showPlanGate = false
            }

        }

        Text {
            text: qsTr("REAL-TIME AI VIDEO TRANSFORMATION")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: ResponsiveHelper.fontSizeXs
            font.letterSpacing: 2
        }

        Text {
            text: qsTr("SELECT A CREDIT PLAN")
            color: Theme.text
            font.family: Theme.fontUi
            font.pixelSize: ResponsiveHelper.fontSizeLg
            font.bold: true
            font.letterSpacing: 3
        }

        Text {
            Layout.fillWidth: true
            wrapMode: Text.WordWrap
            textFormat: Text.RichText
            text: qsTr("Credits power your live AI sessions at <b style='color:" + Theme.gold + "'>120 credits/minute</b>. Purchase once, use anytime — credits never expire.")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: ResponsiveHelper.fontSizeSm
        }

        // Responsive Grid (matches Electron .plan-cards CSS Grid with 4→2→1 cols)
        Flickable {
            Layout.fillWidth: true
            Layout.fillHeight: true
            contentHeight: plansGrid.implicitHeight + ResponsiveHelper.spacingMd
            clip: true
            flickableDirection: Flickable.VerticalFlick

            Grid {
                id: plansGrid
                width: parent.width
                columns: planGridColumns
                spacing: ResponsiveHelper.spacingMd

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
                        width: (plansGrid.width - (plansGrid.columns - 1) * plansGrid.spacing) / plansGrid.columns
                        onClicked: App.selectPlan(modelData.id)
                    }
                }
            }
        }
    }
}