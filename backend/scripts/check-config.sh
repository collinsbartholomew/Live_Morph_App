#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

PROFILE="${1:-release}"
ENV_FILE="${ENV_FILE:-${LIVEMORPH_ENV_FILE:-}}"
if [ -n "$ENV_FILE" ]; then
  [ -f "$ENV_FILE" ] || { echo "environment file not found: $ENV_FILE" >&2; exit 1; }
  export LIVEMORPH_ENV_FILE="$ENV_FILE"
fi
case "$PROFILE" in
  release)
    BIN="target/release/livemorph-backend"
    cargo build --release --locked
    ;;
  debug)
    BIN="target/debug/livemorph-backend"
    cargo build --locked
    ;;
  *)
    echo "usage: $0 [release|debug]" >&2
    exit 2
    ;;
esac

exec "$BIN" --check-config
