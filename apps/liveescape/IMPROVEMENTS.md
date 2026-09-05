# Improvements vs original Electron app

## Closed gaps
- Tutorials: full tabbed guides (START / OBS / FACE / PROMPT / PAY)
- Account: creator program, referral copy, earned credits, upgrade/logout
- Checkout: USD + estimated NGN, clear payment explanation
- Payments: in-app WebEngine, atomic fulfillment, Decart platform float
- Connection quality + latency HUD on dashboard
- Tour: 13-step product tour

## Production / future-proof
- Docker Compose (Mongo + backend)
- GitHub Actions backend `cargo check`
- SECURITY.md runbook
- Rate limit, CORS allow-list, security headers
- Idempotent order fulfillment (no double credit)

## Still operator-dependent
- Qt WebEngine on the build machine for full AI pixels + in-app pay
- Real secrets and TLS reverse proxy
- Keep platform Decart float funded after dashboard top-ups
