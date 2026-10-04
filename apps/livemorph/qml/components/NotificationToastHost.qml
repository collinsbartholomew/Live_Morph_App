import LiveMorph
import QtQuick
import QtQuick.Layouts

/**
 * NotificationToastHost — transient toast surface.
 *
 * Two sources feed it:
 *   1. Notifier.pushed  -> mirrors inbox events as toasts (throttled + coalesced).
 *   2. show(...)        -> contextual/action toasts (e.g. recording "Reveal").
 *
 * Resource discipline:
 *   - One shared 250ms tick timer drives auto-dismiss only while toasts exist.
 *   - Hovering pauses the remaining time WITHOUT resetting it (no animation restart).
 *   - Toasts fade in AND out; no per-toast NumberAnimation that fights bindings.
 *   - Identical consecutive toasts coalesce instead of stacking.
 *   - Bursts cannot evict errors/warnings (info-only eviction first).
 */
Item {
    id: root

    property int maxToasts: 3
    readonly property int durationMs: 4500
    property int _seq: 0
    property int _lastMirrorTs: 0
    // Toast action callbacks live in a JS side-map (keyed by toastId), not in
    // the ListModel: storing functions/nulls in model roles triggers
    // "Adding an object with a null member does not create a role for it".
    property var _cbs: ({})

    function mirror(title, sev, body) {
        var now = Date.now();
        // Errors always surface; non-error bursts are throttled to 300ms and
        // identical repeats just refresh the existing toast instead of stacking.
        if (sev !== "error") {
            if (_lastMirrorTs > 0 && now - _lastMirrorTs < 300) {
                if (toastModel.count > 0) {
                    var head = toastModel.get(0);
                    if (head.message === title && head.type === sev)
                        toastModel.set(0, {
                        "remaining": head.total
                    });

                }
                return ;
            }
            _lastMirrorTs = now;
        }
        show(title, sev, body);
    }

    function show(msg, t, det, action, cb) {
        var m = msg || "";
        var k = t || "info";
        var d = det || "";
        var a = action || "";
        var f = cb || null;
        // Coalesce an identical leading toast (refreshes its lifetime)
        if (toastModel.count > 0) {
            var head = toastModel.get(0);
            if (head.message === m && head.type === k) {
                toastModel.set(0, {
                    "remaining": head.total
                });
                return ;
            }
        }
        var id = ++root._seq;
        if (f)
            root._cbs[id] = f;
        toastModel.insert(0, {
            "toastId": id,
            "message": m,
            "type": k,
            "detail": d,
            "actionLabel": a,
            "remaining": root.durationMs,
            "total": root.durationMs,
            "hovered": false,
            "exiting": false
        });
        root._trim();
    }

    function invokeCb(id) {
        var f = root._cbs[id];
        delete root._cbs[id];
        if (typeof f === "function")
            f();
    }

    // Weighted eviction: info rows go first, so a burst never kills errors/warnings.
    function _trim() {
        while (toastModel.count > root.maxToasts) {
            var drop = -1;
            for (var i = toastModel.count - 1; i >= 0; i--) {
                if (toastModel.get(i).type === "info") {
                    drop = i;
                    break;
                }
            }
            if (drop < 0)
                drop = toastModel.count - 1;

            delete root._cbs[toastModel.get(drop).toastId];
            toastModel.remove(drop, 1);
        }
    }

    function removeById(id) {
        for (var i = 0; i < toastModel.count; i++) {
            if (toastModel.get(i).toastId === id) {
                delete root._cbs[id];
                toastModel.remove(i, 1);
                return ;
            }
        }
        delete root._cbs[id];
    }

    function removeAt(i) {
        if (i >= 0 && i < toastModel.count) {
            delete root._cbs[toastModel.get(i).toastId];
            toastModel.remove(i, 1);
        }

    }

    function dismiss() {
        toastModel.clear();
        root._cbs = {};
    }

    // Electron: toasts live BOTTOM-RIGHT (320px) — the old top-center stack
    // was an invention. Functional extras kept: stacking ≤3, auto-dismiss,
    // hover-pause, progress bar.
    anchors.right: parent.right
    anchors.bottom: parent.bottom
    anchors.rightMargin: 24
    // StatusBar (32) + ActionBar (88) = 120px chrome + 16px gap
    anchors.bottomMargin: 136
    width: 320
    height: col.implicitHeight
    z: 900

    ListModel {
        id: toastModel
    }

    Column {
        id: col

        width: parent.width
        spacing: 10

        Repeater {
            model: toastModel

            delegate: Item {
                id: wrap

                required property var model
                property bool shown: false
                readonly property color typeColor: {
                    if (model.type === "error")
                        return Colors.statusError;

                    if (model.type === "success")
                        return Colors.statusSuccess;

                    if (model.type === "warning")
                        return Colors.statusWarning;

                    return Colors.statusInfo;
                }
                // Electron toast card: bg-surface-raised/95 + TYPE-TINTED
                // HEADER STRIP — not per-type card fills.
                readonly property color typeStripBg: Qt.rgba(wrap.typeColor.r, wrap.typeColor.g, wrap.typeColor.b, 0.08)
                readonly property string typeIcon: {
                    if (model.type === "error")
                        return "x-circle";

                    if (model.type === "success")
                        return "check-circle";

                    if (model.type === "warning")
                        return "alert-circle";

                    return "info";
                }

                width: col.width
                height: card.implicitHeight
                visible: opacity > 0.001
                opacity: model.exiting ? 0 : (shown ? 1 : 0)
                Component.onCompleted: shown = true

                Rectangle {
                    id: card

                    width: parent.width
                    implicitHeight: inner.implicitHeight + 32 // + header strip
                    radius: Theme.radiusMd
                    color: "#101019f2" // surface-raised/95
                    border.width: 1
                    border.color: Colors.surfaceBorder
                    // shadow-modal
                    Rectangle { anchors.fill: parent; anchors.margins: -2; radius: parent.radius + 2; color: "#00000059"; z: -1 }
                    Rectangle { anchors.fill: parent; anchors.margins: -10; anchors.topMargin: -4; radius: parent.radius + 10; color: "#0000008c"; opacity: 0.9; z: -1 }

                    // Header strip (Electron): type-tinted band with icon +
                    // uppercase mono label, hairline bottom border
                    Rectangle {
                        id: headerStrip
                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.top: parent.top
                        height: 30
                        radius: Theme.radiusMd
                        color: wrap.typeStripBg
                        Rectangle {
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.bottom: parent.bottom
                            height: 1
                            color: Qt.rgba(wrap.typeColor.r, wrap.typeColor.g, wrap.typeColor.b, 0.15)
                        }
                        Row {
                            anchors.left: parent.left
                            anchors.leftMargin: 12
                            anchors.verticalCenter: parent.verticalCenter
                            spacing: 8
                            Icon {
                                anchors.verticalCenter: parent.verticalCenter
                                name: wrap.typeIcon
                                size: 14
                                color: wrap.typeColor
                            }
                            Text {
                                anchors.verticalCenter: parent.verticalCenter
                                text: model.type.toUpperCase()
                                color: wrap.typeColor
                                font.family: Theme.fontMono.family
                                font.pixelSize: 10
                                font.capitalization: Font.AllUppercase
                                font.letterSpacing: 1.2
                            }
                        }
                        // Bottom-left square corners for the strip
                        Rectangle {
                            anchors.left: parent.left
                            anchors.bottom: parent.bottom
                            width: parent.radius
                            height: parent.radius
                            color: parent.color
                        }
                    }

                    ColumnLayout {
                        id: inner

                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.top: parent.top
                        anchors.topMargin: 30 // below the header strip
                        anchors.margins: 12
                        anchors.leftMargin: 14
                        anchors.rightMargin: 14
                        spacing: 6

                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 10

                            ColumnLayout {
                                Layout.fillWidth: true
                                spacing: 2

                                Text {
                                    text: model.message
                                    color: Colors.textPrimary
                                    font.pixelSize: 12
                                    font.weight: Font.DemiBold
                                    wrapMode: Text.WordWrap
                                    Layout.fillWidth: true
                                }

                                Text {
                                    visible: model.detail && model.detail.length > 0
                                    text: model.detail || ""
                                    color: Colors.textMuted
                                    font.pixelSize: 11
                                    font.family: Theme.fontMono.family
                                    wrapMode: Text.WordWrap
                                    Layout.fillWidth: true
                                }

                            }

                            // Action chip (Electron: uppercase mono accent chip)
                            Rectangle {
                                visible: model.actionLabel && model.actionLabel.length > 0
                                radius: Theme.radiusSm
                                color: Colors.accent10
                                border.color: Colors.accent30
                                border.width: 1
                                implicitWidth: actLbl.implicitWidth + 16
                                implicitHeight: 24
                                Layout.alignment: Qt.AlignVCenter

                                Text {
                                    id: actLbl

                                    anchors.centerIn: parent
                                    text: (model.actionLabel || "").toUpperCase()
                                    color: Colors.accentHover
                                    font.family: Theme.fontMono.family
                                    font.pixelSize: 10
                                    font.letterSpacing: 0.8
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: {
                                        root.invokeCb(model.toastId);
                                        root.removeById(model.toastId);
                                    }
                                }

                            }

                            // Dismiss
                            Rectangle {
                                width: 24
                                height: 24
                                radius: 12
                                color: dismissMa.containsMouse ? Colors.white06 : "transparent"
                                Layout.alignment: Qt.AlignTop

                                Icon {
                                    anchors.centerIn: parent
                                    name: "x"
                                    size: 14
                                    color: Colors.textMuted
                                }

                                MouseArea {
                                    id: dismissMa

                                    anchors.fill: parent
                                    hoverEnabled: true
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: root.removeById(model.toastId)
                                }

                            }

                        }

                        // Progress bar — driven by remaining/total (no restart-on-hover)
                        Item {
                            Layout.fillWidth: true
                            height: 2

                            Rectangle {
                                anchors.fill: parent
                                color: Colors.divider
                                radius: 1
                            }

                            Rectangle {
                                width: (card.width - 28) * Math.max(0, model.remaining) / Math.max(1, model.total)
                                height: parent.height
                                radius: 1
                                color: wrap.typeColor
                                opacity: 0.55

                                Behavior on width {
                                    NumberAnimation {
                                        duration: 200
                                    }

                                }

                            }

                        }

                    }

                    // Hover pauses the auto-dismiss without resetting it
                    MouseArea {
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onEntered: model.hovered = true
                        onExited: model.hovered = false
                    }

                }

                // Exit animation completion -> remove the row
                Timer {
                    interval: 260
                    running: model.exiting
                    onTriggered: root.removeById(model.toastId)
                }

                // Electron slide-in-bottom (.26s cubic-bezier(.16,1,.3,1)):
                // opacity + 12px rise together
                Behavior on opacity {
                    NumberAnimation {
                        duration: 260
                        easing.type: Easing.OutCubic
                    }

                }
                transform: Translate { y: wrap.shown && !wrap.model.exiting ? 0 : 12 }

            }

        }

    }

    // Mirror inbox events as transient toasts (throttled + coalesced)
    Connections {
        function onPushed(id) {
            var it = Notifier.itemById(id);
            if (it && it.title)
                root.mirror(it.title, it.severity, it.body);

        }

        target: Notifier
    }

    // Single shared auto-dismiss driver — only runs while toasts exist
    Timer {
        interval: 250
        repeat: true
        running: toastModel.count > 0
        onTriggered: {
            for (var i = toastModel.count - 1; i >= 0; i--) {
                var it = toastModel.get(i);
                if (it.exiting || it.hovered)
                    continue;

                var rem = it.remaining - 250;
                if (rem <= 0)
                    toastModel.set(i, {
                    "exiting": true,
                    "remaining": 0
                });
                else
                    toastModel.set(i, {
                    "remaining": rem
                });
            }
        }
    }

}
