# LiveMorph deployment guide

This is the authoritative deployment path for the Rust API, Kaggle test deployment, and Qt desktop packages.

## Release requirements

A deployment is complete only when:

- Configuration passes `livemorph-backend --check-config` without connecting to MongoDB.
- `GET /api/v1/health` returns HTTP 200 with `{"status":"ok"}` locally and through the public URL.
- The public hostname matches Google OAuth and payment callback URLs.
- Desktop packages pass the CTest suite and `LiveMorph --verify-qml`.
- Bundled Qt and GStreamer runtime checks pass.

Keep `JWT_SECRET`, `DECART_API_KEY`, OTP/payment/SMTP secrets, and Mongo credentials on the backend only. The Qt client needs only the public API base URL.

## Backend preflight

From `backend/`:

```bash
cp .env.example .env
# Fill the required values in .env.
bash scripts/check-config.sh release
```

For a named file, without shell-sourcing secrets:

```bash
ENV_FILE=.env.production bash scripts/check-config.sh release
```

`ENV_FILE` and `LIVEMORPH_ENV_FILE` are equivalent. An explicitly selected missing or malformed file is fatal. Environment variables already present in the process retain normal dotenv precedence.

Run the selected configuration in the foreground:

```bash
LIVEMORPH_ENV_FILE=.env.production ./run.sh release
```

## Local Docker development

```bash
cp backend/.env.example backend/.env
# Fill JWT_SECRET and DECART_API_KEY; keep RUST_ENV=development.
docker compose up -d --build
docker compose ps
curl -fsS http://127.0.0.1:3874/api/v1/health
```

The Compose file supplies `mongodb://mongo:27017` to the API container and publishes MongoDB and the API on loopback only. Do not pass `--env-file backend/.env` for this local stack: its example Mongo URI is host-loopback, not the Compose service name.

## Production Docker

```bash
cp backend/.env.production.template backend/.env.production
# Replace every placeholder with real production values.
cd backend && ENV_FILE=.env.production bash scripts/check-config.sh release && cd ..
LIVEMORPH_BACKEND_ENV_FILE=./backend/.env.production \
  docker compose --env-file backend/.env.production up -d --build
```

Production requires, among other checks:

- `RUST_ENV=production`, a real 32+ character `JWT_SECRET`, and 16+ character `OTP_PEPPER`.
- HTTPS `PUBLIC_BASE_URL`, WSS Decart signaling, and TLS-enabled MongoDB.
- `ALLOW_MANUAL_PAYMENTS=false`, `ALLOW_CREDITS_ADJUST=false`, and `LOG_OTP_CODES=false`.
- Distinct primary and secondary databases.
- Complete OAuth and SMTP settings when those features are enabled.

The API remains bound to host loopback by default for a reverse proxy. Terminate TLS at that proxy and forward HTTP and WebSocket upgrades to `127.0.0.1:3874`. Set `MULTI_INSTANCE=1` on every replica when more than one API process shares the databases.

URL-encode MongoDB usernames and passwords. When Compose consumes an env file, escape every literal dollar sign as `$$` so it is preserved instead of interpolated.

Useful operations:

```bash
docker compose logs --tail=200 api
docker compose restart api
curl -fsS https://api.yourdomain.com/api/v1/health
```

## Kaggle backend deployment

`deploy_kaggle.py` is intentionally gitignored because its `ENV_VARS` contains real testing credentials. Keep those values intact, store the script outside the cloned repository, and do not publish it.

Add these Kaggle Secrets:

- `NGROK_AUTH_TOKEN`
- `GITHUB_TOKEN` when the repository is private

The Google OAuth redirect in `ENV_VARS` must use the reserved ngrok hostname, and that exact redirect must be registered in Google Cloud Console. Configure the Paystack webhook as:

```text
https://YOUR_RESERVED_DOMAIN/api/v1/payments/webhook/paystack
```

Run the non-mutating static check, then deploy:

```bash
python3 deploy_kaggle.py --check
python3 deploy_kaggle.py
```

The script installs missing dependencies, builds with the locked Rust toolchain, validates the backend config, checks local and public health, provisions the test admin, and only then prints `DEPLOYMENT COMPLETE`. It does not silently fall back to a random ngrok domain. If the reserved domain or credentials are invalid, deployment stops with an actionable error.

The monitor checks backend and tunnel health, repairs interruptions, and deploys new commits. Updates build before stopping the service and retain a rollback binary. A commit that fails runtime health is paused instead of repeatedly causing outages; push a fixed commit or rerun after inspection.

Options:

```bash
python3 deploy_kaggle.py --no-update
REQUIRE_PUBLIC_TUNNEL=0 python3 deploy_kaggle.py --no-update
```

`REQUIRE_PUBLIC_TUNNEL=0` is for local testing only and cannot make a remote Qt client reach Kaggle localhost.

## Qt frontend release build

Install Qt 6.5+ with Multimedia, WebSockets, Svg, Test, and LinguistTools, plus a C++20 compiler and GStreamer development packages including WebRTC, nice, and srtp.

```bash
cd apps/livemorph
cp .env.example .env
# Set LIVEMORPH_API_URL to the public HTTPS backend origin, then compile.
./build.sh
```

Compilation fails if the env file is missing or its API URL is invalid. The configured origin is injected at configure time instead of relying on a hardcoded local fallback. The default Release build runs the CTest suite and headless QML verification. Optional settings:

```bash
CMAKE_PREFIX_PATH=/path/to/Qt/6.x ./build.sh
LIVEMORPH_ENV_FILE=/secure/path/frontend.env ./build.sh
BUILD_DIR=build-release BUILD_TYPE=Release ./build.sh
VERIFY=0 ./build.sh
```

Explicit Settings choices can override the compiled origin, and `LIVEMORPH_API_URL` can override it at process launch. Legacy localhost settings without an explicit user-choice marker cannot override the env origin. Do not embed backend secrets in the application.

## Desktop packaging

Linux:

```bash
cd apps/livemorph
./packaging/deploy-linux.sh build/bin/LiveMorph
./build/bin/dist/LiveMorph.sh --verify-qml
```

The output is `build/bin/dist/`. The script discovers Qt through `qmake` and GStreamer through `pkg-config`, rejects missing libraries or QML modules, and verifies the staged launcher.

macOS:

```bash
cd apps/livemorph
QTDIR=/path/to/Qt/6.x ./packaging/deploy-macos.sh build/bin/LiveMorph.app
```

The DMG is written beside the `.app`. Target Macs must install the full GStreamer runtime with WebRTC plugins.

Windows, from `apps/livemorph` in the Qt/GStreamer developer shell:

```powershell
.\packaging\deploy-windows.ps1 -BuildDir build\bin -QtDir C:\Qt\6.x\msvc2022_64 -GstDir C:\gstreamer\1.0\msvc_x86_64
```

Ship the entire directory containing `LiveMorph.exe` and launch through `LiveMorph.bat`. `-AllowSystemGStreamer` is an explicit alternative that requires the full runtime on every target machine.

All installers register `omegarevelation://`; legacy `livemorph://` callbacks are also registered for compatibility.

## Full verification

From the repository root:

```bash
bash verify.sh
```

Additional release checks:

```bash
cd backend && cargo test && ENV_FILE=.env.production bash scripts/check-config.sh release
python3 deploy_kaggle.py --check
```

External services cannot be preflighted offline completely. Valid provider credentials, DNS/TLS, Mongo access, the reserved ngrok domain, and provider dashboard callback settings must be correct at deployment time.
