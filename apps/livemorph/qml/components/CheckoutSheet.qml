import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

/**
 * Checkout sheet — hands off to the system browser via Backend.openExternal,
 * then polls for payment completion via Recheck.
 */
Item {
    id: root
    anchors.fill: parent
    visible: open
    z: 300

    property bool open: false
    property string checkoutUrl: ""
    property string orderId: ""
    property string statusText: qsTr("Complete payment below")

    signal closed()
    signal completed(string orderId, string reference)

    function openCheckout(url, oid) {
        var u = (url || "").trim()
        // Only allow http(s) checkout URLs (Paystack hosted pages)
        if (u.length && !(u.indexOf("https://") === 0 || u.indexOf("http://") === 0)) {
            App.notify(qsTr("Invalid checkout URL"), "error")
            return
        }
        checkoutUrl = u
        orderId = oid || ""
        open = true
        statusText = qsTr("Complete payment below")
        if (checkoutUrl.length) {
            Backend.openExternal(checkoutUrl)
            statusText = qsTr("Browser opened — return here when done")
        }
    }

    function close() {
        open = false
        closed()
    }

    Rectangle {
        anchors.fill: parent
        color: Colors.overlayScrim
        opacity: 0.85
        MouseArea { anchors.fill: parent }
    }

    Rectangle {
        anchors.centerIn: parent
        width: Math.min(parent.width - 24, 540)
        height: Math.min(parent.height - 40, 740)
        radius: Theme.radiusLg
        color: Colors.surfaceRaised
        border.color: Colors.surfaceBorder
        border.width: 1
        clip: true

        ColumnLayout {
            anchors.fill: parent
            spacing: 0

            Rectangle {
                Layout.fillWidth: true
                height: 52
                color: Colors.surfaceOverlay
                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 16
                    anchors.rightMargin: 8
                    spacing: 8
                    Text {
                        text: qsTr("Secure checkout")
                        color: Colors.textPrimary
                        font.pixelSize: 15
                        font.bold: true
                        Layout.fillWidth: true
                    }
                    Text {
                        text: root.statusText
                        color: Colors.textMuted
                        font.pixelSize: 10
                        elide: Text.ElideRight
                        Layout.maximumWidth: 160
                    }
                    GhostButton {
                        text: qsTr("Close")
                        onClicked: root.close()
                    }
                }
            }

            Item {
                Layout.fillWidth: true
                Layout.fillHeight: true

                Column {
                    anchors.centerIn: parent
                    spacing: 14
                    width: parent.width * 0.88
                    Text {
                        width: parent.width
                        wrapMode: Text.WordWrap
                        horizontalAlignment: Text.AlignHCenter
                        color: Colors.textSecondary
                        font.pixelSize: 13
                        text: qsTr("Checkout opened in your system browser. After paying, tap Recheck.")
                    }
                    PrimaryButton {
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: qsTr("I've paid — Recheck")
                        onClicked: root.completed(root.orderId, "")
                    }
                }
            }

            Rectangle {
                Layout.fillWidth: true
                height: 56
                color: Colors.surfaceOverlay
                RowLayout {
                    anchors.fill: parent
                    anchors.margins: 12
                    GhostButton {
                        text: qsTr("Cancel")
                        onClicked: root.close()
                    }
                    Item { Layout.fillWidth: true }
                    SecondaryButton {
                        text: qsTr("Recheck")
                        onClicked: root.completed(root.orderId, "")
                    }
                }
            }
        }
    }
}
