import QtQuick
import LiveMorph

/**
 * Full-page BuyCredits is no longer the primary UX.
 * Original app uses panel-drawer w-[500px] over dashboard.
 * This page only exists as a deep-link / navigateTo("buy-credits") fallback:
 * it immediately opens the drawer and returns to dashboard.
 */
Item {
    id: root
    anchors.fill: parent
    Rectangle { anchors.fill: parent; color: Colors.surfaceBase }

    Component.onCompleted: {
        App.navigateTo("dashboard")
        App.openBuyCredits()
    }
}
