#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP="${1:-${SCRIPT_DIR}/../build/bin/LiveMorph.app}"
QTDIR="${QTDIR:-${CMAKE_PREFIX_PATH:-}}"
QTDIR="${QTDIR%%;*}"
[[ -d "$APP" ]] || { echo "Missing $APP — build first" >&2; exit 1; }
APP_BIN="$APP/Contents/MacOS/LiveMorph"
[[ -x "$APP_BIN" ]] || { echo "Missing app executable: $APP_BIN" >&2; exit 1; }

QMAKE_BIN="${QMAKE:-}"
if [[ -z "$QMAKE_BIN" && -n "$QTDIR" && -x "$QTDIR/bin/qmake" ]]; then
  QMAKE_BIN="$QTDIR/bin/qmake"
fi
if [[ -z "$QMAKE_BIN" ]]; then
  QMAKE_BIN="$(command -v qmake6 || command -v qmake || true)"
fi
if [[ -z "$QTDIR" && -n "$QMAKE_BIN" ]]; then
  QTDIR="$("$QMAKE_BIN" -query QT_INSTALL_PREFIX)"
fi
MACDEPLOYQT="${MACDEPLOYQT:-}"
if [[ -z "$MACDEPLOYQT" && -n "$QTDIR" ]]; then
  MACDEPLOYQT="$QTDIR/bin/macdeployqt"
fi
if [[ -z "$MACDEPLOYQT" ]]; then
  MACDEPLOYQT="$(command -v macdeployqt || true)"
fi
[[ -x "$MACDEPLOYQT" ]] || { echo "macdeployqt not found; set QTDIR or MACDEPLOYQT" >&2; exit 1; }

"$APP_BIN" --verify-qml
DMG="${APP%.app}.dmg"
rm -f "$DMG"
"$MACDEPLOYQT" "$APP" -qmldir="$SCRIPT_DIR/../qml" -always-overwrite -dmg
[[ -s "$DMG" ]] || { echo "macdeployqt completed without creating $DMG" >&2; exit 1; }
if command -v hdiutil >/dev/null 2>&1; then
  hdiutil imageinfo "$DMG" >/dev/null
fi

echo "DMG created: $DMG"
echo "Target Macs must install GStreamer 1.x with WebRTC, nice, and srtp plugins."
