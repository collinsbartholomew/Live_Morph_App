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
    anchors.centerIn: parent
    width: Math.min(520, parent ? parent.width - 48 : 520)
    height: Math.min(parent ? parent.height - 64 : 520, contentCol.implicitHeight + 140)
    closePolicy: Popup.NoAutoClose
    padding: 0

    property bool consentGiven: chk1Label.checked && chk2Label.checked && chk3Label.checked

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
        Rectangle { anchors.fill: parent; anchors.margins: -2; radius: parent.radius + 2; color: "#00000059"; z: -1 }
        Rectangle { anchors.fill: parent; anchors.margins: -12; anchors.topMargin: -4; radius: parent.radius + 12; color: "#0000008c"; opacity: 0.9; z: -1 }
    }

    contentItem: ColumnLayout {
        id: contentCol
        spacing: 0

        // Header: 40px accent icon circle + title + intro (px-6 pt-6 pb-4)
        ColumnLayout {
            Layout.fillWidth: true
            Layout.margins: 24
            Layout.bottomMargin: 16
            spacing: 12

            Rectangle {
                width: 40; height: 40; radius: 20
                color: Colors.accent10
                border.color: Colors.accent20
                border.width: 1
                Icon {
                    anchors.centerIn: parent
                    name: "upload"
                    size: Theme.iconMd
                    color: Colors.accent
                }
            }

            Text {
                text: qsTr("Before you upload, read this")
                color: Colors.textPrimary
                font.pixelSize: 16
                font.weight: Font.DemiBold
            }

            Text {
                text: qsTr("LiveMorph is powered by Decart Lucy 2. Decart's Acceptable Use Policy and ours both require you to attest to a few things on every reference image. Take a moment to check each one.")
                color: Colors.textMuted
                font.pixelSize: 12
                wrapMode: Text.WordWrap
                Layout.fillWidth: true
                lineHeight: 1.4
            }
        }

        Rectangle { Layout.fillWidth: true; height: 1; color: Colors.surfaceBorderSubtle }

        // Checks (px-6 py-5, gap-2) — custom Electron-style checkboxes
        ColumnLayout {
            Layout.fillWidth: true
            Layout.margins: 24
            spacing: 8

            // Check 1: likeness consent
            RowLayout {
                Layout.fillWidth: true
                spacing: 12
                Rectangle {
                    width: 16; height: 16
                    radius: 3
                    color: chk1Label.checked ? Colors.accent : Colors.surfaceBase
                    border.width: 1
                    border.color: chk1Label.checked ? Colors.accent
                        : (row1Ma.containsMouse ? Colors.textMuted : Colors.surfaceBorderStrong)
                    anchors.verticalCenter: parent.verticalCenter
                    Icon {
                        visible: chk1Label.checked
                        anchors.centerIn: parent
                        name: "check"
                        size: 12
                        color: Colors.white
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
                    lineHeight: 1.45
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
                Layout.fillWidth: true
                spacing: 12
                Rectangle {
                    width: 16; height: 16
                    radius: 3
                    color: chk2Label.checked ? Colors.accent : Colors.surfaceBase
                    border.width: 1
                    border.color: chk2Label.checked ? Colors.accent
                        : (row2Ma.containsMouse ? Colors.textMuted : Colors.surfaceBorderStrong)
                    anchors.verticalCenter: parent.verticalCenter
                    Icon {
                        visible: chk2Label.checked
                        anchors.centerIn: parent
                        name: "check"
                        size: 12
                        color: Colors.white
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
                    lineHeight: 1.45
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
                Layout.fillWidth: true
                spacing: 12
                Rectangle {
                    width: 16; height: 16
                    radius: 3
                    color: chk3Label.checked ? Colors.accent : Colors.surfaceBase
                    border.width: 1
                    border.color: chk3Label.checked ? Colors.accent
                        : (row3Ma.containsMouse ? Colors.textMuted : Colors.surfaceBorderStrong)
                    anchors.verticalCenter: parent.verticalCenter
                    Icon {
                        visible: chk3Label.checked
                        anchors.centerIn: parent
                        name: "check"
                        size: 12
                        color: Colors.white
                    }
                }
                Text {
                    id: chk3Label
                    property bool checked: false
                    Layout.fillWidth: true
                    text: qsTr("I have read and agree to both: ") +
                          "<a href='" + Constants.urlAup + "'>LiveMorph AUP</a> · " +
                          "<a href='https://docs.platform.decart.ai/resources/aup'>Decart AUP</a>"
                    textFormat: Text.RichText
                    color: row3Ma.containsMouse ? Colors.textPrimary : Colors.textSecondary
                    font.pixelSize: 12
                    wrapMode: Text.WordWrap
                    onLinkActivated: (link) => Qt.openUrlExternally(link)
                    MouseArea {
                        id: row3Ma
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: chk3Label.checked = !chk3Label.checked
                    }
                }
            }
        }

        Item { Layout.fillHeight: true }

        // Footer strip (px-6 py-4, bg-surface-base/40): ghost Cancel + primary
        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: 64
            color: "#08080c66"
            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                height: 1
                color: "#26263099"
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
        chk1Label.checked = false
        chk2Label.checked = false
        chk3Label.checked = false
    }
}
