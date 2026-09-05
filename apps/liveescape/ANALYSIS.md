# LiveEscape — gap closure & production hardening

## Hardened this pass

### Payments
- Configurable `USD_NGN_RATE` (default 1600) via `Config::amount_minor_units` / `amount_major_units`
- Paystack + Flutterwave init paths use shared FX helpers (no hardcoded 1600)
- Paystack webhook: mark `paid` before `fulfill_paid_order`; store provider amount/currency
- Flutterwave webhook: require `FLUTTERWAVE_SECRET_HASH` / `verif-hash` in production
- Order metadata includes `amount_usd` + `fx_rate` for reconciliation

### Recording (single path)
- Prefer QML `MediaRecorder` MP4; notify C++ with purpose `"mp4"` to cancel PNG timer
- PNG sequence only starts after 2s if no MP4 path
- Valid JSON `recording.json` sidecar + ffmpeg hint
- Snap / freeze remain real `grabToImage` paths

### WebEngine / AI pixels
- Peer page: optional TURN (`turn_urls` / `turn_user` / `turn_cred`)
- `skip_local=1` so WebEngine does not open a second camera (QML owns capture)
- Client env: `LIVEESCAPE_TURN_URLS`, `LIVEESCAPE_TURN_USER`, `LIVEESCAPE_TURN_CRED`

## Qt 6 posture
- CMake Qt 6.5+, versionless QML, modern Multimedia / WebSockets
- WebEngine optional (`SS_HAS_WEBENGINE`)

## Ops checklist
```
PAYSTACK_SECRET_KEY=...
PAYSTACK_WEBHOOK_SECRET=...   # preferred over secret key for HMAC
PAYSTACK_CURRENCY=NGN
USD_NGN_RATE=1600             # update with market rate
PUBLIC_BASE_URL=https://api.yourdomain.com
FLUTTERWAVE_SECRET_HASH=...   # required in production if using FLW
LIVEESCAPE_TURN_URLS=turn:turn.example.com:3478
LIVEESCAPE_TURN_USER=...
LIVEESCAPE_TURN_CRED=...
```

## Remaining limits
- AI remote video still needs a WebEngine-linked build + working ICE (TURN recommended)
- MediaRecorder may not capture WebEngine pixels on all platforms (PNG fallback remains)
- Keep Decart platform float funded after top-ups
