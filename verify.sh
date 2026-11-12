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
# The integration suite makes many same-IP auth calls, so run the gate backend
# with test-scaled rate limits and a fresh in-memory limiter (restart if up).
if ( cd "$BACKEND" && cargo build ) >/tmp/verify_build.log 2>&1; then
  # Export .env KEY=VALUE lines safely (values may contain spaces/quotes).
  if [ -f "$BACKEND/.env" ]; then
    while IFS= read -r line; do
      case "$line" in ''|\#*) continue;; esac
      export "$line"
    done < "$BACKEND/.env"
  fi
  # Test-scale limits so the suites' repeated same-IP calls don't lock out.
  export AUTH_MAX_ATTEMPTS=500
  pkill -f "target/debug/livemorph-backend" 2>/dev/null; sleep 1
  GATE_STARTED_BACKEND=1
  ( cd "$BACKEND" && setsid ./target/debug/livemorph-backend > /tmp/backend.log 2>&1 < /dev/null & disown )
  for i in $(seq 1 20); do
    curl -sf --max-time 2 "$BASE/api/v1/health" >/dev/null 2>&1 && break
    sleep 1
  done
else
  bad "cargo build"; tail -20 /tmp/verify_build.log
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
  if [[ ! -f "$APP_DIR/build/Makefile" ]]; then
    cmake_args=(-S . -B build)
    [[ -n "${CMAKE_PREFIX_PATH:-}" ]] && cmake_args+=(-DCMAKE_PREFIX_PATH="$CMAKE_PREFIX_PATH")
    ( cd "$APP_DIR" && cmake "${cmake_args[@]}" ) >>/tmp/verify_qml_build.log 2>&1
  fi
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

step "6/6 Frontend hygiene (no-motion directive + i18n catalog sync)"
# No time-based animation elements are allowed anywhere in QML/C++ (project directive).
# Comment lines are excluded (Theme.qml's header comment names the banned types);
# boundsBehavior (a Flickable enum, not an animation) is excluded explicitly.
# Strip full-line AND trailing comments before matching, then match any
# *Animation/*Animator/Behavior/Transition/Action type name (covers
# SpringAnimation, PathAnimation, UniformAnimator, ... too).
ANIM=$(grep -rnE --include=*.qml --include=*.cpp --include=*.h "\b[A-Za-z]*(Animation|Animator)\b|\bBehavior\b|\bTransition\b|\b(PropertyAction|ScriptAction)\b|QPropertyAnimation|QAbstractAnimation" "$APP_DIR/qml" "$APP_DIR/src" 2>/dev/null \
  | sed -E 's#(//|/\*|\*/).*##' \
  | grep -vE '^[^:]+:[0-9]+:[[:space:]]*$' \
  | grep -vE '^[^:]+:[0-9]+:[[:space:]]*\*' \
  | grep -v boundsBehavior | wc -l)
if [ "$ANIM" -eq 0 ]; then
  ok "no animation elements in QML"
else
  bad "animation elements found in QML ($ANIM) — motion is banned project-wide"
fi
# The embedded English catalog must be in sync with qsTr()/tr() sources.
LUPDATE_BIN="$(command -v lupdate || command -v lupdate6 || true)"
[ -z "$LUPDATE_BIN" ] && [ -x /usr/lib/qt6/bin/lupdate ] && LUPDATE_BIN=/usr/lib/qt6/bin/lupdate
if [ -z "$LUPDATE_BIN" ]; then
  bad "lupdate not found — cannot verify i18n catalog sync"
else
  TMP="/tmp/lm_i18n_check_$$.ts"
  rm -f "$TMP"
  # Run from the app dir with RELATIVE source paths: some lupdate builds emit
  # a 0-byte .ts when handed absolute source dirs, which would false-fail here.
  (cd "$APP_DIR" && "$LUPDATE_BIN" qml src -ts "$TMP" -no-obsolete >/dev/null 2>&1)
  # Compare sorted (context,source) pairs, not just counts — a missing and a
  # stale string would cancel out in a pure count comparison.
  pairs() { python3 - "$1" <<'PYEOF'
import sys, xml.etree.ElementTree as ET
try:
    root = ET.parse(sys.argv[1]).getroot()
except Exception:
    sys.exit(0)
for m in root.iter('message'):
    ctx = m.findtext('name') or ''
    src = m.findtext('source') or ''
    print(ctx + '\x01' + src)
PYEOF
  }
  if [ -s "$TMP" ]; then
    pairs "$TMP" | sort > "/tmp/lm_i18n_src_$$.txt"
    pairs "$APP_DIR/i18n/livemorph_en.ts" | sort > "/tmp/lm_i18n_ts_$$.txt"
    rm -f "$TMP"
    N=$(wc -l < "/tmp/lm_i18n_ts_$$.txt")
    if diff -q "/tmp/lm_i18n_src_$$.txt" "/tmp/lm_i18n_ts_$$.txt" >/dev/null 2>&1; then
      ok "i18n catalog in sync ($N messages)"
    else
      bad "i18n catalog out of sync — diff (sources vs ts):"
      diff "/tmp/lm_i18n_src_$$.txt" "/tmp/lm_i18n_ts_$$.txt" | head -10 | sed 's/^/    /'
      echo "    run: lupdate qml src -ts i18n/livemorph_en.ts -no-obsolete (from apps/livemorph)"
    fi
    rm -f "/tmp/lm_i18n_src_$$.txt" "/tmp/lm_i18n_ts_$$.txt"
  else
    rm -f "$TMP"
    bad "lupdate produced no output — cannot verify i18n catalog sync"
  fi
fi

echo ""
if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}═══ ALL VERIFY GATES PASSED ═══${NC}"
else
  echo -e "${RED}═══ VERIFY FAILURES — see logs above ═══${NC}"
fi
# Reap the gate backend so the script's process tree is empty and callers that
# wait on the tree see the script terminate. Restart any time with:
#   cd backend && cargo run
if [ "${GATE_STARTED_BACKEND:-0}" = "1" ]; then
  pkill -f "target/debug/livemorph-backend" 2>/dev/null
fi
exit $FAILED