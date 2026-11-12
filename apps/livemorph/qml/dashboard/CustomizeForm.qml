import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import QtQuick.Dialogs
import LiveMorph

/**
 * CustomizeForm — Electron "Customize" disclosure card at the bottom of the
 * workshop roster:
 *   header: icon + "Customize" + mode chip (DEFAULT / REPLACE SCENE/BACKGROUND)
 *   body: reference drop zone → STYLE chips → Replace background →
 *         scene input + 6 chips → "Edit prompt ADVANCED" → SAVE AS CHARACTER
 * Collapsed by default (Electron).
 */
Item {
    id: root

    property bool expanded: false
    property bool advExpanded: false
    property bool dragOver: false
    property string refImagePath: ""
    readonly property int margin: Theme.padSection

    implicitHeight: col.implicitHeight

    function localPath(url) {
        var s = url.toString()
        if (s.startsWith("file://"))
            return decodeURIComponent(s.substring(7))
        return s
    }

    function defaultPrompt() {
        if (Session.sceneEnabled)
            return "Transform into a vivid cinematic character with rich detail and atmospheric lighting."
        return "Transform into the person shown, preserving their identity and facial features."
    }

    // Style/scene chip labels are translatable; the prompt strings stay raw
    // (they are AI input, never translated).
    function styleName(key) {
        switch (key) {
        case "default": return qsTr("Default Swap")
        case "anime": return qsTr("Anime")
        case "zombie": return qsTr("Zombie")
        case "cartoon": return qsTr("Cartoon")
        case "cyberpunk": return qsTr("Cyberpunk")
        case "oldage": return qsTr("Old Age")
        case "vampire": return qsTr("Vampire")
        case "animated3d": return qsTr("3D Animated")
        }
        return key
    }
    function sceneName(key) {
        switch (key) {
        case "hospital": return qsTr("Hospital")
        case "barracks": return qsTr("Military barracks")
        case "alley": return qsTr("Cyberpunk alley")
        case "cathedral": return qsTr("Cathedral")
        case "beach": return qsTr("Beach sunset")
        case "rooftop": return qsTr("Tokyo rooftop")
        }
        return key
    }

    property string pendingUpload: ""

    function attachReference(path) {
        // Electron mm: first upload is gated on the consent modal
        // (persisted ack via Config.uploadConsentShown).
        if (!Config.uploadConsentShown) {
            root.pendingUpload = path
            consentDialog.open()
            return
        }
        doAttach(path)
    }

    function doAttach(path) {
        // Electron R1: attach = setCharacterImage ONLY — the current
        // selection (id/name/prompt) is preserved, not clobbered.
        root.refImagePath = path
        Session.setActiveCharacter(
            Session.activeCharacterId,
            Session.activeCharacterName.length ? Session.activeCharacterName : qsTr("Custom"),
            path,
            Session.activePrompt)
    }

    function removeReference() {
        root.refImagePath = ""
        Session.setActiveCharacter(
            Session.activeCharacterId,
            Session.activeCharacterName.length ? Session.activeCharacterName : "",
            "",
            Session.activePrompt)
    }

    // ── Card: inset from the panel borders, flat (no shadow), accent ring
    //    while expanded ──
    Rectangle {
        z: Theme.zUnder
        x: root.margin
        y: col.y
        width: parent.width - root.margin * 2
        height: col.implicitHeight
        radius: Theme.radiusLg
        color: root.expanded ? Colors.accent06 : Colors.surfaceRaised
        border.color: root.expanded ? Colors.accent30
                      : headerMa.containsMouse ? Colors.surfaceBorderStrong
                      : Colors.surfaceBorder
        border.width: 1
    }

    Column {
        id: col
        x: root.margin
        width: parent.width - root.margin * 2
        spacing: 0

        // Header (sits on the card — no own chrome)
        Rectangle {
            width: parent.width
            height: 48
            radius: Theme.radiusLg
            color: Colors.transparent

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 12
                anchors.rightMargin: 12
                spacing: 10

                // Hex icon badge
                HexBadge {
                    size: 30
                    iconName: "sliders-horizontal"
                    iconSize: 15
                    lineWidth: 1
                    lineColor: root.expanded ? Colors.accent30 : Colors.surfaceBorderSubtle
                    fillColor: root.expanded ? Colors.accent12 : Colors.overlay40
                    iconColor: root.expanded ? Colors.accentHover : Colors.textMuted
                }
                Text {
                    text: qsTr("Customize")
                    color: Colors.textPrimary
                    font.family: Theme.fontTitle.family
                    font.pixelSize: Theme.fontTitle.pixelSize
                    font.weight: Font.Bold
                    Layout.alignment: Qt.AlignVCenter
                }
                Rectangle {
                    width: Math.min(160, modeChip.implicitWidth + 14)
                    height: 18
                    radius: Theme.radiusFull
                    // Only the scene mode is accent — DEFAULT is neutral
                    color: Session.sceneEnabled ? Colors.accent10 : Colors.base40
                    border.color: Session.sceneEnabled ? Colors.accent30 : Colors.surfaceBorderSubtle
                    border.width: 1
                    Layout.alignment: Qt.AlignVCenter
                    Text {
                        id: modeChip
                        anchors.centerIn: parent
                        width: parent.width - 12
                        elide: Text.ElideRight
                        horizontalAlignment: Text.AlignHCenter
                        text: Session.sceneEnabled
                              ? qsTr("SCENE / BACKGROUND")
                              : qsTr("DEFAULT")
                        color: Session.sceneEnabled ? Colors.accentHover : Colors.textMuted
                        font.pixelSize: 8
                        font.family: Theme.fontMono.family
                        font.letterSpacing: 1.0
                    }
                }
                Item { Layout.fillWidth: true }
                Item {
                    width: 22; height: 22
                    Layout.alignment: Qt.AlignVCenter
                    Hexagon {
                        anchors.centerIn: parent
                        size: 23
                        lineWidth: 1
                        lineColor: headerMa.containsMouse ? Colors.accent30 : Colors.surfaceBorderSubtle
                        fillColor: headerMa.containsMouse ? Colors.overlay40 : Colors.transparent
                    }
                    Icon {
                        anchors.centerIn: parent
                        name: "chevron-down"
                        size: 12
                        color: headerMa.containsMouse ? Colors.accentHover : Colors.textMuted
                        rotation: root.expanded ? 180 : 0
                    }
                }
            }

            MouseArea {
                id: headerMa
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: root.expanded = !root.expanded
            }
        }

        // Body divider (Electron: border-t under the header)
        Rectangle {
            width: parent.width
            height: 1
            color: Colors.surfaceBorderSubtle
            visible: root.expanded
        }

        // ── Body ───────────────────────────────────────────────────────
        Column {
            id: bodyCol
            x: 20 // px-5 inside the card
            width: parent.width - 40
            visible: root.expanded
            opacity: root.expanded ? 1 : 0
            spacing: 20 // Electron: each section mb-5

            Item { width: 1; height: 20 } // pt-5

            // Section eyebrow
            SectionHeader { text: qsTr("REFERENCE IMAGE"); width: parent.width }
            Item { width: 1; height: 6 }

            // 1) Reference dropzone
            Rectangle {
                id: dropZone
                width: parent.width
                height: root.refImagePath.length ? 68 : 56
                radius: Theme.radiusMd
                color: root.dragOver ? Colors.accent06
                     : root.refImagePath.length ? Colors.overlay40
                     : dropZoneMa.containsMouse ? Colors.raised80
                     : Colors.raised20
                border.color: root.dragOver ? Colors.accent40
                            : dropZoneMa.containsMouse ? Colors.surfaceBorderStrong
                            : Colors.surfaceBorderSubtle
                border.width: 1
                clip: true

                // Faint honeycomb wash in the empty state (signature texture)
                Honeycomb {
                    anchors.fill: parent
                    visible: !root.refImagePath.length
                    cellSize: Theme.honeycombCell
                    lineColor: Colors.honeycombLineFaint
                    opacity: 0.6
                }

                // (Border lives on the Rectangle itself — solid subtle border,
                // accent on drag-over/hover; no dashed canvas overlay.)

                // Empty state
                Row {
                    visible: !root.refImagePath.length
                    anchors.centerIn: parent
                    spacing: 10

                    Item {
                        width: 28; height: 28
                        anchors.verticalCenter: parent.verticalCenter
                        Hexagon {
                            anchors.centerIn: parent
                            size: 30
                            lineWidth: 1
                            lineColor: root.dragOver ? Colors.accent40
                                     : dropZoneMa.containsMouse ? Colors.accent30
                                     : Colors.surfaceBorder
                            fillColor: root.dragOver || dropZoneMa.containsMouse ? Colors.accent12 : Colors.surfaceOverlay
                        }
                        Icon {
                            anchors.centerIn: parent
                            name: "upload"
                            size: 14
                            color: root.dragOver || dropZoneMa.containsMouse ? Colors.accentHover : Colors.textMuted
                        }
                    }
                    Text {
                        anchors.verticalCenter: parent.verticalCenter
                        text: root.dragOver ? qsTr("Drop to attach reference image")
                                            : qsTr("Drag image here, or click to browse")
                        color: root.dragOver || dropZoneMa.containsMouse ? Colors.textSecondary : Colors.textMuted
                        font.pixelSize: 11
                    }
                }

                // Attached state
                Row {
                    visible: root.refImagePath.length > 0
                    anchors.left: parent.left
                    anchors.verticalCenter: parent.verticalCenter
                    anchors.leftMargin: 12
                    spacing: 10

                    Image {
                        width: 48; height: 48
                        clip: true
                        anchors.verticalCenter: parent.verticalCenter
                        source: root.refImagePath
                        fillMode: Image.PreserveAspectCrop
                        asynchronous: true
                        Rectangle {
                            anchors.fill: parent
                            color: Colors.transparent
                            border.color: Colors.surfaceBorder
                            border.width: 1
                            radius: Theme.radiusSm
                        }
                    }
                    Column {
                        anchors.verticalCenter: parent.verticalCenter
                        spacing: 2
                        Text {
                            text: qsTr("Reference image attached")
                            color: Colors.textSecondary
                            font.pixelSize: 11
                            font.weight: Font.Normal
                            elide: Text.ElideRight
                            width: dropZone.width - 48 - 24 - 32 - 12
                        }
                        Text {
                            text: qsTr("USED AS VISUAL ANCHOR")
                            color: Colors.textMuted
                            font.pixelSize: 10
                            font.family: Theme.fontMono.family
                            font.letterSpacing: 1.2
                        }
                    }
                    Rectangle {
                        anchors.verticalCenter: parent.verticalCenter
                        width: 24; height: 24; radius: Theme.radiusSm
                        color: removeRefMa.containsMouse ? Colors.errorFaintBg : Colors.transparent
                        Icon {
                            anchors.centerIn: parent
                            name: "x"
                            size: 12
                            emphasis: true
                            color: removeRefMa.containsMouse ? Colors.statusError : Colors.textMuted
                        }
                        MouseArea {
                            id: removeRefMa
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: root.removeReference()
                        }
                        Tooltip {
                            anchors.top: parent.bottom
                            anchors.topMargin: 4
                            text: qsTr("Remove reference image")
                            shown: removeRefMa.containsMouse
                        }
                    }
                }

            // Keep the MA below the content rows (z: Theme.zUnder) so the
            // remove-reference X stays clickable.
            MouseArea {
                id: dropZoneMa
                anchors.fill: parent
                z: Theme.zUnder
                hoverEnabled: true
                cursorShape: Qt.PointingHandCursor
                onClicked: refFileDialog.open()

                DropArea {
                    anchors.fill: parent
                    onEntered: root.dragOver = true
                    onExited: root.dragOver = false
                    onDropped: function(drop) {
                        root.dragOver = false
                        if (drop.hasUrls) {
                            var u = drop.urls[0].toString()
                            if (!u.startsWith("file://")) {
                                App.notify(qsTr("Drop a local image file (PNG, JPG, or WebP)."), "error")
                                return
                            }
                            var p = root.localPath(drop.urls[0])
                            if (p.match(/\.(png|jpe?g|webp)$/i))
                                root.attachReference(p)
                            else
                                App.notify(qsTr("Unsupported file format. Use PNG, JPG, or WebP."), "error")
                        }
                    }
                }
            }
            }

            // 2) STYLE chips
            SectionHeader { text: qsTr("STYLE"); width: parent.width }
            Flow {
                width: parent.width
                spacing: 6 // gap-1.5

                Repeater {
                    model: ListModel {
                        ListElement { key: "default"; prompt: "Transform into the person shown, preserving their identity and facial features." }
                        ListElement { key: "anime"; prompt: "Transform into an anime character with large expressive eyes and stylized features." }
                        ListElement { key: "zombie"; prompt: "Turn into a terrifying zombie with decayed skin, hollow eyes, and a deathly pale complexion." }
                        ListElement { key: "cartoon"; prompt: "Transform into a 3D cartoon character with exaggerated proportions and bright colors." }
                        ListElement { key: "cyberpunk"; prompt: "Transform into a futuristic cyberpunk character with neon accents and metallic implants." }
                        ListElement { key: "oldage"; prompt: "Age the face dramatically to look like an elderly person with wrinkles and grey hair." }
                        ListElement { key: "vampire"; prompt: "Transform into a gothic vampire with pale skin, sharp features, and red eyes." }
                        ListElement { key: "animated3d"; prompt: "Transform into a 3D animated movie character with smooth stylized skin, big expressive eyes, and soft round features." }
                    }

                    Rectangle {
                        width: chipLabel.implicitWidth + 20
                        height: 26
                        radius: Theme.radiusFull
                        color: sessionPrompt === model.prompt ? Colors.accent12
                             : styleChipMa.containsMouse ? Colors.overlay50
                             : Colors.raised20
                        border.color: sessionPrompt === model.prompt ? Colors.accent40
                                     : styleChipMa.containsMouse ? Colors.surfaceBorderStrong
                                     : Colors.surfaceBorderSubtle
                        border.width: 1

                        readonly property string sessionPrompt: Session.activePrompt

                        Text {
                            id: chipLabel
                            anchors.centerIn: parent
                            text: root.styleName(model.key)
                            color: sessionPrompt === model.prompt ? Colors.accentHover
                                 : styleChipMa.containsMouse ? Colors.textPrimary
                                 : Colors.textSecondary
                            font.pixelSize: 11
                            font.weight: Font.Normal
                        }

                        MouseArea {
                            id: styleChipMa
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: {
                                promptArea.text = model.prompt
                                Session.commitPrompt(model.prompt)
                                promptApplied.restart()
                            }
                        }
                    }
                }
            }

            // 3) Replace background card — the WHOLE card is a clickable
            //    label (Electron), not just the switch.
            Rectangle {
                id: replaceBgCard
                width: parent.width
                height: 60
                radius: Theme.radiusMd
                color: Session.sceneEnabled ? Colors.accent06
                     : replaceBgMa.containsMouse ? Colors.overlay50
                     : Colors.surfaceRaised
                border.color: Session.sceneEnabled ? Colors.accent30
                     : replaceBgMa.containsMouse ? Colors.surfaceBorderStrong
                     : Colors.surfaceBorder
                border.width: 1

                function toggleScene() {
                    Session.setSceneEnabled(!Session.sceneEnabled) // setSceneEnabled — sceneEnabled is read-only
                    if (Session.sceneEnabled) App.swapMode = "scene"
                }

                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 12
                    anchors.rightMargin: 12
                    spacing: 12

                    Rectangle {
                        width: 32; height: 32; radius: Theme.radiusSm
                        color: Colors.overlay60 // surface-overlay/60
                        border.color: Colors.surfaceBorderSubtle
                        border.width: 1
                        Icon {
                            anchors.centerIn: parent
                            name: "image"
                            size: 15
                            color: Colors.textSecondary
                        }
                    }

                    ColumnLayout {
                        spacing: 1
                        Layout.fillWidth: true
                        Text {
                            text: qsTr("Replace background")
                            color: Colors.textPrimary
                            font.pixelSize: 12
                            font.weight: Font.Bold
                        }
                        Text {
                            text: qsTr("Drop yourself into a new scene.")
                            color: Colors.textMuted
                            font.pixelSize: 10
                        }
                    }

                    Switch {
                        checked: Session.sceneEnabled
                        enabled: false // display-only; the card MouseArea owns the toggle
                        opacity: 1.0
                    }
                }

                // Card-wide click toggles the switch (Electron label pattern)
                MouseArea {
                    id: replaceBgMa
                    anchors.fill: parent
                    anchors.rightMargin: 52 // switch column stays clickable
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: replaceBgCard.toggleScene()
                }
            }

            // 4) Scene field + chips (when enabled)
            Column {
                width: parent.width
                visible: Session.sceneEnabled
                spacing: 6

                TextField {
                    id: sceneField
                    width: parent.width
                    placeholderText: qsTr("Add 2 to 3 sentences. E.g. inside a vast gothic cathedral, towering stained glass windows, dozens of flickering candles, dramatic chiaroscuro lighting, cinematic atmosphere")
                    onEditingFinished: {
                        Session.setScenePrompt(text.trim())
                        // Manual edits decouple from any preset chip — the
                        // highlight derives from the live field value.
                        if (text.trim() !== Session.activeScene)
                            Session.setActiveScene("")
                    }
                }

                // Single-row horizontal scroll (Electron: overflow-x-auto,
                // shrink-0 chips — never wraps)
                Flickable {
                    width: parent.width
                    height: 32
                    contentWidth: sceneChipRow.implicitWidth + 4
                    clip: true
                    boundsBehavior: Flickable.StopAtBounds
                    interactive: contentWidth > width

                    Row {
                        id: sceneChipRow
                        spacing: 6

                        Repeater {
                            model: ListModel {
                                ListElement { key: "hospital"; prompt: "in a busy hospital ward, sterile fluorescent lighting, medical equipment, white walls, blue scrubs, clinical atmosphere" }
                                ListElement { key: "barracks"; prompt: "in a military barracks at dawn, neat rows of bunks, morning light through windows, polished concrete floor, regulation order" }
                                ListElement { key: "alley"; prompt: "in a rain-slicked neon alley at night, holographic billboards, steam rising from manholes, deep shadows, cinematic chiaroscuro lighting" }
                                ListElement { key: "cathedral"; prompt: "inside a vast gothic cathedral, towering stained glass windows, dozens of flickering candles, stone arches and gargoyles, dramatic chiaroscuro lighting, cinematic atmosphere" }
                                ListElement { key: "beach"; prompt: "on a tropical beach at sunset, golden hour light, palm tree silhouettes, gentle waves on white sand, warm cinematic atmosphere" }
                                ListElement { key: "rooftop"; prompt: "on a Tokyo skyscraper rooftop at night, glowing neon billboards in the distance, distant city lights, rain reflections, cinematic atmosphere" }
                            }

                            Rectangle {
                                // Selection derives from the LIVE field value
                                // (Session.scenePrompt), not a sticky marker.
                                property bool chipSelected: Session.scenePrompt === model.prompt
                                width: sceneChipLabel.implicitWidth + 20
                                height: 26
                                radius: Theme.radiusFull
                                color: chipSelected ? Colors.accent12
                                     : sceneChipMa.containsMouse ? Colors.overlay50
                                     : Colors.surfaceElevated
                                border.width: 1
                                border.color: chipSelected ? Colors.accent40
                                             : sceneChipMa.containsMouse ? Colors.surfaceBorderStrong
                                             : Colors.surfaceBorderSubtle

                                Text {
                                    id: sceneChipLabel
                                    anchors.centerIn: parent
                                    text: root.sceneName(model.key)
                                    color: chipSelected ? Colors.accentHover
                                         : sceneChipMa.containsMouse ? Colors.textPrimary
                                         : Colors.textSecondary
                                    font.pixelSize: 11
                                }

                                MouseArea {
                                    id: sceneChipMa
                                    anchors.fill: parent
                                    hoverEnabled: true
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: {
                                        sceneField.text = model.prompt
                                        Session.setScenePrompt(model.prompt)
                                        Session.setActiveScene(model.prompt)
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // 5) Edit prompt (Advanced disclosure)
            Rectangle {
                width: parent.width
                height: 26
                radius: Theme.radiusSm
                color: advMa.containsMouse ? Colors.surfaceOverlay : Colors.transparent

                RowLayout {
                    anchors.fill: parent
                    anchors.leftMargin: 4
                    anchors.rightMargin: 4
                    spacing: 6
                    Icon {
                        name: "chevron-right"
                        size: 12
                        color: Colors.textMuted
                        rotation: advExpanded ? 90 : 0
                    }
                    Text {
                        text: qsTr("Edit prompt")
                        color: Colors.textPrimary
                        font.pixelSize: 11
                    }
                    Rectangle {
                        width: advTag.implicitWidth + 12
                        height: 18
                        radius: Theme.radiusFull
                        color: Colors.surfaceElevated
                        border.color: Colors.surfaceBorderSubtle
                        border.width: 1
                        Text {
                            id: advTag
                            anchors.centerIn: parent
                            text: qsTr("ADVANCED")
                            color: Colors.textMuted
                            font.pixelSize: 8
                            font.family: Theme.fontMono.family
                            font.weight: Font.Bold
                            font.letterSpacing: 1.2
                        }
                    }
                    Rectangle {
                        visible: promptArea.text.length > 0 && promptArea.text !== root.defaultPrompt()
                        width: editedTag.implicitWidth + 12
                        height: 18
                        radius: Theme.radiusFull
                        color: Colors.accent10
                        border.color: Colors.accent30
                        border.width: 1
                        Text {
                            id: editedTag
                            anchors.centerIn: parent
                            text: qsTr("EDITED")
                            color: Colors.accentHover
                            font.pixelSize: 8
                            font.family: Theme.fontMono.family
                            font.weight: Font.Bold
                            font.letterSpacing: 1.2
                        }
                    }
                    Item { Layout.fillWidth: true }
                }

                MouseArea {
                    id: advMa
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: advExpanded = !advExpanded
                }
            }

            Column {
                id: advBody
                width: parent.width
                visible: advExpanded
                spacing: 8

                TextArea {
                    id: promptArea
                    width: parent.width
                    height: 160 // Electron: min-h-[160px]
                    padding: 10
                    // Hard cap like PromptCommitBar: an oversized prompt becomes
                    // one huge WS frame and can kill the session (proxy limit).
                    // (TextArea has no maximumLength on this Qt — clamp on edit.)
                    onTextChanged: {
                        if (text.length > 1000) {
                            const pos = cursorPosition
                            text = text.substring(0, 1000)
                            cursorPosition = Math.min(pos, 1000)
                        }
                    }
                    color: Colors.textPrimary
                    placeholderText: Session.sceneEnabled
                        ? qsTr("Describe the character. Set the scene below.")
                        : qsTr("Describe the character transformation...")
                    wrapMode: TextEdit.Wrap
                    background: Rectangle {
                        // Electron input-field focus: border #8b5cf680, bg #131320,
                        // 3px #268b5cf6 ring
                        color: promptArea.activeFocus ? Colors.surfaceFocus : Colors.surfaceRaised
                        border.color: promptArea.activeFocus ? Colors.accent50 : Colors.surfaceBorder
                        border.width: 1
                        radius: Theme.radiusSm
                        Rectangle {
                            anchors.fill: parent
                            anchors.margins: -2
                            radius: Theme.radiusLg
                            color: Colors.transparent
                            border.width: 3
                            border.color: promptArea.activeFocus ? Colors.accent15 : Colors.transparent
                        }
                        Rectangle {
                            anchors.left: parent.left; anchors.right: parent.right
                            anchors.top: parent.top; anchors.topMargin: 1
                            height: 1
                        radius: Theme.radiusHairline
                            color: Colors.insetHighlight
                        }
                    }
                }

                // Enhance toggle (Auto-improve prompts)
                // Electron: only shown for the decart realtime provider
                Row {
                    visible: App.realtimeProvider === "decart"
                    spacing: 8
                    Switch {
                        checked: Session.enhancePrompts
                        onToggled: Session.enhancePrompts = checked
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    Text {
                        text: qsTr("Auto-improve prompts (Optional)")
                        color: Colors.textSecondary
                        font.pixelSize: 11
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    Item {
                        width: 13
                        height: 13
                        anchors.verticalCenter: parent.verticalCenter
                        Icon {
                            id: enhanceHelp
                            anchors.centerIn: parent
                            name: "info"
                            size: 13
                            color: enhanceHelpMa.containsMouse ? Colors.textMuted
                                 : Colors.textMuted60
                        }
                        MouseArea {
                            id: enhanceHelpMa
                            anchors.fill: parent
                            hoverEnabled: true
                            acceptedButtons: Qt.NoButton
                        }
                        Tooltip {
                            anchors.bottom: parent.top
                            anchors.bottomMargin: 4
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: qsTr("Lucy 2 auto-expands short prompts for better scene / background replacement and detail.")
                            shown: enhanceHelpMa.containsMouse
                        }
                    }
                }

                Row {
                    spacing: 8
                    visible: promptArea.text.trim() !== root.defaultPrompt() || Session.isActive || (Session.sceneEnabled && Session.scenePrompt.trim().length > 0)
                    Item {
                        width: resetInner.implicitWidth
                        height: 20
                        Row {
                            id: resetInner
                            anchors.centerIn: parent
                            spacing: 4
                            Icon {
                                name: "undo-2"
                                size: 11
                                color: resetBtnMa.containsMouse ? Colors.textSecondary : Colors.textMuted
                                anchors.verticalCenter: parent.verticalCenter
                            }
                            Text {
                                id: resetBtn
                                text: qsTr("RESET")
                                color: resetBtnMa.containsMouse ? Colors.textSecondary : Colors.textMuted
                                font.pixelSize: 10
                                font.family: Theme.fontMono.family
                                font.capitalization: Font.AllUppercase
                                font.letterSpacing: 1.2
                                anchors.verticalCenter: parent.verticalCenter
                            }
                        }
                        MouseArea {
                            id: resetBtnMa
                            anchors.fill: parent
                            anchors.margins: -4
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            onClicked: {
                                promptArea.text = root.defaultPrompt()
                                Session.commitPrompt(promptArea.text.substring(0, 1000))
                            }
                        }
                    }
                    PrimaryButton {
                        // Electron: Apply prompt only while a swap is active
                        visible: Session.isActive
                        property bool wasApplied: promptApplied.running
                        text: wasApplied ? qsTr("Applied") : qsTr("Apply prompt")
                        stateBg: wasApplied ? Colors.statusSuccess10 : undefined
                        stateBorder: wasApplied ? Colors.statusSuccess30 : undefined
                        stateFg: wasApplied ? Colors.statusSuccess : undefined
                        implicitHeight: 30
                        onClicked: {
                            const p = promptArea.text.trim()
                            if (!p.length) return
                            Session.commitPrompt(p)
                            promptApplied.restart()
                        }
                        Timer { id: promptApplied; interval: 1200 }
                    }
                }
            }

            // 6) SAVE AS CHARACTER (Electron: mt-auto pt-4 border-t)
            Rectangle { width: parent.width; height: 1; color: Colors.surfaceBorderSubtle }
            Item { width: 1; height: 12 }
            SectionHeader { text: qsTr("SAVE AS CHARACTER"); width: parent.width }
            Row {
                width: parent.width
                spacing: 8
                TextField {
                    id: nameField
                    width: parent.width - saveBtn.width - 8
                    placeholderText: qsTr("Name (optional)")
                    maximumLength: 40
                    onAccepted: if (saveBtn.enabled) saveBtn.clicked()
                }
                PrimaryButton {
                    id: saveBtn
                    // Electron jP save states: saved → success, failures →
                    // error, else accent CTA / ghost-disabled.
                    property string saveState: "idle"
                    text: saveState === "saved" ? qsTr("Saved")
                         : saveState === "library-full" ? qsTr("Library full")
                         : qsTr("Save")
                    enabled: root.refImagePath.length > 0
                             || promptArea.text.trim() !== root.defaultPrompt()
                             || (Session.sceneEnabled && Session.scenePrompt.trim().length > 0)
                    onClicked: {
                        // Electron jP: writes image+prompt into the first free
                        // library slot and auto-selects it. Failure states:
                        // library-full / no-content.
                        const p = promptArea.text.trim()
                        const id = Catalog.addUserCharacter(nameField.text.trim(), root.refImagePath, p)
                        if (id.length) {
                            saveState = "saved"
                            savedTimer.restart()
                            nameField.text = ""
                            App.notify(qsTr("Saved to Library"), "success")
                        } else if (p.length === 0 && root.refImagePath.length === 0) {
                            saveState = "no-content"
                            savedTimer.restart()
                            App.notify(qsTr("Add a prompt or reference image above to save."), "warning")
                        } else {
                            saveState = "library-full"
                            savedTimer.restart()
                            App.notify(qsTr("Your library is full — delete a character to free a slot."), "warning")
                        }
                    }
                    // State styling (Electron)
                    stateBg: saveState === "saved" ? Colors.statusSuccess15
                        : (saveState === "library-full" || saveState === "no-content") ? Colors.statusError10
                        : undefined
                    stateBorder: saveState === "saved" ? Colors.statusSuccess30
                        : (saveState === "library-full" || saveState === "no-content") ? Colors.statusError30
                        : undefined
                    stateFg: saveState === "saved" ? Colors.statusSuccess
                        : (saveState === "library-full" || saveState === "no-content") ? Colors.statusError
                        : undefined
                    Timer {
                        id: savedTimer
                        interval: 2500
                        onTriggered: saveBtn.saveState = "idle"
                    }
                }
            }
            Text {
                width: parent.width
                text: (promptArea.text.trim().length > 0 || root.refImagePath.length > 0)
                      ? qsTr("Saves the current prompt and reference image to your Library.")
                      : qsTr("Add a prompt or reference image above to save.")
                color: Colors.textMuted
                font.pixelSize: 10
                wrapMode: Text.WordWrap
            }

            Item { width: 1; height: 16 }
        }
    }

    FileDialog {
        id: refFileDialog
        title: qsTr("Choose a reference image")
        nameFilters: [qsTr("Images (*.png *.jpg *.jpeg *.webp)")]
        onAccepted: root.attachReference(root.localPath(selectedFile))
    }

    // First-upload consent gate (Electron mm) — the dialog persists the ack
    // (Config.uploadConsentShown) on accept, then the pending upload runs.
    UploadConsentDialog {
        id: consentDialog
        onAccepted: {
            if (root.pendingUpload.length) {
                root.doAttach(root.pendingUpload)
                root.pendingUpload = ""
            }
        }
        onRejected: root.pendingUpload = ""
    }

    Component.onCompleted: {
        if (Presets.count === 0)
            Presets.load()
        // reflect the committed prompt + attached reference on open
        promptArea.text = Session.activePrompt
        if (Session.activeCharacterImage.length > 0)
            refImagePath = Session.activeCharacterImage
        // Electron: disclosure starts OPEN when the prompt is non-default
        const d = root.defaultPrompt()
        advExpanded = promptArea.text.length > 0 && promptArea.text !== d
    }

    // Keep the editor in sync when the selection changes elsewhere (character
    // card click, preset apply) — but never clobber the user mid-edit.
    Connections {
        target: Session
        function onActivePromptChanged() {
            if (!promptArea.activeFocus)
                promptArea.text = Session.activePrompt
        }
        function onActiveCharacterImageChanged() {
            refImagePath = Session.activeCharacterImage
        }
    }
}
