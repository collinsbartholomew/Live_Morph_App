#!/usr/bin/env bash
# =============================================================================
# LiveMorph Backend — Endpoint Smoke (unified /api/v1 tree)
# Product selected via X-Frontend-Id header on every request.
#
# P2_ID is the wire id of the SECOND product slot (the next desktop client).
# It defaults to "secondary" and must match the backend's SECONDARY_PRODUCT_ID.
# =============================================================================
set -euo pipefail
BASE="${BASE:-http://127.0.0.1:3874}"
P2_ID="${P2_ID:-secondary}"
HDR_LM=(-H "X-Frontend-Id: livemorph" -H "Content-Type: application/json" -H "Accept: application/json")
HDR_P2=(-H "X-Frontend-Id: $P2_ID" -H "Content-Type: application/json" -H "Accept: application/json")
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
check "P2 bootstrap" "${HDR_P2[@]}" "$BASE/api/v1/bootstrap"
check "health" "${HDR_LM[@]}" "$BASE/api/v1/health"
check "LM version" "${HDR_LM[@]}" "$BASE/api/v1/app/version"
check "P2 feature flags" "${HDR_P2[@]}" "$BASE/api/v1/public/feature-flags"
check "P2 plans" "${HDR_P2[@]}" "$BASE/api/v1/settings/plans"
check "P2 activation plans" "${HDR_P2[@]}" "$BASE/api/v1/settings/activation-plans"
check "P2 platform settings" "${HDR_P2[@]}" "$BASE/api/v1/settings/platform-settings"
check "P2 payment gateway" "${HDR_P2[@]}" "$BASE/api/v1/settings/payment-gateway"
check "P2 crypto config" "${HDR_P2[@]}" "$BASE/api/v1/settings/crypto"
check "P2 streaming availability" "${HDR_P2[@]}" "$BASE/api/v1/settings/streaming-availability"
check "P2 credit burn rate" "${HDR_P2[@]}" "$BASE/api/v1/settings/credit-burn-rate"
check "P2 background presets" "${HDR_P2[@]}" "$BASE/api/v1/streaming/background-presets"
check "ICE servers" "${HDR_LM[@]}" "$BASE/api/v1/webrtc/ice-servers"
check "LM packages" "${HDR_LM[@]}" "$BASE/api/v1/payments/packages"
check "LM catalog" "${HDR_LM[@]}" "$BASE/api/v1/catalog"
check "Google oauth status" "${HDR_LM[@]}" "$BASE/api/v1/auth/oauth/google/status"
check "P2 version check" -X POST "${HDR_P2[@]}" -d '{"version":"1.8.0","platform":"linux"}' "$BASE/api/v1/update/check"
check "LM version check" -X POST "${HDR_LM[@]}" -d '{"version":"1.8.0","platform":"linux"}' "$BASE/api/v1/update/check"

EMAIL="smoke_$(date +%s)@test.local"
REG=$(curl -s -w "\n%{http_code}" -X POST "${HDR_LM[@]}" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"TestPass123!\",\"display_name\":\"Smoke\",\"accepted_terms\":true}" \
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

P2_EMAIL="p2_smoke_$(date +%s)@test.local"
P2REG=$(curl -s -w "\n%{http_code}" -X POST "${HDR_P2[@]}" \
  -d "{\"email\":\"$P2_EMAIL\",\"password\":\"TestPass123!\",\"name\":\"P2 Smoke\",\"accepted_terms\":true}" \
  "$BASE/api/v1/auth/register" || true)
P2_CODE=$(echo "$P2REG" | tail -1)
P2_BODY=$(echo "$P2REG" | sed '$d')
if [[ "$P2_CODE" == "201" || "$P2_CODE" == "200" ]]; then
  echo "PASS P2 signup ($P2_CODE)"; PASS=$((PASS+1))
  P2_AT=$(echo "$P2_BODY" | python3 -c "import sys,json; print(json.load(sys.stdin).get('access_token',''))" 2>/dev/null || true)
else
  echo "FAIL P2 signup ($P2_CODE)"; FAIL=$((FAIL+1)); P2_AT=""
fi
if [[ -n "${P2_AT:-}" ]]; then
  P2AUTH=(-H "Authorization: Bearer $P2_AT" "${HDR_P2[@]}")
  check "P2 credits" "${P2AUTH[@]}" "$BASE/api/v1/credits/balance"
  check "P2 burn rate" "${P2AUTH[@]}" "$BASE/api/v1/settings/credit-burn-rate"
  check "P2 streaming avail" "${P2AUTH[@]}" "$BASE/api/v1/settings/streaming-availability"
  check "P2 backgrounds" "${P2AUTH[@]}" "$BASE/api/v1/streaming/background-presets"
  check "P2 downloads list" "${P2AUTH[@]}" "$BASE/api/v1/downloads/list"
  check "P2 referral code" "${P2AUTH[@]}" "$BASE/api/v1/referral/my-code"
  check "P2 support" -X POST "${P2AUTH[@]}" -d '{"subject":"s","message":"m"}' "$BASE/api/v1/support/tickets"
  check "P2 logout-all" -X POST "${P2AUTH[@]}" "$BASE/api/v1/auth/logout_all"
fi
echo "=== Results: PASS=$PASS FAIL=$FAIL ==="
exit $([[ "$FAIL" -eq 0 ]] && echo 0 || echo 1)
