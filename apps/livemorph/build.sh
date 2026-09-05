#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="${ROOT}/build"

mkdir -p "${BUILD_DIR}"
cd "${BUILD_DIR}"

# Adjust CMAKE_PREFIX_PATH if Qt is not in default location
cmake .. \
  -DCMAKE_BUILD_TYPE=Release \
  ${CMAKE_PREFIX_PATH:+-DCMAKE_PREFIX_PATH="$CMAKE_PREFIX_PATH"}

cmake --build . -j"$(nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 4)"

echo ""
echo "Build complete. Run:"
echo "  ${BUILD_DIR}/LiveMorph"
