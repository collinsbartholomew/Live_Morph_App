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
        toastModel.insert(0, {
            "toastId": id,
            "message": m,
            "type": k,
            "detail": d,
            "actionLabel": a,
            "cb": f,
            "remaining": root.durationMs,
            "total": root.durationMs,
            "hovered": false,
            "exiting": false
        });
        root._trim();
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

            toastModel.remove(drop, 1);
        }
    }

    function removeById(id) {
        for (var i = 0; i < toastModel.count; i++) {
            if (toastModel.get(i).toastId === id) {
                toastModel.remove(i, 1);
                return ;
            }
        }
    }

    function removeAt(i) {
        if (i >= 0 && i < toastModel.count)
            toastModel.remove(i, 1);

    }

    function dismiss() {
        toastModel.clear();
    }

    anchors.left: parent.left
    anchors.right: parent.right
    anchors.top: parent.top
    anchors.topMargin: 52
    height: col.implicitHeight
    z: 900

    ListModel {
        id: toastModel
    }

    Column {
        id: col

        anchors.horizontalCenter: parent.horizontalCenter
        width: Math.min(parent.width - 32, 420)
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
                readonly property color typeBg: {
                    if (model.type === "error")
                        return Colors.toastErrorBg;

                    if (model.type === "success")
                        return Colors.toastSuccessBg;

                    if (model.type === "warning")
                        return Colors.toastWarningBg;

                    return Colors.toastInfoBg;
                }
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
                    implicitHeight: inner.implicitHeight + 4
                    radius: Theme.radiusLg
                    color: wrap.typeBg
                    border.width: 1
                    border.color: Qt.rgba(wrap.typeColor.r, wrap.typeColor.g, wrap.typeColor.b, 0.35)

                    // Left accent strip
                    Rectangle {
                        width: 3
                        anchors.left: parent.left
                        anchors.top: parent.top
                        anchors.bottom: parent.bottom
                        anchors.margins: 1
                        radius: 2
                        color: wrap.typeColor
                    }

                    ColumnLayout {
                        id: inner

                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.top: parent.top
                        anchors.margins: 14
                        anchors.leftMargin: 16
                        spacing: 6

                        RowLayout {
                            Layout.fillWidth: true
                            spacing: 12

                            Rectangle {
                                width: 28
                                height: 28
                                radius: 14
                                color: Qt.rgba(wrap.typeColor.r, wrap.typeColor.g, wrap.typeColor.b, 0.18)
                                Layout.alignment: Qt.AlignTop

                                Icon {
                                    anchors.centerIn: parent
                                    name: wrap.typeIcon
                                    size: 16
                                    color: wrap.typeColor
                                }

                            }

                            ColumnLayout {
                                Layout.fillWidth: true
                                spacing: 2

                                Text {
                                    text: model.message
                                    color: Colors.textPrimary
                                    font.pixelSize: 13
                                    font.weight: Font.DemiBold
                                    wrapMode: Text.WordWrap
                                    Layout.fillWidth: true
                                }

                                Text {
                                    visible: model.detail && model.detail.length > 0
                                    text: model.detail || ""
                                    color: Colors.textSecondary
                                    font.pixelSize: 12
                                    wrapMode: Text.WordWrap
                                    Layout.fillWidth: true
                                }

                            }

                            // Action chip
                            Rectangle {
                                visible: model.actionLabel && model.actionLabel.length > 0
                                radius: Theme.radiusFull
                                color: Colors.accent15
                                border.color: Colors.accent30
                                border.width: 1
                                implicitWidth: actLbl.implicitWidth + 16
                                implicitHeight: 28
                                Layout.alignment: Qt.AlignTop

                                Text {
                                    id: actLbl

                                    anchors.centerIn: parent
                                    text: model.actionLabel || ""
                                    color: Colors.accentHover
                                    font.pixelSize: 11
                                    font.weight: Font.DemiBold
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: {
                                        if (model.cb)
                                            model.cb();

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
                    interval: 200
                    running: model.exiting
                    onTriggered: root.removeById(model.toastId)
                }

                Behavior on opacity {
                    NumberAnimation {
                        duration: Theme.motionNormal
                        easing.type: Easing.OutCubic
                    }

                }

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
