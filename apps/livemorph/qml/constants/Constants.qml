pragma Singleton
import QtQuick

/**
 * Constants — single source of truth for app-wide values.
 * Chrome heights MUST match Theme.qml (original JS: h-11=44, h-12=48, h-[88px], w-[320px]).
 */
QtObject {
    id: root

    // ── App identity ────────────────────────────────────────────────
    readonly property string appName: "LiveMorph"
    readonly property string appVersion: "1.8.0"
    readonly property string organization: "LiveMorph"
    readonly property string domain: "livemorph.com"

    // ── Backend ─────────────────────────────────────────────────────
    // Base URL comes from LIVEMORPH_API_URL env var or Settings (no hardcoded port).
    readonly property string backendBaseUrl: Backend && Backend.baseUrl ? Backend.baseUrl : ""
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

    // ── Session / morph ─────────────────────────────────────────────
    readonly property int cooldownSecs: 3
    readonly property string defaultModel: "lucy-2.1"
    readonly property string defaultSwapMode: "character"
    readonly property string defaultSwapTier: "standard"

    // ── Layout (synced with Theme; Electron: titlebar 40, topbar 44,
    //    status footer 32 FIXED — no compact variant) ────────────────
    readonly property int titleBarHeight: 40
    readonly property int topBarHeight: 44
    readonly property int statusBarHeight: 32
    readonly property int actionBarHeight: 88
    readonly property int workshopWidth: 360
    readonly property int actionLeftWidth: 360
    readonly property int settingsDrawerWidth: 480
    readonly property int buyCreditsDrawerWidth: 500
    readonly property int notificationsWidth: 360
    readonly property int pipWidth: 180
    readonly property int pipHeight: 120

    // ── External links ──────────────────────────────────────────────
    readonly property string urlTerms: "https://livemorph.com/terms"
    readonly property string urlPrivacy: "https://livemorph.com/privacy"
    readonly property string urlAup: "https://livemorph.com/acceptable-use"
    readonly property string urlSupport: "https://livemorph.com/support"
    readonly property string urlDiscord: "https://discord.gg/livemorph"

    // ── Payment packages (Electron names + duration format: floor minutes,
    //    "1h 23m" style; no "~") ───────────────────────────────────────
    readonly property var creditPackages: [
        { key: "basic",   name: "Basic",   credits: "900",    per: "7 min",   priceUsd: "$15",  priceNgn: "₦25,000",  popular: false },
        { key: "starter", name: "Starter", credits: "4,000",  per: "33 min",  priceUsd: "$60",  priceNgn: "₦100,000", popular: false },
        { key: "mid",     name: "Mid",     credits: "10,000", per: "1h 23m",  priceUsd: "$150", priceNgn: "₦250,000", popular: true  },
        { key: "pro",     name: "Pro",     credits: "45,000", per: "6h 15m",  priceUsd: "$600", priceNgn: "₦950,000", popular: false }
    ]

    // Electron: HD is available on the Starter pack and above
    readonly property var hdPackageKeys: ["starter", "mid", "pro"]

    readonly property string tagline: "Live AI character transformation"
    readonly property string productLine: "LiveMorph Desktop"

    readonly property var catalogCategories: ["All", "Fantasy", "Horror", "Sci-Fi", "Realistic"]

    readonly property string shortcutRecord: "F12"
    readonly property string shortcutPreview: "Ctrl+P"
    readonly property string shortcutPopout: "Ctrl+Shift+P"

    readonly property int maxNotifications: 50
    readonly property int defaultStreamPort: 4789
}
