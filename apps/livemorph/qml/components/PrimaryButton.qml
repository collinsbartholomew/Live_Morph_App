import QtQuick
import QtQuick.Controls as Controls
import LiveMorph

/**
 * Electron primary button (ground truth):
 *   rounded-sm bg-accent text-white text-[12px] font-semibold
 *   border border-accent/60
 *   shadow-[inset 0 1px 0 rgba(255,255,255,.12), 0 2px 8px -2px rgba(168,85,247,.4)]
 *   hover:bg-accent-hover hover:-translate-y-[0.5px]
 *   disabled: bg-surface-elevated text-text-muted border-surface-border-subtle
 *   CTA variant (h-11 rounded-full font-bold uppercase tracking-[0.18em])
 */
Controls.Button {
    id: control

    property bool busy: false
    property bool cta: false // ActionBar "BEGIN SWAP" style variant

    implicitHeight: cta ? 44 : 36
    padding: cta ? 20 : 14
    font: Theme.fontUi

    background: Item {
        // CTA glow halo (hover deepens) — shadow-glow-sm/cta language
        Rectangle {
            anchors.centerIn: parent
            width: parent.width + (control.cta ? 24 : 12)
            height: parent.height + (control.cta ? 24 : 12)
            radius: (control.cta ? Theme.radiusFull : Theme.radiusSm) + (control.cta ? 12 : 6)
            color: control.cta ? Colors.glowAccentCta : Colors.accent
            opacity: !control.enabled ? 0
                : control.hovered ? (control.cta ? 0.38 : 0.22)
                : (control.cta ? 0.30 : 0.14)
            Behavior on opacity { NumberAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
        }
        Rectangle {
            anchors.fill: parent
            radius: control.cta ? Theme.radiusFull : Theme.radiusSm
            color: !control.enabled ? Colors.surfaceElevated
                 : control.pressed ? Colors.accentPressed
                 : control.hovered ? Colors.accentHover
                 : Colors.accent
            border.width: 1
            border.color: !control.enabled ? Colors.surfaceBorderSubtle
                 : Colors.accent60
            Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
            // Electron inset: 0 1px 0 rgba(255,255,255,0.12)
            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                anchors.margins: 1
                height: 1
                radius: 1
                color: "#ffffff1f"
                visible: control.enabled
            }
        }
        FocusRing {
            shown: control.activeFocus
            ringRadius: control.cta ? Theme.radiusFull : Theme.radiusSm
        }
    }

    contentItem: Row {
        spacing: 8
        anchors.centerIn: parent

        // Electron busy state: 8px white dot with ping halo (no spinner)
        Item {
            width: 8
            height: 8
            anchors.verticalCenter: parent.verticalCenter
            visible: control.busy

            Rectangle {
                id: busyPing
                anchors.centerIn: parent
                width: 8; height: 8; radius: 4
                color: Colors.white
                opacity: 0.75
                SequentialAnimation on scale {
                    running: control.busy && Qt.application.state === Qt.ApplicationActive
                    loops: Animation.Infinite
                    NumberAnimation { to: 2.0; duration: 1000; easing.type: Easing.OutCubic }
                    NumberAnimation { to: 1.0; duration: 0 }
                }
                SequentialAnimation on opacity {
                    running: control.busy && Qt.application.state === Qt.ApplicationActive
                    loops: Animation.Infinite
                    NumberAnimation { to: 0; duration: 1000; easing.type: Easing.OutCubic }
                    NumberAnimation { to: 0.75; duration: 0 }
                }
            }
        }

        Text {
            text: control.text
            color: !control.enabled ? Colors.textMuted : Colors.white
            font.family: control.font.family
            font.pixelSize: control.cta ? 12 : 12
            font.weight: control.cta ? Font.Bold : Font.DemiBold
            font.capitalization: control.cta ? Font.AllUppercase : Font.MixedCase
            font.letterSpacing: control.cta ? 2.16 : 0
            anchors.verticalCenter: parent.verticalCenter
            horizontalAlignment: Text.AlignHCenter
        }
    }

    // Electron: active:scale-[0.98] (the 0.5px hover lift is imperceptible and
    // requires anchors we can't guarantee inside layouts)
    scale: control.pressed ? 0.98 : 1.0
    Behavior on scale { NumberAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
}
