#!/usr/bin/env bash
# Stage a relocatable directory with Qt WebEngine for Linux.
# For production, prefer linuxdeploy + linuxdeploy-plugin-qt AppImage.
set -euo pipefail
BIN="${1:-build/LiveMorph}"
QT_PREFIX="${CMAKE_PREFIX_PATH:-${QTDIR:-}}"
[[ -x "$BIN" ]] || { echo "Missing binary $BIN"; exit 1; }
[[ -n "$QT_PREFIX" ]] || { echo "Set CMAKE_PREFIX_PATH or QTDIR"; exit 1; }

OUT="$(cd "$(dirname "$BIN")" && pwd)/dist"
rm -rf "$OUT"
mkdir -p "$OUT/lib" "$OUT/libexec" "$OUT/resources" "$OUT/translations" "$OUT/i18n" "$OUT/plugins"

cp -a "$BIN" "$OUT/"
# Core Qt + WebEngine
for lib in Core Gui Qml Quick QuickControls2 Network WebSockets Multimedia Svg \
           WebEngineCore WebEngineQuick WebChannel Positioning OpenGL DBus; do
  cp -a "$QT_PREFIX"/lib/libQt6${lib}.so* "$OUT/lib/" 2>/dev/null || true
done
cp -a "$QT_PREFIX"/libexec/QtWebEngineProcess "$OUT/libexec/" 2>/dev/null || true
cp -a "$QT_PREFIX"/resources/. "$OUT/resources/" 2>/dev/null || true
cp -a "$QT_PREFIX"/translations/qtwebengine_locales "$OUT/translations/" 2>/dev/null || true
cp -a "$(dirname "$0")/../i18n/"*.qm "$OUT/i18n/" 2>/dev/null || true

# Plugins often required
for plug in platforms imageformats qmltooling multimedia; do
  if [[ -d "$QT_PREFIX/plugins/$plug" ]]; then
    cp -a "$QT_PREFIX/plugins/$plug" "$OUT/plugins/"
  fi
done

cat > "$OUT/LiveMorph.sh" << 'RUN'
#!/usr/bin/env bash
DIR="$(cd "$(dirname "$0")" && pwd)"
export LD_LIBRARY_PATH="$DIR/lib:${LD_LIBRARY_PATH:-}"
export QT_PLUGIN_PATH="$DIR/plugins"
export QTWEBENGINEPROCESS_PATH="$DIR/libexec/QtWebEngineProcess"
exec "$DIR/LiveMorph" "$@"
RUN
chmod +x "$OUT/LiveMorph.sh" "$OUT/LiveMorph"

echo "Staged: $OUT"
echo "Run: $OUT/LiveMorph.sh"
echo "Tip: use linuxdeploy-plugin-qt for a single AppImage."


# Desktop entry + protocol handler
cat > "$OUT/livemorph.desktop" << EOF
[Desktop Entry]
Type=Application
Name=LiveMorph
Exec=$OUT/LiveMorph.sh %u
Icon=$OUT/livemorph-icon.png
Terminal=false
Categories=AudioVideo;Graphics;
MimeType=x-scheme-handler/livemorph;
EOF
if [[ -f "$ROOT/resources/assets/livemorph-icon.png" ]]; then
  cp "$ROOT/resources/assets/livemorph-icon.png" "$OUT/" 2>/dev/null || true
fi
echo "Optional: xdg-desktop-menu install $OUT/livemorph.desktop"
echo "Optional: xdg-mime default livemorph.desktop x-scheme-handler/livemorph"
