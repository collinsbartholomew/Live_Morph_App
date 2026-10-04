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
    // Electron: NOTHING preselected — CTA stays "Pick a payment method above"
    // until the user chooses; Crypto is listed FIRST.
    property string payMethod: ""
    readonly property var methodModel: {
        var m = [];
        var prov = (typeof Backend !== "undefined" && Backend.paymentProviders) ? Backend.paymentProviders : [];
        if (prov.indexOf("nowpayments") >= 0 || prov.indexOf("crypto") >= 0)
            m.push({
            "id": "usdt",
            "label": "Pay with Crypto",
            "subtitle": "USDT, USDC, SOL, TRX, TON & more · confirms in <1 min · worldwide"
        });
        m.push({
            "id": "paystack",
            "label": "Pay in NGN",
            "subtitle": "Nigerian-issued cards only"
        });
        return m;
    }
    property string pendingOrderId: ""
    property string cryptoAddress: ""
    property real cryptoAmount: 0
    property string cryptoCurrency: ""
    property string cryptoStatus: ""
    property real paymentStartedAt: 0
    property bool paymentSuccess: false
    property int elapsedSecs: 0
    // Electron tier subtitles (verbatim) + price-size ladder
    readonly property var tierConfig: ({
        "basic":   { "priceSize": 22, "subtitle": "" },
        "starter": { "priceSize": 26, "subtitle": "" },
        "mid":     { "priceSize": 36, "subtitle": "Most creators land here · 10,000 credits ≈ 83 minutes of live swap time." },
        "pro":     { "priceSize": 40, "subtitle": "For studios and full session days · 45,000 credits ≈ 6 hours." }
    })
    // Electron HD_PACKAGE_KEYS: starter, mid, pro
    readonly property var hdTiers: ["starter", "mid", "pro"]
    readonly property var coinLogos: ({
        "usdt":  { "color": "#26A17B", "symbol": "\u0D83" },
        "usdc":  { "color": "#3E73C4", "symbol": "$" },
        "btc":   { "color": "#F7931A", "symbol": "\u20BF" },
        "eth":   { "color": "#627EEA", "symbol": "\u039E" },
        "sol":   { "color": "#66F9A1", "symbol": "S" },
        "trx":   { "color": "#EF0027", "symbol": "T" },
        "bnb":   { "color": "#F3BA2F", "symbol": "B" },
        "matic": { "color": "#6F41D8", "symbol": "M" },
        "xrp":   { "color": "#23292F", "symbol": "X" },
        "ton":   { "color": "#0098EA", "symbol": "T" }
    })
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
                "per": root.formatDuration(cred / cps),
                "priceUsd": "$" + usd.toFixed(0),
                "priceUsdNum": usd,
                "priceNgn": "\u20A6" + naira.toLocaleString(),
                "popular": !!p.popular,
                "hd": root.hdTiers.indexOf(p.key) >= 0,
                "subtitle": (root.tierConfig[p.key] || {}).subtitle || "",
                "priceSize": (root.tierConfig[p.key] || {}).priceSize || 18
            });
        }
        return out;
    }

    function formatElapsed(totalSecs) {
        var m = Math.floor(totalSecs / 60)
        var s = totalSecs % 60
        return m + ":" + (s < 10 ? "0" : "") + s
    }

    // Electron formatDuration: floor minutes, then compact "1h 23m" past an
    // hour — NO "~" prefix and no decimals.
    function formatDuration(totalSecs) {
        var mins = Math.floor(totalSecs / 60)
        if (mins < 60)
            return mins + " min"
        var h = Math.floor(mins / 60)
        var m = mins % 60
        return m > 0 ? (h + "h " + m + "m") : (h + "h")
    }

    function savingsPercent(idx) {
        if (idx === 0 || root.packageList.length < 2) return 0
        var basePerCredit = root.packageList[0].priceUsdNum / root.packageList[0].credits
        var thisPerCredit = root.packageList[idx].priceUsdNum / root.packageList[idx].credits
        return Math.round((1 - thisPerCredit / basePerCredit) * 100)
    }

    function redeemKey() {
        var key = creditKeyInput.text.trim()
        if (key.length < 8) {
            App.notify("Enter a valid credit key", "warning")
            return
        }
        App.notify("Activating credit key\u2026", "info")
        Backend.redeemCreditKey(key)
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

    // Escalation messages timer
    Timer {
        id: escalationTimer

        interval: 600000 // 10 minutes
        repeat: true
        running: root.pendingOrderId.length > 0 && root.cryptoAddress.length > 0
        onTriggered: {
            var elapsed = (Date.now() - root.paymentStartedAt) / 1000
            if (elapsed > 1800) {
                App.notify("Payment pending for over 30 min — contact support if this persists", "warning")
            } else {
                App.notify("Payment pending — ensure exact amount was sent to the address", "info")
            }
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

    Timer {
        id: elapsedTimer
        interval: 1000
        repeat: true
        running: root.cryptoAddress.length > 0 && root.paymentStartedAt > 0
        onTriggered: root.elapsedSecs = Math.floor((Date.now() - root.paymentStartedAt) / 1000)
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
        // Electron panel-drawer background: #17171f (surface-overlay)
        color: Colors.surfaceOverlay
        border.color: Colors.surfaceBorder
        border.width: 0

        // Panel hairline — accent gradient at top
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 1
            z: 1
            gradient: Gradient {
                GradientStop { position: 0.0; color: "transparent" }
                GradientStop { position: 0.5; color: Colors.accent60 }
                GradientStop { position: 1.0; color: "transparent" }
            }
        }

        // Panel drawer shadow — layered depth
        Rectangle {
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            anchors.right: parent.right
            anchors.rightMargin: -8
            width: 8
            color: Colors.shadow
            opacity: 0.35
        }

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
                            text: qsTr("Buy credits")
                            color: Colors.textPrimary
                            font.pixelSize: 16
                            font.weight: Font.DemiBold
                        }

                        Text {
                            text: "Balance: " + Auth.creditBalance.toLocaleString() + (Auth.bonusBalance > 0 ? ("  ·  Bonus: " + Auth.bonusBalance) : "")
                            color: Colors.textSecondary
                            font.pixelSize: 11
                            font.family: Theme.fontMono.family
                        }

                    }

                    Rectangle {
                        width: 28
                        height: 28
                        radius: Theme.radiusSm
                        color: closeMa.containsMouse ? Colors.surfaceOverlay : "transparent"

                        Icon {
                            anchors.centerIn: parent
                            name: "x"
                            size: Theme.iconMd
                            color: Colors.textSecondary
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
                            property bool isSelected: root.selectedKey === modelData.key

                            Layout.fillWidth: true
                            Layout.preferredHeight: modelData.popular ? 76 : 68
                            radius: Theme.radiusMd
                            // Electron: selected = bg-accent/[0.06] (subtle!) +
                            // shadow-glow-sm + full accent border; unselected
                            // hover adds border-accent/40. The old /20 fill
                            // read as a heavy violet block.
                            color: isSelected ? Colors.accent06
                                  : (pkgMa.containsMouse ? Colors.accent06 : Colors.surfaceBase)
                            border.color: isSelected ? Colors.accent
                                  : (pkgMa.containsMouse ? Colors.accent40 : Colors.surfaceBorder)
                            border.width: 1
                            Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
                            Behavior on border.color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }

                            // shadow-glow-sm (selected only): 8px violet 15%
                            Rectangle {
                                visible: isSelected
                                anchors.centerIn: parent
                                width: parent.width + 8
                                height: parent.height + 8
                                radius: parent.radius + 4
                                color: Colors.accent
                                opacity: 0.15
                                z: -1
                            }

                            // Popular left accent bar
                            Rectangle {
                                visible: modelData.popular
                                anchors.left: parent.left
                                anchors.top: parent.top
                                anchors.bottom: parent.bottom
                                anchors.margins: 6
                                width: 2
                                radius: 1
                                color: Colors.accent
                            }

                            RowLayout {
                                anchors.fill: parent
                                anchors.leftMargin: modelData.popular ? 16 : 14
                                anchors.rightMargin: 14
                                spacing: 12

                                // Index label
                                Text {
                                    text: String(index + 1).padStart(2, "0")
                                    color: isSelected ? Colors.accentMuted : Colors.textMuted
                                    font.pixelSize: 10
                                    font.family: Theme.fontMono.family
                                    font.letterSpacing: 1
                                    opacity: 0.5
                                }

                                ColumnLayout {
                                    spacing: 1
                                    Layout.fillWidth: true

                                    Row {
                                        spacing: 6
                                        Text {
                                            text: modelData.name
                                            color: Colors.textPrimary
                                            font.pixelSize: 13
                                            font.weight: Font.DemiBold
                                        }
                                        Rectangle {
                                            visible: modelData.hd === true
                                            height: 14
                                            width: hdLabel.implicitWidth + 8
                                            radius: 3
                                            color: Colors.accent10
                                            border.color: Colors.accent40
                                            border.width: 1
                                            anchors.verticalCenter: parent.verticalCenter
                                            Text {
                                                id: hdLabel
                                                anchors.centerIn: parent
                                                text: "HD"
                                                color: Colors.accentHover
                                                font.pixelSize: 8
                                                font.family: Theme.fontMono.family
                                                font.weight: Font.Bold
                                                font.letterSpacing: 0.5
                                            }
                                        }
                                    }

                                    Text {
                                        text: modelData.credits + " cr \u00B7 " + modelData.per
                                        color: Colors.textMuted
                                        font.pixelSize: 10
                                        font.family: Theme.fontMono.family
                                    }

                                    Text {
                                        visible: (modelData.subtitle || "").length > 0
                                        text: modelData.subtitle || ""
                                        color: Colors.textMuted
                                        font.pixelSize: 9
                                        font.italic: true
                                    }
                                }

                                ColumnLayout {
                                    spacing: 1
                                    Layout.alignment: Qt.AlignRight

                                    RowLayout {
                                        spacing: 2
                                        Layout.alignment: Qt.AlignRight

                                        Text {
                                            text: "$"
                                            color: isSelected ? Colors.accentMuted : Colors.textMuted
                                            font.pixelSize: 14
                                            font.weight: Font.Medium
                                            anchors.baseline: priceText.baseline
                                        }

                                        Text {
                                            id: priceText
                                            text: modelData.priceUsd
                                            color: isSelected ? Colors.accent : Colors.textPrimary
                                            font.pixelSize: modelData.priceSize || 18
                                            font.weight: Font.Bold
                                            font.family: Theme.fontMono.family
                                            font.letterSpacing: -0.5
                                        }
                                    }

                                    Text {
                                        visible: root.savingsPercent(index) > 0
                                        // Electron: "Save N%" word order; with the default
                                        // pricing ladder the badge never shows (hidden).
                                        text: qsTr("Save %1%").arg(root.savingsPercent(index))
                                        color: "#22c55ecc"
                                        font.pixelSize: 10
                                        font.family: Theme.fontMono.family
                                        Layout.alignment: Qt.AlignRight
                                    }
                                }
                            }

                            MouseArea {
                                id: pkgMa
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor
                                onClicked: root.selectedKey = modelData.key
                            }
                        }
                    }

                }

            }

            // Payment method cards
            ColumnLayout {
                Layout.fillWidth: true
                Layout.leftMargin: 20
                Layout.rightMargin: 20
                Layout.topMargin: 16
                spacing: 8

                Repeater {
                    model: root.methodModel

                    Rectangle {
                        Layout.fillWidth: true
                        height: 60
                        radius: Theme.radiusMd
                        // Electron: selected method = bg-accent/[0.12] + border-accent 2px;
                        // unselected hover adds border-accent/40
                        color: root.payMethod === modelData.id ? Colors.accent12 : Colors.surfaceBase
                        border.color: root.payMethod === modelData.id ? Colors.accent
                                     : (methodMa.containsMouse ? Colors.accent40 : Colors.surfaceBorder)
                        border.width: 2
                        Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
                        Behavior on border.color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }

                        RowLayout {
                            anchors.fill: parent
                            anchors.leftMargin: 12
                            anchors.rightMargin: 12
                            spacing: 12

                            Rectangle {
                                width: 40
                                height: 40
                                radius: Theme.radiusSm
                                color: Colors.surfaceOverlay
                                border.color: Colors.surfaceBorderSubtle
                                border.width: 1

                                // Coin logo for USDT
                                Canvas {
                                    anchors.centerIn: parent
                                    width: 24; height: 24
                                    visible: modelData.id === "usdt"
                                    onPaint: {
                                        var ctx = getContext("2d")
                                        ctx.clearRect(0, 0, 24, 24)
                                        ctx.fillStyle = "#26A17B"
                                        ctx.beginPath()
                                        ctx.arc(12, 12, 11, 0, Math.PI * 2)
                                        ctx.fill()
                                        ctx.fillStyle = "#FFFFFF"
                                        ctx.font = "bold 13px sans-serif"
                                        ctx.textAlign = "center"
                                        ctx.textBaseline = "middle"
                                        ctx.fillText("T", 12, 13)
                                    }
                                }
                                // Credit card icon for Paystack
                                Icon {
                                    anchors.centerIn: parent
                                    visible: modelData.id !== "usdt"
                                    name: "credit-card"
                                    size: 20
                                    color: Colors.textSecondary
                                }
                            }

                            ColumnLayout {
                                spacing: 2
                                Layout.fillWidth: true

                                Text {
                                    text: modelData.label
                                    color: Colors.textPrimary
                                    font.pixelSize: 14
                                    font.weight: Font.Medium
                                }

                                Row {
                                    spacing: 6
                                    Text {
                                        text: modelData.subtitle || ""
                                        color: Colors.textMuted
                                        font.pixelSize: 11
                                    }
                                    // Visa/Mastercard logos for Paystack
                                    Row {
                                        visible: modelData.id === "paystack"
                                        spacing: 4
                                        anchors.verticalCenter: parent.verticalCenter
                                        // Visa
                                        Canvas {
                                            width: 26; height: 16
                                            anchors.verticalCenter: parent.verticalCenter
                                            onPaint: {
                                                var ctx = getContext("2d")
                                                ctx.clearRect(0, 0, 26, 16)
                                                ctx.fillStyle = "#1A1F71"
                                                ctx.font = "bold 11px sans-serif"
                                                ctx.textAlign = "center"
                                                ctx.textBaseline = "middle"
                                                ctx.fillText("VISA", 13, 9)
                                            }
                                        }
                                        // Mastercard
                                        Canvas {
                                            width: 20; height: 16
                                            anchors.verticalCenter: parent.verticalCenter
                                            onPaint: {
                                                var ctx = getContext("2d")
                                                ctx.clearRect(0, 0, 20, 16)
                                                // Left circle (red)
                                                ctx.fillStyle = "#EB001B"
                                                ctx.beginPath()
                                                ctx.arc(7, 8, 6, 0, Math.PI * 2)
                                                ctx.fill()
                                                // Right circle (orange)
                                                ctx.fillStyle = "#F79E1B"
                                                ctx.beginPath()
                                                ctx.arc(13, 8, 6, 0, Math.PI * 2)
                                                ctx.fill()
                                                // Middle blend
                                                ctx.fillStyle = "#FF5F00"
                                                ctx.beginPath()
                                                ctx.arc(10, 8, 4, 0, Math.PI * 2)
                                                ctx.fill()
                                            }
                                        }
                                    }
                                }
                            }

                            Rectangle {
                                width: 20
                                height: 20
                                radius: 10
                                border.color: root.payMethod === modelData.id ? Colors.accent : Colors.surfaceBorderStrong
                                border.width: 2
                                color: "transparent"

                                Rectangle {
                                    anchors.centerIn: parent
                                    width: 10
                                    height: 10
                                    radius: 5
                                    color: Colors.accent
                                    visible: root.payMethod === modelData.id
                                }
                            }
                        }

                        MouseArea {
                            id: methodMa
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: root.payMethod = modelData.id
                        }
                    }
                }
            }

            // Footer with CTA
            Rectangle {
                Layout.fillWidth: true
                height: footerCol.implicitHeight + 32
                color: Colors.surfaceRaised

                Rectangle {
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    height: 1
                    color: Colors.surfaceBorder
                }

                ColumnLayout {
                    id: footerCol
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    anchors.margins: 20
                    spacing: 10

                    Rectangle {
                        Layout.fillWidth: true
                        height: 48
                        radius: Theme.radiusMd
                        color: ctaMa.containsMouse ? Colors.accentHover : Colors.accent
                        opacity: (root.payMethod.length > 0 && root.selectedKey.length > 0) ? 1 : 0.5

                        Row {
                            anchors.centerIn: parent
                            spacing: 12

                            Text {
                                anchors.verticalCenter: parent.verticalCenter
                                text: {
                                    // Electron: no method → "Pick a payment method above";
                                    // method + package → "Continue with {name}"
                                    if (!root.payMethod) return qsTr("Pick a payment method above");
                                    if (!root.selectedKey) return qsTr("Continue");
                                    var pkg = null;
                                    for (var i = 0; i < root.packageList.length; i++) {
                                        if (root.packageList[i].key === root.selectedKey) { pkg = root.packageList[i]; break; }
                                    }
                                    if (!pkg) return qsTr("Continue");
                                    return qsTr("Continue with %1").arg(pkg.name);
                                }
                                color: Colors.textOnAccent
                                font.pixelSize: 14
                                font.weight: Font.DemiBold
                            }

                            // Vertical divider
                            Rectangle {
                                width: 1
                                height: 20
                                color: Qt.rgba(1, 1, 1, 0.2)
                                anchors.verticalCenter: parent.verticalCenter
                                visible: root.selectedKey.length > 0
                            }

                            // Price display
                            Row {
                                visible: root.selectedKey.length > 0
                                spacing: 2
                                anchors.verticalCenter: parent.verticalCenter
                                Text {
                                    text: "$"
                                    color: Qt.rgba(1, 1, 1, 0.6)
                                    font.pixelSize: 11
                                    font.weight: Font.Medium
                                    anchors.baseline: ctaPrice.baseline
                                }
                                Text {
                                    id: ctaPrice
                                    text: {
                                        for (var i = 0; i < root.packageList.length; i++) {
                                            if (root.packageList[i].key === root.selectedKey)
                                                return root.packageList[i].priceUsd;
                                        }
                                        return ""
                                    }
                                    color: Colors.textOnAccent
                                    font.pixelSize: 18
                                    font.weight: Font.Bold
                                    font.family: Theme.fontMono.family
                                    font.letterSpacing: -0.5
                                }
                                Text {
                                    text: "\u2192"
                                    color: Qt.rgba(1, 1, 1, 0.8)
                                    font.pixelSize: 14
                                    anchors.verticalCenter: parent.verticalCenter
                                }
                            }
                        }

                        MouseArea {
                            id: ctaMa
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            enabled: root.payMethod.length > 0 && root.selectedKey.length > 0
                            onClicked: {
                                if (!Backend.reachable) {
                                    App.notify("Backend offline \u2014 cannot create order", "error");
                                    return;
                                }
                                if (!Auth.isAuthenticated) {
                                    App.notify("Sign in required", "warning");
                                    App.navigateTo("auth");
                                    return;
                                }
                                var pkg = null;
                                for (var i = 0; i < root.packageList.length; i++) {
                                    if (root.packageList[i].key === root.selectedKey) { pkg = root.packageList[i]; break; }
                                }
                                if (pkg) {
                                    App.notify("Creating order for " + pkg.name + "\u2026", "info");
                                    var prov = root.payMethod === "usdt" ? "nowpayments" : "paystack";
                                    Backend.createPaymentOrder(pkg.key, prov);
                                }
                            }
                        }
                    }

                    RowLayout {
                        Layout.fillWidth: true
                        spacing: 8

                        Text {
                            text: "Already paid? Credits can take a moment."
                            color: Colors.textMuted
                            font.pixelSize: 11
                            Layout.fillWidth: true
                            wrapMode: Text.WordWrap
                        }

                        SecondaryButton {
                            text: "Recheck"
                            enabled: root.pendingOrderId.length > 0
                            onClicked: {
                                App.notify("Rechecking payment status\u2026", "info");
                                if (root.cryptoAddress.length > 0)
                                    Backend.fetchOrderStatus(root.pendingOrderId);
                                else
                                    Backend.verifyPaymentOrder(root.pendingOrderId);
                            }
                        }
                    }
                }
            }

            // Credit key redemption
            Rectangle {
                Layout.fillWidth: true
                Layout.leftMargin: 20
                Layout.rightMargin: 20
                Layout.bottomMargin: 8
                height: creditKeyCol.implicitHeight + 24
                radius: Theme.radiusMd
                color: Colors.surfaceRaised
                border.color: Colors.surfaceBorder
                border.width: 1

                ColumnLayout {
                    id: creditKeyCol
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    anchors.margins: 12
                    spacing: 8

                    Text {
                        text: qsTr("Have a manual credit key?")
                        color: Colors.textSecondary
                        font.pixelSize: 12
                        font.weight: Font.DemiBold
                    }

                    RowLayout {
                        spacing: 8

                        TextField {
                            id: creditKeyInput
                            Layout.fillWidth: true
                            placeholderText: "CK-XXXX-XXXX"
                            color: Colors.textPrimary
                            font.pixelSize: 13
                            font.family: Theme.fontMono.family
                            inputMethodHints: Qt.ImhUppercaseOnly | Qt.ImhNoPredictiveText
                            background: Rectangle {
                                radius: Theme.radiusSm
                                color: Colors.surfaceOverlay
                                border.color: creditKeyInput.activeFocus ? Colors.accent : Colors.surfaceBorder
                                border.width: 1
                            }
                            onAccepted: redeemKey()
                        }

                        GhostButton {
                            text: "ACTIVATE"
                            enabled: creditKeyInput.text.length > 0
                            onClicked: redeemKey()
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
                        font.family: Theme.fontMono.family
                        font.weight: Font.Bold
                    }

                    Text {
                        text: root.cryptoAddress
                        color: Colors.textSecondary
                        font.pixelSize: 11
                        font.family: Theme.fontMono.family
                        wrapMode: Text.WrapAnywhere
                        Layout.fillWidth: true
                    }

                    Text {
                        text: qsTr("Status: %1").arg(root.cryptoStatus || "waiting")
                        color: Colors.textMuted
                        font.pixelSize: 10
                    }

                    Text {
                        visible: root.elapsedSecs > 0
                        text: qsTr("Elapsed: %1").arg(root.formatElapsed(root.elapsedSecs))
                        color: Colors.textMuted
                        font.pixelSize: 10
                        font.family: Theme.fontMono.family
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

                        SecondaryButton {
                            text: qsTr("Cancel")
                            visible: root.pendingOrderId.length > 0
                            onClicked: {
                                Backend.cancelPaymentOrder(root.pendingOrderId)
                                root.pendingOrderId = ""
                                root.cryptoAddress = ""
                                cryptoPoll.stop()
                                escalationTimer.stop()
                                App.notify(qsTr("Order cancelled"), "info")
                            }
                        }

                    }

            }

            }

        }

        // Success animation overlay (sibling of ColumnLayout, fills entire drawer)
        Rectangle {
            id: successOverlay

            visible: root.paymentSuccess
            anchors.fill: parent
            color: Qt.rgba(0, 0, 0, 0.85)
            z: 300

            Column {
                anchors.centerIn: parent
                spacing: 16

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "\u2713"
                    color: Colors.statusSuccess
                    font.pixelSize: 64
                    font.weight: Font.Bold
                    Timer {
                        running: root.paymentSuccess
                        repeat: false
                        onTriggered: { root.paymentSuccess = false; root.open = false; Auth.refreshProfile(); }
                        interval: 2500
                    }
                }

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Payment received"
                    color: Colors.textPrimary
                    font.pixelSize: 22
                    font.weight: Font.Bold
                }

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Credits added to your account"
                    color: Colors.textSecondary
                    font.pixelSize: 13
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
            root.paymentStartedAt = Date.now()
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
            if (bal.credit_balance !== undefined) {
                Auth.applyBalance(bal.credit_balance, bal.bonus_balance || 0);
                root.paymentSuccess = true;
            }
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
                if (bal.credit_balance !== undefined) {
                    Auth.applyBalance(bal.credit_balance, bal.bonus_balance || 0);
                    root.paymentSuccess = true;
                }
            }
        }

        function onRequestFailed(ep, err) {
            if (ep.indexOf("payment") >= 0)
                cryptoPoll.stop();

        }

        function onCreditKeyRedeemed(result) {
            if (result.error) {
                App.notify(result.error, "error")
                return
            }
            creditKeyInput.text = ""
            var added = result.credits_added || result.creditsAdded || 0
            App.notify("Credit key activated — " + added + " credits added", "success")
            Auth.refreshProfile()
        }

        target: Backend
    }

}
