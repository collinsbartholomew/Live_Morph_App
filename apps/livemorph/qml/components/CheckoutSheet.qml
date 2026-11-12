import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

/**
 * Checkout sheet — hands off to the system browser via Backend.openExternal
 * (HTTPS-only URLs), then the footer Recheck verifies the order.
 * Nocturne redesign: icon-tile header + status pill, centered body with the
 * order chip, gradient CTA to reopen, Recheck as the primary footer action.
 */
Item {
    id: root
    anchors.fill: parent
    visible: open
    z: Theme.zSheet

    property bool open: false
    property string checkoutUrl: ""
    property string orderId: ""
    property string statusText: qsTr("Complete payment below")

    signal closed()
    signal completed(string orderId, string reference)

    // Host allowlist for hosted checkout pages — the URL comes from the
    // backend, so a compromised backend must not be able to send the user to
    // a look-alike page. Known providers, or the configured API host itself
    // (self-hosted checkout in dev).
    function checkoutHostAllowed(u) {
        var host = u.substring(8).split("/")[0].toLowerCase()
        if (!host) return false
        var apiHost = ""
        try { apiHost = String(Config.apiBaseUrl).replace(/^https?:\/\//, "").split("/")[0].toLowerCase() } catch (e) {}
        if (apiHost && host === apiHost) return true
        // Exact provider host or a proper subdomain — a bare endsWith would
        // also accept "evilpaystack.com".
        return host === "paystack.com" || host.endsWith(".paystack.com")
            || host === "nowpayments.io" || host.endsWith(".nowpayments.io")
            || host === "flutterwave.com" || host.endsWith(".flutterwave.com")
    }

    function openCheckout(url, oid) {
        var u = (url || "").trim()
        // Only allow https checkout URLs (hosted payment pages)
        if (!u.length || u.indexOf("https://") !== 0) {
            App.notify(qsTr("Invalid checkout URL"), "error", "payment")
            return
        }
        if (!checkoutHostAllowed(u)) {
            App.notify(qsTr("Refusing checkout URL from an unrecognized host"), "error", "payment")
            return
        }
        checkoutUrl = u
        orderId = oid || ""
        open = true
        statusText = qsTr("Browser opened — return here when done")
        Backend.openExternal(checkoutUrl)
    }

    function close() {
        open = false
        verifying = false
        checkoutUrl = ""
        orderId = ""
        statusText = qsTr("Complete payment below")
        closed()
    }

    property bool verifying: false

    // Scrim
    Rectangle {
        anchors.fill: parent
        color: Colors.overlayScrim
        opacity: 0.85
        MouseArea { anchors.fill: parent; onClicked: root.close() }
    }

    // Card — clipped so the honeycomb wash respects the rounded corners;
    // the top hairline hexes sit INSIDE (topMargin 4) instead of straddling.
    Rectangle {
        id: card
        anchors.centerIn: parent
        width: Math.min(parent.width - 24, 480)
        height: Math.min(parent.height - 40, 420)
        radius: Theme.radiusLg
        color: Colors.surfaceRaised
        border.color: Colors.surfaceBorder
        border.width: 1
        clip: true

        // Faint honeycomb wash (signature texture on modal cards)
        Honeycomb {
            anchors.fill: parent
            cellSize: Theme.honeycombCell
            lineColor: Colors.honeycombLineFaint
            opacity: 0.45
        }

        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 1
            color: Colors.white35
            z: Theme.zLocal1
        }
        Hexagon {
            size: 8
            lineWidth: 1.5
            lineColor: Colors.accent
            anchors.left: parent.left
            anchors.leftMargin: 14
            anchors.top: parent.top
            anchors.topMargin: 4
            z: Theme.zLocal1
        }
        Hexagon {
            size: 8
            lineWidth: 1.5
            lineColor: Colors.accent
            anchors.right: parent.right
            anchors.rightMargin: 14
            anchors.top: parent.top
            anchors.topMargin: 4
            z: Theme.zLocal1
        }
        CornerTicks {
            anchors.fill: parent
            inset: 6
            tickSize: 8
            thickness: 1
            color: Colors.accent30
            z: Theme.zLocal1
        }

        ColumnLayout {
            anchors.fill: parent
            spacing: 0

            // Header: shield hex + title + status pill + close disc
            Rectangle {
                Layout.fillWidth: true
                height: Theme.drawerHeaderHeight
                color: Colors.surfaceOverlay

                Rectangle {
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.bottom: parent.bottom
                    height: 1
                    color: Colors.surfaceBorderSubtle
                }

                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 14
                    anchors.rightMargin: 10
                    spacing: 10

                    HexBadge {
                        size: 30
                        iconName: "shield-check"
                        iconSize: 15
                        lineWidth: 1
                        lineColor: Colors.accent30
                        fillColor: Colors.accent12
                        iconColor: Colors.accentHover
                    }

                    Text {
                        text: qsTr("Secure checkout")
                        color: Colors.textPrimary
                        font.pixelSize: 14
                        font.weight: Font.Bold
                        Layout.fillWidth: true
                        elide: Text.ElideRight
                    }

                    // Status pill
                    Rectangle {
                        radius: Theme.radiusXs
                        color: Colors.accent10
                        border.color: Colors.accent30
                        border.width: 1
                        implicitWidth: statusLbl.implicitWidth + 12
                        implicitHeight: 20
                        Layout.alignment: Qt.AlignVCenter
                        Text {
                            id: statusLbl
                            anchors.centerIn: parent
                            width: Math.min(implicitWidth, 180)
                            elide: Text.ElideRight
                            horizontalAlignment: Text.AlignHCenter
                            text: root.statusText
                            color: Colors.accentHover
                            font.pixelSize: 9
                            font.family: Theme.fontMono.family
                            font.weight: Font.Bold
                        }
                    }

                    Rectangle {
                        width: 26; height: 26
                        radius: Theme.radiusFull
                        color: closeMa.containsMouse ? Colors.overlay50 : Colors.transparent
                        Layout.alignment: Qt.AlignVCenter
                        Icon {
                            anchors.centerIn: parent
                            name: "x"
                            size: 13
                            emphasis: true
                            color: closeMa.containsMouse ? Colors.textPrimary : Colors.textMuted
                        }
                        MouseArea {
                            id: closeMa
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: root.close()
                        }
                    }
                }
            }

            // Body
            Item {
                Layout.fillWidth: true
                Layout.fillHeight: true

                Column {
                    anchors.centerIn: parent
                    spacing: 14
                    width: parent.width * 0.86

                    Item {
                        width: 52; height: 52
                        anchors.horizontalCenter: parent.horizontalCenter
                        Hexagon {
                            anchors.centerIn: parent
                            size: 52
                            lineWidth: 1.5
                            lineColor: Colors.accent20
                            fillColor: Colors.accent10
                        }
                        Icon {
                            anchors.centerIn: parent
                            name: "external-link"
                            size: 20
                            color: Colors.accent
                        }
                    }

                    Text {
                        width: parent.width
                        wrapMode: Text.WordWrap
                        horizontalAlignment: Text.AlignHCenter
                        color: Colors.textSecondary
                        font.pixelSize: 13
                        lineHeight: 1.45
                        text: qsTr("Checkout opened in your system browser. After paying, come back and tap Recheck to confirm.")
                    }

                    // Order chip
                    Rectangle {
                        visible: root.orderId.length > 0
                        anchors.horizontalCenter: parent.horizontalCenter
                        radius: Theme.radiusFull
                        color: Colors.surfaceElevated
                        border.color: Colors.surfaceBorderSubtle
                        border.width: 1
                        implicitWidth: orderLbl.implicitWidth + 14
                        implicitHeight: 24
                        Text {
                            id: orderLbl
                            anchors.centerIn: parent
                            text: qsTr("ORDER %1").arg(root.orderId)
                            color: Colors.textMuted
                            font.family: Theme.fontMono.family
                            font.pixelSize: 9
                            font.weight: Font.Bold
                            font.letterSpacing: 1.0
                            elide: Text.ElideMiddle
                            width: Math.min(implicitWidth, card.width - 48)
                        }
                    }

                    PrimaryButton {
                        anchors.horizontalCenter: parent.horizontalCenter
                        cta: true
                        text: qsTr("Reopen in browser")
                        enabled: root.checkoutUrl.length > 0
                        onClicked: if (root.checkoutUrl.length) Backend.openExternal(root.checkoutUrl)
                    }
                }
            }

            // Footer: cancel left, Recheck (primary) right
            Rectangle {
                Layout.fillWidth: true
                height: 60
                color: Colors.surfaceOverlay

                Rectangle {
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    height: 1
                    color: Colors.surfaceBorderSubtle
                }

                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 14
                    anchors.rightMargin: 14
                    spacing: 10

                    GhostButton {
                        text: qsTr("Cancel")
                        onClicked: root.close()
                    }
                    Item { Layout.fillWidth: true }
                    PrimaryButton {
                        text: root.verifying ? qsTr("Checking…") : qsTr("Recheck payment")
                        enabled: root.orderId.length > 0 && !root.verifying
                        onClicked: {
                            if (root.verifying)
                                return
                            root.verifying = true
                            root.completed(root.orderId, "")
                            verifyReset.restart()
                        }
                        Timer {
                            id: verifyReset
                            interval: 4000
                            onTriggered: root.verifying = false
                        }
                    }
                }
            }
        }
    }
}
