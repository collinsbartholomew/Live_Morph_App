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
    property bool paymentFailed: false
    // Guards against double-click creating multiple paid orders.
    property bool creatingOrder: false
    property int pollCount: 0      // crypto poll counter (capped, like the banner)
    property bool cancelling: false
    property bool redeeming: false
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
            "label": qsTr("Pay with Crypto"),
            "subtitle": qsTr("USDT, USDC, SOL, TRX, TON & more · confirms in <1 min · worldwide")
        });
        m.push({
            "id": "paystack",
            "label": qsTr("Pay in NGN"),
            "subtitle": qsTr("Nigerian-issued cards only")
        });
        if (prov.indexOf("flutterwave") >= 0)
            m.push({
            "id": "flutterwave",
            "label": qsTr("Pay by card (intl)"),
            "subtitle": qsTr("Visa/Mastercard via Flutterwave · worldwide")
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
    property int lastPurchasedCredits: 0
    property string linkCopiedFlash: ""
    property string reason: ""
    // Electron: inline phase messages (paystackTimeout / cryptoTimeout /
    // cryptoStillProcessing / failure) rendered in the section, not toasts
    property string inlineError: ""
    property string inlineWarning: ""
    property int elapsedSecs: 0
    // Price-size ladder + static subtitle tags only — credit amounts and swap
    // durations are computed live from the backend package catalog (the "per"
    // field), so they can never drift from what the server actually grants.
    readonly property var tierConfig: ({
        "basic":   { "priceSize": 22, "subtitle": "" },
        "starter": { "priceSize": 26, "subtitle": "" },
        "mid":     { "priceSize": 36, "subtitle": qsTr("Most creators land here.") },
        "pro":     { "priceSize": 40, "subtitle": qsTr("For studios and full session days.") }
    })
    // Electron HD_PACKAGE_KEYS: starter, mid, pro
    readonly property var hdTiers: ["starter", "mid", "pro"]
    // Coin brand colors/symbols live in Constants.cryptoLogos (single source).
    readonly property var coinLogos: Constants.cryptoLogos
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
            const cred = Number(String(p.credits || 0).replace(/,/g, ""));
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
            return qsTr("%1 min").arg(mins)
        var h = Math.floor(mins / 60)
        var m = mins % 60
        return m > 0 ? qsTr("%1h %2m").arg(h).arg(m) : qsTr("%1h").arg(h)
    }

    function savingsPercent(idx) {
        if (idx === 0 || root.packageList.length < 2) return 0
        var basePerCredit = root.packageList[0].priceUsdNum / root.packageList[0].credits
        var thisPerCredit = root.packageList[idx].priceUsdNum / root.packageList[idx].credits
        return Math.round((1 - thisPerCredit / basePerCredit) * 100)
    }

    function redeemKey() {
        if (root.redeeming) return
        var key = creditKeyInput.text.trim()
        if (key.length < 8) {
            App.notify(qsTr("Enter a valid credit key"), "warning", "payment")
            return
        }
        root.redeeming = true
        App.notify(qsTr("Activating credit key\u2026"), "info", "payment")
        Backend.redeemCreditKey(key)
    }

    anchors.fill: parent
    visible: open

    // Poller must stop when the drawer closes (the resume banner owns polling).
    // Reopening with no pending order clears stale inline messages.
    onOpenChanged: {
        if (!open) {
            cryptoPoll.stop()
        } else if (root.pendingOrderId.length > 0) {
            root.pollCount = 0
            cryptoPoll.restart() // resume polling a pending invoice on reopen
        } else {
            root.inlineError = ""
            root.inlineWarning = ""
        }
    }
    z: Theme.zDrawer

    // Escalation messages timer
    Timer {
        id: escalationTimer

        interval: 600000 // 10 minutes
        repeat: true
        running: root.open && root.pendingOrderId.length > 0 && root.cryptoAddress.length > 0
        onTriggered: {
            var elapsed = (Date.now() - root.paymentStartedAt) / 1000
            if (elapsed > 1800) {
                App.notify(qsTr("Payment pending for over 30 min - contact support if this persists"), "warning", "payment")
            } else {
                App.notify(qsTr("Payment pending - ensure exact amount was sent to the address"), "info", "payment")
            }
        }
    }

    Timer {
        id: cryptoPoll

        interval: 5000
        repeat: true
        onTriggered: {
            if (root.pendingOrderId.length > 0 && root.cryptoAddress.length > 0) {
                if (++root.pollCount >= 720) { // ~60 min cap, same as the banner
                    cryptoPoll.stop();
                    root.inlineWarning = qsTr("Still confirming on the network — you can close this panel; credits land automatically.");
                    return;
                }
                Backend.fetchOrderStatus(root.pendingOrderId);
            }
        }
    }


    Timer {
        id: elapsedTimer
        interval: 1000
        repeat: true
        running: root.open && root.cryptoAddress.length > 0 && root.paymentStartedAt > 0
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


    }

    // Drawer panel — panel-drawer w-[500px]
    Rectangle {
        id: drawer

        width: Math.min(Theme.buyCreditsDrawerWidth, root.width * 0.92)
        height: parent.height
        x: open ? root.width - width : root.width
        y: 0
        // Electron panel-drawer background: #17171f (surface-overlay)
        color: Colors.surfaceOverlay
        border.color: Colors.surfaceBorder
        border.width: 0

        Honeycomb {
            anchors.fill: parent
            cellSize: Theme.honeycombCell
            lineColor: Colors.honeycombLineFaint
            opacity: 0.4
        }

        // Panel hairline — solid white rule with hex ticks at the ends
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 1
            z: Theme.zLocal1
            color: Colors.white35
        }
        Hexagon {
            size: 8
            lineWidth: 1.5
            lineColor: Colors.accent
            anchors.left: parent.left
            anchors.leftMargin: 12
            anchors.top: parent.top
            anchors.topMargin: -3
            z: Theme.zLocal1
        }
        Hexagon {
            size: 8
            lineWidth: 1.5
            lineColor: Colors.accent
            anchors.right: parent.right
            anchors.rightMargin: 12
            anchors.top: parent.top
            anchors.topMargin: -3
            z: Theme.zLocal1
        }

        // Left edge border
        Rectangle {
            anchors.left: parent.left
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            width: 1
            color: Colors.surfaceBorder
        }

        // Hex-tech corner frame (signature motif on drawer panels)
        CornerTicks {
            anchors.fill: parent
            inset: 6
            tickSize: 8
            thickness: 1
            color: Colors.accent30
            z: Theme.zLocal1
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
                height: Theme.drawerHeaderHeight
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

                    HexBadge {
                        size: 38
                        iconName: "coins"
                        iconSize: 18
                        lineWidth: 1
                        lineColor: Colors.accent30
                        fillColor: Colors.accent12
                        iconColor: Colors.accentHover
                    }

                    ColumnLayout {
                        spacing: 2
                        Layout.fillWidth: true

                        Text {
                            text: qsTr("Buy credits")
                            color: Colors.textPrimary
                            font.family: Theme.fontHeading.family
                            font.pixelSize: Theme.fontHeading.pixelSize
                            font.weight: Font.Bold
                        }

                    }

                    Rectangle {
                        width: 28
                        height: 28
                        radius: Theme.radiusFull
                        color: closeMa.containsMouse ? Colors.overlay50 : Colors.transparent

                        Icon {
                            anchors.centerIn: parent
                            name: "x"
                            size: 14
                            emphasis: true
                            color: closeMa.containsMouse ? Colors.textPrimary : Colors.textMuted
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

            // Reason banner (Electron: minToStart etc.) — in-flow strip below the
            // header so it never paints over the balance bar
            Rectangle {
                visible: root.reason.length > 0
                Layout.fillWidth: true
                Layout.preferredHeight: visible ? reasonLbl.implicitHeight + 20 : 0
                color: Colors.statusWarning05
                border.color: Colors.statusWarning20
                border.width: 1
                Text {
                    id: reasonLbl
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    anchors.margins: 10
                    text: root.reason
                    color: Colors.statusWarning
                    font.pixelSize: 12
                    wrapMode: Text.WordWrap
                }
            }

            // Balance bar (Electron: px-6 py-2.5 border-b bg-surface-base/50)
            Rectangle {
                Layout.fillWidth: true
                Layout.preferredHeight: 40
                color: Colors.base50
                Rectangle { anchors.left: parent.left; anchors.right: parent.right; anchors.bottom: parent.bottom; height: 1; color: Colors.surfaceBorderSubtle }

                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 24
                    anchors.rightMargin: 24
                    spacing: 8

                                        SectionHeader {
                        text: qsTr("BALANCE");
                        Layout.fillWidth: true;
                    }
                    Item { Layout.fillWidth: true }
                    Text {
                        text: Auth.creditBalance.toLocaleString(Qt.locale(I18n.uiLocaleName()), 'f', 0)
                        color: Colors.textPrimary
                        font.family: Theme.fontMono.family
                        font.pixelSize: 18
                        font.weight: Font.Bold
                    }
                    Text {
                        text: qsTr("(%n minute)", "(%n minutes)", Math.max(0, Math.floor((Auth.creditBalance + Auth.bonusBalance) / Math.max(0.1, Session.creditsPerSecond * 60))))
                        color: Colors.textMuted
                        font.pixelSize: 10
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
                ScrollBar.vertical: StyledScrollBar { thin: true }

                ColumnLayout {
                    id: packagesCol

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
                         Layout.preferredHeight: Math.max(64, pkgCol.implicitHeight + 24)
                         radius: Theme.radiusMd
                         color: isSelected ? Colors.accent06
                         : (pkgMa.containsMouse ? Colors.surfaceHover
                         : Colors.surfaceRaised)
                         border.color: isSelected ? Colors.accent
                         : (pkgMa.containsMouse ? Colors.accent40 : Colors.surfaceBorder)
                         border.width: isSelected ? 2 : 1

                         // Selection corner ticks (selected only, no glow)
                         CornerTicks {
                             anchors.fill: parent
                             visible: isSelected
                             inset: 6
                             tickSize: 10
                             thickness: 2
                             color: Colors.accent
                             z: Theme.zUnder
                         }

                         RowLayout {
                         anchors.fill: parent
                         anchors.leftMargin: 14
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
                         id: pkgCol
                         spacing: 1
                         Layout.fillWidth: true

                         Row {
                          spacing: 6
                          Text {
                          text: modelData.name
                          // runtime-supplied name: cap + elide so long names
                          // can't push the POPULAR/HD chips out of the card
                          width: Math.max(0, Math.min(implicitWidth, pkgCol.width - 150))
                          elide: Text.ElideRight
                          color: Colors.textPrimary
                          font.pixelSize: modelData.popular ? 15 : 13
                          font.weight: Font.Bold
                          }
                          Rectangle {
                          visible: modelData.popular
                          height: 16
                          width: popLbl.implicitWidth + 10
                          radius: Theme.radiusFull
                          color: Colors.tierProBg
                          border.color: Colors.tierProBorder
                          border.width: 1
                          anchors.verticalCenter: parent.verticalCenter
                          Text {
                          id: popLbl
                          anchors.centerIn: parent
                          text: qsTr("POPULAR")
                          color: Colors.tierProText
                          font.pixelSize: 8
                          font.family: Theme.fontMono.family
                          font.weight: Font.Bold
                          font.letterSpacing: 1.0
                          }
                          }
                          Rectangle {
                          // HD badge by tier key AND server flags
                          visible: modelData.hd === true && (Backend.hdMultiplier > 1 || Auth.tier === "starter" || Auth.tier === "mid" || Auth.tier === "pro")
                          height: 16
                          width: hdLabel.implicitWidth + 10
                          radius: Theme.radiusFull
                          color: Colors.surfaceElevated
                          border.color: Colors.surfaceBorder
                          border.width: 1
                          anchors.verticalCenter: parent.verticalCenter
                          Text {
                          id: hdLabel
                          anchors.centerIn: parent
                          text: qsTr("HD")
                          color: Colors.textSecondary
                          font.pixelSize: 8
                          font.family: Theme.fontMono.family
                          font.weight: Font.Bold
                          font.letterSpacing: 0.5
                          }
                          }
                         }

                                    Text {
                                        text: qsTr("%1 cr · %2").arg(modelData.credits, modelData.per)
                                        color: Colors.textMuted
                                        font.pixelSize: 10
                                        font.family: Theme.fontMono.family
                                    }

                                    Text {
                                        visible: (modelData.subtitle || "").length > 0
                                        text: modelData.subtitle || ""
                                        color: Colors.textSecondary
                                        font.pixelSize: 11
                                        wrapMode: Text.WordWrap
                                        Layout.maximumWidth: 340 // ~36ch at 11px
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
                                            font.weight: Font.Normal
                                            Layout.alignment: Qt.AlignBottom
                                            bottomPadding: 3
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
                                        color: Colors.accent80
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

            // PAYMENT METHOD — hidden while the tracker is active (Electron)
            SectionHeader {
                visible: root.cryptoAddress.length === 0 && !root.paymentSuccess
                Layout.fillWidth: true
                Layout.leftMargin: 20
                Layout.rightMargin: 20
                Layout.topMargin: 16
                text: qsTr("PAYMENT METHOD")
            }
            Text {
                Layout.fillWidth: true
                Layout.leftMargin: 20
                Layout.rightMargin: 20
                Layout.topMargin: 4
                Layout.bottomMargin: 8
                text: qsTr("Outside Nigeria? Pick Crypto.")
                color: Colors.textMuted
                font.pixelSize: 11
            }

            // Payment method cards (hidden while tracker active)
            ColumnLayout {
                visible: root.cryptoAddress.length === 0 && !root.paymentSuccess
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

                        RowLayout {
                            anchors.fill: parent
                            anchors.leftMargin: 12
                            anchors.rightMargin: 12
                            spacing: 12

                            Rectangle {
                                width: 40
                                height: 40
                                radius: Theme.radiusSm
                                color: modelData.id === "usdt" ? Colors.accent10 : Colors.surfaceOverlay
                                border.color: modelData.id === "usdt" ? Colors.accent30 : Colors.surfaceBorderSubtle
                                border.width: 1

                                Icon {
                                    anchors.centerIn: parent
                                    name: modelData.id === "usdt" ? "coins" : "credit-card"
                                    size: 20
                                    color: modelData.id === "usdt" ? Colors.accentHover : Colors.textSecondary
                                }
                            }

                            ColumnLayout {
                                spacing: 2
                                Layout.fillWidth: true

                                Text {
                                    text: modelData.label
                                    color: Colors.textPrimary
                                    font.pixelSize: 14
                                    font.weight: Font.Normal
                                }

                                Text {
                                    text: modelData.subtitle || ""
                                    color: Colors.textMuted
                                    font.pixelSize: 11
                                    Layout.fillWidth: true
                                    wrapMode: Text.WordWrap
                                }
                            }

                            // Coin stack (Electron crypto row: 20px coins,
                            // -space-x-1.5 overlap, ring-2 ring-surface-base)
                            Row {
                                visible: modelData.id === "usdt"
                                spacing: -6
                                Layout.alignment: Qt.AlignVCenter
                                Repeater {
                                    model: ["usdc", "sol", "trx", "ton"].map(function (k) {
                                        return { t: root.coinLogos[k].symbol, c: root.coinLogos[k].color }
                                    })
                                    Rectangle {
                                        required property var modelData
                                        width: 20; height: 20; radius: Theme.radiusFull
                                        color: modelData.c
                                        border.width: 2
                                        border.color: Colors.surfaceBase
                                        Text {
                                            anchors.centerIn: parent
                                            text: modelData.t
                                            color: Colors.white
                                            font.pixelSize: 9
                                            font.weight: Font.Bold
                                        }
                                    }
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
                height: footCol.implicitHeight + 32
                color: Colors.surfaceRaised

                Rectangle {
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    height: 1
                    color: Colors.surfaceBorder
                }

                ColumnLayout {
                    id: footCol
                    anchors.fill: parent
                    anchors.leftMargin: 20
                    anchors.rightMargin: 20
                    anchors.topMargin: 16
                    anchors.bottomMargin: 16
                    spacing: 10

                    // Electron: fast-settling cryptos only (crypto selected)
                    Text {
                        visible: root.payMethod === "usdt"
                        Layout.fillWidth: true
                        wrapMode: Text.WordWrap
                        text: qsTr("We accept fast-settling cryptos only. BTC and Ethereum take 30+ minutes to confirm — use USDT, USDC, SOL, TRX or TON for fast settlement.")
                        color: Colors.textMuted
                        font.pixelSize: 10
                    }

                    // Inline error box
                    Rectangle {
                        visible: root.inlineError.length > 0
                        Layout.fillWidth: true
                        height: inlineErrLbl.implicitHeight + 16
                        radius: Theme.radiusMd
                        color: Colors.statusError10
                        border.color: Colors.statusError30
                        border.width: 1
                        RowLayout {
                            anchors.fill: parent
                            anchors.margins: 8
                            spacing: 8
                            Icon {
                                name: "alert-circle"
                                size: 14
                                color: Colors.statusError
                                Layout.alignment: Qt.AlignTop
                            }
                            Text {
                                id: inlineErrLbl
                                Layout.fillWidth: true
                                text: root.inlineError
                                color: Colors.statusError
                                font.pixelSize: 11
                                wrapMode: Text.WordWrap
                            }
                        }
                    }

                    // Inline warning box
                    Rectangle {
                        visible: root.inlineWarning.length > 0
                        Layout.fillWidth: true
                        height: inlineWarnLbl.implicitHeight + 16
                        radius: Theme.radiusMd
                        color: Colors.statusWarning10
                        border.color: Colors.statusWarning30
                        border.width: 1
                        RowLayout {
                            anchors.fill: parent
                            anchors.margins: 8
                            spacing: 8
                            Icon {
                                name: "alert-circle"
                                size: 14
                                color: Colors.statusWarning
                                Layout.alignment: Qt.AlignTop
                            }
                            Text {
                                id: inlineWarnLbl
                                Layout.fillWidth: true
                                text: root.inlineWarning
                                color: Colors.statusWarning
                                font.pixelSize: 11
                                wrapMode: Text.WordWrap
                            }
                        }
                    }

                    // CTA (hidden while the crypto tracker is active)
                    Rectangle {
                        visible: root.cryptoAddress.length === 0 && !root.paymentSuccess
                        Layout.fillWidth: true
                        height: 48
                        radius: Theme.radiusMd
                        color: Colors.accent
                        border.width: 1
                        border.color: Colors.accent
                        opacity: (root.payMethod.length > 0 && root.selectedKey.length > 0 && !root.creatingOrder && root.pendingOrderId.length === 0) ? 1.0 : 0.5

                        // Hex-tech corner frame on hover (signature CTA chrome)
                        CornerTicks {
                            anchors.fill: parent
                            visible: ctaMa.containsMouse && ctaMa.enabled
                            inset: 5
                            tickSize: 7
                            thickness: 1.5
                            color: Colors.textOnAccent
                            opacity: 0.9
                        }

                        Row {
                            anchors.centerIn: parent
                            spacing: 12

                            Text {
                                anchors.verticalCenter: parent.verticalCenter
                                text: {
                                    if (root.paymentFailed) return qsTr("Try again")
                                    if (root.creatingOrder) return qsTr("Creating order…")
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
                                font.pixelSize: 13
                                font.weight: Font.Bold
                                font.capitalization: Font.AllUppercase
                                font.letterSpacing: 1.5
                                // runtime package name: elide inside the fixed 296px CTA
                                width: Math.min(implicitWidth, 160)
                                elide: Text.ElideRight
                            }

                            Rectangle {
                                width: 1
                                height: 20
                                color: Colors.base20
                                anchors.verticalCenter: parent.verticalCenter
                                visible: root.selectedKey.length > 0
                            }

                            Row {
                                visible: root.selectedKey.length > 0
                                spacing: 2
                                anchors.verticalCenter: parent.verticalCenter
                                Text {
                                    text: "$"
                                    color: Colors.base50
                                    font.pixelSize: 11
                                    font.weight: Font.Normal
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
                                    color: Colors.base70
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
                            enabled: root.payMethod.length > 0 && root.selectedKey.length > 0 && !root.creatingOrder && root.pendingOrderId.length === 0
                            onClicked: {
                                if (root.creatingOrder)
                                    return
                                if (!Backend.reachable) {
                                    App.notify(qsTr("Backend offline - cannot create order"), "error", "payment");
                                    return;
                                }
                                if (!Auth.isAuthenticated) {
                                    App.notify(qsTr("Sign in required"), "warning");
                                    App.navigateTo("auth");
                                    return;
                                }
                                var pkg = null;
                                for (var i = 0; i < root.packageList.length; i++) {
                                    if (root.packageList[i].key === root.selectedKey) { pkg = root.packageList[i]; break; }
                                }
                                if (pkg) {
                                    root.creatingOrder = true
                                    App.notify(qsTr("Creating order for %1\u2026").arg(pkg.name), "info", "payment");
                                    var prov = root.payMethod === "usdt" ? "nowpayments" : root.payMethod;
                                    Backend.createPaymentOrder(pkg.key, prov);
                                }
                            }
                        }
                    }

                    RowLayout {
                        Layout.fillWidth: true
                        spacing: 8

                        Text {
                            text: root.payMethod === "usdt"
                                  ? qsTr("Pay any supported crypto at the USD equivalent. Works from any country.")
                                  : root.payMethod === "paystack"
                                    ? qsTr("Charged in NGN at today's rate. Foreign cards will be declined.")
                                    : qsTr("Choose a payment method above to continue")
                            color: Colors.textMuted
                            font.pixelSize: 11
                            Layout.fillWidth: true
                            wrapMode: Text.WordWrap
                        }

                        SecondaryButton {
                            text: qsTr("Recheck")
                            enabled: root.pendingOrderId.length > 0
                            onClicked: {
                                App.notify(qsTr("Rechecking payment status\u2026"), "info", "payment");
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

                    RowLayout {
                        spacing: 8
                        Rectangle {
                            width: 26; height: 26
                            radius: Theme.radiusSm
                            color: Colors.overlay40
                            border.color: Colors.surfaceBorderSubtle
                            border.width: 1
                            Icon {
                                anchors.centerIn: parent
                                name: "key"
                                size: 13
                                color: Colors.textMuted
                            }
                        }
                        Text {
                            text: qsTr("Have a manual credit key?")
                            color: Colors.textSecondary
                            font.pixelSize: 12
                            font.weight: Font.Bold
                            Layout.fillWidth: true
                        }
                    }

                    RowLayout {
                        spacing: 8

                        TextField {
                            id: creditKeyInput
                            Layout.fillWidth: true
                            placeholderText: qsTr("CK-XXXX-XXXX")
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
                            text: qsTr("ACTIVATE")
                            enabled: creditKeyInput.text.length > 0 && !root.redeeming
                            onClicked: redeemKey()
                        }
                    }
                }
            }

            // Crypto invoice tracker — Electron PaymentTracker:
            // phase circle + 3-step progress + escalation boxes + actions
            Rectangle {
                id: cryptoInvoicePanel

                visible: root.cryptoAddress.length > 0
                Layout.fillWidth: true
                Layout.leftMargin: 20
                Layout.rightMargin: 20
                Layout.bottomMargin: 8
                height: visible ? cryptoCol.implicitHeight + 28 : 0
                radius: Theme.radiusMd
                color: Colors.surfaceRaised
                border.color: Colors.surfaceBorder
                border.width: 1

                readonly property bool stepSent: root.cryptoStatus === "confirming" || root.cryptoStatus === "confirmed"
                                                    || root.cryptoStatus === "sending" || root.cryptoStatus === "finished"
                                                    || root.cryptoStatus === "provisioned"
                readonly property bool stepSeen: root.cryptoStatus === "confirmed" || root.cryptoStatus === "sending"
                                                    || root.cryptoStatus === "finished" || root.cryptoStatus === "provisioned"
                readonly property bool stepLanded: root.cryptoStatus === "finished" || root.cryptoStatus === "provisioned"

                ColumnLayout {
                    id: cryptoCol

                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    anchors.margins: 14
                    spacing: 10

                    // Phase circle + headline + waiting pill
                    RowLayout {
                        spacing: 12
                        Rectangle {
                            width: 40; height: 40; radius: Theme.radiusFull
                            color: cryptoInvoicePanel.stepLanded ? Colors.statusSuccess10 : Colors.accent10
                            border.color: cryptoInvoicePanel.stepLanded ? Colors.statusSuccess30 : Colors.accent30
                            border.width: 1
                            Icon {
                                anchors.centerIn: parent
                                name: cryptoInvoicePanel.stepLanded ? "check" : "sparkles"
                                size: 18
                                color: cryptoInvoicePanel.stepLanded ? Colors.statusSuccess : Colors.accent
                            }
                        }
                        ColumnLayout {
                            spacing: 2
                            Layout.fillWidth: true
                            Text {
                                text: cryptoInvoicePanel.stepLanded ? qsTr("Payment credited")
                                    : qsTr("Crypto payment in progress")
                                color: Colors.textPrimary
                                font.pixelSize: 14
                                font.weight: Font.Bold
                            }
                            Text {
                                // amount stays visible for the send step
                                text: qsTr("Send %1 %2").arg(root.cryptoAmount > 0 ? Number(root.cryptoAmount).toFixed(6) : "—").arg(root.cryptoCurrency || "USDT")
                                color: Colors.textSecondary
                                font.pixelSize: 11
                                font.family: Theme.fontMono.family
                            }
                        }
                        // Waiting pill (mono tabular m:ss)
                        Rectangle {
                            visible: !cryptoInvoicePanel.stepLanded
                            radius: Theme.radiusFull
                            color: Colors.accent10
                            border.color: Colors.accent30
                            border.width: 1
                            implicitWidth: waitLbl.implicitWidth + 12
                            implicitHeight: 22
                            Layout.alignment: Qt.AlignVCenter
                            Text {
                                id: waitLbl
                                anchors.centerIn: parent
                                text: qsTr("WAITING %1").arg(root.formatElapsed(Math.floor(root.elapsedSecs || 0)))
                                color: Colors.accentHover
                                font.family: Theme.fontMono.family
                                font.pixelSize: 9
                                font.weight: Font.Bold
                                font.letterSpacing: 1.0
                            }
                        }
                    }

                    // PaymentTracker (Electron TSX: vertical list, 24px
                    // circles — pending shows the INDEX NUMBER, active step
                    // shows a 10px hint under its 12px title)
                    ColumnLayout {
                        Layout.fillWidth: true
                        spacing: 10

                        Repeater {
                            model: [
                                { n: 1, title: qsTr("Payment sent from your wallet"),
                                  done: cryptoInvoicePanel.stepSent, active: !cryptoInvoicePanel.stepSent,
                                  hint: qsTr("Send exactly the amount above in one transfer.") },
                                { n: 2, title: qsTr("Confirmed on blockchain"),
                                  done: cryptoInvoicePanel.stepSeen, active: cryptoInvoicePanel.stepSent && !cryptoInvoicePanel.stepSeen,
                                  hint: qsTr("Waiting for the network to confirm your transaction.") },
                                { n: 3, title: qsTr("Credited to your account"),
                                  done: cryptoInvoicePanel.stepLanded, active: cryptoInvoicePanel.stepSeen && !cryptoInvoicePanel.stepLanded,
                                  hint: qsTr("Credits are added the moment settlement lands.") }
                            ]
                            delegate: RowLayout {
                                id: stepRow
                                required property var modelData
                                required property int index
                                Layout.fillWidth: true
                                spacing: 10

                                // Circle: done = check, pending = index number
                                Rectangle {
                                    width: 24; height: 24; radius: Theme.radiusFull
                                    color: modelData.done ? Colors.statusSuccess15 // success/15
                                         : modelData.active ? Colors.accent10
                                         : Colors.surfaceOverlay
                                    border.width: 1
                                    border.color: modelData.done ? Colors.statusSuccess30
                                                : modelData.active ? Colors.accent40
                                                : Colors.surfaceBorder
                                    Icon {
                                        anchors.centerIn: parent
                                        visible: modelData.done
                                        name: "check"
                                        size: 12
                                        emphasis: true
                                        color: Colors.statusSuccess
                                    }
                                    Text {
                                        anchors.centerIn: parent
                                        visible: !modelData.done
                                        text: modelData.n
                                        color: modelData.active ? Colors.accent : Colors.textMuted
                                        font.pixelSize: 10
                                        font.weight: Font.Bold
                                        font.family: Theme.fontMono.family
                                    }
                                }

                                // Connector between steps
                                Rectangle {
                                    visible: index < 2
                                    Layout.fillWidth: true
                                    Layout.alignment: Qt.AlignTop
                                    Layout.topMargin: 24
                                    height: 2
                                    color: (index + 1 < 3 && [cryptoInvoicePanel.stepSent, cryptoInvoicePanel.stepSeen, cryptoInvoicePanel.stepLanded][index + 1])
                                           ? Colors.accent40 : Colors.surfaceBorder
                                }

                                ColumnLayout {
                                    Layout.fillWidth: true
                                    Layout.alignment: Qt.AlignVCenter
                                    spacing: 2
                                    Text {
                                        text: modelData.title
                                        color: modelData.done ? Colors.statusSuccess
                                             : modelData.active ? Colors.textPrimary
                                             : Colors.textMuted
                                        font.pixelSize: 12
                                        font.weight: modelData.active ? Font.Bold : Font.Normal
                                    }
                                    Text {
                                        visible: modelData.active
                                        text: modelData.hint
                                        color: Colors.textMuted
                                        font.pixelSize: 10
                                        wrapMode: Text.WordWrap
                                        Layout.fillWidth: true
                                    }
                                }
                            }
                        }
                    }

                    // Address (tap to copy)
                    Rectangle {
                        Layout.fillWidth: true
                        Layout.preferredHeight: 40
                        radius: Theme.radiusSm
                        color: addrMa.containsMouse ? Colors.surfaceHover : Colors.surfaceBase
                        border.color: addrMa.containsMouse ? Colors.surfaceBorderStrong : Colors.surfaceBorderSubtle
                        border.width: 1
                        RowLayout {
                            anchors.fill: parent
                            anchors.leftMargin: 10
                            anchors.rightMargin: 10
                            spacing: 8
                            Icon {
                                name: "copy"
                                size: 13
                                color: addrMa.containsMouse ? Colors.textSecondary : Colors.textMuted
                            }
                            Text {
                                Layout.fillWidth: true
                                text: root.cryptoAddress
                                color: Colors.textSecondary
                                font.pixelSize: 11
                                font.family: Theme.fontMono.family
                                elide: Text.ElideMiddle
                            }
                        }
                        MouseArea {
                            id: addrMa
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: {
                                Backend.copyToClipboard(root.cryptoAddress);
                                App.notify(qsTr("Address copied"), "success");
                            }
                        }
                    }

                    // Escalation boxes (10 min / 30 min)
                    Rectangle {
                        visible: root.elapsedSecs > 600
                        Layout.fillWidth: true
                        Layout.preferredHeight: esc10.implicitHeight + 16
                        radius: Theme.radiusSm
                        color: Colors.surfaceBase
                        border.color: Colors.surfaceBorderSubtle
                        border.width: 1
                        Text {
                            id: esc10
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.top: parent.top
                            anchors.margins: 8
                            wrapMode: Text.WordWrap
                            text: qsTr("Crypto settlement typically completes within 15 minutes. You can close this panel. Credits land in your account automatically when the network finishes.")
                            color: Colors.textMuted
                            font.pixelSize: 10
                        }
                    }
                    Rectangle {
                        visible: root.elapsedSecs > 1800
                        Layout.fillWidth: true
                        Layout.preferredHeight: esc30.implicitHeight + 16
                        radius: Theme.radiusSm
                        color: Colors.statusWarning10
                        border.color: Colors.statusWarning30
                        border.width: 1
                        Text {
                            id: esc30
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.top: parent.top
                            anchors.margins: 8
                            wrapMode: Text.WordWrap
                            text: qsTr("Still no settlement after 30 minutes. The network can be busy, but credits typically still arrive within an hour. If your payment is missing after an hour, contact support with your transaction hash and we will resolve it manually.")
                            color: Colors.statusWarning
                            font.pixelSize: 10
                        }
                    }

                    Flow {
                        Layout.fillWidth: true
                        spacing: 8

                        SecondaryButton {
                            // Electron: recheck appears only after 5 minutes
                            visible: root.elapsedSecs >= 300
                            text: recheckBusy.running ? qsTr("Re-checking…") : qsTr("Re-check payment status")
                            onClicked: {
                                recheckBusy.restart()
                                Backend.fetchOrderStatus(root.pendingOrderId)
                            }
                            Timer {
                                id: recheckBusy
                                interval: 4000
                                onTriggered: root.linkCopiedFlash = qsTr("Still processing — we'll keep watching.")
                            }
                        }

                        SecondaryButton {
                            text: qsTr("Reopen checkout")
                            visible: root.pendingOrderId.length > 0
                            onClicked: Backend.openExternal(Constants.urlNowPayments + "?iid=" + encodeURIComponent(root.pendingOrderId))
                        }

                        SecondaryButton {
                            text: root.linkCopiedFlash === qsTr("Link copied") ? qsTr("Link copied") : qsTr("Copy link")
                            onClicked: {
                                Backend.copyToClipboard(Constants.urlNowPayments + "?iid=" + encodeURIComponent(root.pendingOrderId));
                                root.linkCopiedFlash = qsTr("Link copied");
                                linkSwap.start()
                            }
                            Timer { id: linkSwap; interval: 1800; onTriggered: root.linkCopiedFlash = "" }
                        }

                        SecondaryButton {
                            text: qsTr("Cancel this payment")
                            destructive: true
                            visible: root.pendingOrderId.length > 0
                            onClicked: {
                                // Wait for the server response before clearing/toasting —
                                // onPaymentOrderCancelled does the real cleanup (a 409
                                // "already settled" must surface as an error, not "cancelled").
                                if (root.cancelling) return
                                root.cancelling = true
                                root.inlineError = ""
                                Backend.cancelPaymentOrder(root.pendingOrderId)
                            }
                        }

                        Text {
                            visible: root.linkCopiedFlash.length > 0 && root.elapsedSecs >= 300
                                && root.linkCopiedFlash !== qsTr("Link copied")
                            text: root.linkCopiedFlash
                            color: Colors.textMuted
                            font.pixelSize: 10
                            width: parent.width
                            wrapMode: Text.WordWrap
                        }
                    }

                    Text {
                        Layout.fillWidth: true
                        visible: root.pendingOrderId.length > 0
                        text: qsTr("Your wallet won't be charged. If you've already sent crypto, those credits will still arrive when the network confirms.")
                        color: Colors.textMuted
                        font.pixelSize: 10
                        wrapMode: Text.WordWrap
                    }
            }

            }

        }

        // Success (Electron inline section: circle + title + mono credits)
        Rectangle {
            id: successPanel

            visible: root.paymentSuccess
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            anchors.topMargin: 96 // below header (56) + balance bar (40)
            color: Colors.surfaceOverlay // covers body, header stays visible
            z: Theme.zDialog

            Column {
            anchors.centerIn: parent
            spacing: 10

            HexBadge {
            size: 56
            iconName: "check"
            iconSize: 26
            lineWidth: 1
            lineColor: Colors.statusSuccess30
            fillColor: Colors.statusSuccess10
            iconColor: Colors.statusSuccess
            emphasis: true
            anchors.horizontalCenter: parent.horizontalCenter
            }

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: qsTr("Payment confirmed")
                    color: Colors.textPrimary
                    font.pixelSize: 15
                    font.weight: Font.Bold
                }

                Rectangle {
                    anchors.horizontalCenter: parent.horizontalCenter
                    radius: Theme.radiusFull
                    color: Colors.statusSuccess10
                    border.color: Colors.statusSuccess30
                    border.width: 1
                    implicitWidth: succLbl.implicitWidth + 16
                    implicitHeight: 26
                    Text {
                        id: succLbl
                        anchors.centerIn: parent
                        text: qsTr("+%1 credits added").arg(Number(Math.max(1, root.lastPurchasedCredits)).toFixed(0))
                        color: Colors.statusSuccess
                        font.pixelSize: 12
                        font.family: Theme.fontMono.family
                        font.weight: Font.Bold
                    }
                }

                SecondaryButton {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: qsTr("Done")
                    onClicked: {
                        root.paymentSuccess = false
                        root.pendingOrderId = ""
                        Auth.refreshProfile()
                    }
                }

                Timer {
                    running: root.paymentSuccess
                    repeat: false
                    onTriggered: { root.paymentSuccess = false; root.pendingOrderId = ""; Auth.refreshProfile(); }
                    interval: 4000
                }
            }
        }


    }

    Connections {
        function onPaymentOrderCreated(order) {
            root.creatingOrder = false
            root.paymentFailed = false
            root.inlineError = ""
            root.inlineWarning = ""
            root.pollCount = 0
            for (var i = 0; i < root.packageList.length; i++) {
                if (root.packageList[i].key === root.selectedKey) {
                    root.lastPurchasedCredits = root.packageList[i].credits || 0
                    break
                }
            }
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
                else if (url.startsWith("https://"))
                    Backend.openExternal(url); // checkout fallback must be TLS
                App.notify(qsTr("Complete payment in your browser, then Recheck"), "info", "payment");
            } else if (provider === "nowpayments" || provider === "crypto") {
                var w2 = Window.window;
                if (w2 && w2.startPaymentFlight)
                    w2.startPaymentFlight(root.pendingOrderId, "crypto");

                App.notify(qsTr("Send exactly the amount shown to the USDT address"), "info", "payment");
                cryptoPoll.restart();
            } else if (provider === "manual") {
                Backend.verifyPaymentOrder(root.pendingOrderId);
            } else {
                App.notify(qsTr("Order created — use Recheck after paying"), "info", "payment");
            }
        }

        function onPaymentOrderVerified(result) {
            if (result.in_flight) {
                root.cryptoStatus = result.crypto_status || root.cryptoStatus;
                return ;
            }
            cryptoPoll.stop();
            root.cryptoAddress = "";
            root.pendingOrderId = ""; // order settled — stop the poller tracking it
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

            // Terminal failure states — stop the poller, surface the error, release the tracker.
            const st = (status.status || status.crypto_status || "").toLowerCase()
            if (st === "failed" || st === "expired" || st === "refunded" || st === "cancelled") {
                cryptoPoll.stop();
                root.cryptoAddress = "";
                root.pendingOrderId = "";
                root.paymentFailed = true;
                root.inlineError = qsTr("Payment %1 — no credits were added. Start a new order.").arg(st);
                Notifier.push(qsTr("Payment %1").arg(st), qsTr("No credits were added."), "error", "payment");
                return;
            }

            if (status.provisioned || status.status === "provisioned") {
                cryptoPoll.stop();
                root.cryptoAddress = "";
                root.pendingOrderId = ""; // settled — release the tracker
                root.paymentFailed = false;
                root.pollCount = 0;
                var bal = status.balance || {
                };
                if (bal.credit_balance !== undefined) {
                    Auth.applyBalance(bal.credit_balance, bal.bonus_balance || 0);
                    root.paymentSuccess = true;
                }
            }
        }

        function onPaymentOrderCancelled(result) {
            root.cancelling = false;
            const errStr = (result.error !== undefined) ? String(result.error) : ""
            const ok = (result.ok === true) || (result.cancelled === true)
                       || String(result.status || "").toLowerCase() === "cancelled"
            if (ok) {
                root.pendingOrderId = "";
                root.cryptoAddress = "";
                root.cryptoStatus = "";
                root.elapsedSecs = 0;
                root.paymentStartedAt = 0;
                cryptoPoll.stop();
                escalationTimer.stop();
                var win = Window.window
                if (win && win.stopPaymentFlight)
                    win.stopPaymentFlight()
                Notifier.push(qsTr("Order cancelled"), "", "info", "payment");
            } else {
                root.inlineError = errStr.length > 0
                    ? errStr
                    : qsTr("Could not cancel the order (it may already be settled).")
                Notifier.push(qsTr("Cancel failed"), root.inlineError, "error", "payment");
            }
        }

        function onRequestFailed(ep, err) {
            root.redeeming = false
            root.cancelling = false
            if (ep.indexOf("payment") >= 0) {
                // Only payment CREATE failures enter Try-again — status polls
                // fail spuriously on flaky links and must not wedge the CTA
                // or kill the invoice poller.
                if (ep.endsWith("/orders") && !ep.endsWith("/verify")) {
                    root.paymentFailed = true
                    root.creatingOrder = false
                    root.inlineError = qsTr("Payment failed. No funds were charged.");
                    cryptoPoll.stop();
                }
                if (ep.endsWith("/cancel")) {
                    root.inlineError = err
                    Notifier.push(qsTr("Cancel failed"), err, "error", "payment")
                }
            }
            if (ep.indexOf("credits/add") >= 0)
                Notifier.push(qsTr("Credit key rejected"), err, "error", "payment")
        }

        // Electron phase messages (driven by the poller/timeouts)
        function onCreditKeyRedeemed(result) {
            root.redeeming = false
            if (result.error) {
                Notifier.push(String(result.error), "", "error", "payment")
                return
            }
            creditKeyInput.text = ""
            var added = result.credits_added || result.creditsAdded || 0
            Notifier.push(qsTr("Credit key activated - %1 credits added").arg(added), "", "success", "payment")
            Auth.refreshProfile()
        }

        target: Backend
    }

}
