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
    property int expandedIndex: 0
    property string bugReportFlash: ""
    onOpenChanged: {
        if (open) {
            expandedIndex = 0
            bugReportFlash = ""
        }
    }

    anchors.fill: parent
    visible: open
    z: Theme.zDrawer



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
            q: qsTr("How do I capture LiveMorph in OBS?"),
            a: qsTr("Start the OBS stream from the action bar, then add a Browser Source in OBS pointing at the MJPEG stream URL shown in the status bar. You can also drag the popout window straight into an OBS scene, or capture the Preview window (1280×720, OBS-capturable) — use Clean Mode (Ctrl+Shift+C) to hide its chrome.")
        },
        {
            q: qsTr("The preview is black / I see nothing"),
            a: qsTr("A black Stage usually means the camera feed hasn't reached the engine yet. Check that no other app is using the camera, that the connection pill shows connected, and give the first frame up to 35 seconds to arrive.")
        },
        {
            q: qsTr("Sign-in keeps failing"),
            a: qsTr("Check your spam folder and make sure the email address is correct. Codes expire after a few minutes. If you still can't sign in, request a new code — the previous link keeps working until it expires.")
        },
        {
            q: qsTr("I paid but credits did not arrive"),
            a: qsTr("Reopen the app and wait about 30 seconds — crypto settlements can take a few minutes to confirm on the network. If credits still haven't landed, contact support with your payment reference and we'll resolve it manually.")
        },
        {
            q: qsTr("The stream disconnects mid-session"),
            a: qsTr("You pay for frames, not time. If the connection drops before frames reached your screen, the warmup period is free; if you were mid-swap the meter stops the moment frames stop. Reconnect and the session resumes fresh.")
        },
        {
            q: qsTr("Can I get a refund?"),
            a: qsTr("Credits are non-refundable once delivered, but we review billing issues case by case. If a payment failed but you were charged, or a technical fault burned credits, contact support with your order reference and we'll make it right.")
        },
        {
            q: qsTr("Where is my data stored? Is it private?"),
            a: qsTr("Camera frames are processed in real time to produce the swap and are not stored. Your reference images are kept only as reusable characters you control — delete them from your library anytime.")
        },
        {
            q: qsTr("How do I contact support?"),
            a: qsTr("Use the Contact support link in this drawer's footer. For bugs, tap Report a bug - it copies a diagnostics summary that you can paste straight into the support page.")
        },
        {
            q: qsTr("How do I record my swap?"),
            a: qsTr("Press F12 (or the REC button in the action bar) to start/stop recording the morphed output. Files save to your chosen recordings folder (Settings > Recording) as .mp4, with crash recovery that re-offers orphaned .part files on next launch.")
        },
        {
            q: qsTr("How do I use the virtual camera?"),
            a: qsTr("Settings > Stream > Start Virtual Camera exposes the swapped video as a system camera (v4l2loopback on Linux, OBS Virtual Camera on Windows). Pick it as the camera in Zoom, Meet, Discord, etc.")
        },
        {
            q: qsTr("How do I add my own character?"),
            a: qsTr("In the workshop, drop an image into an empty slot (or use Customize > Save as character). Accept the upload consent once; the image is stored as a reusable character you can rename, delete, or hide.")
        },
        {
            q: qsTr("What are presets and prompts?"),
            a: qsTr("Presets are saved prompt styles. The prompt bar under the stage commits your text prompt to the engine; scene mode adds a background scene on top of the character. The Customize panel has style/scene chips and a reference-image dropzone.")
        },
        {
            q: qsTr("Keyboard shortcuts?"),
            a: qsTr("Space = start/stop swap, F12 = record, Ctrl+P = preview window, Ctrl+Shift+P = popout window, ? = this shortcuts sheet, Esc = close topmost overlay. In the preview window: Ctrl+Shift+C toggles clean mode, F11 fullscreen.")
        },
        {
            q: qsTr("What is the camera PiP?"),
            a: qsTr("The draggable picture-in-picture shows your local camera over the stage. Drag it to any corner to dock. Settings > General > Input camera PiP controls when it shows (always / only while swapping / never). It is forced visible until your first successful swap.")
        },
        {
            q: qsTr("Standard vs HD engine?"),
            a: qsTr("Standard is the default engine. HD (smooth 30fps) is available on paid tiers and can be picked from the stage controls (ENGINE segment). HD burns credits at the HD multiplier shown in the rate pill.")
        },
        {
            q: qsTr("Why did my session stop or cool down?"),
            a: qsTr("Sessions stop when credits run out, the connection fails, or no video frame arrives within 35s. After a failed swap there is a short cooldown (shown on the button) before you can start again.")
        },
        {
            q: qsTr("Where are my downloads and recordings?"),
            a: qsTr("The Downloads icon in the top bar lists tutorial videos and downloads from the platform. Recordings live in your recordings folder (Settings > Recording) and appear in the notification center when saved.")
        },
        {
            q: qsTr("How do I change language or appearance?"),
            a: qsTr("Settings > General > Language switches the interface language (translated live, cached locally). Compact chrome collapses the bars on small windows automatically.")
        },
        {
            q: qsTr("How do I update or check the version?"),
            a: qsTr("Settings > About shows the current version and has a Check for updates button. The app also notifies you when a new version is available.")
        }
    ]

    // Scrim — Electron bg-black/60
    Rectangle {
        anchors.fill: parent
        color: Colors.overlayScrim
        opacity: root.open ? 1 : 0
        MouseArea {
            anchors.fill: parent
            onClicked: root.open = false
        }
    }

    // Drawer panel (Electron w-[480px])
    Rectangle {
        id: panel
        width: Math.min(Theme.helpDrawerWidth, root.width * 0.92)
        height: parent.height
        x: open ? root.width - width : root.width
        y: 0
        color: Colors.surfaceOverlay


        Honeycomb {
            anchors.fill: parent
            cellSize: Theme.honeycombCell
            lineColor: Colors.honeycombLineFaint
            opacity: 0.4
        }

        // Panel hairline — solid white rule with hex ticks at the ends
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            height: 1
            z: Theme.zLocal1
            color: Colors.white35
        }
        Hexagon {
            size: 8
            lineWidth: 1.5
            lineColor: Colors.accent
            anchors.left: parent.left
            anchors.leftMargin: 12
            anchors.top: parent.top
            anchors.topMargin: -3
            z: Theme.zLocal1
        }
        Hexagon {
            size: 8
            lineWidth: 1.5
            lineColor: Colors.accent
            anchors.right: parent.right
            anchors.rightMargin: 12
            anchors.top: parent.top
            anchors.topMargin: -3
            z: Theme.zLocal1
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
                height: Theme.drawerHeaderHeight
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
                    spacing: 10
                    HexBadge {
                        size: 30
                        iconName: "help-circle"
                        iconSize: 15
                        lineWidth: 1
                        lineColor: Colors.accent30
                        fillColor: Colors.accent12
                        iconColor: Colors.accentHover
                    }
                    Text {
                        text: qsTr("Help")
                        color: Colors.textPrimary
                        font.family: Theme.fontHeading.family
                        font.pixelSize: Theme.fontHeading.pixelSize
                        font.weight: Font.Bold
                        Layout.fillWidth: true
                    }
                    Rectangle {
                        width: 28; height: 28
                        radius: Theme.radiusFull
                        color: hdXMa.containsMouse ? Colors.overlay50 : Colors.transparent
                        Icon {
                            anchors.centerIn: parent
                            name: "x"
                            size: 14
                            emphasis: true
                            color: hdXMa.containsMouse ? Colors.textPrimary : Colors.textMuted
                        }
                        MouseArea {
                            id: hdXMa
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: root.open = false
                        }
                    }
                }
            }

            // FAQ accordion
            Flickable {
                Layout.fillWidth: true
                Layout.fillHeight: true
                contentHeight: faqCol.implicitHeight + 40
                clip: true
                boundsBehavior: Flickable.StopAtBounds
                ScrollBar.vertical: StyledScrollBar { thin: true }

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
                            readonly property bool expanded: root.expandedIndex === faqItem.index
                            width: faqCol.width
                            spacing: 0

                            // Question card — height follows the wrapped label
                            // (a fixed 44px clipped two-line questions)
                            Rectangle {
                                width: parent.width - 24
                                x: 12
                                implicitHeight: qRow.implicitHeight + 20
                                radius: Theme.radiusMd
                                color: faqItem.expanded ? Colors.accent06
                                     : qMa.containsMouse ? Colors.surfaceHover
                                     : Colors.surfaceRaised
                                border.width: 1
                                border.color: faqItem.expanded ? Colors.accent30
                                             : qMa.containsMouse ? Colors.surfaceBorderStrong
                                             : Colors.surfaceBorderSubtle
                                RowLayout {
                                    id: qRow
                                    anchors.fill: parent
                                    anchors.leftMargin: 12
                                    anchors.rightMargin: 10
                                    spacing: 8
                                    Icon {
                                        name: "message-circle"
                                        size: 13
                                        color: faqItem.expanded ? Colors.accentHover : Colors.textMuted
                                    }
                                    Text {
                                        text: faqItem.item.q
                                        color: faqItem.expanded ? Colors.textPrimary : Colors.textSecondary
                                        font.pixelSize: 12
                                        font.weight: faqItem.expanded ? Font.Bold : Font.Normal
                                        Layout.fillWidth: true
                                        wrapMode: Text.WordWrap
                                    }
                                    // Expand indicator inside a hex outline
                                    // (plus when collapsed, chevron when open)
                                    Item {
                                        width: 20; height: 20
                                        Hexagon {
                                            anchors.centerIn: parent
                                            size: 20
                                            lineWidth: faqItem.expanded ? 1 : 0
                                            lineColor: Colors.accent30
                                            fillColor: faqItem.expanded ? Colors.accent12 : Colors.transparent
                                        }
                                        Icon {
                                            anchors.centerIn: parent
                                            name: faqItem.expanded ? "chevron-down" : "plus"
                                            size: 11
                                            color: faqItem.expanded ? Colors.accentHover : Colors.textMuted
                                            rotation: faqItem.expanded ? 180 : 0
                                        }
                                    }
                                }
                                MouseArea {
                                    id: qMa
                                    anchors.fill: parent
                                    hoverEnabled: true
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: root.expandedIndex = faqItem.expanded ? -1 : faqItem.index
                                }
                            }

                            Item { width: 1; height: faqItem.expanded ? 6 : 0 }

                            // Answer (inset panel under the expanded question)
                            Rectangle {
                                visible: faqItem.expanded
                                width: parent.width - 24
                                x: 12
                                implicitHeight: ansTxt.implicitHeight + 20
                                radius: Theme.radiusMd
                                color: Colors.surfaceBase
                                border.color: Colors.surfaceBorderSubtle
                                border.width: 1
                                Text {
                                    id: ansTxt
                                    anchors.left: parent.left
                                    anchors.right: parent.right
                                    anchors.top: parent.top
                                    anchors.margins: 10
                                    text: faqItem.item.a
                                    color: Colors.textMuted
                                    font.pixelSize: 11
                                    wrapMode: Text.WordWrap
                                    lineHeight: 1.5
                                }
                            }

                            Item { width: 1; height: 8 }
                        }
                    }
                }
            }

            // Footer: four action chips (support / bug / report content / AUP)
            Rectangle {
                Layout.fillWidth: true
                implicitHeight: footFlow.implicitHeight + 24
                color: Colors.surfaceRaised
                Rectangle {
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    height: 1
                    color: Colors.surfaceBorder
                }
                Flow {
                    id: footFlow
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.top: parent.top
                    anchors.margins: 12
                    spacing: 8

                    Repeater {
                        model: [
                            { label: qsTr("Contact support"), icon: "mail", accent: true,
                              tip: Constants.urlSupport, act: function() { Backend.openExternal(Constants.urlSupport) } },
                            { label: root.bugReportFlash.length ? qsTr("Copied!") : qsTr("Report a bug"), icon: root.bugReportFlash.length ? "check" : "copy", accent: false, flash: true,
                              act: function() {
                                  Backend.copyToClipboard(
                                      qsTr("LiveMorph v%1 · %2 · device %3")
                                          .arg(App.appVersion || Backend.appVersion)
                                          .arg(Qt.platform.os)
                                          .arg(Backend.deviceId))
                                  root.bugReportFlash = qsTr("Copied!")
                                  flashTimer.restart()
                              } },
                            { label: qsTr("Report content"), icon: "shield-alert", accent: false, danger: true,
                              act: function() { Backend.openExternal(Constants.urlReport) } },
                            { label: qsTr("Read AUP"), icon: "file-text", accent: false,
                              act: function() { Backend.openExternal(Constants.urlAup) } }
                        ]
                        delegate: Rectangle {
                            required property var modelData
                            height: 30
                            width: chipRow.implicitWidth + 14
                            radius: Theme.radiusFull
                            color: chipMa.containsMouse
                                   ? (modelData.danger ? Colors.statusError10
                                      : modelData.accent ? Colors.accent12
                                      : Colors.overlay50)
                                   : Colors.surfaceElevated
                            border.width: 1
                            border.color: modelData.flash && root.bugReportFlash.length ? Colors.statusSuccess30
                                         : chipMa.containsMouse
                                           ? (modelData.danger ? Colors.statusError40
                                              : modelData.accent ? Colors.accent30
                                              : Colors.surfaceBorderStrong)
                                           : Colors.surfaceBorderSubtle
                            Row {
                                id: chipRow
                                anchors.centerIn: parent
                                spacing: 6
                                Icon {
                                    name: modelData.icon
                                    size: 12
                                    color: modelData.flash && root.bugReportFlash.length ? Colors.statusSuccess
                                         : modelData.danger ? (chipMa.containsMouse ? Colors.statusError : Colors.statusError80)
                                         : modelData.accent ? Colors.accentHover
                                         : chipMa.containsMouse ? Colors.textPrimary : Colors.textMuted
                                    anchors.verticalCenter: parent.verticalCenter
                                }
                                Text {
                                    text: modelData.label
                                    color: modelData.flash && root.bugReportFlash.length ? Colors.statusSuccess
                                         : modelData.danger ? Colors.statusError
                                         : modelData.accent ? Colors.accentHover
                                         : chipMa.containsMouse ? Colors.textPrimary : Colors.textSecondary
                                    font.pixelSize: 10
                                    font.weight: Font.Bold
                                    anchors.verticalCenter: parent.verticalCenter
                                }
                            }
                            MouseArea {
                                id: chipMa
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor
                                onClicked: modelData.act()
                            }
                        }
                    }
                }
            }
        }
    }

    Timer {
        id: flashTimer
        interval: 4000
        onTriggered: root.bugReportFlash = ""
    }
}
