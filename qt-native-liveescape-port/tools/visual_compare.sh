#!/usr/bin/env bash
# Visual regression: capture the Qt port and the Electron reference at the
# same window size and compare element positions pixel-by-pixel.
#
# Usage: tools/visual_compare.sh [qt|electron|both|probe]
#   qt       — launch Qt in capture mode and grab ~/.cache/le-shots/qt.png
#   electron — ensure the seeded chromium reference is up and grab .../electron.png
#   both     — do both, then print the alignment probe
#   probe    — only print the alignment probe from existing captures
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SHOTS="$HOME/.cache/le-shots"
mkdir -p "$SHOTS"

launch_qt() {
  systemctl --user stop smoke-qt 2>/dev/null
  sleep 1
  systemd-run --user --unit=smoke-qt \
    --setenv=DISPLAY=:0 --setenv=QT_QPA_PLATFORM=xcb --setenv=HOME="$HOME" \
    --setenv=XDG_RUNTIME_DIR=/run/user/1000 \
    --setenv=SMOKE_API_URL=http://127.0.0.1:3874 --setenv=SMOKE_NO_MAXIMIZE=1 \
    "$ROOT/build/bin/smokescreen-qt" >/dev/null 2>&1
  sleep 6
  capture_window "Smoke Screen" "$SHOTS/qt.png"
}

ensure_electron() {
  if ! pgrep -f "[c]hrome-gui" >/dev/null; then
    systemd-run --user --unit=ele-ref \
      --setenv=DISPLAY=:0 --setenv=HOME="$HOME" \
      --setenv=XDG_RUNTIME_DIR=/run/user/1000 \
      --setenv=XDG_CONFIG_HOME="$HOME/.config" --setenv=XDG_CACHE_HOME="$HOME/.cache" \
      chromium --app="file://$HOME/.cache/le-ref/_seed.html" \
      --user-data-dir="$HOME/.cache/le-chrome-profile" --no-first-run \
      --disable-web-security --allow-file-access-from-files >/dev/null 2>&1
    sleep 10
  fi
  capture_window "Smoke Screen" "$SHOTS/electron.png"
}

capture_window() {                     # $1 = title prefix, $2 = output png
  local geo
  geo=$(hyprctl clients -j 2>/dev/null | python3 - "$1" <<'PY'
import json,sys
prefix=sys.argv[1]
for c in json.load(sys.stdin):
    t=c.get('title','')
    if t.startswith(prefix) and 'Chromium' not in t:
        print(f"{c['at'][0]} {c['at'][1]} {c['size'][0]} {c['size'][1]} {c['workspace']['id']}")
        break
PY
)
  [ -z "$geo" ] && { echo "window '$1' not found"; return 1; }
  read -r X Y W H WS <<<"$geo"
  hyprctl dispatch workspace "$WS" >/dev/null 2>&1
  sleep 1
  grim -o eDP-1 "$SHOTS/_full.png"
  magick "$SHOTS/_full.png" -crop "${W}x${H}+${X}+${Y}" +repage "$2"
  echo "captured $2 (${W}x${H})"
}

probe() {                              # element alignment probe at x=620
  local E="$SHOTS/electron.png" Q="$SHOTS/qt.png"
  [ -f "$E" ] || { echo "missing $E"; return 1; }
  [ -f "$Q" ] || { echo "missing $Q"; return 1; }
  for pair in "ELECTRON:$E" "QT:$Q"; do
    local label="${pair%%:*}" img="${pair#*:}"
    echo "--- $label ($(magick identify -format '%wx%h' "$img")) ---"
    echo -n "  s2 fields:"
    for y in $(seq 180 5 500); do
      c=$(magick "$img" -format "%[fx:int(255*p.r)] %[fx:int(255*p.g)] %[fx:int(255*p.b)]" -crop "1x1+620+$y" +repage info: 2>/dev/null)
      set -- $c
      if [ "${1:-0}" -ge 14 ] && [ "${1:-0}" -le 20 ] && [ "${3:-0}" -ge 28 ] && [ "${3:-0}" -le 36 ]; then echo -n " $y"; fi
    done
    echo ""
    echo -n "  gold rows:"
    for y in $(seq 100 5 600); do
      c=$(magick "$img" -format "%[fx:int(255*p.r)] %[fx:int(255*p.g)] %[fx:int(255*p.b)]" -crop "1x1+620+$y" +repage info: 2>/dev/null)
      set -- $c
      if [ "${1:-0}" -ge 180 ] && [ "${2:-0}" -ge 140 ]; then echo -n " $y"; fi
    done
    echo ""
  done
}

case "${1:-both}" in
  qt) launch_qt ;;
  electron) ensure_electron ;;
  probe) probe ;;
  both) launch_qt; ensure_electron; probe ;;
  *) echo "usage: $0 [qt|electron|both|probe]"; exit 2 ;;
esac
