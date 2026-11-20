#!/usr/bin/env bash
# Run the LiveMorph backend in the foreground with all logs on stdout.
# Usage:
#   ./run.sh              # debug build (target/debug/livemorph-backend)
#   ./run.sh release      # release build (target/release/livemorph-backend)
# Env: .env in this directory is loaded automatically by the backend (dotenvy).
# Override anything inline, e.g.:  AUTH_MAX_ATTEMPTS=500 ./run.sh
set -euo pipefail
cd "$(dirname "$0")"

PROFILE="${1:-debug}"
if [ "$#" -gt 0 ]; then
    shift
fi
if [ "$PROFILE" = "release" ]; then
    BIN="target/release/livemorph-backend"
elif [ "$PROFILE" = "debug" ]; then
    BIN="target/debug/livemorph-backend"
else
    echo "profile must be 'debug' or 'release', got: $PROFILE" >&2
    exit 2
fi

if [ ! -x "$BIN" ]; then
    echo "binary $BIN not found — building ($PROFILE)..." >&2
    if [ "$PROFILE" = "release" ]; then
        cargo build --release
    else
        cargo build
    fi
fi

echo "starting $BIN (Ctrl-C to stop, logs stream below)" >&2
exec "$BIN" "$@"
