import LiveMorph
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

/**
 * BuyCredits drawer — original BuyCredits-*.js uses:
 *   fixed inset-0 + bg-black/70 backdrop
 *   panel-drawer w-[500px] slide-in-right
 */
Item {
    id: root

    property bool open: false
    property bool closing: false
    property string selectedKey: "mid"
    property string payMethod: "paystack" // paystack | usdt
    readonly property var methodModel: {
        var m = [{
            "id": "paystack",
            "label": "Paystack"
        }];
        var prov = (typeof Backend !== "undefined" && Backend.paymentProviders) ? Backend.paymentProviders : [];
        if (prov.indexOf("nowpayments") >= 0 || prov.indexOf("crypto") >= 0)
            m.push({
            "id": "usdt",
            "label": "USDT"
        });

        return m;
    }
    property string pendingOrderId: ""
    property string cryptoAddress: ""
    property real cryptoAmount: 0
    property string cryptoCurrency: ""
    property string cryptoStatus: ""
    // Prefer the backend package catalog (live prices/credits); fall back to
    // Constants only until the first /payments/packages response arrives.
    readonly property var packageList: {
        const live = (typeof Backend !== "undefined" && Backend.paymentPackages && Backend.paymentPackages.length > 0);
        if (!live)
            return Constants.creditPackages;

        const cps = (typeof Session !== "undefined" && Session.creditsPerSecond > 0) ? Session.creditsPerSecond : 2;
        const out = [];
        for (let i = 0; i < Backend.paymentPackages.length; i++) {
            const p = Backend.paymentPackages[i];
            const cred = Number(p.credits || 0);
            const usd = Number(p.price_usd || 0);
            const naira = (Number(p.price_ngn_kobo || 0) / 100);
            out.push({
                "key": p.key,
                "name": p.name,
                "credits": cred,
                "per": "~" + root.formatSecs(cred / cps),
                "priceUsd": "$" + usd.toFixed(0),
                "priceNgn": "₦" + naira.toLocaleString(),
                "popular": !!p.popular
            });
        }
        return out;
    }

    function formatSecs(sec) {
        sec = Math.round(sec);
        if (sec >= 3600)
            return (sec / 3600).toFixed(1).replace(/\.0$/, "") + " hr";

        if (sec >= 60)
            return Math.round(sec / 60) + " min";

        return sec + "s";
    }

    anchors.fill: parent
    visible: open || closing
    z: 210
    onOpenChanged: {
        if (open) {
            closing = false;
            drawer.x = root.width - drawer.width;
        } else if (visible) {
            closing = true;
            drawer.x = root.width;
            cryptoPoll.stop();
            closeTimer.start();
        }
    }

    Timer {
        id: cryptoPoll

        interval: 5000
        repeat: true
        onTriggered: {
            if (root.pendingOrderId.length > 0)
                Backend.fetchOrderStatus(root.pendingOrderId);

        }
    }

    Timer {
        id: closeTimer

        interval: Theme.motionNormal
        onTriggered: root.closing = false
    }

    // Scrim — original bg-black/70
    Rectangle {
        anchors.fill: parent
        color: Colors.overlayScrim
        opacity: root.open ? 1 : 0

        MouseArea {
            anchors.fill: parent
            onClicked: root.open = false
        }

        Behavior on opacity {
            NumberAnimation {
                duration: 180
                easing.type: Easing.OutCubic
            }

        }

    }

    // Drawer panel — panel-drawer w-[500px]
    Rectangle {
        id: drawer

        width: Math.min(Theme.buyCreditsDrawerWidth, root.width * 0.92)
        height: parent.height
        x: root.open ? root.width - width : root.width
        y: 0
        color: Colors.surfaceOverlay
        border.color: Colors.surfaceBorder
        border.width: 0

        // left edge border + depth approximation
        Rectangle {
            anchors.left: parent.left
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            width: 1
            color: Colors.surfaceBorder
        }

        Rectangle {
            anchors.left: parent.left
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            anchors.leftMargin: 1
            width: 1
            color: Colors.insetHighlightSoft
            opacity: 0.5
        }

        ColumnLayout {
            anchors.fill: parent
            spacing: 0

            // Sticky header
            Rectangle {
                Layout.fillWidth: true
                height: 56
                color: Colors.surfaceRaised

                Rectangle {
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.bottom: parent.bottom
                    height: 1
                    color: Colors.surfaceBorder
                }

                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 20
                    anchors.rightMargin: 12
                    spacing: 12

                    ColumnLayout {
                        spacing: 2
                        Layout.fillWidth: true

                        Text {
                            text: qsTr("Get LiveMorph credits")
                            color: Colors.textPrimary
                            font.pixelSize: 16
                            font.weight: Font.DemiBold
                        }

                        Text {
                            text: "Balance: " + Auth.creditBalance.toLocaleString() + (Auth.bonusBalance > 0 ? ("  ·  Bonus: " + Auth.bonusBalance) : "")
                            color: Colors.textSecondary
                            font.pixelSize: 11
                            font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                        }

                    }

                    Rectangle {
                        width: 32
                        height: 32
                        radius: Theme.radiusSm
                        color: closeMa.containsMouse ? Colors.surfaceOverlay : "transparent"

                        Text {
                            anchors.centerIn: parent
                            text: "✕"
                            color: Colors.textMuted
                            font.pixelSize: 14
                        }

                        MouseArea {
                            id: closeMa

                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: root.open = false
                        }

                    }

                }

            }

            // Payment method tabs
            RowLayout {
                Layout.fillWidth: true
                Layout.leftMargin: 20
                Layout.rightMargin: 20
                Layout.topMargin: 16
                spacing: 8

                Repeater {
                    model: [{
                        "id": "card",
                        "label": "Card"
                    }, {
                        "id": "paystack",
                        "label": "Paystack"
                    }, {
                        "id": "usdt",
                        "label": "USDT",
                        "enabled": true
                    }]

                    Rectangle {
                        width: tabLabel.implicitWidth + 24
                        height: 32
                        radius: Theme.radiusSm
                        color: root.payMethod === modelData.id ? Colors.accent15 : Colors.surfaceRaised
                        border.color: root.payMethod === modelData.id ? Colors.accent : Colors.surfaceBorder
                        border.width: 1
                        opacity: modelData.enabled === false ? 0.45 : 1

                        Text {
                            id: tabLabel

                            anchors.centerIn: parent
                            text: modelData.label
                            color: root.payMethod === modelData.id ? Colors.accent : Colors.textSecondary
                            font.pixelSize: 11
                            font.weight: Font.Medium
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            enabled: modelData.enabled !== false
                            onClicked: root.payMethod = modelData.id
                        }

                    }

                }

                Item {
                    Layout.fillWidth: true
                }

            }

            Text {
                Layout.leftMargin: 20
                Layout.topMargin: 6
                text: root.payMethod === "usdt" ? "Crypto · USDT TRC20/ERC20" : root.payMethod === "paystack" ? "Paystack · NG cards & transfers" : "Visa / Mastercard"
                color: Colors.textMuted
                font.pixelSize: 10
                font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
            }

            // Package list (vertical for drawer density)
            Flickable {
                Layout.fillWidth: true
                Layout.fillHeight: true
                Layout.topMargin: 12
                contentWidth: width
                contentHeight: packagesCol.height
                clip: true
                boundsBehavior: Flickable.StopAtBounds

                ColumnLayout {
                    id: packagesCol

                    width: parent.width
                    spacing: 10
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.leftMargin: 20
                    anchors.rightMargin: 20

                    Repeater {
                        model: root.packageList

                        Rectangle {
                            Layout.fillWidth: true
                            Layout.preferredHeight: 118
                            radius: Theme.radiusLg
                            color: root.selectedKey === modelData.key ? Colors.surfaceElevated : Colors.surfaceRaised
                            border.color: modelData.popular || root.selectedKey === modelData.key ? Colors.accent : Colors.surfaceBorder
                            border.width: modelData.popular || root.selectedKey === modelData.key ? 1.5 : 1

                            // inset highlight
                            Rectangle {
                                anchors.left: parent.left
                                anchors.right: parent.right
                                anchors.top: parent.top
                                height: 1
                                color: Colors.insetHighlight
                                radius: Theme.radiusLg
                            }

                            Rectangle {
                                visible: modelData.popular
                                anchors.top: parent.top
                                anchors.right: parent.right
                                anchors.margins: 10
                                width: popLabel.implicitWidth + 12
                                height: 18
                                radius: 3
                                color: Colors.accent

                                Text {
                                    id: popLabel

                                    anchors.centerIn: parent
                                    text: "MOST POPULAR"
                                    color: Colors.white
                                    font.pixelSize: 9
                                    font.weight: Font.Bold
                                    font.letterSpacing: 0.8
                                }

                            }

                            RowLayout {
                                anchors.fill: parent
                                anchors.margins: 14
                                spacing: 12

                                ColumnLayout {
                                    spacing: 2
                                    Layout.fillWidth: true

                                    Text {
                                        text: modelData.name
                                        color: Colors.textPrimary
                                        font.pixelSize: 14
                                        font.weight: Font.DemiBold
                                    }

                                    Text {
                                        text: modelData.credits + " credits"
                                        color: Colors.accent
                                        font.pixelSize: 20
                                        font.weight: Font.Bold
                                        font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                                    }

                                    Text {
                                        text: modelData.per + " of morph time"
                                        color: Colors.textSecondary
                                        font.pixelSize: 10
                                    }

                                    Text {
                                        text: modelData.priceUsd + "  /  " + modelData.priceNgn
                                        color: Colors.textMuted
                                        font.pixelSize: 11
                                        font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                                    }

                                }

                                PrimaryButton {
                                    text: root.payMethod === "usdt" ? "USDT" : root.payMethod === "paystack" ? "Paystack" : "Pay"
                                    implicitHeight: 36
                                    Layout.preferredWidth: 96
                                    onClicked: {
                                        root.selectedKey = modelData.key;
                                        if (!Backend.reachable) {
                                            App.notify("Backend offline — cannot create order", "error");
                                            return ;
                                        }
                                        if (!Auth.isAuthenticated) {
                                            App.notify("Sign in required", "warning");
                                            App.navigateTo("auth");
                                            return ;
                                        }
                                        App.notify("Creating order for " + modelData.name + "…", "info");
                                        var prov = root.payMethod === "usdt" ? "nowpayments" : root.payMethod === "paystack" ? "paystack" : "paystack";
                                        Backend.createPaymentOrder(modelData.key, prov);
                                    }
                                }

                            }

                            MouseArea {
                                anchors.fill: parent
                                anchors.rightMargin: 110
                                cursorShape: Qt.PointingHandCursor
                                onClicked: root.selectedKey = modelData.key
                            }

                        }

                    }

                }

            }

            // Footer
            Rectangle {
                Layout.fillWidth: true
                height: 64
                color: Colors.surfaceRaised

                Rectangle {
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    height: 1
                    color: Colors.surfaceBorder
                }

                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 20
                    anchors.rightMargin: 20
                    spacing: 12

                    Text {
                        text: "Already paid? Credits can take a moment to appear."
                        color: Colors.textMuted
                        font.pixelSize: 11
                        Layout.fillWidth: true
                        wrapMode: Text.WordWrap
                    }

                    SecondaryButton {
                        text: "Recheck"
                        enabled: root.pendingOrderId.length > 0
                        onClicked: {
                            App.notify("Rechecking payment status…", "info");
                            if (root.cryptoAddress.length > 0)
                                Backend.fetchOrderStatus(root.pendingOrderId);
                            else
                                Backend.verifyPaymentOrder(root.pendingOrderId);
                        }
                    }

                }

            }

            // Crypto invoice tracker (USDT / NOWPayments)
            Rectangle {
                id: cryptoInvoicePanel

                visible: root.cryptoAddress.length > 0
                Layout.fillWidth: true
                Layout.leftMargin: 20
                Layout.rightMargin: 20
                Layout.bottomMargin: 8
                height: visible ? cryptoCol.implicitHeight + 24 : 0
                radius: Theme.radiusMd
                color: Colors.surfaceRaised
                border.color: Colors.accent
                border.width: 1

                ColumnLayout {
                    id: cryptoCol

                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    anchors.margins: 12
                    spacing: 6

                    Text {
                        text: qsTr("Send USDT")
                        color: Colors.accent
                        font.pixelSize: 12
                        font.weight: Font.DemiBold
                    }

                    Text {
                        text: (root.cryptoAmount > 0 ? Number(root.cryptoAmount).toFixed(6) : "—") + " " + (root.cryptoCurrency || "USDT")
                        color: Colors.textPrimary
                        font.pixelSize: 16
                        font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                        font.weight: Font.Bold
                    }

                    Text {
                        text: root.cryptoAddress
                        color: Colors.textSecondary
                        font.pixelSize: 11
                        font.family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
                        wrapMode: Text.WrapAnywhere
                        Layout.fillWidth: true
                    }

                    Text {
                        text: qsTr("Status: %1").arg(root.cryptoStatus || "waiting")
                        color: Colors.textMuted
                        font.pixelSize: 10
                    }

                    RowLayout {
                        spacing: 8

                        SecondaryButton {
                            text: qsTr("Copy address")
                            onClicked: {
                                Backend.copyToClipboard(root.cryptoAddress);
                                App.notify(qsTr("Address copied"), "success");
                            }
                        }

                        SecondaryButton {
                            text: qsTr("Recheck")
                            onClicked: Backend.fetchOrderStatus(root.pendingOrderId)
                        }

                    }

                }

            }

        }

        Behavior on x {
            NumberAnimation {
                duration: Theme.motionNormal
                easing.type: Easing.OutCubic
            }

        }

    }

    Connections {
        function onPaymentOrderCreated(order) {
            root.pendingOrderId = order.order_id || order.id || "";
            root.cryptoAddress = order.pay_address || "";
            root.cryptoAmount = order.pay_amount || 0;
            root.cryptoCurrency = order.pay_currency || "";
            root.cryptoStatus = order.crypto_status || order.status || "";
            var url = order.authorization_url || order.authorizationUrl || "";
            var provider = (order.provider || "").toLowerCase();
            if (url.length) {
                var win = Window.window;
                if (win && win.startPaymentFlight)
                    win.startPaymentFlight(root.pendingOrderId, "card");

                if (win && win.openCheckout)
                    win.openCheckout(url, root.pendingOrderId);
                else
                    Backend.openExternal(url);
                App.notify(qsTr("Complete payment in your browser, then Recheck"), "info");
            } else if (provider === "nowpayments" || provider === "crypto") {
                var w2 = Window.window;
                if (w2 && w2.startPaymentFlight)
                    w2.startPaymentFlight(root.pendingOrderId, "crypto");

                App.notify(qsTr("Send exactly the amount shown to the USDT address"), "info");
                cryptoPoll.restart();
            } else if (provider === "manual") {
                Backend.verifyPaymentOrder(root.pendingOrderId);
            } else {
                App.notify(qsTr("Order created — use Recheck after paying"), "info");
            }
        }

        function onPaymentOrderVerified(result) {
            if (result.in_flight) {
                root.cryptoStatus = result.crypto_status || root.cryptoStatus;
                return ;
            }
            cryptoPoll.stop();
            root.cryptoAddress = "";
            var bal = result.balance || {
            };
            if (bal.credit_balance !== undefined)
                Auth.applyBalance(bal.credit_balance, bal.bonus_balance || 0);

        }

        function onPaymentOrderStatusReceived(status) {
            root.cryptoStatus = status.crypto_status || status.status || root.cryptoStatus;
            if (status.pay_address)
                root.cryptoAddress = status.pay_address;

            if (status.provisioned || status.status === "provisioned") {
                cryptoPoll.stop();
                root.cryptoAddress = "";
                var bal = status.balance || {
                };
                if (bal.credit_balance !== undefined)
                    Auth.applyBalance(bal.credit_balance, bal.bonus_balance || 0);

            }
        }

        function onRequestFailed(ep, err) {
            if (ep.indexOf("payment") >= 0)
                cryptoPoll.stop();

        }

        target: Backend
    }

}
