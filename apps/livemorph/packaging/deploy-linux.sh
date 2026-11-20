#!/usr/bin/env bash
# Stage a relocatable Linux directory with the Qt runtime + GStreamer plugins.
# (The app no longer uses Qt WebEngine — media is GStreamer webrtcbin.)
# For a single-file AppImage, prefer linuxdeploy + linuxdeploy-plugin-qt.
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BIN="${1:-${SCRIPT_DIR}/../build/bin/LiveMorph}"
# CMAKE_PREFIX_PATH is a CMake ';' list — take the FIRST entry, not the whole list.
QT_PREFIX="${CMAKE_PREFIX_PATH:-}"
QT_PREFIX="${QT_PREFIX%%;*}"
[[ -z "$QT_PREFIX" ]] && QT_PREFIX="${QTDIR:-}"
QMAKE_BIN="${QMAKE:-}"
if [[ -z "$QMAKE_BIN" && -n "$QT_PREFIX" && -x "$QT_PREFIX/bin/qmake" ]]; then
  QMAKE_BIN="$QT_PREFIX/bin/qmake"
fi
if [[ -z "$QMAKE_BIN" ]]; then
  QMAKE_BIN="$(command -v qmake6 || command -v qmake || true)"
fi
if [[ -z "$QT_PREFIX" && -n "$QMAKE_BIN" ]]; then
  QT_PREFIX="$("$QMAKE_BIN" -query QT_INSTALL_PREFIX)"
fi
[[ -x "$BIN" ]] || { echo "Missing binary $BIN (build first: ./build.sh)"; exit 1; }
[[ -n "$QT_PREFIX" ]] || { echo "Set CMAKE_PREFIX_PATH or QTDIR to your Qt6 prefix"; exit 1; }
QT_LIBDIR="${QT_LIBDIR:-}"
QT_PLUGIN_DIR="${QT_PLUGIN_DIR:-}"
QT_QML_DIR="${QT_QML_DIR:-}"
if [[ -n "$QMAKE_BIN" ]]; then
  [[ -n "$QT_LIBDIR" ]] || QT_LIBDIR="$("$QMAKE_BIN" -query QT_INSTALL_LIBS)"
  [[ -n "$QT_PLUGIN_DIR" ]] || QT_PLUGIN_DIR="$("$QMAKE_BIN" -query QT_INSTALL_PLUGINS)"
  [[ -n "$QT_QML_DIR" ]] || QT_QML_DIR="$("$QMAKE_BIN" -query QT_INSTALL_QML)"
fi
QT_LIBDIR="${QT_LIBDIR:-$QT_PREFIX/lib}"
QT_PLUGIN_DIR="${QT_PLUGIN_DIR:-$QT_PREFIX/plugins}"
QT_QML_DIR="${QT_QML_DIR:-$QT_PREFIX/qml}"
[[ -d "$QT_LIBDIR" && -d "$QT_PLUGIN_DIR" && -d "$QT_QML_DIR" ]] || {
  echo "Qt runtime directories not found for prefix $QT_PREFIX"; exit 1;
}

