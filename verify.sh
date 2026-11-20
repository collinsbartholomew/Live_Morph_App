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

step "1/7 Backend build (cargo check)"
if ( cd "$BACKEND" && cargo check ) >/tmp/verify_cargo.log 2>&1; then
  ok "cargo check"
else
  bad "cargo check"; tail -20 /tmp/verify_cargo.log
fi

step "2/7 Backend unit + hardening tests (cargo test)"
if ( cd "$BACKEND" && cargo test ) >/tmp/verify_cargo_test.log 2>&1; then
  ok "cargo test"
  grep -E "test result: ok" /tmp/verify_cargo_test.log | sed 's/^/    /'
else
  bad "cargo test"; tail -20 /tmp/verify_cargo_test.log
fi

step "3/7 Ensure backend is running at $BASE"
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
  # The suites send the test admin secret; .env ships ADMIN_SECRET empty by
  # design, so take it from backend/.test.env (single source of truth) AFTER
  # the .env export loop above.
  if [ -z "${ADMIN_SECRET:-}" ] && [ -f "$BACKEND/.test.env" ]; then
    _ts=$(grep -E '^ADMIN_SECRET=' "$BACKEND/.test.env" | head -1 | cut -d= -f2-)
    [ -n "$_ts" ] && export ADMIN_SECRET="$_ts"
  fi
  # Export BASE so the integration suite targets the same host we health-check
  # (integration_tests.sh honors BASE; endpoint_smoke.sh already does).
  export BASE
  # Only boot a local gate backend when BASE is the default; with a remote BASE
  # we must not kill or replace whatever is running there.
  if [ "$BASE" = "http://127.0.0.1:3874" ]; then
    # Kill ONLY a previous gate-started backend (recorded PID). Never pkill:
    # a pattern match also kills a dev backend the user started themselves
    # from backend/target/debug, which must not be touched by the gate.
    if [ -f /tmp/verify_backend.pid ]; then
      kill "$(cat /tmp/verify_backend.pid)" 2>/dev/null
      sleep 1
    fi
    if curl -sf --max-time 2 "$BASE/api/v1/health" >/dev/null 2>&1; then
      FOREIGN_LISTENER=1
    else
      FOREIGN_LISTENER=0
    fi
    # The gate backend is a local development instance: force development mode
    # so a fresh shell (no RUST_ENV in env, .env without RUST_ENV) does not
    # default to production and fail closed on dev-only flags.
    export RUST_ENV=development
    if [ "$FOREIGN_LISTENER" = 0 ]; then
      GATE_STARTED_BACKEND=1
      ( cd "$BACKEND" && setsid ./target/debug/livemorph-backend > /tmp/backend.log 2>&1 < /dev/null & echo $! > /tmp/verify_backend.pid; disown )
    else
      GATE_STARTED_BACKEND=0
    fi
  else
    GATE_STARTED_BACKEND=0
    FOREIGN_LISTENER=0
  fi
  GATE_DEAD=0
  for i in $(seq 1 20); do
    if [ "$GATE_STARTED_BACKEND" = 1 ] && ! kill -0 "$(cat /tmp/verify_backend.pid 2>/dev/null)" 2>/dev/null; then
      GATE_DEAD=1
      break
    fi
    curl -sf --max-time 2 "$BASE/api/v1/health" >/dev/null 2>&1 && break
    sleep 1
  done
else
  bad "cargo build"; tail -20 /tmp/verify_build.log
  GATE_STARTED_BACKEND=0
  FOREIGN_LISTENER=0
  GATE_DEAD=0
fi
SKIP_LIVE=0
if [ "${FOREIGN_LISTENER:-0}" = 1 ]; then
  bad "another backend already listens on $BASE — stop it (or run: BASE=http://127.0.0.1:3875 bash verify.sh) so the gate tests its own instance"
  SKIP_LIVE=1
elif [ "${GATE_DEAD:-0}" = 1 ]; then
  bad "gate backend died at startup (see /tmp/backend.log)"
  tail -5 /tmp/backend.log
  SKIP_LIVE=1
elif curl -sf --max-time 3 "$BASE/api/v1/health" >/dev/null 2>&1; then
  ok "backend reachable"
else
  bad "backend not reachable (see /tmp/backend.log)"
  SKIP_LIVE=1
