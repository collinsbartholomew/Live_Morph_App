#!/usr/bin/env bash
# =============================================================================
# LiveMorph Backend — Endpoint Smoke (unified /api/v1 tree)
# Product selected via X-Frontend-Id header on every request.
# =============================================================================
set -euo pipefail
BASE="${BASE:-http://127.0.0.1:3874}"
HDR_LM=(-H "X-Frontend-Id: livemorph" -H "Content-Type: application/json" -H "Accept: application/json")
HDR_LE=(-H "X-Frontend-Id: liveescape" -H "Content-Type: application/json" -H "Accept: application/json")
PASS=0; FAIL=0
check() {
  local name="$1"; shift
  local code
  code=$(curl -s -o /tmp/ep_body.json -w "%{http_code}" "$@" || echo "000")
  if [[ "$code" =~ ^(200|201|204)$ ]]; then
    echo "PASS $name ($code)"; PASS=$((PASS+1))
  else
    echo "FAIL $name ($code) body=$(head -c 180 /tmp/ep_body.json 2>/dev/null)"; FAIL=$((FAIL+1))
  fi
}
echo "=== Platform smoke against $BASE (unified /api/v1) ==="
check "LM bootstrap" "${HDR_LM[@]}" "$BASE/api/v1/bootstrap"
check "LE bootstrap" "${HDR_LE[@]}" "$BASE/api/v1/bootstrap"
check "health" "${HDR_LM[@]}" "$BASE/api/v1/health"
check "LM version" "${HDR_LM[@]}" "$BASE/api/v1/app/version"
check "LE feature flags" "${HDR_LE[@]}" "$BASE/api/v1/public/feature-flags"
check "LE plans" "${HDR_LE[@]}" "$BASE/api/v1/settings/plans"
check "LE activation plans" "${HDR_LE[@]}" "$BASE/api/v1/settings/activation-plans"
check "LE platform settings" "${HDR_LE[@]}" "$BASE/api/v1/settings/platform-settings"
check "LE payment gateway" "${HDR_LE[@]}" "$BASE/api/v1/settings/payment-gateway"
check "LE crypto config" "${HDR_LE[@]}" "$BASE/api/v1/settings/crypto"
check "LE streaming availability" "${HDR_LE[@]}" "$BASE/api/v1/settings/streaming-availability"
check "LE credit burn rate" "${HDR_LE[@]}" "$BASE/api/v1/settings/credit-burn-rate"
check "LE background presets" "${HDR_LE[@]}" "$BASE/api/v1/streaming/background-presets"
check "ICE servers" "${HDR_LM[@]}" "$BASE/api/v1/webrtc/ice-servers"
check "LM packages" "${HDR_LM[@]}" "$BASE/api/v1/payments/packages"
check "LM catalog" "${HDR_LM[@]}" "$BASE/api/v1/catalog"
check "Google oauth status" "${HDR_LM[@]}" "$BASE/api/v1/auth/oauth/google/status"
check "LE version check" -X POST "${HDR_LE[@]}" -d '{"version":"1.8.0","platform":"linux"}' "$BASE/api/v1/update/check"
check "LM version check" -X POST "${HDR_LM[@]}" -d '{"version":"1.8.0","platform":"linux"}' "$BASE/api/v1/update/check"

EMAIL="smoke_$(date +%s)@test.local"
REG=$(curl -s -w "\n%{http_code}" -X POST "${HDR_LM[@]}" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"TestPass123!\",\"display_name\":\"Smoke\"}" \
  "$BASE/api/v1/auth/register" || true)
REG_CODE=$(echo "$REG" | tail -1)
REG_BODY=$(echo "$REG" | sed '$d')
if [[ "$REG_CODE" == "201" || "$REG_CODE" == "200" ]]; then
  echo "PASS LM register ($REG_CODE)"; PASS=$((PASS+1))
  AT=$(echo "$REG_BODY" | python3 -c "import sys,json; print(json.load(sys.stdin).get('access_token',''))" 2>/dev/null || true)
  RT=$(echo "$REG_BODY" | python3 -c "import sys,json; print(json.load(sys.stdin).get('refresh_token',''))" 2>/dev/null || true)
else
  echo "FAIL LM register ($REG_CODE)"; FAIL=$((FAIL+1)); AT=""; RT=""
fi
if [[ -n "${AT:-}" ]]; then
  AUTH=(-H "Authorization: Bearer $AT" "${HDR_LM[@]}")
  check "LM me" "${AUTH[@]}" "$BASE/api/v1/auth/me"
  check "LM credits balance" "${AUTH[@]}" "$BASE/api/v1/credits/balance"
  check "LM credits ledger" "${AUTH[@]}" "$BASE/api/v1/credits/ledger"
  check "LM stream status" "${AUTH[@]}" "$BASE/api/v1/stream/status"
  check "LM vc status" "${AUTH[@]}" "$BASE/api/v1/vc/status"
  check "LM support ticket" -X POST "${AUTH[@]}" -d '{"subject":"smoke","message":"test"}' "$BASE/api/v1/support/tickets"
  if [[ -n "$RT" ]]; then
    check "LM refresh" -X POST "${HDR_LM[@]}" -d "{\"refresh_token\":\"$RT\"}" "$BASE/api/v1/auth/refresh"
  fi
fi

LE_EMAIL="le_smoke_$(date +%s)@test.local"
LEREG=$(curl -s -w "\n%{http_code}" -X POST "${HDR_LE[@]}" \
  -d "{\"email\":\"$LE_EMAIL\",\"password\":\"TestPass123!\",\"name\":\"LE Smoke\",\"accepted_terms\":true}" \
  "$BASE/api/v1/auth/register" || true)
LE_CODE=$(echo "$LEREG" | tail -1)
LE_BODY=$(echo "$LEREG" | sed '$d')
if [[ "$LE_CODE" == "201" || "$LE_CODE" == "200" ]]; then
  echo "PASS LE signup ($LE_CODE)"; PASS=$((PASS+1))
  LE_AT=$(echo "$LE_BODY" | python3 -c "import sys,json; print(json.load(sys.stdin).get('access_token',''))" 2>/dev/null || true)
else
  echo "FAIL LE signup ($LE_CODE)"; FAIL=$((FAIL+1)); LE_AT=""
fi
if [[ -n "${LE_AT:-}" ]]; then
  LEAUTH=(-H "Authorization: Bearer $LE_AT" "${HDR_LE[@]}")
  check "LE credits" "${LEAUTH[@]}" "$BASE/api/v1/credits/balance"
  check "LE burn rate" "${LEAUTH[@]}" "$BASE/api/v1/settings/credit-burn-rate"
  check "LE streaming avail" "${LEAUTH[@]}" "$BASE/api/v1/settings/streaming-availability"
  check "LE backgrounds" "${LEAUTH[@]}" "$BASE/api/v1/streaming/background-presets"
  check "LE downloads list" "${LEAUTH[@]}" "$BASE/api/v1/downloads/list"
  check "LE referral code" "${LEAUTH[@]}" "$BASE/api/v1/referral/my-code"
  check "LE support" -X POST "${LEAUTH[@]}" -d '{"subject":"s","message":"m"}' "$BASE/api/v1/support/tickets"
  check "LE logout-all" -X POST "${LEAUTH[@]}" "$BASE/api/v1/auth/logout_all"
fi
echo "=== Results: PASS=$PASS FAIL=$FAIL ==="
exit $([[ "$FAIL" -eq 0 ]] && echo 0 || echo 1)