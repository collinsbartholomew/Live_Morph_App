import QtQuick
import QtQuick.Layouts
import LiveMorph

/**
 * CharacterCard — Electron roster card:
 *   4:5 portrait, full-bleed image (object-cover), idle opacity .8 → 1 hover,
 *   scale 1.02 hover (500ms), bottom gradient name bar, 4px kind dot,
 *   selected: accent ring + 16px check badge (check-pop), click again deselects.
 */
Item {
    id: root

    property string characterId: ""
    property string name: ""
    property string thumbnail: ""
    property string description: ""
    property bool isStarter: false
    property bool isPremium: false
    signal clickedMenu(string id, string name, bool starter)
    signal deleteRequested(string id, string name)

    readonly property bool isSelected: Session.activeCharacterId === characterId

    Rectangle {
        id: card
        anchors.fill: parent
        radius: Theme.radiusMd
        color: Colors.surfaceRaised
        border.color: root.isSelected ? Colors.accent
                    : cardMa.containsMouse ? Colors.surfaceBorderStrong
                    : Colors.surfaceBorder
        border.width: root.isSelected ? 2 : 1

        clip: true

        // Card click target — declared FIRST (bottom of paint order) so the
        // hover actions and inline rename controls above keep their clicks.
        MouseArea {
            id: cardMa
            anchors.fill: parent
            acceptedButtons: Qt.LeftButton | Qt.RightButton
            cursorShape: Qt.PointingHandCursor
            hoverEnabled: true
            property bool heldMenu: false
            onClicked: function(mouse) {
                if (heldMenu) { heldMenu = false; return }
                if (mouse.button === Qt.RightButton) {
                    root.clickedMenu(root.characterId, root.name, root.isStarter)
                } else if (root.isSelected) {
                    // Electron: clicking the SELECTED card deselects
                    Session.setActiveCharacter("", "", "", "")
                } else {
                    Session.setActiveCharacter(root.characterId, root.name,
                                               root.thumbnail || "", root.description || "")
                }
            }
            onPressAndHold: { cardMa.heldMenu = true; root.clickedMenu(root.characterId, root.name, root.isStarter) }
            onReleased: heldMenu = false
            onCanceled: heldMenu = false
        }

        // Selected: crisp inner white hairline (card is clipped, stays inside)
        Rectangle {
            anchors.fill: parent
            anchors.margins: 3
            radius: Theme.radiusXs
            color: Colors.transparent
            border.width: 1
            border.color: Colors.accent40
            visible: root.isSelected
            z: Theme.zLocal5
        }

        // Hover ring: whole card, ring-white/10 inset (Electron)
        Rectangle {
            anchors.fill: parent
            radius: Theme.radiusMd
            color: Colors.transparent
            border.width: 1
            border.color: cardMa.containsMouse && !root.isSelected ? Colors.white10 : Colors.transparent
            z: Theme.zLocal4
        }

        // Hex-tech corner frame on hover / selection (signature motif)
        CornerTicks {
            anchors.fill: parent
            visible: cardMa.containsMouse
            inset: 5
            tickSize: 7
            thickness: 1
            color: root.isSelected ? Colors.accent70 : Colors.accent30
            z: Theme.zLocal4
        }

        Image {
            id: thumb
            anchors.fill: parent
            // Gated on the DELEGATE's visibility — hidden delegates (the
            // two-grid starters/user split) must not decode at all.
            // sourceSize caps decode to ~2x the 100x125 cell.
            source: root.visible && root.thumbnail && root.thumbnail.length ? root.thumbnail : ""
            sourceSize.width: 200
            sourceSize.height: 250
            fillMode: Image.PreserveAspectCrop
            asynchronous: true
            visible: status === Image.Ready
            opacity: cardMa.containsMouse || root.isSelected ? 1.0 : 0.8
        }
        // Image-less cards: hexagonal upload-target placeholder
        Item {
            anchors.centerIn: parent
            width: 74; height: 74
            visible: !thumb.visible
            Hexagon {
                anchors.centerIn: parent
                size: 72
                lineWidth: 1.5
                lineColor: cardMa.containsMouse ? Colors.accent40 : Colors.surfaceBorderSubtle
            }
            Icon {
                anchors.centerIn: parent
                name: "image"
                size: 22
                color: cardMa.containsMouse ? Colors.accent : Colors.textMuted40
            }
        }

        // Bottom scrim: two solid alpha steps (no gradient) so the name
        // stays readable over any thumbnail
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.bottom: parent.bottom
            height: 40
            color: Colors.black70
            opacity: 0.55
        }
        Rectangle {
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.bottom: parent.bottom
            height: 24
            color: Colors.black70
            // (ring moved to card level — Electron wraps the WHOLE card)
            RowLayout {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.bottom: parent.bottom
                anchors.bottomMargin: 5
                anchors.leftMargin: 6
                anchors.rightMargin: 6
                spacing: 4

                Text {
                    id: nameLbl
                    text: renameField.visible ? "" : (root.name || "")
                    color: cardMa.containsMouse ? Colors.white : Colors.white90
                    font.pixelSize: 10
                    font.weight: Font.Bold
                    font.letterSpacing: -0.25
                    elide: Text.ElideRight
                    Layout.fillWidth: true
                    Layout.alignment: Qt.AlignVCenter
                }
                // Inline rename (Electron: pencil in the name bar)
                Rectangle {
                    id: pencilBtn
                    visible: !root.isStarter && cardMa.containsMouse && !renameField.visible
                    width: 16; height: 16
                    radius: Theme.radiusXs
                    color: pencilMa.containsMouse ? Colors.accent15 : Colors.transparent
                    Layout.alignment: Qt.AlignVCenter
                    Icon {
                        anchors.centerIn: parent
                        name: "pencil"
                        size: 9
                        color: pencilMa.containsMouse ? Colors.accent : Colors.white40
                    }
                    MouseArea {
                        id: pencilMa
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            renameField.text = root.name
                            renameField.visible = true
                            renameField.forceActiveFocus()
                        }
                    }
                }
                // Built-in lock (starters)
                Icon {
                    id: lockIco
                    visible: root.isStarter
                    name: "lock"
                    size: 9
                    color: Colors.white35
                    Layout.alignment: Qt.AlignVCenter
                    Tooltip {
                        anchors.bottom: parent.top
                        anchors.bottomMargin: 6
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: qsTr("Built in, so it cannot be renamed or removed")
                        shown: lockHover.containsMouse
                    }
                    MouseArea {
                        id: lockHover
                        anchors.fill: parent
                        anchors.margins: -4
                        hoverEnabled: true
                        acceptedButtons: Qt.NoButton
                    }
                }
                // Inline rename input (Electron: bg-black/85 border-b accent/60)
                TextField {
                    id: renameField
                    visible: false
                    width: parent.width - 4
                    height: 20
                    maximumLength: 40 // matches PresetGrid rename + C++ cap
                    background: Rectangle { color: Colors.black70 }
                    color: Colors.white
                    font.pixelSize: 10
                    font.family: Theme.fontMono.family
                    padding: 2
                    function commit() {
                        const t = text.trim()
                        if (t.length > 0 && t !== root.name)
                            Catalog.renameCharacter(root.characterId, t)
                        else
                            text = root.name // revert accidental blur-commit
                        visible = false
                    }
                    onAccepted: commit()
                    onActiveFocusChanged: if (!activeFocus && visible) commit()
                }
            }
        }

        // Hover actions (top-right): trash (user chars only) + more (context
        // menu for every card — discoverable alternative to right-click).
        // Glass discs over the image; shift left of the check badge when selected.
        Row {
            anchors.top: parent.top
            anchors.right: parent.right
            anchors.topMargin: 6
            anchors.rightMargin: root.isSelected ? 30 : 6
            spacing: 6
            z: Theme.zLocal6
            visible: cardMa.containsMouse

            Rectangle {
                visible: !root.isStarter
                width: 24; height: 24
                radius: Theme.radiusSm
                color: trashHover.containsMouse ? Colors.statusError : Colors.base70
                border.width: 1
                border.color: trashHover.containsMouse ? Colors.statusError60 : Colors.white10
                Icon {
                    anchors.centerIn: parent
                    name: "trash"
                    size: 12
                    color: trashHover.containsMouse ? Colors.white : Colors.white65
                }
                MouseArea {
                    id: trashHover
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: root.deleteRequested(root.characterId, root.name)
                }
            }

            Rectangle {
                width: 24; height: 24
                radius: Theme.radiusSm
                color: moreMa.containsMouse ? Colors.overlay60 : Colors.base70
                border.width: 1
                border.color: moreMa.containsMouse ? Colors.surfaceBorderStrong : Colors.white10
                Icon {
                    anchors.centerIn: parent
                    name: "more-horizontal"
                    size: 14
                    color: moreMa.containsMouse ? Colors.white : Colors.white65
                }
                MouseArea {
                    id: moreMa
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: root.clickedMenu(root.characterId, root.name, root.isStarter)
                }
            }
        }

        // Selected: white hexagon check badge
        Item {
            visible: root.isSelected
            anchors.top: parent.top
            anchors.right: parent.right
            anchors.margins: 6
            width: 18; height: 18
            z: Theme.zLocal3
            Hexagon {
                anchors.centerIn: parent
                size: 18
                lineWidth: 1.5
                lineColor: Colors.accent
                fillColor: Colors.accent
            }
            Icon {
                anchors.centerIn: parent
                name: "check"
                size: 10
                emphasis: true
                color: Colors.textOnAccent
            }
        }

        // Kind glyph: hex for starters, muted for user characters
        Hexagon {
            anchors.left: parent.left
            anchors.bottom: parent.bottom
            anchors.margins: 6
            size: 8
            lineWidth: 0
            fillColor: root.isStarter ? Colors.accent : Colors.textMuted
            Tooltip {
                anchors.bottom: parent.top
                anchors.bottomMargin: 6
                text: root.isStarter ? qsTr("LiveMorph character") : qsTr("Your character")
                shown: kindDotMa.containsMouse
            }
            MouseArea {
                id: kindDotMa
                anchors.fill: parent
                anchors.margins: -6
                hoverEnabled: true
                acceptedButtons: Qt.NoButton
            }
        }

        // Premium badge (top-left) — monochrome: solid white pill, black glyph
        // (tierPro tokens; amber is reserved for functional warnings only)
        Rectangle {
            visible: root.isPremium
            anchors.top: parent.top
            anchors.left: parent.left
            anchors.margins: 6
            implicitWidth: premRow.implicitWidth + 10
            implicitHeight: 18
            radius: Theme.radiusFull
            color: Colors.tierProBg
            border.color: Colors.tierProBorder
            border.width: 1
            z: Theme.zLocal6
            Row {
                id: premRow
                anchors.centerIn: parent
                spacing: 3
                Icon {
                    name: "star"
                    size: 9
                    color: Colors.tierProText
                    anchors.verticalCenter: parent.verticalCenter
                }
                Text {
                    text: qsTr("PRO")
                    color: Colors.tierProText
                    font.pixelSize: 8
                    font.family: Theme.fontMono.family
                    font.weight: Font.Bold
                    anchors.verticalCenter: parent.verticalCenter
                }
            }
        }

    }
}
