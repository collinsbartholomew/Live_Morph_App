#!/usr/bin/env bash
# =============================================================================
# LiveMorph Platform — Unified Verification Gate
# Runs: backend unit + hardening tests, live integration suite, endpoint smoke.
# Usage: bash verify.sh [--quick]   (--quick skips a fresh build)
# =============================================================================
set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$ROOT/backend"
BASE="${BASE:-http://127.0.0.1:3874}"
QUICK="${QUICK:-}"
if [[ "${1:-}" == "--quick" ]]; then QUICK=1; fi

GREEN='\033[0;32m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'
FAILED=0

step() { echo -e "\n${CYAN}════ $1 ════${NC}"; }
ok()   { echo -e "  ${GREEN}✓${NC} $1"; }
bad()  { echo -e "  ${RED}✗${NC} $1"; FAILED=1; }

APP_DIR="$ROOT/apps/livemorph"

step "1/5 Backend build (cargo check)"
if ( cd "$BACKEND" && cargo check ) >/tmp/verify_cargo.log 2>&1; then
  ok "cargo check"
else
  bad "cargo check"; tail -20 /tmp/verify_cargo.log
fi

step "2/5 Backend unit + hardening tests (cargo test)"
if ( cd "$BACKEND" && cargo test ) >/tmp/verify_cargo_test.log 2>&1; then
  ok "cargo test"
  grep -E "test result: ok" /tmp/verify_cargo_test.log | sed 's/^/    /'
else
  bad "cargo test"; tail -20 /tmp/verify_cargo_test.log
fi

step "3/5 Ensure backend is running at $BASE"
if ! curl -sf --max-time 3 "$BASE/api/v1/health" >/dev/null 2>&1; then
  echo "    Backend not running — attempting to start it…"
  if ( cd "$BACKEND" && cargo build ) >/tmp/verify_build.log 2>&1; then
    export $(grep -v '^#' "$BACKEND/.env" 2>/dev/null | grep -v '^$' | xargs -d '\n')
    ( cd "$BACKEND" && setsid ./target/debug/livemorph-backend > /tmp/backend.log 2>&1 < /dev/null & disown )
    for i in $(seq 1 20); do
      curl -sf --max-time 2 "$BASE/api/v1/health" >/dev/null 2>&1 && break
      sleep 1
    done
  else
    bad "cargo build"; tail -20 /tmp/verify_build.log
  fi
fi
if curl -sf --max-time 3 "$BASE/api/v1/health" >/dev/null 2>&1; then
  ok "backend reachable"
else
  bad "backend not reachable (see /tmp/backend.log)"
fi

step "4/5 Integration suite + endpoint smoke"
if ( cd "$BACKEND" && bash tests/integration_tests.sh ) >/tmp/verify_integration.log 2>&1; then
  ok "integration_tests.sh"
  grep -E "Passed:|Failed:" /tmp/verify_integration.log | sed 's/^/    /'
else
  bad "integration_tests.sh"; grep -E "✗|FAIL" /tmp/verify_integration.log | head -20
fi
if ( cd "$BACKEND" && bash scripts/endpoint_smoke.sh ) >/tmp/verify_smoke.log 2>&1; then
  ok "endpoint_smoke.sh"
  grep -E "Results:" /tmp/verify_smoke.log | sed 's/^/    /'
else
  bad "endpoint_smoke.sh"; grep -E "FAIL" /tmp/verify_smoke.log | head -20
fi

step "5/5 Frontend QML load verification (--verify-qml)"
if [[ "$QUICK" != 1 ]]; then
  if ( cd "$APP_DIR" && cmake --build build ) >/tmp/verify_qml_build.log 2>&1; then
    ok "frontend build"
  else
    bad "frontend build"; tail -20 /tmp/verify_qml_build.log
  fi
fi
if [[ -x "$APP_DIR/build/bin/LiveMorph" ]]; then
  # QPA=offscreen required; the app sets it when --verify-qml is passed
  if ( cd "$APP_DIR" && timeout 30 ./build/bin/LiveMorph --verify-qml ) >/tmp/verify_qml_run.log 2>&1; then
    ok "QML load: PASS"
  else
    bad "QML load: FAIL (see /tmp/verify_qml_run.log)"
    tail -20 /tmp/verify_qml_run.log
  fi
else
  bad "LiveMorph binary not found — skip QML verify"
fi

echo ""
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}═══ ALL VERIFY GATES PASSED ═══${NC}"
else
  echo -e "${RED}═══ VERIFY FAILURES — see logs above ═══${NC}"
fi
exit $FAILED