fi

step "4/7 Integration suite + endpoint smoke"
if [ "$SKIP_LIVE" = 1 ]; then
  bad "integration_tests.sh (skipped: no trusted gate backend)"
  bad "endpoint_smoke.sh (skipped: no trusted gate backend)"
else
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
fi

step "5/7 Frontend CTest + QML load verification"
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
if [[ -f "$APP_DIR/build/CTestTestfile.cmake" ]]; then
  if ( cd "$APP_DIR" && ctest --test-dir build --output-on-failure ) >/tmp/verify_frontend_smoke.log 2>&1; then
    ok "frontend CTest suite: PASS"
  else
    bad "frontend CTest suite: FAIL"
    tail -20 /tmp/verify_frontend_smoke.log
  fi
else
  bad "CTest metadata not found"
fi

step "6/7 Frontend hygiene (no-motion directive + i18n catalog sync)"
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

step "7/7 Deployment assets"
DEPLOY_SYNTAX_OK=1
for script in "$BACKEND/run.sh" "$BACKEND/scripts/check-config.sh" "$APP_DIR/build.sh" "$APP_DIR/packaging/deploy-linux.sh" "$APP_DIR/packaging/deploy-macos.sh"; do
  if ! bash -n "$script"; then
    bad "shell syntax: $script"
    DEPLOY_SYNTAX_OK=0
  fi
done
if [ "$DEPLOY_SYNTAX_OK" = 1 ]; then
  ok "backend and desktop launch script syntax"
fi
if [[ -f "$ROOT/deploy_kaggle.py" ]]; then
  if python3 - "$ROOT/deploy_kaggle.py" >/tmp/verify_kaggle.log 2>&1 <<'PY'
import ast
import sys
from pathlib import Path

source = Path(sys.argv[1]).read_text(encoding="utf-8")
tree = ast.parse(source, filename=sys.argv[1])
managed = None
for node in ast.walk(tree):
    if isinstance(node, ast.Assign) and any(isinstance(target, ast.Name) and target.id == "ENV_VARS" for target in node.targets):
        if not isinstance(node.value, ast.Dict):
            raise SystemExit("ENV_VARS must be a dictionary literal")
        managed = {key.value for key in node.value.keys if isinstance(key, ast.Constant) and isinstance(key.value, str)}
        break
if managed is None:
    raise SystemExit("ENV_VARS dictionary not found")
required = {
    "MONGODB_URI", "MONGODB_DB", "MONGODB_DB_SECONDARY", "JWT_SECRET",
    "DECART_API_KEY", "DECART_SIGNALING_URL", "DECART_DEFAULT_MODEL",
    "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REDIRECT_URI",
    "PAYSTACK_SECRET_KEY", "PAYSTACK_PUBLIC_KEY", "SMTP_HOST",
    "SMTP_USERNAME", "SMTP_PASSWORD", "SMTP_FROM", "ADMIN_SECRET",
}
missing = sorted(required - managed)
if missing:
    raise SystemExit("ENV_VARS missing required keys: " + ", ".join(missing))
print(f"Kaggle static deployment structure: PASS ({len(managed)} managed vars)")
PY
  then
    ok "Kaggle static deployment config"
  else
    bad "Kaggle static deployment config (see /tmp/verify_kaggle.log)"
    tail -20 /tmp/verify_kaggle.log
  fi
else
  echo "  - deploy_kaggle.py not present; local Kaggle check skipped"
fi
if command -v docker >/dev/null 2>&1; then
  if ( cd "$ROOT" && docker compose config --quiet ) >/tmp/verify_compose.log 2>&1; then
    ok "Compose config"
  else
    bad "Compose config"
    tail -20 /tmp/verify_compose.log
  fi
else
  echo "  - docker unavailable; Compose runtime config check skipped"
fi
if command -v desktop-file-validate >/dev/null 2>&1; then
  if desktop-file-validate "$APP_DIR/packaging/livemorph.desktop"; then
    ok "Linux desktop entry"
  else
    bad "Linux desktop entry"
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
  # Reap only the gate's own recorded PID — never pkill a pattern, so a
  # user-started dev backend survives the verify run.
  [ -f /tmp/verify_backend.pid ] && kill "$(cat /tmp/verify_backend.pid)" 2>/dev/null
fi
exit $FAILED