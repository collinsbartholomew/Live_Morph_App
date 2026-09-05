import QtQuick
import LiveMorph

/** Fallback if something navigates to page "settings" — bounce to dashboard + drawer */
Item {
    anchors.fill: parent
    Rectangle { anchors.fill: parent; color: Colors.surfaceBase }
    Component.onCompleted: {
        App.showSettings = true
        App.navigateTo("dashboard")
    }
}
