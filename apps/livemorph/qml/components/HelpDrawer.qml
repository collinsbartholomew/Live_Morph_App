import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import LiveMorph

/**
 * Help drawer (Electron xo, ground truth):
 *   w-[480px] right panel-drawer · heading "Help"
 *   body: FAQ accordion, 11 items in fixed order
 *   footer: Contact support · Report a bug (clipboard) · Report content · Read AUP
 */
Item {
    id: root

    property bool open: false
    property bool closing: false
    property int expandedIndex: -1
    property string bugReportFlash: ""

    anchors.fill: parent
    visible: open || closing
    z: 200

    onOpenChanged: {
        if (open) {
            closing = false
            panel.x = root.width - panel.width
        } else if (visible) {
            closing = true
            panel.x = root.width
            closeTimer.start()
        }
    }

    Timer {
        id: closeTimer
        interval: Theme.motionNormal
        onTriggered: root.closing = false
    }

    // FAQ content (Electron order: swapMode, swapEngine, credits, obs,
    // blackPreview, signInFails, noCredits, midSessionDisconnect, refund,
    // dataPrivacy, contactSupport)
    readonly property var faq: [
        {
            q: qsTr("How does Swap Mode work?"),
            a: qsTr("Your webcam feed is streamed to our AI model, which transforms you into a chosen character in real time. The swapped video plays on the Stage, and you can send it to OBS, a virtual camera, or popout windows.")
        },
        {
            q: qsTr("Can I change the swap engine or remove the watermark?"),
            a: qsTr("Standard is watermark-free at %1 credits/sec. HD adds smooth 30fps at the same %1 credits/sec. Switch engines between swaps from the stage controls; you can't remove a watermark that isn't there.").arg(Session.creditsPerSecond.toFixed(0))
        },
        {
            q: qsTr("What are credits and how do they work?"),
            a: qsTr("Credits are the currency for live swaps. %1 credits = 1 second of swapped video at Standard rate. The meter only runs while swapped frames are actually on screen — warmup and idle cost nothing.").arg(Session.creditsPerSecond.toFixed(0))
        },
        {
            q: qsTr("How do I stream to OBS?"),
            a: qsTr("Start the OBS stream from the action bar, then add a Browser Source in OBS pointing at the URL shown in the status bar. You can also drag the popout window straight into an OBS scene, or use a virtual camera for Zoom and Discord.")
        },
        {
            q: qsTr("Why is my preview black?"),
            a: qsTr("A black Stage usually means the camera feed hasn't reached the engine yet. Check that no other app is using the camera, that the connection pill shows connected, and give the first frame up to 35 seconds to arrive.")
        },
        {
            q: qsTr("Sign-in codes aren't arriving — what do I do?"),
            a: qsTr("Check your spam folder and make sure the email address is correct. Codes expire after a few minutes. If you still can't sign in, request a new code — the previous link keeps working until it expires.")
        },
        {
            q: qsTr("What happens when I run out of credits?"),
            a: qsTr("The session ends automatically when your balance can't cover another second. You'll see the meter turn amber as you approach zero. Top up from the top bar balance badge and begin swap again.")
        },
        {
            q: qsTr("My session disconnected mid-swap — was I charged?"),
            a: qsTr("You pay for frames, not time. If the connection drops before frames reached your screen, the warmup period is free; if you were mid-swap the meter stops the moment frames stop. Reconnect and the session resumes fresh.")
        },
        {
            q: qsTr("Can I get a refund?"),
            a: qsTr("Unused credits stay on your account forever. If a payment failed but you were charged, or a technical fault burned credits, contact support with your order reference and we'll make it right.")
        },
        {
            q: qsTr("What do you do with my data?"),
            a: qsTr("Camera frames are processed in real time to produce the swap and are not stored. Your reference images are kept only as reusable characters you control — delete them from your library anytime.")
        },
        {
            q: qsTr("How do I contact support?"),
            a: qsTr("Use the Contact support link in this drawer's footer. For bugs, tap Report a bug — it copies a diagnostics summary that you can paste straight into the support page.")
        }
    ]

    // Scrim — Electron bg-black/60
    Rectangle {
        anchors.fill: parent
        color: Colors.overlayScrim
        opacity: root.open ? 1 : 0
        Behavior on opacity { NumberAnimation { duration: 180; easing.type: Easing.OutCubic } }
        MouseArea {
            anchors.fill: parent
            onClicked: root.open = false
        }
    }

    // Drawer panel (Electron w-[480px])
    Rectangle {
        id: panel
        width: Math.min(480, root.width * 0.92)
        height: parent.height
        x: root.width
        y: 0
        color: Colors.surfaceOverlay

        Behavior on x { NumberAnimation { duration: 250; easing.type: Easing.OutCubic } }

        // Panel hairline — accent gradient at top
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 1
            z: 1
            gradient: Gradient {
                GradientStop { position: 0.0; color: "transparent" }
                GradientStop { position: 0.5; color: Colors.accent60 }
                GradientStop { position: 1.0; color: "transparent" }
            }
        }

        // Left-casting shadow (panel-drawer)
        Rectangle {
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            anchors.right: parent.left
            width: 8
            color: Colors.shadow
            opacity: 0.35
        }
        Rectangle {
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            anchors.right: parent.left
            anchors.rightMargin: 8
            width: 24
            color: Colors.shadowStrong
            opacity: 0.25
        }

        // Left edge border
        Rectangle {
            anchors.left: parent.left
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            width: 1
            color: Colors.surfaceBorder
        }

        ColumnLayout {
            anchors.fill: parent
            spacing: 0

            // Header (Electron: "Help" + X)
            Rectangle {
                Layout.fillWidth: true
                height: 52
                color: Colors.surfaceRaised
                Rectangle {
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.bottom: parent.bottom
                    height: 1
                    color: Colors.surfaceBorder
                }
                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 16
                    anchors.rightMargin: 8
                    Text {
                        text: qsTr("Help")
                        color: Colors.textPrimary
                        font.pixelSize: 16
                        font.weight: Font.DemiBold
                        Layout.fillWidth: true
                    }
                    IconButton { name: "x"; onClicked: root.open = false }
                }
            }

            // FAQ accordion
            Flickable {
                Layout.fillWidth: true
                Layout.fillHeight: true
                contentHeight: faqCol.implicitHeight + 40
                clip: true
                boundsBehavior: Flickable.StopAtBounds

                Column {
                    id: faqCol
                    width: parent.width
                    spacing: 0

                    Repeater {
                        model: root.faq.length
                        delegate: Column {
                            id: faqItem
                            required property int index
                            readonly property var item: root.faq[index]
                            width: faqCol.width

                            // Question row
                            Rectangle {
                                width: parent.width
                                height: 44
                                color: qMa.containsMouse ? Colors.surfaceOverlay : Colors.transparent
                                RowLayout {
                                    anchors.fill: parent
                                    anchors.leftMargin: 16
                                    anchors.rightMargin: 16
                                    spacing: 8
                                    Text {
                                        text: faqItem.item.q
                                        color: Colors.textPrimary
                                        font.pixelSize: 12
                                        font.weight: Font.Medium
                                        Layout.fillWidth: true
                                        wrapMode: Text.WordWrap
                                    }
                                    Icon {
                                        name: "chevron-down"
                                        size: 14
                                        color: Colors.textMuted
                                        rotation: root.expandedIndex === faqItem.index ? 180 : 0
                                        Behavior on rotation { NumberAnimation { duration: 200; easing.type: Easing.OutCubic } }
                                    }
                                }
                                MouseArea {
                                    id: qMa
                                    anchors.fill: parent
                                    hoverEnabled: true
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: root.expandedIndex = (root.expandedIndex === faqItem.index) ? -1 : faqItem.index
                                }
                            }

                            // Answer (tab-fade-in on expand)
                            Text {
                                visible: root.expandedIndex === faqItem.index
                                width: parent.width - 32
                                x: 16
                                text: faqItem.item.a
                                color: Colors.textMuted
                                font.pixelSize: 11
                                wrapMode: Text.WordWrap
                                lineHeight: 1.5
                                bottomPadding: 16
                                opacity: visible ? 1 : 0
                                Behavior on opacity { NumberAnimation { duration: 200; easing.type: Easing.OutCubic } }
                            }

                            Rectangle {
                                width: parent.width
                                height: 1
                                color: Colors.surfaceBorderSubtle
                                opacity: 0.6
                            }
                        }
                    }
                }
            }

            // Footer quartet (Electron: Contact support · Report a bug · Report content · Read AUP)
            Rectangle {
                Layout.fillWidth: true
                height: 56
                color: Colors.surfaceRaised
                Rectangle {
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    height: 1
                    color: Colors.surfaceBorder
                }
                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 16
                    anchors.rightMargin: 16
                    spacing: 12

                    Text {
                        text: qsTr("Contact support")
                        color: Colors.accent
                        font.pixelSize: 11
                        font.weight: Font.Medium
                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: Backend.openExternal(Constants.urlSupport)
                        }
                    }
                    Text {
                        text: root.bugReportFlash.length ? root.bugReportFlash : qsTr("Report a bug")
                        color: root.bugReportFlash.length ? Colors.statusSuccess : Colors.textSecondary
                        font.pixelSize: 11
                        font.weight: Font.Medium
                        MouseArea {
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: {
                                Backend.copyToClipboard(
                                    qsTr("LiveMorph v%1 · %2 · device %3")
                                        .arg(App.appVersion || Backend.appVersion)
                                        .arg(Qt.platform.os)
                                        .arg(Backend.deviceId))
                                root.bugReportFlash = qsTr("Copied. Paste it on the support page")
                                flashTimer.restart()
                            }
                        }
                    }
                    Text {
                        text: qsTr("Report content")
                        color: rcMa.containsMouse ? Colors.statusError : Colors.textSecondary
                        font.pixelSize: 11
                        font.weight: Font.Medium
                        Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
                        MouseArea {
                            id: rcMa
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: Backend.openExternal("https://livemorph.com/report")
                        }
                    }
                    Item { Layout.fillWidth: true }
                    Text {
                        text: qsTr("Read AUP")
                        color: aupMa.containsMouse ? Colors.accentHover : Colors.textSecondary
                        font.pixelSize: 11
                        font.weight: Font.Medium
                        Behavior on color { ColorAnimation { duration: Theme.motionFast; easing.type: Easing.OutCubic } }
                        MouseArea {
                            id: aupMa
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: Backend.openExternal(Constants.urlAup)
                        }
                    }
                }
            }
        }
    }

    Timer {
        id: flashTimer
        interval: 2500
        onTriggered: root.bugReportFlash = ""
    }
}
