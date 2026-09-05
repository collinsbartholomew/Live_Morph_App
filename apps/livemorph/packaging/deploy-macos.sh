#!/usr/bin/env bash
# Bundle LiveMorph.app with Qt + WebEngine for macOS.
set -euo pipefail
APP="${1:-build/LiveMorph.app}"
QTDIR="${QTDIR:-${CMAKE_PREFIX_PATH:-}}"
if [[ ! -d "$APP" ]]; then
  echo "Missing $APP — build first"
  exit 1
fi
MACDEPLOYQT="${QTDIR:+$QTDIR/bin/macdeployqt}"
MACDEPLOYQT="${MACDEPLOYQT:-$(command -v macdeployqt)}"
"$MACDEPLOYQT" "$APP" -qmldir="$(dirname "$0")/../qml" -always-overwrite -dmg
# i18n
mkdir -p "$APP/Contents/Resources/i18n"
cp -f "$(dirname "$0")/../i18n/"*.qm "$APP/Contents/Resources/i18n/" 2>/dev/null || true
echo "DMG created beside $APP (WebEngine inside the app bundle)"
