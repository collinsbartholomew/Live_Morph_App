#!/usr/bin/env bash
# deploy-linux.sh — Package LiveMorph for Linux distribution
# Usage: ./deploy-linux.sh [--appimage]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BUILD_DIR="${SCRIPT_DIR}/build-release"
APPIMAGE="${1:-}"

echo "=== LiveMorph Linux Deploy ==="

# 1. Ensure release build exists
if [ ! -f "${BUILD_DIR}/bin/LiveMorph" ]; then
    echo "→ Building Release..."
    cmake --preset release -S "${SCRIPT_DIR}"
    cmake --build --preset release -j"$(nproc)"
fi

# 2. Install to staging
STAGING="${BUILD_DIR}/_staging"
rm -rf "${STAGING}"
cmake --install "${BUILD_DIR}" --prefix "${STAGING}/usr"

# 3. Copy desktop file and icon
mkdir -p "${STAGING}/usr/share/applications"
cp "${SCRIPT_DIR}/packaging/livemorph.desktop" "${STAGING}/usr/share/applications/"

# Icon is installed by CMake (install rule in CMakeLists.txt); this copy is a
# fallback for older build dirs.
ICON_SRC="${SCRIPT_DIR}/resources/assets/livemorph-icon.png"
if [ -f "${ICON_SRC}" ] && [ ! -f "${STAGING}/usr/share/icons/hicolor/256x256/apps/livemorph.png" ]; then
    mkdir -p "${STAGING}/usr/share/icons/hicolor/256x256/apps"
    cp "${ICON_SRC}" "${STAGING}/usr/share/icons/hicolor/256x256/apps/livemorph.png"
fi

echo "→ Staged to ${STAGING}"

# 4. Optional AppImage via linuxdeploy
if [ "${APPIMAGE}" = "--appimage" ]; then
    if command -v linuxdeploy &>/dev/null; then
        echo "→ Creating AppImage..."
        linuxdeploy \
            --appdir "${STAGING}" \
            --desktop-file "${STAGING}/usr/share/applications/livemorph.desktop" \
            --icon-file "${STAGING}/usr/share/icons/hicolor/256x256/apps/livemorph.png" \
            --output appimage
        echo "→ AppImage created"
    else
        echo "⚠ linuxdeploy not found — install from https://github.com/linuxdeploy/linuxdeploy"
        echo "  Then run: linuxdeploy --appdir ${STAGING} --desktop-file ... --output appimage"
    fi
fi

# 5. Create tarball
echo "→ Creating release tarball..."
cd "${BUILD_DIR}"
VERSION="$(grep -m1 'project(LiveMorph VERSION' "${SCRIPT_DIR}/CMakeLists.txt" | sed -E 's/.*VERSION ([0-9.]+).*/\1/')"
tar czf "LiveMorph-${VERSION:-1.8.0}-linux.tar.gz" -C _staging .
echo "→ Tarball: ${BUILD_DIR}/LiveMorph-*-linux.tar.gz"

echo "=== Deploy complete ==="
