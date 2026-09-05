# Performance notes (2026-08-29)

## LiveMorph
- Camera frames capped ~30 FPS; drop if previous frame still queued (no backlog)
- Single image move to UI thread (no double `.copy()`)
- Frame fan-out skipped when MJPEG/VCam/recording all idle
- MJPEG JPEG quality 65, 30 FPS cap, slow-client backpressure
- Backend reachability ping every 15s (was 5s)
- Recording elapsed UI timer 2 Hz (was 5 Hz)

## LiveEscape
- Payment status poll every 6s while in-flight (was 4s)
- WS reconnect exponential backoff (prior)

## Backend
- Shared `reqwest::Client` connection pool for Paystack/NOWPayments/Google
- Balance WebSocket: 10s tick, emit only when balance changes; config nudge ~30s
- `resolve_model` avoids allocating a HashSet on every call

## Operator tips
- Prefer OBS Browser Source on MJPEG URL rather than high-res local encode
- Keep concurrent morph sessions at 1 (`MAX_CONCURRENT_SESSIONS`)
- Mongo indexes on `user_id`, payment `_id`, OTP email already expected via app usage patterns
