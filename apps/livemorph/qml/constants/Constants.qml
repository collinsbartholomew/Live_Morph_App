pragma Singleton
import QtQuick
import LiveMorph

/**
 * Constants — single source of truth for app-wide values.
 * Chrome heights MUST match Theme.qml (original JS: h-11=44, h-12=48, h-[88px], w-[320px]).
 */
QtObject {
    id: root

    // ── App identity ────────────────────────────────────────────────
    readonly property string appName: "LiveMorph"
    readonly property string appVersion: "1.0.0"
    readonly property string organization: "LiveMorph"
    readonly property string domain: "livemorph.com"

    // ── Backend ─────────────────────────────────────────────────────
    // Base URL comes from LIVEMORPH_API_URL env var or Settings (no hardcoded port).
    // typeof guard: a bare `Backend &&` throws ReferenceError if the name is
    // not yet resolvable during singleton init.
    readonly property string backendBaseUrl: typeof Backend !== "undefined" && Backend.baseUrl ? Backend.baseUrl : ""
    readonly property string apiPrefix: "/api/v1"
    readonly property string apiBase: backendBaseUrl + apiPrefix
    readonly property string realtimePath: "/api/v1/realtime"
    readonly property string realtimeWsUrl: backendBaseUrl ? backendBaseUrl.replace("http", "ws") + realtimePath : ""

    // ── Auth ────────────────────────────────────────────────────────
    readonly property int otpLength: 8
    readonly property int otpMinSubmitLength: 8
    readonly property int resendCooldownSecs: 30
    readonly property int authMaxAttempts: 5
    readonly property int authLockoutSecs: 60

    // ── Credits ─────────────────────────────────────────────────────
    readonly property real defaultCreditsPerSecond: 2.0
    readonly property real minCreditsToStart: 5.0
    readonly property real hdCreditMultiplier: 1.5
    readonly property real signupBonusCredits: 100.0
    // Below this balance the UI flips to the low-credit (warning) treatment.
    readonly property int lowCreditThreshold: 600
    // Below this the balance is treated as critically low (error treatment).
    readonly property int criticalCreditThreshold: 120
    // Library/prompt layout caps (single source; QML must not hardcode them).
    readonly property int maxLibrarySize: 28
    readonly property int maxPromptBarWidth: 880

    // ── Session / morph ─────────────────────────────────────────────
    readonly property int cooldownSecs: 3
    readonly property string defaultModel: "lucy-2.1"
    readonly property string defaultSwapMode: "character"
    readonly property string defaultSwapTier: "standard"

    // ── Layout (synced with Theme; Electron: titlebar 40, topbar 48,
    //    status footer 36 FIXED — no compact variant) ────────────────
    readonly property int titleBarHeight: 40
    readonly property int topBarHeight: 48
    readonly property int statusBarHeight: 36
    readonly property int actionBarHeight: 72
    readonly property int workshopWidth: 360
    readonly property int actionLeftWidth: 360
    readonly property int settingsDrawerWidth: 560
    readonly property int buyCreditsDrawerWidth: 500
    readonly property int notificationsWidth: 340
    readonly property int pipWidth: 180
    readonly property int pipHeight: 120

    // ── External links ──────────────────────────────────────────────
    readonly property string urlTerms: "https://livemorph.com/terms"
    readonly property string urlPrivacy: "https://livemorph.com/privacy"
    readonly property string urlAup: "https://livemorph.com/acceptable-use"
    readonly property string urlSupport: "https://livemorph.com/support"
    readonly property string urlReport: "https://livemorph.com/report"
    readonly property string urlBilling: "https://livemorph.com/billing"
    readonly property string urlSite: "https://livemorph.com"
    readonly property string urlLegalAup: "https://livemorph.com/legal/aup"
    readonly property string urlLinktree: "https://linktr.ee/thetoolshub"
    readonly property string urlDiscord: "https://discord.gg/livemorph"
    readonly property string urlDecartAup: "https://docs.platform.decart.ai/resources/aup"
    readonly property string urlNowPayments: "https://nowpayments.io/payment/"

    // ── Payment packages (fallback until the first /payments/packages response;
    //    values mirror the backend TokenPackage catalog — basic/starter/mid/pro —
    //    so prices and credits never disagree with what the server grants.
    //    "per" assumes the default 2 credits/s burn rate) ────────────────────
    readonly property var creditPackages: [
        { key: "basic",   name: "Spark",   credits: "500",   per: qsTr("4 min"),  priceUsd: "$5",  priceNgn: "₦7,500",   popular: false },
        { key: "starter", name: "Creator", credits: "1,200", per: qsTr("10 min"), priceUsd: "$10", priceNgn: "₦15,000",  popular: false },
        { key: "mid",     name: "Studio",  credits: "3,000", per: qsTr("25 min"), priceUsd: "$20", priceNgn: "₦30,000",  popular: true  },
        { key: "pro",     name: "Stage",   credits: "8,000", per: qsTr("1h 6m"),  priceUsd: "$45", priceNgn: "₦67,500",  popular: false }
    ]

    // Electron: HD is available on the Starter pack and above
    readonly property var hdPackageKeys: ["starter", "mid", "pro"]

    // Crypto coin brand colors/symbols (brand data, not theme) — single source
    // for the BuyCreditsDrawer coin stack.
    readonly property var cryptoLogos: ({
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

    readonly property string tagline: qsTr("Live AI character transformation")
    readonly property string productLine: qsTr("LiveMorph Desktop")

    readonly property var catalogCategories: ["All", "Fantasy", "Horror", "Sci-Fi", "Realistic"]

    readonly property string shortcutRecord: "F12"
    readonly property string shortcutPreview: "Ctrl+P"
    readonly property string shortcutPopout: "Ctrl+Shift+P"

    readonly property int maxNotifications: 50
    readonly property int defaultStreamPort: 4789
}
