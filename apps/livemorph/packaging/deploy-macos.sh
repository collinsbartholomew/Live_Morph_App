#!/usr/bin/env bash
# Bundle LiveMorph.app with Qt + GStreamer dylibs for macOS.
# (The app no longer uses Qt WebEngine — media is GStreamer webrtcbin.)
set -euo pipefail
# Bundles are RUNTIME artifacts — they land in build/bin/, not build/.
APP="${1:-build/bin/LiveMorph.app}"
QTDIR="${QTDIR:-${CMAKE_PREFIX_PATH:-}}"
if [[ ! -d "$APP" ]]; then
  echo "Missing $APP — build first"
  exit 1
fi
MACDEPLOYQT="${QTDIR:+$QTDIR/bin/macdeployqt}"
MACDEPLOYQT="${MACDEPLOYQT:-$(command -v macdeployqt)}"
"$MACDEPLOYQT" "$APP" -qmldir="$(dirname "$0")/../qml" -always-overwrite -dmg
# GStreamer dylibs are NOT bundled by macdeployqt — install GStreamer via
# Homebrew on the target machine, or extend this script to copy the dylibs
# from /opt/homebrew/lib into Contents/Frameworks and fix install names.
echo "DMG created beside $APP (Qt inside; install GStreamer separately)"
