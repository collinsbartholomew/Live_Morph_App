#!/usr/bin/env bash
# Stage a relocatable Linux directory with the Qt runtime + GStreamer plugins.
# (The app no longer uses Qt WebEngine — media is GStreamer webrtcbin.)
# For a single-file AppImage, prefer linuxdeploy + linuxdeploy-plugin-qt.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BIN="${1:-${SCRIPT_DIR}/../build/bin/LiveMorph}"
# CMAKE_PREFIX_PATH is a CMake ';' list — take the FIRST entry, not the whole list.
QT_PREFIX="${CMAKE_PREFIX_PATH%%;*}"
[[ -z "$QT_PREFIX" ]] && QT_PREFIX="${QTDIR:-}"
[[ -x "$BIN" ]] || { echo "Missing binary $BIN (build first: ./build.sh)"; exit 1; }
[[ -n "$QT_PREFIX" ]] || { echo "Set CMAKE_PREFIX_PATH or QTDIR to your Qt6 prefix"; exit 1; }

BIN_DIR="$(cd "$(dirname "$BIN")" && pwd)"
# Never derive a delete target from a system path (e.g. /usr/bin/LiveMorph).
case "$BIN_DIR" in /usr|/bin|/sbin|/etc|/usr/*|/bin/*|/sbin/*|/etc/*)
  echo "Refusing to stage from a system binary path: $BIN"; exit 1;; esac
OUT="$BIN_DIR/dist"
rm -rf "$OUT"
mkdir -p "$OUT/lib" "$OUT/plugins" "$OUT/qml" "$OUT/gst-plugins"

cp -a "$BIN" "$OUT/"
# Core Qt libs the app links (no WebEngine — media is GStreamer webrtcbin).
# QuickDialogs2 and OpenGL are direct DT_NEEDED of the binary; QuickTemplates2
# and DBus are required transitively by QuickControls2/Multimedia.
MISSING=0
for lib in Core Gui Widgets Qml Quick QuickControls2 QuickDialogs2 QuickTemplates2 QuickLayouts QuickShapes OpenGL Network WebSockets Multimedia Svg Concurrent DBus; do
  if ! cp -a "$QT_PREFIX"/lib/libQt6${lib}.so* "$OUT/lib/" 2>/dev/null; then
    echo "warn: Qt lib not found: libQt6${lib}.so*"; MISSING=1
  fi
done
# GStreamer runtime libs (webrtcbin lives in gst-plugins-bad)
# gstbase is a direct DT_NEEDED of the binary; gstaudio/gsttag/orc/libnice are
# required by the bundled gst-plugins-bad webrtcbin plugin chain.
TRIPLET="$(gcc -dumpmachine 2>/dev/null || echo x86_64-linux-gnu)"
for lib in libgstreamer-1.0.so* libgstwebrtc-1.0.so* libgstsdp-1.0.so* libgstapp-1.0.so* libgstbase-1.0.so* libgstvideo-1.0.so* libgstaudio-1.0.so* libgsttag-1.0.so* libgstcodecparsers-1.0.so* libgstpbutils-1.0.so* libgstrtp-1.0.so* libgstrtpmanager-1.0.so* libgstnet-1.0.so* libgstgl-1.0.so* libglib-2.0.so* libgobject-2.0.so* liborc-0.4.so* libnice.so* libsrtp2.so*; do
  found=0
  for f in "/usr/lib/$TRIPLET/$lib" /usr/lib/"$lib" /usr/lib64/"$lib"; do
    if [[ -e "$f" ]]; then cp -a "$f" "$OUT/lib/" 2>/dev/null && found=1; fi
  done
  [[ $found -eq 0 ]] && { echo "warn: gst lib not found: $lib"; MISSING=1; }
done

# Qt plugins the app needs at runtime — tls is required for HTTPS to the
# backend; xcbglintegrations/egldeviceintegrations for GL rendering;
# platforminputcontexts/networkinformation/wayland-* for IME/net/Wayland.
for plug in platforms platforminputcontexts imageformats qmltooling multimedia iconengines tls xcbglintegrations egldeviceintegrations networkinformation scenegraph wayland-decoration-client wayland-graphics-integration-client wayland-shell-integration; do
  if [[ -d "$QT_PREFIX/plugins/$plug" ]]; then
    cp -a "$QT_PREFIX/plugins/$plug" "$OUT/plugins/"
  fi
done
# QML modules imported by the compiled module (QtQuick.*, QtMultimedia, ...)
if [[ -d "$QT_PREFIX/qml" ]]; then
  cp -a "$QT_PREFIX/qml/." "$OUT/qml/"
fi
# GStreamer plugin .so files (webrtcbin, codecs, appsrc/appsink, videoconvert...)
for d in "/usr/lib/$TRIPLET/gstreamer-1.0" /usr/lib/gstreamer-1.0 /usr/lib64/gstreamer-1.0; do
  [[ -d "$d" ]] && cp -a "$d/." "$OUT/gst-plugins/" 2>/dev/null
done

cat > "$OUT/LiveMorph.sh" << 'RUN'
#!/usr/bin/env bash
DIR="$(cd "$(dirname "$0")" && pwd)"
export LD_LIBRARY_PATH="$DIR/lib:${LD_LIBRARY_PATH:-}"
export QT_PLUGIN_PATH="$DIR/plugins"
export QML_IMPORT_PATH="$DIR/qml"
export GST_PLUGIN_PATH="$DIR/gst-plugins"
# Append (not replace) so a partial bundled plugin dir still falls back to
# the system GStreamer plugins. Resolve the system dir at RUNTIME (the build
# host's multiarch triplet may differ from the target's).
SYSGST="$(dirname "$(ldconfig -p 2>/dev/null | awk '/libgstreamer-1.0\.so/{print $NF; exit}')")/gstreamer-1.0"
export GST_PLUGIN_SYSTEM_PATH="$DIR/gst-plugins:${GST_PLUGIN_SYSTEM_PATH:-${SYSGST:-/usr/lib/gstreamer-1.0}}"
exec "$DIR/LiveMorph" "$@"
RUN
chmod +x "$OUT/LiveMorph.sh" "$OUT/LiveMorph"

# Icon + desktop entry with protocol handler
cp "${SCRIPT_DIR}/../resources/assets/livemorph-icon.png" "$OUT/livemorph-icon.png"
cat > "$OUT/livemorph.desktop" << EOF
[Desktop Entry]
Type=Application
Name=LiveMorph
Exec="$OUT/LiveMorph.sh" %u
Icon=$OUT/livemorph-icon.png
Terminal=false
Categories=AudioVideo;Graphics;
MimeType=x-scheme-handler/livemorph;
EOF

# Verify the staged binary actually resolves every shared lib — a wrong Qt
# prefix or missing lib must fail HERE, not with a loader error on the target.
if ldd "$OUT/LiveMorph" 2>/dev/null | grep -q "not found"; then
  echo "ERROR: staged binary has unresolved libraries:" >&2
  ldd "$OUT/LiveMorph" 2>/dev/null | grep "not found" >&2
  exit 1
fi
for so in "$OUT"/gst-plugins/*.so; do
  [[ -e "$so" ]] || continue
  if ldd "$so" 2>/dev/null | grep -q "not found"; then
    echo "ERROR: gst plugin $so has unresolved libraries:" >&2
    ldd "$so" 2>/dev/null | grep "not found" >&2
    exit 1
  fi
done
[[ $MISSING -eq 0 ]] || echo "warning: some optional libs were missing (see above)" >&2

echo "Staged: $OUT"
echo "Run: $OUT/LiveMorph.sh"
echo "Tip: use linuxdeploy-plugin-qt for a single AppImage."
echo "Optional: xdg-desktop-menu install $OUT/livemorph.desktop"
echo "Optional: xdg-mime default livemorph.desktop x-scheme-handler/livemorph"
