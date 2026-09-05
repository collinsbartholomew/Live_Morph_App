# Bundle LiveMorph + Qt runtime (including WebEngine) for Windows.
# Usage (from LiveMorphQt after Release build):
#   .\packaging\deploy-windows.ps1 -BuildDir build\Release -QtDir C:\Qt\6.7.0\msvc2019_64

param(
    [string]$BuildDir = "build/Release",
    [string]$QtDir = $env:QTDIR
)

$ErrorActionPreference = "Stop"
if (-not $QtDir) { throw "Set -QtDir or QTDIR to your Qt 6 kit (must include WebEngine)" }

$exe = Join-Path $BuildDir "LiveMorph.exe"
if (-not (Test-Path $exe)) { throw "Missing $exe — build Release first" }

$windeploy = Join-Path $QtDir "bin\windeployqt.exe"
& $windeploy --release --qmldir (Join-Path $PSScriptRoot "..\qml") --compiler-runtime $exe

# Ensure WebEngine process + resources are present
$weProcess = Join-Path $BuildDir "QtWebEngineProcess.exe"
if (-not (Test-Path $weProcess)) {
    Write-Warning "QtWebEngineProcess.exe not found — rebuild with Qt WebEngine and re-run windeployqt"
} else {
    Write-Host "WebEngine process present."
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


# Register livemorph:// protocol for current user (Google OAuth return)
$exePath = (Resolve-Path $exe).Path
$reg = "HKCU:\Software\Classes\livemorph"
New-Item -Path $reg -Force | Out-Null
Set-ItemProperty -Path $reg -Name "(default)" -Value "URL:LiveMorph Protocol"
Set-ItemProperty -Path $reg -Name "URL Protocol" -Value ""
New-Item -Path "$reg\shell\open\command" -Force | Out-Null
Set-ItemProperty -Path "$reg\shell\open\command" -Name "(default)" -Value "`"$exePath`" `"%1`""
Write-Host "Registered livemorph:// protocol for current user."
