import LiveEscape
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

Item {
    id: root

    anchors.fill: parent
    visible: App.showCheckoutWeb && App.checkoutUrl.length > 0
    z: 260

    Rectangle {
        anchors.fill: parent
        color: "#000000"
        opacity: 0.8

        MouseArea {
            anchors.fill: parent
        }
    }

    Rectangle {
        anchors.centerIn: parent
        width: Math.min(parent.width - 24, 920)
        height: Math.min(parent.height - 24, 720)
        radius: 12
        color: Theme.s1
        border.color: Theme.goldDim
        clip: true

        ColumnLayout {
            anchors.fill: parent
            anchors.margins: 12
            spacing: 8

            Text {
                text: "SECURE CHECKOUT"
                color: Theme.gold
                font.family: Theme.fontUi
                font.pixelSize: 14
                font.bold: true
                font.letterSpacing: 2
            }

            Text {
                text: "Checkout opened in your system browser. Return here when done."
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 11
                Layout.fillWidth: true
                wrapMode: Text.WordWrap
            }

            Item {
                Layout.fillWidth: true
                Layout.fillHeight: true
            }

            GhostButton {
                text: "DONE / CLOSE"
                onClicked: {
                    App.closeCheckoutWeb();
                    App.pollPaymentStatus();
                }
            }
        }
    }

    Component.onCompleted: {
        if (App.checkoutUrl.length > 0)
            App.openExternal(App.checkoutUrl);
    }
}
