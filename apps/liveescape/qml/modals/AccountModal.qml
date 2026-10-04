import LiveEscape
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts

ModalBase {
    open: App.showAccountModal
    modalZ: 500
    panelWidth: Math.min(parent.width * 0.9, 440)
    panelImplicitHeight: contentCol.implicitHeight + 48
    onClose: App.showAccountModal = false

    // Header with avatar
    RowLayout {
        width: parent.width
        spacing: 12

        Rectangle {
            Layout.preferredWidth: 48
            Layout.preferredHeight: 48
            radius: 24
            color: Theme.goldGlow
            border.color: Theme.gold
            border.width: 2
            Text {
                anchors.centerIn: parent
                text: {
                    var n = Session.displayName || Session.email || "?";
                    return n.charAt(0).toUpperCase();
                }
                color: Theme.gold
                font.family: Theme.fontUi
                font.pixelSize: 20
                font.bold: true
            }
        }

        Column {
            Layout.fillWidth: true
            spacing: 2

            Text {
                text: Session.displayName || Session.email || "User"
                color: Theme.text
                font.family: Theme.fontUi
                font.pixelSize: 18
                font.bold: true
            }
            Text {
                text: Session.email || "—"
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 9
            }
        }

        GhostButton {
            text: qsTr("✕")
            onClicked: App.showAccountModal = false
        }
    }

    Rectangle {
        width: parent.width
        height: 1
        color: Theme.border
    }

    RowLayout {
        width: parent.width
        spacing: 12

        Text {
            text: qsTr("LANGUAGE")
            color: Theme.dim
            font.family: Theme.fontMono
            font.pixelSize: 9
            font.letterSpacing: 1.5
            Layout.fillWidth: true
        }

        ComboBox {
            id: langBox

            Layout.preferredWidth: 200
            model: {
                var m = [];
                var langs = App.i18nLanguages;
                var names = {
                    "en": "English", "es": "Español", "fr": "Français", "de": "Deutsch",
                    "pt": "Português", "it": "Italiano", "nl": "Nederlands", "pl": "Polski",
                    "sv": "Svenska", "tr": "Türkçe", "ru": "Русский", "uk": "Українська",
                    "ar": "العربية", "hi": "हिन्दी", "id": "Bahasa Indonesia", "vi": "Tiếng Việt",
                    "th": "ไทย", "zh": "中文", "ja": "日本語", "ko": "한국어"
                };
                for (var i = 0; i < langs.length; i++)
                    m.push((names[langs[i]] || langs[i]) + "  (" + langs[i] + ")");
                return m;
            }
            currentIndex: Math.max(0, App.i18nLanguages.indexOf(App.i18nLanguage))
            font.family: Theme.fontMono
            font.pixelSize: 10
            background: Rectangle {
                radius: Theme.radius
                color: Theme.s1
                border.color: Theme.border
            }
            onActivated: App.i18nSetLanguage(App.i18nLanguages[currentIndex])
        }

    }

    Repeater {
        model: [{
            "k": "EMAIL",
            "v": Session.email || "—"
        }, {
            "k": "USER ID",
            "v": Session.userId || "—"
        }, {
            "k": "PLAN",
            "v": (Session.plan || "starter").toUpperCase()
        }, {
            "k": "STATUS",
            "v": Session.licenseStatus || "—",
            "c": Theme.teal
        }, {
            "k": "LICENSE EXPIRES",
            "v": Session.licenseExpiry.length > 0 ? Session.licenseExpiry.substring(0, 10) : "—"
        }, {
            "k": "CREDITS",
            "v": Math.floor(Session.creditsRemaining) + " remaining / " + Math.floor(Session.creditsUsed) + " used",
            "c": Theme.teal
        }, {
            "k": "DEVICE",
            "v": App.deviceId(),
            "c": Theme.gold
        }]

        RowLayout {
            width: parent.width
            spacing: 12

            Text {
                text: modelData.k
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 9
                font.letterSpacing: 1.5
                Layout.preferredWidth: 72
            }

            Text {
                text: modelData.v
                color: modelData.c || Theme.text
                font.family: Theme.fontMono
                font.pixelSize: 11
                elide: Text.ElideMiddle
                Layout.fillWidth: true
            }

        }

    }

    Rectangle {
        width: parent.width
        height: creatorCol.implicitHeight + 20
        radius: Theme.radius
        color: Theme.s2
        border.color: Theme.border

        Column {
            id: creatorCol

            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.margins: 10
            spacing: 8

            Text {
                text: qsTr("🎁 REFERRAL PROGRAM")
                color: Theme.gold
                font.family: Theme.fontMono
                font.pixelSize: 10
                font.letterSpacing: 1.5
                font.bold: true
            }

            Text {
                width: parent.width
                wrapMode: Text.WordWrap
                text: qsTr("Share your code with friends. When they sign up & buy credits, you both earn 100 free credits.")
                color: Theme.dim
                font.family: Theme.fontMono
                font.pixelSize: 10
            }

            RowLayout {
                width: parent.width

                Column {
                    Layout.fillWidth: true
                    spacing: 2

                    Text {
                        text: "YOUR CODE:"
                        color: Theme.teal
                        font.family: Theme.fontMono
                        font.pixelSize: 8
                        font.letterSpacing: 1.5
                    }
                    Text {
                        text: Session.referralCode || "— loading —"
                        color: Theme.teal
                        font.family: Theme.fontMono
                        font.pixelSize: 12
                        font.bold: true
                    }
                }

                GhostButton {
                    text: qsTr("COPY")
                    enabled: Session.referralCode && Session.referralCode.length > 0
                    onClicked: {
                        App.copyToClipboard(Session.referralCode);
                        App.toast("Referral code copied", "ok");
                    }
                }

            }

            Text {
                text: "Referral credits earned: " + (Session.referralEarned !== undefined ? Session.referralEarned : "0")
                color: Theme.teal
                font.family: Theme.fontMono
                font.pixelSize: 10
            }

        }

    }

    // Creator payout details (Creator/Pro plans only)
    Rectangle {
        visible: Session.hasFeature("creatorProgram")
        width: parent.width
        height: payoutCol.implicitHeight + 20
        radius: Theme.radius
        color: Theme.s2
        border.color: Theme.border

        Column {
            id: payoutCol

            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.margins: 10
            spacing: 8

            Text {
                text: qsTr("🏦 CREATOR PROGRAM — PAYOUT DETAILS")
                color: Theme.gold
                font.family: Theme.fontMono
                font.pixelSize: 10
                font.letterSpacing: 1.5
                font.bold: true
            }

            Grid {
                columns: 2
                spacing: 8
                width: parent.width

                Text { text: "ACCOUNT NAME"; color: Theme.dim; font.family: Theme.fontMono; font.pixelSize: 9; verticalAlignment: Text.AlignVCenter }
                TextField {
                    id: payAccount
                    width: 260; color: Theme.text; font.family: Theme.fontMono; font.pixelSize: 10
                    placeholderText: qsTr("Full name on account")
                    text: App.payoutDetails.account_name || ""
                    background: Rectangle { color: Theme.s1; radius: Theme.radius; border.color: Theme.border }
                }
                Text { text: "BANK NAME"; color: Theme.dim; font.family: Theme.fontMono; font.pixelSize: 9; verticalAlignment: Text.AlignVCenter }
                TextField {
                    id: payBank
                    width: 260; color: Theme.text; font.family: Theme.fontMono; font.pixelSize: 10
                    placeholderText: qsTr("e.g. GTBank, Zenith, UBA")
                    text: App.payoutDetails.bank_name || ""
                    background: Rectangle { color: Theme.s1; radius: Theme.radius; border.color: Theme.border }
                }
                Text { text: "ACCOUNT NUMBER"; color: Theme.dim; font.family: Theme.fontMono; font.pixelSize: 9; verticalAlignment: Text.AlignVCenter }
                TextField {
                    id: payNumber
                    width: 260; color: Theme.text; font.family: Theme.fontMono; font.pixelSize: 10
                    placeholderText: qsTr("10-digit account number")
                    text: App.payoutDetails.account_number || ""
                    background: Rectangle { color: Theme.s1; radius: Theme.radius; border.color: Theme.border }
                }
                Text { text: "ROUTING / SORT CODE (optional)"; color: Theme.dim; font.family: Theme.fontMono; font.pixelSize: 9; verticalAlignment: Text.AlignVCenter }
                TextField {
                    id: payRouting
                    width: 260; color: Theme.text; font.family: Theme.fontMono; font.pixelSize: 10
                    placeholderText: qsTr("For international transfers")
                    text: App.payoutDetails.routing_number || ""
                    background: Rectangle { color: Theme.s1; radius: Theme.radius; border.color: Theme.border }
                }
                Text { text: "COUNTRY"; color: Theme.dim; font.family: Theme.fontMono; font.pixelSize: 9; verticalAlignment: Text.AlignVCenter }
                ComboBox {
                    id: payCountry
                    width: 260
                    // Display label → ISO code sent to backend (Electron parity: value="NG" etc.)
                    property var countryCodes: ["NG", "GH", "KE", "ZA", "GB", "US", "OTHER"]
                    model: ["Nigeria (NGN)", "Ghana (GHS)", "Kenya (KES)", "South Africa (ZAR)", "United Kingdom (GBP)", "United States (USD)", "Other"]
                    readonly property string code: currentIndex >= 0 && currentIndex < countryCodes.length
                         ? countryCodes[currentIndex] : "OTHER"
                    currentIndex: {
                        var c = App.payoutDetails.country || "NG";
                        var i = countryCodes.indexOf(c);
                        return i >= 0 ? i : 0;
                    }
                    font.family: Theme.fontMono
                    font.pixelSize: 10
                    background: Rectangle { color: Theme.s1; radius: Theme.radius; border.color: Theme.border }
                }
            }

            GoldButton {
                width: parent.width
                text: qsTr("SAVE PAYOUT DETAILS")
                onClicked: App.savePayoutDetails(payAccount.text, payBank.text, payNumber.text, payRouting.text,
                                                  payCountry.code)
            }

        }

    }

    GoldButton {
        width: parent.width
        text: qsTr("🎟️ BUY CREDITS")
        onClicked: {
            App.showAccountModal = false;
            App.showPlanGate = true;
        }
    }

    GhostButton {
        width: parent.width
        text: qsTr("📈 UPGRADE PLAN")
        onClicked: {
            App.showAccountModal = false;
            App.openUpgradeFlow();
        }
    }

    RowLayout {
        width: parent.width
        spacing: 8

        GhostButton {
            text: qsTr("💬 SUPPORT")
            Layout.fillWidth: true
            onClicked: App.openExternal("https://t.me/liveescapeapp")
        }

        GhostButton {
            text: qsTr("⬅ BACK")
            Layout.fillWidth: true
            onClicked: App.showAccountModal = false
        }
    }

    GhostButton {
        width: parent.width
        text: qsTr("⬅ SIGN OUT")
        fg: Theme.red
        onClicked: {
            App.showAccountModal = false;
            App.logout();
        }
    }

}
