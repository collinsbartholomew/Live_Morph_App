# Virtual camera: what the excluded “kernel driver” would do

## What you have today (supported)

LiveMorph (like the original Electron helper) exposes morph/camera frames as a **local MJPEG HTTP stream**, e.g.:

`http://127.0.0.1:4789/` (or `/stream`)

Apps such as **OBS** add a **Browser Source** or media source pointed at that URL. On Linux you can optionally feed **v4l2loopback** if the module is installed by the user.

That is enough for streaming and many capture workflows **without** admin rights or a signed driver.

## What a “kernel virtual camera driver” would add

A **kernel VCam driver** (examples: custom DirectShow/AVFoundation plugin, or a Windows driver that appears as “LiveMorph Camera” in Zoom/Teams/Chrome’s camera list) would:

1. Register a **fake webcam device** at the OS level.
2. Accept frames from LiveMorph and present them as if they came from a USB camera.
3. Let **any** app that only lists webcams (Zoom, Meet, Discord, browsers) pick “LiveMorph” **without** OBS.

### Why it was excluded (same as original practical path)

| Issue | Detail |
|-------|--------|
| **OS signing** | Windows requires driver signing / attestation; macOS has strict system extensions. |
| **Install friction** | Often needs reboot, admin password, enterprise policy blocks. |
| **Maintenance** | Separate binaries per OS version; high support cost. |
| **Original app** | MorphMe also relied on **MJPEG + OBS** (and similar helpers), not a shipped kernel webcam. |

So exclusion is **intentional parity with the original’s supported path**, not a missing feature relative to MorphMe’s production helper model.

### If you add it later

Treat it as an **optional installer component**: Windows virtual camera SDK / DirectShow filter, macOS camera extension, Linux `v4l2loopback` + automount — not required for LiveMorph core.
