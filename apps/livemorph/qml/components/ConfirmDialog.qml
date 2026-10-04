import QtQuick
import QtQuick.Controls
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
    anchors.centerIn: parent
    width: 380
    title: ""

    background: Rectangle {
        color: Colors.surfaceOverlay
        border.color: Colors.surfaceBorder
        border.width: 1
        radius: Theme.radiusLg
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 1
            color: Colors.insetHighlight
            radius: Theme.radiusLg
        }
        // panel-premium shadow: 0 2px 8px .35 + 0 24px 48px -12px .55
        Rectangle {
            anchors.fill: parent
            anchors.margins: -2
            radius: parent.radius + 2
            color: "#00000059"
            z: -1
        }
        Rectangle {
            anchors.fill: parent
            anchors.margins: -12
            anchors.topMargin: -4
            radius: parent.radius + 12
            color: "#0000008c"
            opacity: 0.9
            z: -1
        }
    }

    header: Item {
        height: 48
        width: parent.width
        Text {
            anchors.left: parent.left
            anchors.verticalCenter: parent.verticalCenter
            anchors.leftMargin: 20
            text: root.title.length ? root.title : qsTr("Confirm")
            color: Colors.textPrimary
            font.pixelSize: 15
            font.weight: Font.DemiBold
        }
        // Close X (Electron: top-right 28px)
        IconButton {
            anchors.right: parent.right
            anchors.rightMargin: 8
            anchors.verticalCenter: parent.verticalCenter
            name: "x"
            iconSize: 14
            emphasis: true
            onClicked: root.reject()
        }
    }

    contentItem: Column {
        spacing: 16
        leftPadding: 20
        rightPadding: 20
        bottomPadding: 8

        // Error icon circle (Electron: h-10 w-10 error/10 ring error/20)
        Rectangle {
            visible: root.destructive
            width: 40; height: 40; radius: 20
            color: Colors.errorFaintBg
            border.color: "#ef444433"
            border.width: 1
            anchors.horizontalCenter: parent.horizontalCenter
            Icon {
                anchors.centerIn: parent
                name: "alert-circle"
                size: Theme.iconMd
                color: Colors.statusError
            }
        }

        Text {
            text: root.message
            color: Colors.textSecondary
            wrapMode: Text.WordWrap
            font.pixelSize: 12
            lineHeight: 1.5
            width: parent.width - 40
            horizontalAlignment: Text.AlignHCenter
        }
    }

    footer: Item {
        implicitWidth: parent.width
        implicitHeight: 76

        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 1
            color: Colors.surfaceBorderSubtle
        }

        // Electron: both buttons flex-1, gap-2.5, cancel OUTLINED + focused
        Row {
            anchors.right: parent.right
            anchors.rightMargin: 16
            anchors.verticalCenter: parent.verticalCenter
            spacing: 10

            SecondaryButton {
                text: root.cancelText
                focus: true
                onClicked: root.reject()
            }

            // Destructive confirm (bg-status-error) — Electron pattern
            Button {
                id: destructiveConfirm
                width: Math.max(112, destructiveLabel.implicitWidth + 32)
                height: 36
                flat: true
                background: Rectangle {
                    radius: Theme.radiusSm
                    color: !destructiveConfirm.enabled ? Colors.surfaceElevated
                         : destructiveConfirm.pressed ? "#dc2626"
                         : destructiveConfirm.hovered ? "#ef4444cc"
                         : Colors.statusError
                    border.width: 1
                    border.color: destructiveConfirm.enabled ? Colors.statusError : Colors.surfaceBorderSubtle
                    Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
                    FocusRing { shown: destructiveConfirm.activeFocus; ringRadius: Theme.radiusSm }
                }
                contentItem: Text {
                    id: destructiveLabel
                    text: root.confirmText
                    color: !destructiveConfirm.enabled ? Colors.textMuted : Colors.white
                    font.pixelSize: 12
                    font.weight: Font.DemiBold
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter
                }
                onClicked: root.accept()
            }
        }
    }
}
