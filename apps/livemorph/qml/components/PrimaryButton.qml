import QtQuick
import QtQuick.Controls as Controls
import LiveMorph

/**
 * Obsidian Hex primary button: solid white fill with black uppercase-mono
 * label and a small hex glyph — no gradient, no glow halo, crisp near-square
 * corners with a 1px white hairline. Disabled = flat elevated surface.
 * All state changes instant (animations banned project-wide).
 */
Controls.Button {
    id: control

    property bool busy: false
    property bool cta: false // ActionBar "START MORPH" style variant
    property int heightOverride: 0 // callers that need a non-standard height
    // Transient state overrides (save-button saved/error flashes).
    property var stateBg: undefined
    property var stateBorder: undefined
    property var stateFg: undefined

    implicitHeight: heightOverride > 0 ? heightOverride : (cta ? 48 : 36)
    leftPadding: cta ? 24 : 16
    rightPadding: cta ? 24 : 16
    font: Theme.fontUi

    background: Item {
        // Solid inverted fill for the enabled primary state
        Rectangle {
            anchors.fill: parent
            radius: Theme.radiusMd
            visible: control.stateBg === undefined && control.enabled
            color: Colors.accent
            border.width: 1
            border.color: Colors.accent
            // Pressed dim (instant, no animation)
            Rectangle {
                anchors.fill: parent
                radius: parent.radius
                color: Colors.black
                opacity: control.pressed ? 0.18 : 0
            }
        }
        Rectangle {
            anchors.fill: parent
            radius: Theme.radiusMd
            color: control.stateBg !== undefined ? control.stateBg
                 : !control.enabled ? Colors.surfaceElevated : Colors.transparent
            border.width: 1
            border.color: control.stateBorder !== undefined ? control.stateBorder
                 : !control.enabled ? Colors.surfaceBorderSubtle
                 : Colors.transparent
        }
        // Hex-tech corner frame on hover/focus over the solid inverted fill
        CornerTicks {
            anchors.fill: parent
            visible: (control.hovered || control.activeFocus) && control.enabled && control.stateBg === undefined
            inset: 4
            tickSize: 6
            thickness: 1.5
            color: Colors.textOnAccent
            opacity: 0.85
        }
        FocusRing {
            shown: control.activeFocus
            ringRadius: Theme.radiusMd
        }
    }

    contentItem: Row {
        spacing: Theme.spacingSm
        anchors.centerIn: parent

        Hexagon {
            size: 9
            lineWidth: 1.5
            lineColor: control.stateFg !== undefined ? control.stateFg
                     : !control.enabled ? Colors.textMuted : Colors.textOnAccent
            anchors.verticalCenter: parent.verticalCenter
            visible: !control.busy
        }

        Hexagon {
            size: 10
            lineWidth: 0
            fillColor: control.stateFg !== undefined ? control.stateFg
                     : !control.enabled ? Colors.textMuted : Colors.textOnAccent
            opacity: 0.85
            anchors.verticalCenter: parent.verticalCenter
            visible: control.busy
        }

        Text {
            text: control.text
            color: control.stateFg !== undefined ? control.stateFg
                 : !control.enabled ? Colors.textMuted : Colors.textOnAccent
            font.family: control.font.family
            font.pixelSize: control.cta ? 14 : Theme.fontUi.pixelSize
            font.weight: Font.Bold
            font.capitalization: control.cta ? Font.AllUppercase : Font.MixedCase
            font.letterSpacing: control.cta ? Theme.trackingCta : 0
            anchors.verticalCenter: parent.verticalCenter
            horizontalAlignment: Text.AlignHCenter
            elide: Text.ElideRight
        }
    }

    scale: control.pressed ? 0.98 : 1.0
}