BIN_DIR="$(cd "$(dirname "$BIN")" && pwd)"
# Never derive a delete target from a system path (e.g. /usr/bin/LiveMorph).
case "$BIN_DIR" in /usr|/bin|/sbin|/etc|/usr/*|/bin/*|/sbin/*|/etc/*)
  echo "Refusing to stage from a system binary path: $BIN"; exit 1;; esac
OUT="$BIN_DIR/dist"
"$BIN" --verify-qml
rm -rf "$OUT"
mkdir -p "$OUT/lib" "$OUT/plugins" "$OUT/qml" "$OUT/gst-plugins"

cp -a "$BIN" "$OUT/"
TRIPLET="$(gcc -dumpmachine 2>/dev/null || echo x86_64-linux-gnu)"
GST_LIBDIR="${GST_LIBDIR:-$(pkg-config --variable=libdir gstreamer-1.0 2>/dev/null || true)}"
GST_PLUGIN_DIR="${GST_PLUGIN_DIR:-$(pkg-config --variable=pluginsdir gstreamer-1.0 2>/dev/null || true)}"

# Qt plugins the app needs at runtime — tls is required for HTTPS to the
# backend; xcbglintegrations/egldeviceintegrations for GL rendering;
# platforminputcontexts/networkinformation/wayland-* for IME/net/Wayland.
for plug in platforms platforminputcontexts imageformats qmltooling multimedia iconengines tls xcbglintegrations egldeviceintegrations networkinformation scenegraph wayland-decoration-client wayland-graphics-integration-client wayland-shell-integration; do
  if [[ -d "$QT_PLUGIN_DIR/$plug" ]]; then
    cp -a "$QT_PLUGIN_DIR/$plug" "$OUT/plugins/"
  fi
done
for module in QtMultimedia QtCore QML; do
  [[ -d "$QT_QML_DIR/$module" ]] || { echo "ERROR: required QML module missing: $module" >&2; exit 1; }
  cp -a "$QT_QML_DIR/$module" "$OUT/qml/"
done
for parent in QtQuick QtQml; do
  mkdir -p "$OUT/qml/$parent"
  for item in "$QT_QML_DIR/$parent"/*; do
    [[ -f "$item" ]] && cp -a "$item" "$OUT/qml/$parent/"
  done
done
for module in Controls Templates Layouts Window Dialogs Shapes; do
  [[ -d "$QT_QML_DIR/QtQuick/$module" ]] || { echo "ERROR: required QtQuick module missing: $module" >&2; exit 1; }
  cp -a "$QT_QML_DIR/QtQuick/$module" "$OUT/qml/QtQuick/"
done
for module in Models WorkerScript; do
  [[ -d "$QT_QML_DIR/QtQml/$module" ]] || { echo "ERROR: required QtQml module missing: $module" >&2; exit 1; }
  cp -a "$QT_QML_DIR/QtQml/$module" "$OUT/qml/QtQml/"
done
# GStreamer plugin .so files (webrtcbin, codecs, appsrc/appsink, videoconvert...)
for d in "$GST_PLUGIN_DIR" "/usr/lib/$TRIPLET/gstreamer-1.0" /usr/lib/gstreamer-1.0 /usr/lib64/gstreamer-1.0; do
  [[ -d "$d" ]] && cp -a "$d/." "$OUT/gst-plugins/" 2>/dev/null
done

cat > "$OUT/LiveMorph.sh" << 'RUN'
#!/usr/bin/env bash
DIR="$(cd "$(dirname "$0")" && pwd)"
export LD_LIBRARY_PATH="$DIR/lib:${LD_LIBRARY_PATH:-}"
export QT_PLUGIN_PATH="$DIR/plugins"
export QML_IMPORT_PATH="$DIR/qml"
export GST_PLUGIN_PATH="$DIR/gst-plugins"
export GST_PLUGIN_SYSTEM_PATH="$DIR/gst-plugins:${GST_PLUGIN_SYSTEM_PATH:-}"
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
MimeType=x-scheme-handler/omegarevelation;x-scheme-handler/livemorph;
EOF

# Verify the staged binary actually resolves every shared lib — a wrong Qt
# prefix or missing lib must fail HERE, not with a loader error on the target.
# Resolve against the STAGED lib dir, not the build host's system libs.
export LD_LIBRARY_PATH="$OUT/lib${LD_LIBRARY_PATH:+:$LD_LIBRARY_PATH}"
stage_runtime_dependencies() {
  local pass input deps dep name real real_name added
  for pass in 1 2 3 4 5 6; do
    added=0
    while IFS= read -r input; do
      deps="$(ldd "$input" 2>/dev/null || true)"
      if grep -q "not found" <<< "$deps"; then
        echo "ERROR: unresolved libraries for $input:" >&2
        grep "not found" <<< "$deps" >&2
        return 1
      fi
      while IFS= read -r dep; do
        [[ "$dep" == /* && -e "$dep" && "$dep" != "$OUT/"* ]] || continue
        name="${dep##*/}"
        case "$name" in
          libQt6*.so*|libgst*.so*|libgstreamer*.so*|libglib*.so*|libgobject*.so*|libgmodule*.so*|libgio*.so*|libnice*.so*|libsrtp*.so*|liborc*.so*) ;;
          *) continue ;;
        esac
        if [[ ! -e "$OUT/lib/$name" && ! -L "$OUT/lib/$name" ]]; then
          cp -a "$dep" "$OUT/lib/"
          added=1
        fi
        real="$(readlink -f "$dep")"
        real_name="${real##*/}"
        if [[ "$real" != "$OUT/"* && ! -e "$OUT/lib/$real_name" && ! -L "$OUT/lib/$real_name" ]]; then
          cp -a "$real" "$OUT/lib/"
          added=1
        fi
      done < <(awk '{if ($2 == "=>" && $3 ~ /^\//) print $3; else if ($1 ~ /^\//) print $1}' <<< "$deps")
    done < <(find "$OUT" -type f \( -name LiveMorph -o -name '*.so' -o -name '*.so.*' \) -print)
    [[ "$added" -eq 0 ]] && break
  done
}
stage_runtime_dependencies
for lib in libQt6Core.so.6 libQt6Qml.so.6 libQt6Quick.so.6 libgstreamer-1.0.so.0 libgstwebrtc-1.0.so.0; do
  [[ -e "$OUT/lib/$lib" ]] || { echo "ERROR: required runtime library missing: $lib" >&2; exit 1; }
done
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
for plug in platforms imageformats multimedia tls; do
  [[ -d "$OUT/plugins/$plug" ]] || { echo "ERROR: required Qt plugin group missing: $plug" >&2; exit 1; }
done
for module in QtQuick/Controls QtQuick/Templates QtQuick/Layouts QtQuick/Window QtQuick/Dialogs QtQuick/Shapes QtQml/Models QtQml/WorkerScript QtMultimedia; do
  [[ -d "$OUT/qml/$module" ]] || { echo "ERROR: required QML module missing: $module" >&2; exit 1; }
done
shopt -s nullglob
webrtc_plugins=("$OUT"/gst-plugins/libgstwebrtc.so "$OUT"/gst-plugins/*webrtcbin*.so)
webengine_libs=("$OUT"/lib/libQt6WebEngine*.so*)
shopt -u nullglob
[[ ${#webrtc_plugins[@]} -gt 0 ]] || { echo "ERROR: GStreamer webrtcbin plugin missing" >&2; exit 1; }
[[ ${#webengine_libs[@]} -eq 0 && ! -d "$OUT/qml/QtWebEngine" ]] || { echo "ERROR: QtWebEngine must not be packaged" >&2; exit 1; }
QT_QPA_PLATFORM=offscreen "$OUT/LiveMorph.sh" --verify-qml

echo "Staged: $OUT"
echo "Run: $OUT/LiveMorph.sh"
echo "Tip: use linuxdeploy-plugin-qt for a single AppImage."
echo "Optional: xdg-desktop-menu install $OUT/livemorph.desktop"
echo "Optional: xdg-mime default livemorph.desktop x-scheme-handler/omegarevelation"
echo "Optional: xdg-mime default livemorph.desktop x-scheme-handler/livemorph"
