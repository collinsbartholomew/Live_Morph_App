#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="${ROOT}/build"

mkdir -p "${BUILD_DIR}"
cd "${BUILD_DIR}"

# Adjust CMAKE_PREFIX_PATH if Qt is not in default location
cmake_args=(.. -DCMAKE_BUILD_TYPE=Release)
if [ -n "${CMAKE_PREFIX_PATH:-}" ]; then
  cmake_args+=(-DCMAKE_PREFIX_PATH="$CMAKE_PREFIX_PATH")
fi
cmake "${cmake_args[@]}"

cmake --build . -j"$(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 4)"

echo ""
echo "Build complete. Run:"
echo "  ${BUILD_DIR}/bin/LiveMorph"
echo "Headless UI check: ${BUILD_DIR}/bin/LiveMorph --verify-qml"
if [ -x "${BUILD_DIR}/bin/LiveMorph_smoke_test" ]; then
  echo "Smoke test:        QT_QPA_PLATFORM=offscreen ${BUILD_DIR}/bin/LiveMorph_smoke_test"
fi
