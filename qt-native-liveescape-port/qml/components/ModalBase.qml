import QtQuick
import Qt5Compat.GraphicalEffects
import SmokeScreen

// .overlay + .modal — exact reference chrome:
//   .overlay: fixed inset 0, z 500, rgba(4,4,10,.97), fadeIn .35s,
//             flex align-items:flex-start + padding:40px 0 (cards sit at y=40)
//   .modal:   s1 card, 1px --gold-d border, radius 12, padding 30px 36px,
//             width 92% max 460px, glow 0 0 80px rgba(232,197,71,.07),
//             slideUp .35s (translateY 24→0, opacity 0→1)
// NOTE: the reference has NO Escape-key handling on overlays — do not add any.
Item {
    id: root
    anchors.fill: parent
    visible: open
    z: modalZ

    property bool open: false
    property int modalZ: 500
    property real panelMaxWidth: 460
    property color panelColor: Theme.s1
    property color panelBorderColor: Theme.goldD
    property real panelRadius: Theme.radiusLg
    property real panelPaddingH: 36
    property real panelPaddingV: 30
    property bool closeOnBackdrop: false
    property bool centered: false
    // content children land here
    default property alias content: contentCol.data

    signal close()

    // re-run slideUp on every open (reference re-animates per open)
    onOpenChanged: {
        if (open) {
            slide.y = 24
            panel.opacity = 0
            entrance.restart()
        }
    }

    // ── backdrop ──
    Rectangle {
        anchors.fill: parent
        color: Theme.overlayBg
        MouseArea {
            anchors.fill: parent
            onClicked: if (root.closeOnBackdrop) root.close()
        }
    }

    // ── card ──
    Rectangle {
        id: panel
        width: Math.min(parent.width * 0.92, root.panelMaxWidth)
        height: contentCol.implicitHeight + root.panelPaddingV * 2
        anchors.horizontalCenter: parent.horizontalCenter
        y: root.centered ? (parent.height - height) / 2 : 40
        radius: root.panelRadius
        color: root.panelColor
        border.width: 1
        border.color: root.panelBorderColor

        // glow 0 0 80px rgba(232,197,71,.07)
        layer.enabled: true
        layer.effect: DropShadow {
            horizontalOffset: 0
            verticalOffset: 0
            radius: 80
            samples: 80
            color: Qt.rgba(232/255, 197/255, 71/255, 0.07)
            transparentBorder: true
        }

        // slideUp .35s (entrance is driven by root.onOpenChanged)
        opacity: 0
        transform: Translate { id: slide; y: 24 }
        SequentialAnimation {
            id: entrance
            ParallelAnimation {
                NumberAnimation { target: slide; property: "y"; to: 0; duration: 350; easing.type: Easing.OutQuad }
                NumberAnimation { target: panel; property: "opacity"; to: 1; duration: 350; easing.type: Easing.OutQuad }
            }
        }

        MouseArea { anchors.fill: parent }   // block backdrop hits through the card

        Column {
            id: contentCol
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.leftMargin: root.panelPaddingH
            anchors.rightMargin: root.panelPaddingH
            anchors.topMargin: root.panelPaddingV
            spacing: 12
        }
    }
}
