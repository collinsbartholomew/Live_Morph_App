# OBS Virtual Camera integration (LiveMorph)

## Supported path (all platforms)

1. **LiveMorph** → Settings → **Start for OBS** (starts local MJPEG `http://127.0.0.1:<port>/stream`).
2. **Copy OBS URL** and paste into OBS → Sources → **Browser**.
3. OBS → **Start Virtual Camera**.
4. Zoom / Teams / Meet / Discord → camera **OBS Virtual Camera**.

Camera frames are already pushed from the LiveMorph camera pipeline into `StreamServer` when the camera is running.

## API (`VirtualCamera` in QML)

| Method / property | Purpose |
|-------------------|---------|
| `startForObs()` | Start MJPEG feed for OBS |
| `copyObsUrl()` | Clipboard ← Browser Source URL |
| `tryLaunchObs()` | Launch OBS if installed |
| `openObsDownloadPage()` | https://obsproject.com/download |
| `obsBrowserSourceUrl` | Current/expected URL |
| `obsInstalled` / `obsInstallPath` | Detection |
| `setupSteps` | Numbered UX steps |
| `platformHint` | OS-specific tip |

## Linux note

OBS Virtual Camera needs **v4l2loopback**. LiveMorph also detects loopback devices when present.

## Not included

Custom signed kernel webcam drivers. OBS’s virtual camera is the maintained open-source standard.
