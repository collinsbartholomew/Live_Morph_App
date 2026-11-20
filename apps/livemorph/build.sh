#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="${BUILD_DIR:-${ROOT}/build}"
case "$BUILD_DIR" in
  /*) ;;
  *) BUILD_DIR="${ROOT}/${BUILD_DIR}" ;;
esac
BUILD_TYPE="${BUILD_TYPE:-Release}"
VERIFY="${VERIFY:-1}"
JOBS="${JOBS:-$(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 4)}"
LIVEMORPH_ENV_FILE="${LIVEMORPH_ENV_FILE:-${ROOT}/.env}"
case "$LIVEMORPH_ENV_FILE" in
  /*) ;;
  *) LIVEMORPH_ENV_FILE="${ROOT}/${LIVEMORPH_ENV_FILE}" ;;
esac
[ -f "$LIVEMORPH_ENV_FILE" ] || { echo "Missing $LIVEMORPH_ENV_FILE. Copy .env.example to .env and set LIVEMORPH_API_URL before compiling." >&2; exit 1; }

command -v cmake >/dev/null 2>&1 || { echo "cmake is required" >&2; exit 1; }
cmake_args=(-S "$ROOT" -B "$BUILD_DIR" -DCMAKE_BUILD_TYPE="$BUILD_TYPE" -DLIVEMORPH_ENV_FILE="$LIVEMORPH_ENV_FILE")
if [ -n "${CMAKE_PREFIX_PATH:-}" ]; then
  cmake_args+=(-DCMAKE_PREFIX_PATH="$CMAKE_PREFIX_PATH")
fi
cmake "${cmake_args[@]}"
cmake --build "$BUILD_DIR" --parallel "$JOBS"

APP_BIN="$BUILD_DIR/bin/LiveMorph"
if [ -x "$BUILD_DIR/bin/LiveMorph.app/Contents/MacOS/LiveMorph" ]; then
  APP_BIN="$BUILD_DIR/bin/LiveMorph.app/Contents/MacOS/LiveMorph"
fi
if [ "$VERIFY" = "1" ]; then
  if [ -f "$BUILD_DIR/CTestTestfile.cmake" ]; then
    ctest --test-dir "$BUILD_DIR" --output-on-failure
  elif [ -x "$BUILD_DIR/bin/LiveMorph_smoke_test" ]; then
    QT_QPA_PLATFORM=offscreen "$BUILD_DIR/bin/LiveMorph_smoke_test"
  fi
  [ -x "$APP_BIN" ] || { echo "LiveMorph binary not found under $BUILD_DIR/bin" >&2; exit 1; }
  "$APP_BIN" --verify-qml
fi

echo ""
echo "Build complete: $APP_BIN"
echo "Set VERIFY=0 to skip smoke and QML checks on subsequent local builds."
