import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

/**
 * Upload consent dialog (Electron iy, ground truth):
 *   w-[520px] panel-premium · title "Before you upload, read this"
 *   intro: "…Decart's Acceptable Use Policy and ours both require you to
 *   attest to a few things on every reference image…"
 *   custom 16px checkboxes (rounded-3, accent when checked, label-row hover)
 *   dual AUP links (ours + Decart's) · footer: ghost Cancel + primary
 *   "I Agree & Upload"
 */
Dialog {
    id: root
    modal: true
    // Center on the window overlay — callers embed this dialog inside narrow
    // panels (workshop), where centerIn: parent would misplace/shrink it.
    anchors.centerIn: Overlay.overlay ? Overlay.overlay : parent
    width: Math.min(520, (Overlay.overlay ? Overlay.overlay.width : 800) - 48)
    height: Math.min((Overlay.overlay ? Overlay.overlay.height : 800) - 64, 560)
    closePolicy: Popup.NoAutoClose
    padding: 0

    // Modal stack registration: the global Escape shortcut closes this.
    // (merged with the checkbox-reset onOpened below)
    Connections {
        target: App
        function onModalEscapeRequested() {
            if (root.visible)
                root.reject()
        }
    }

    property bool consentGiven: chk1Label.checked && chk2Label.checked && chk3Label.checked

    background: Rectangle {
        color: Colors.surfaceOverlay
        border.color: Colors.surfaceBorder
        border.width: 1
        radius: Theme.radiusLg
        clip: true
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 1
            color: Colors.insetHighlight
        }
        Honeycomb {
            anchors.fill: parent
            cellSize: Theme.honeycombCell
            lineColor: Colors.honeycombLineFaint
            opacity: 0.5
        }
        CornerTicks {
            anchors.fill: parent
            inset: 8
            tickSize: 8
            thickness: 1.5
            color: Colors.accent50
        }
    }

    contentItem: ColumnLayout {
        id: contentCol
        spacing: 0

        // Header (Electron): icon BESIDE title on one row, intro underneath
        ColumnLayout {
            Layout.fillWidth: true
            Layout.margins: 24
            Layout.bottomMargin: 16
            spacing: 12

            RowLayout {
                Layout.fillWidth: true
                spacing: 12
                HexBadge {
                    size: 42
                    iconName: "shield"
                    iconSize: Theme.iconMd
                    lineWidth: 1.5
                    lineColor: Colors.accent20
                    fillColor: Colors.accent10
                    iconColor: Colors.accent
                    Layout.alignment: Qt.AlignVCenter
                }
                Text {
                    text: qsTr("Before you upload, read this")
                    color: Colors.textPrimary
                    font.pixelSize: 16
                    font.weight: Font.Bold
                    Layout.fillWidth: true
                    Layout.alignment: Qt.AlignVCenter
                    wrapMode: Text.WordWrap
                }
            }

            Text {
                text: qsTr("LiveMorph is powered by Decart Lucy 2. Decart's Acceptable Use Policy and ours both require you to attest to a few things on every reference image. Take a moment to check each one.")
                color: Colors.textMuted
                font.pixelSize: 12
                wrapMode: Text.WordWrap
                Layout.fillWidth: true
                lineHeight: 1.625
            }
        }

        Rectangle { Layout.fillWidth: true; height: 1; color: Colors.surfaceBorderSubtle }

        // Checks (px-6 py-5, gap-2) — custom Electron-style checkboxes.
        // Scrollable so the footer never renders outside the panel on short windows.
        Flickable {
            Layout.fillWidth: true
            Layout.fillHeight: true
            Layout.preferredHeight: Math.max(0, Math.min(checksCol.implicitHeight + 48,
                                             (Overlay.overlay ? Overlay.overlay.height : 800) - 64 - 220))
            contentWidth: width
            contentHeight: checksCol.implicitHeight + 48
            clip: true
            boundsBehavior: Flickable.StopAtBounds
            ScrollBar.vertical: StyledScrollBar { thin: true }

        ColumnLayout {
            id: checksCol
            width: parent.width - 48
            x: 24
            spacing: 8

            // Check 1: likeness consent
            RowLayout {
                id: row1
                Layout.fillWidth: true
                spacing: 12
                // Keyboard accessible: focusable row, Space/Enter toggles.
                // main.qml's global Space shortcut defers to spaceToggles items.
                focus: true
                property bool spaceToggles: true
                Keys.onSpacePressed: (e) => { chk1Label.checked = !chk1Label.checked; e.accepted = true }
                Keys.onReturnPressed: (e) => { chk1Label.checked = !chk1Label.checked; e.accepted = true }
                // Hex checkbox (honeycomb signature on consent checks)
                Hexagon {
                    size: 16
                    lineWidth: 1
                    lineColor: chk1Label.checked ? Colors.accent
                        : (row1Ma.containsMouse ? Colors.textMuted : Colors.surfaceBorderStrong)
                    fillColor: chk1Label.checked ? Colors.accent : Colors.surfaceBase
                    Layout.alignment: Qt.AlignVCenter
                    Icon {
                        visible: chk1Label.checked
                        anchors.centerIn: parent
                        name: "check"
                        size: 11
                        color: Colors.textOnAccent
                    }
                }
                Text {
                    id: chk1Label
                    property bool checked: false
                    Layout.fillWidth: true
                    text: qsTr("This image is either a fictional character, OR I have explicit, documented consent from the real person it depicts. I will not use LiveMorph to impersonate anyone without their consent.")
                    color: row1Ma.containsMouse ? Colors.textPrimary : Colors.textSecondary
                    font.pixelSize: 12
                    wrapMode: Text.WordWrap
                    lineHeight: 1.625
                    MouseArea {
                        id: row1Ma
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: chk1Label.checked = !chk1Label.checked
                    }
                }
            }

            // Check 2: AI disclosure
            RowLayout {
                id: row2
                Layout.fillWidth: true
                spacing: 12
                focus: true
                property bool spaceToggles: true
                Keys.onSpacePressed: (e) => { chk2Label.checked = !chk2Label.checked; e.accepted = true }
                Keys.onReturnPressed: (e) => { chk2Label.checked = !chk2Label.checked; e.accepted = true }
                Hexagon {
                    size: 16
                    lineWidth: 1
                    lineColor: chk2Label.checked ? Colors.accent
                        : (row2Ma.containsMouse ? Colors.textMuted : Colors.surfaceBorderStrong)
                    fillColor: chk2Label.checked ? Colors.accent : Colors.surfaceBase
                    Layout.alignment: Qt.AlignVCenter
                    Icon {
                        visible: chk2Label.checked
                        anchors.centerIn: parent
                        name: "check"
                        size: 11
                        color: Colors.textOnAccent
                    }
                }
                Text {
                    id: chk2Label
                    property bool checked: false
                    Layout.fillWidth: true
                    text: qsTr("I will disclose to my viewers that my stream is AI-generated (stream title, panel, or scene overlay) and will not present this output as authentic news, real events, or testimony of a real person.")
                    color: row2Ma.containsMouse ? Colors.textPrimary : Colors.textSecondary
                    font.pixelSize: 12
                    wrapMode: Text.WordWrap
                    lineHeight: 1.625
                    MouseArea {
                        id: row2Ma
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: chk2Label.checked = !chk2Label.checked
                    }
                }
            }

            // Check 3: AUP links (ours + Decart's)
            RowLayout {
                id: row3
                Layout.fillWidth: true
                spacing: 12
                focus: true
                property bool spaceToggles: true
                Keys.onSpacePressed: (e) => { chk3Label.checked = !chk3Label.checked; e.accepted = true }
                Keys.onReturnPressed: (e) => { chk3Label.checked = !chk3Label.checked; e.accepted = true }
                Hexagon {
                    size: 16
                    lineWidth: 1
                    lineColor: chk3Label.checked ? Colors.accent
                        : (row3Ma.containsMouse ? Colors.textMuted : Colors.surfaceBorderStrong)
                    fillColor: chk3Label.checked ? Colors.accent : Colors.surfaceBase
                    Layout.alignment: Qt.AlignVCenter
                    Icon {
                        visible: chk3Label.checked
                        anchors.centerIn: parent
                        name: "check"
                        size: 11
                        color: Colors.textOnAccent
                    }
                }
                Text {
                    id: chk3Label
                    property bool checked: false
                    Layout.fillWidth: true
                    text: qsTr("I have read and agree to both: ") +
                          "<a href='" + Constants.urlAup + "'>LiveMorph AUP</a> / " +
                          "<a href='" + Constants.urlDecartAup + "'>Decart AUP</a>."
                    textFormat: Text.RichText
                    linkColor: Colors.accent;
                    color: row3Ma.containsMouse ? Colors.textPrimary : Colors.textSecondary
                    font.pixelSize: 12
                    wrapMode: Text.WordWrap
                    onLinkActivated: (link) => {
                        if (link.indexOf("https://") === 0)
                            Qt.openUrlExternally(link)
                    }
                    MouseArea {
                        id: row3Ma
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: function(mouse) {
                            var link = chk3Label.linkAt(mouse.x, mouse.y)
                            if (link) {
                                if (link.indexOf("https://") === 0)
                                    Qt.openUrlExternally(link)
                                return
                            }
                            chk3Label.checked = !chk3Label.checked
                        }
                    }
                }
            }
        }
        }

        // Footer strip (px-6 py-4, bg-surface-base/40): ghost Cancel + primary
        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 64
            color: Colors.base40
            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                height: 1
                color: Colors.border50
            }
            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 24
                anchors.rightMargin: 24
                Item { Layout.fillWidth: true }
                GhostButton {
                    text: qsTr("Cancel")
                    onClicked: root.reject()
                }
                PrimaryButton {
                    text: qsTr("I Agree & Upload")
                    enabled: root.consentGiven
                    onClicked: {
                        Config.uploadConsentShown = true
                        root.accept()
                    }
                }
            }
        }
    }

    onOpened: {
        App.modalOpened()
        chk1Label.checked = false
        chk2Label.checked = false
        chk3Label.checked = false
        row1.forceActiveFocus()
    }
    onClosed: App.modalClosed()
}
