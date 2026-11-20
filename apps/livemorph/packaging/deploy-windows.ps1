# Bundle LiveMorph + Qt/GStreamer runtime for Windows.
# (The app no longer uses Qt WebEngine — media is GStreamer webrtcbin.)
# Usage (from apps/livemorph after a Release build):
#   .\packaging\deploy-windows.ps1 -QtDir C:\Qt\6.12.0\msvc2022_64
# (-BuildDir defaults to build\bin, the single-config output dir)

param(
    [string]$BuildDir = "",
    [string]$QtDir = $env:QTDIR,
    [string]$GstDir = $env:GSTREAMER_1_0_ROOT_MSVC_X86_64,
    [switch]$AllowSystemGStreamer
)

$ErrorActionPreference = "Stop"
if (-not $BuildDir) { $BuildDir = Join-Path $PSScriptRoot "..\build\bin" }
if (-not $QtDir) { throw "Set -QtDir or QTDIR to your Qt 6 kit" }

# Multi-config generators (VS) append the config to the runtime output dir
# (build\bin\Release); single-config generators (Ninja/MinGW) put the exe
# directly in build\bin. Probe all candidates.
$exe = $null
foreach ($cand in @(
    (Join-Path $BuildDir "LiveMorph.exe"),
    (Join-Path $BuildDir "bin\Release\LiveMorph.exe"),
    "build\bin\LiveMorph.exe",
    "build\bin\Release\LiveMorph.exe"
)) {
    if (Test-Path $cand) { $exe = $cand; break }
}
if (-not $exe) { throw "Missing LiveMorph.exe — build Release first (looked under '$BuildDir', build\bin, build\bin\Release)" }
$exe = (Resolve-Path $exe).Path
$exeDir = Split-Path $exe

$windeploy = Join-Path $QtDir "bin\windeployqt.exe"
if (-not (Test-Path $windeploy -PathType Leaf)) { throw "windeployqt.exe not found at $windeploy" }
& $windeploy --release --qmldir (Join-Path $PSScriptRoot "..\qml") --compiler-runtime $exe
if ($LASTEXITCODE -ne 0) { throw "windeployqt failed with exit code $LASTEXITCODE" }

# GStreamer runtime: the exe links gstreamer-1.0.dll, gstwebrtc-1.0.dll etc.,
# which windeployqt does NOT bundle — copy the MSVC runtime + plugins.
if ($GstDir) {
    $gstBin = Join-Path $GstDir "bin"
    $gstPluginSource = Join-Path $GstDir "lib\gstreamer-1.0"
    if (-not (Test-Path $gstBin -PathType Container)) { throw "GStreamer bin directory not found: $gstBin" }
    if (-not (Test-Path $gstPluginSource -PathType Container)) { throw "GStreamer plugin directory not found: $gstPluginSource" }
    Copy-Item "$gstBin\*.dll" $exeDir
    $gstPlugins = Join-Path $exeDir "gst-plugins"
    if (Test-Path $gstPlugins) { Remove-Item $gstPlugins -Recurse -Force }
    New-Item -ItemType Directory -Force -Path $gstPlugins | Out-Null
    Copy-Item "$gstPluginSource\*.dll" $gstPlugins
    $webrtcPlugin = Get-ChildItem $gstPlugins -Filter "*webrtc*.dll" | Where-Object { $_.Name -notmatch "dsp" } | Select-Object -First 1
    if (-not $webrtcPlugin) { throw "GStreamer WebRTC plugin was not staged from $gstPluginSource" }
    $launcher = Join-Path $exeDir "LiveMorph.bat"
    @"
@echo off
if defined GST_PLUGIN_SYSTEM_PATH_1_0 (
  set "GST_PLUGIN_SYSTEM_PATH_1_0=%~dp0gst-plugins;%GST_PLUGIN_SYSTEM_PATH_1_0%"
) else (
  set "GST_PLUGIN_SYSTEM_PATH_1_0=%~dp0gst-plugins"
)
set "GST_PLUGIN_PATH_1_0=%~dp0gst-plugins"
start "" "%~dp0LiveMorph.exe" %*
"@ | Set-Content $launcher
    $env:GST_PLUGIN_SYSTEM_PATH_1_0 = $gstPlugins
    $env:GST_PLUGIN_PATH_1_0 = $gstPlugins
    & $exe --verify-qml
    if ($LASTEXITCODE -ne 0) { throw "Packaged app failed QML verification with exit code $LASTEXITCODE" }
    Write-Host "GStreamer runtime staged from $GstDir (launcher: LiveMorph.bat)"
} elseif (-not $AllowSystemGStreamer) {
    throw "Set -GstDir or GSTREAMER_1_0_ROOT_MSVC_X86_64, or explicitly use -AllowSystemGStreamer"
} else {
    Write-Warning "GStreamer DLLs are not bundled; target machines must install the full GStreamer MSVC runtime."
    & $exe --verify-qml
    if ($LASTEXITCODE -ne 0) { throw "Packaged app failed QML verification with exit code $LASTEXITCODE" }
}

# Translations ship inside the binary (embedded livemorph_en.ts catalog +
# online runtime translation) — there are no .qm files to stage.

Write-Host "Done. Ship the entire folder: $exeDir"
Write-Host "Optional: wrap with Inno Setup / NSIS for an installer."

# NOTE: the omegarevelation:// protocol is registered at INSTALL time by the NSIS
# installer (see CPACK_NSIS_EXTRA_INSTALL_COMMANDS in CMakeLists.txt), NOT here —
# writing HKCU from the build machine would be a side effect on the dev host and
# would never reach end users. Do not re-add registry writes in this script.
