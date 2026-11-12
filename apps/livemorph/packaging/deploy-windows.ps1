# Bundle LiveMorph + Qt/GStreamer runtime for Windows.
# (The app no longer uses Qt WebEngine — media is GStreamer webrtcbin.)
# Usage (from apps/livemorph after a Release build):
#   .\packaging\deploy-windows.ps1 -BuildDir build\bin\Release -QtDir C:\Qt\6.12.0\msvc2022_64

param(
    [string]$BuildDir = "build/bin/Release",
    [string]$QtDir = $env:QTDIR,
    [string]$GstDir = $env:GSTREAMER_1_0_ROOT_MSVC_X86_64
)

$ErrorActionPreference = "Stop"
if (-not $QtDir) { throw "Set -QtDir or QTDIR to your Qt 6 kit" }

# Multi-config generators append the config to the runtime output dir.
$exe = Join-Path $BuildDir "LiveMorph.exe"
if (-not (Test-Path $exe)) {
    # Only append bin\Release when BuildDir isn't already a multi-config output dir.
    if ($BuildDir -notmatch 'bin[\\/]Release$') {
        $alt = Join-Path $BuildDir "bin\Release\LiveMorph.exe"
        if (Test-Path $alt) { $exe = $alt }
    }
    if (-not (Test-Path $exe)) { throw "Missing LiveMorph.exe under $BuildDir — build Release first (try build\bin\Release)" }
}

$windeploy = Join-Path $QtDir "bin\windeployqt.exe"
& $windeploy --release --qmldir (Join-Path $PSScriptRoot "..\qml") --compiler-runtime $exe

# GStreamer runtime: the exe links gstreamer-1.0.dll, gstwebrtc-1.0.dll etc.,
# which windeployqt does NOT bundle — copy the MSVC runtime + plugins.
if ($GstDir) {
    Copy-Item "$GstDir\bin\*.dll" (Split-Path $exe) -ErrorAction SilentlyContinue
    $gstPlugins = Join-Path (Split-Path $exe) "gst-plugins"
    New-Item -ItemType Directory -Force -Path $gstPlugins | Out-Null
    Copy-Item "$GstDir\lib\gstreamer-1.0\*.dll" $gstPlugins -ErrorAction SilentlyContinue
    $launcher = Join-Path (Split-Path $exe) "LiveMorph.bat"
    @"
@echo off
if defined GST_PLUGIN_SYSTEM_PATH (
  set "GST_PLUGIN_SYSTEM_PATH=%~dp0gst-plugins;%GST_PLUGIN_SYSTEM_PATH%"
) else (
  set "GST_PLUGIN_SYSTEM_PATH=%~dp0gst-plugins"
)
start "" "%~dp0LiveMorph.exe" %*
"@ | Set-Content $launcher
    Write-Host "GStreamer runtime staged from $GstDir (launcher: LiveMorph.bat)"
} else {
    Write-Warning "GSTREAMER_1_0_ROOT_MSVC_X86_64 not set — GStreamer DLLs NOT bundled; the packaged app needs GStreamer installed."
}

# Copy i18n .qm if any
$i18nSrc = Join-Path $PSScriptRoot "..\i18n"
$i18nDst = Join-Path $BuildDir "i18n"
if (Test-Path $i18nSrc) {
    New-Item -ItemType Directory -Force -Path $i18nDst | Out-Null
    Copy-Item (Join-Path $i18nSrc "*.qm") $i18nDst -ErrorAction SilentlyContinue
}

Write-Host "Done. Ship the entire folder: $BuildDir"
Write-Host "Optional: wrap with Inno Setup / NSIS for an installer."

# NOTE: the livemorph:// protocol is registered at INSTALL time by the NSIS
# installer (see CPACK_NSIS_EXTRA_INSTALL_COMMANDS in CMakeLists.txt), NOT here —
# writing HKCU from the build machine would be a side effect on the dev host and
# would never reach end users. Do not re-add registry writes in this script.
