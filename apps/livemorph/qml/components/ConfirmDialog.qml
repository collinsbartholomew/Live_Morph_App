import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

/**
 * ConfirmDialog (Electron Cr, ground truth):
 *   w-[380px] panel-premium · 40px error icon circle (error/10 + error/20 ring)
 *   title 15px semibold · body 12.5px secondary relaxed
 *   buttons mt-6 flex-1 pair · cancel OUTLINED + AUTOFOCUSED
 *   confirm DESTRUCTIVE: bg-status-error white semibold (NOT violet)
 */
Dialog {
    id: root
    property string message: ""
    property string confirmText: qsTr("Confirm")
    property string cancelText: qsTr("Cancel")
    property bool destructive: true // Electron confirm dialogs are destructive
    modal: true
    // Center on the window overlay, not the declaring item: callers embed
    // this dialog inside narrow panels/drawers where centerIn: parent would
    // misplace it.
    anchors.centerIn: Overlay.overlay
    width: 380
    padding: 0 // Electron px-6 pt-7 pb-6 — Dialog default padding (12) shifts everything
    title: ""

    background: Rectangle {
        color: Colors.surfaceOverlay
        border.color: Colors.surfaceBorder
        border.width: 1
        radius: Theme.radiusLg
        clip: true
        Honeycomb {
            anchors.fill: parent
            cellSize: Theme.honeycombCell
            lineColor: Colors.honeycombLineFaint
            opacity: 0.5
        }
        // top hairline + corner frame (signature Obsidian Hex panel chrome)
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 1
            color: Colors.white35
        }
        CornerTicks {
            anchors.fill: parent
            inset: 8
            tickSize: 8
            thickness: 1.5
            color: Colors.accent50
        }
    }

    header: null // Electron: no header bar — floating X over content

    // Register with the global modal stack so the window-level Escape
    // shortcut closes this dialog deterministically.
    onOpened: App.modalOpened()
    onClosed: App.modalClosed()
    Connections {
        target: App
        function onModalEscapeRequested() {
            if (root.visible)
                root.reject()
        }
    }


    contentItem: Item {
        implicitWidth: 380
        // Dialog height derives from contentItem.implicitHeight — drive it
        // from the column, otherwise the dialog collapses to footer-only.
        implicitHeight: col.implicitHeight

        // Floating X (Electron: absolute top-3 right-3 h-7 w-7)
        IconButton {
            anchors.top: parent.top
            anchors.right: parent.right
            anchors.topMargin: 12
            anchors.rightMargin: 12
            name: "x"
            iconSize: 14
            emphasis: true
            onClicked: root.reject()
            z: Theme.zLocal5
        }

        Column {
            id: col
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.topMargin: 24
            anchors.leftMargin: 24
            anchors.rightMargin: 24
            spacing: 8

            // 48px hexagon badge (error ring for destructive,
            // solid white for informational)
            HexBadge {
                size: 48
                iconName: root.destructive ? "trash-2" : "info"
                iconSize: Theme.iconLg
                lineWidth: 1.5
                lineColor: root.destructive ? Colors.statusError40 : Colors.white
                fillColor: root.destructive ? Colors.errorFaintBg : Colors.accent10
                iconColor: root.destructive ? Colors.statusError : Colors.textPrimary
            }

            Item { width: 1; height: 8 } // Electron mt-4

            // Title (leave room for the floating X on the first line)
            Text {
                width: parent.width - 40
                text: root.title.length ? root.title : qsTr("Confirm")
                color: Colors.textPrimary
                font.family: Theme.fontHeading.family
                font.pixelSize: Theme.fontHeading.pixelSize
                font.weight: Font.Bold
                wrapMode: Text.WordWrap
            }

            // Body (Electron mt-1.5)
            Text {
                width: parent.width
                text: root.message
                color: Colors.textSecondary
                wrapMode: Text.WordWrap
                font.pixelSize: 13
                lineHeight: 1.5
            }

            Item { width: 1; height: 8 }
        }
    }

    footer: Item {
        implicitWidth: parent.width
        implicitHeight: 88

        // Hairline separating the footer from the body
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 1
            color: Colors.surfaceBorderSubtle
        }

        // Electron: both buttons flex-1, gap-2.5, cancel OUTLINED + focused;
        // mt-6 row with pb-6 → inline footer padding 24/24.
        RowLayout {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.leftMargin: 24
            anchors.rightMargin: 24
            anchors.topMargin: 24
            anchors.bottomMargin: 24
            spacing: 10

            SecondaryButton {
                Layout.fillWidth: true
                Layout.preferredHeight: 40
                text: root.cancelText
                focus: true
                onClicked: root.reject()
            }

            // Destructive confirm (bg-status-error) — Electron pattern
            Button {
                id: destructiveConfirm
                Layout.fillWidth: true
                height: 40
                flat: true
                background: Rectangle {
                    radius: Theme.radiusSm
                    color: !destructiveConfirm.enabled ? Colors.surfaceElevated
                         : destructiveConfirm.pressed ? Colors.dangerPressed
                         : destructiveConfirm.hovered ? Colors.statusError80
                         : Colors.statusError
                    border.width: 1
                    border.color: destructiveConfirm.enabled ? Colors.statusError : Colors.surfaceBorderSubtle
                    FocusRing { shown: destructiveConfirm.activeFocus; ringRadius: Theme.radiusSm }
                }
                contentItem: Text {
                    id: destructiveLabel
                    text: root.confirmText
                    color: !destructiveConfirm.enabled ? Colors.textMuted : Colors.white
                    font.pixelSize: 12
                    font.weight: Font.Bold
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter
                }
                onClicked: root.accept()
            }
        }
    }
}
