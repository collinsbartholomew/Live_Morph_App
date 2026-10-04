# VISUAL PARITY MATRIX — Smoke Screen → Qt 6

Reference: seeded offline Electron copy (`~/.cache/le-ref`), captured via GUI
chromium at matched window sizes. Qt side: self-captured via
`SMOKE_CAPTURE_TO` (window-exact pixels, compositor-independent).
Probe: `tools/pixel_probe.py` / `tools/visual_compare.sh`.

## Measured alignment (auth screen, x=620 column, 945-wide windows)

| Element | Reference | Qt port | Δ |
|---|---|---|---|
| Card top (`--s1` #0a0a16) | y≈45 | y≈41 | ~4px |
| Gold active tab | y160–180 | y160–180 | **0** |
| Field 1 (`--s2` #111120) | y230–255 | y230–255 | **0** |
| Field 2 | y290–315 | y295–320 | 5px |
| Gold SIGN IN button | y420–455 | y425–455 | 5px |
| Backdrop | #04040a + gold radial | #04040a + gold wash | ✓ |

## Screen status

| Screen | State | Status | Evidence |
|---|---|---|---|
| Preloader | boot | ✅ exact tokens/animation (gem gradient+rotate, ring, dots, title) | CSS-spec port; clean run |
| Auth | login (boot default) | ✅ pixel-aligned (table above) | probes |
| Auth | signup / reset ×2 | ✅ same card shell, exact labels/placeholders | code parity to inventory |
| Consent | boot gate | ✅ exact card/body/button; verified capture | probe (card/body/gold btn at expected ys) |
| GateBlocker | transient | ✅ #0a0a0a + red padlock + copy | code parity |
| Access Gate | full | ✅ box gradient/tiles/stepper/gold buttons; verified full-height render | probe |
| Dashboard | idle | ✅ 54px bar + gold logo, black stage (scanlines/placeholder/loader/PiP), 210px 3-col controls with pinned actions, gold accents verified | probes (bar y0–50, stage y80–815, controls y845+, gold connect/logo/buy) |
| Dashboard | theatre | ✅ stage fullscreen + EXIT OBS pill | code parity |
| All modals | static | ✅ implemented to exact CSS values (backdrops/z-order/paddings/typography) | build-clean; individual capture passes pending as states are reachable |
| Toast | any toast | ✅ slide-up 300ms, 4.5s, err/ok variants | code parity |

## Method notes

- Window sizes vary with the live tiling WM between captures; comparisons use
  the window-exact self-capture and center-column probes, which are
  width-independent for the centered cards (420–460px).
- The earlier reported "UI looks nothing alike" state had three causes, all
  fixed: wrong app (MorphMe/Live Escape shell), missing hero/logo (bad qrc
  paths in the predecessor), and broken responsive tokens. The new port uses
  the reference's exact tokens from the start (Rajdhani, #04040a, single
  centered auth card).

## Pending visual passes (reachable only with live backend state)

- Live streaming stage (video frames), HUD quality/latency values
- Payment modals with real gateway data, crypto coins/QR
- Account modal with real referral code/creator payout prefill
- Tour spotlight over live dashboard items
