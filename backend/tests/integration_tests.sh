#!/usr/bin/env bash
# =============================================================================
# LiveMorph Backend — Unified Integration Test Suite v3
# Targets the single /api/v1 tree; product via X-Frontend-Id headers.
# =============================================================================
set -uo pipefail

BASE="http://127.0.0.1:3874"
TIMEOUT="--max-time 10"
PASS=0
FAIL=0
WARN=0
TESTS=()

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

check() {
    local name="$1" expected="$2" actual="$3"
    if echo "$actual" | grep -q "$expected"; then
        echo -e "  ${GREEN}✓${NC} $name"
        PASS=$((PASS + 1))
        TESTS+=("PASS: $name")
    else
        echo -e "  ${RED}✗${NC} $name (expected '$expected', got: $(echo "$actual" | head -c 140))"
        FAIL=$((FAIL + 1))
        TESTS+=("FAIL: $name")
    fi
}

check_code() {
    local name="$1" expected="$2" actual="$3"
    if [ "$actual" = "$expected" ]; then
        echo -e "  ${GREEN}✓${NC} $name → $actual"
        PASS=$((PASS + 1))
        TESTS+=("PASS: $name")
    else
        echo -e "  ${RED}✗${NC} $name (expected $expected, got $actual)"
        FAIL=$((FAIL + 1))
        TESTS+=("FAIL: $name")
    fi
}

section() {
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
}

TEST_ID="test_$(date +%s)_$$"
LM_EMAIL="lm_${TEST_ID}@test.local"
LM_PASS="TestPass123!"
LE_EMAIL="le_${TEST_ID}@test.local"
LE_PASS="LeTestPass123!"
ADMIN_SECRET="DzdIHOMlGgcnTUGaUbsR+Ln0dO54fnOnhnStGdl6fyE="
LE_HDR=(-H "X-Frontend-Id: LiveEscape")
LM_HDR=(-H "X-Frontend-Id: LiveMorph")

echo -e "${CYAN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  LiveMorph Backend — Unified Integration Suite v3     ║${NC}"
echo -e "${CYAN}║  Target: $BASE                          ║${NC}"
echo -e "${CYAN}║  Test ID: $TEST_ID                            ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════╝${NC}"

# ═══════════════════════════════════════════════════════════════
section "1. HEALTH & BOOTSTRAP"
# ═══════════════════════════════════════════════════════════════
R=$(curl -sf $TIMEOUT "$BASE/api/v1/health" 2>&1)
check "GET /api/v1/health returns ok" '"status":"ok"' "$R"
check "Health: mongo_livemorph=true" '"mongo_livemorph":true' "$R"
check "Health: mongo_liveescape=true" '"mongo_liveescape":true' "$R"

R=$(curl -sf $TIMEOUT "$BASE/api/v1/bootstrap" "${LE_HDR[@]}" 2>&1)
check "GET /api/v1/bootstrap (LE)" 'credits_per_second\|product' "$R"
check "LE bootstrap advertises /api/v1 keys" 'api/v1/keys/validate' "$R"

R=$(curl -sf $TIMEOUT "$BASE/api/v1/bootstrap" "${LM_HDR[@]}" 2>&1)
check "GET /api/v1/bootstrap (LM)" 'credits_per_second' "$R"

# ═══════════════════════════════════════════════════════════════
section "2. LE AUTH — SIGNUP & LOGIN (product header)"
# ═══════════════════════════════════════════════════════════════
LE_SIGNUP=$(curl -s $TIMEOUT -X POST "$BASE/api/v1/auth/register" \
    "${LE_HDR[@]}" -H "Content-Type: application/json" \
    -d "{\"email\":\"$LE_EMAIL\",\"password\":\"$LE_PASS\",\"name\":\"Test LE User\",\"accepted_terms\":true}" 2>&1)
check "POST /api/v1/auth/register (LE) returns access_token" '"access_token"' "$LE_SIGNUP"

LE_TOKEN=$(echo "$LE_SIGNUP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token',''))" 2>/dev/null || echo "")
LE_REFRESH=$(echo "$LE_SIGNUP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('refresh_token',''))" 2>/dev/null || echo "")

if [ -n "$LE_TOKEN" ]; then
    echo -e "  ${GREEN}✓${NC} LE token obtained ($(echo "$LE_TOKEN" | wc -c) chars)"
    PASS=$((PASS + 1)); TESTS+=("PASS: LE token obtained")
else
    echo -e "  ${YELLOW}⚠${NC} LE signup returned no token — will try login"
fi

LE_LOGIN=$(curl -s $TIMEOUT -X POST "$BASE/api/v1/auth/login" \
    "${LE_HDR[@]}" -H "Content-Type: application/json" \
    -d "{\"email\":\"$LE_EMAIL\",\"password\":\"$LE_PASS\"}" 2>&1)
check "POST /api/v1/auth/login (LE) returns access_token" '"access_token"' "$LE_LOGIN"
LE_TOKEN=$(echo "$LE_LOGIN" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token',''))" 2>/dev/null || echo "")
LE_REFRESH=$(echo "$LE_LOGIN" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('refresh_token',''))" 2>/dev/null || echo "")

LE_BAD=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/auth/login" \
    "${LE_HDR[@]}" -H "Content-Type: application/json" \
    -d "{\"email\":\"$LE_EMAIL\",\"password\":\"wrongpassword\"}" 2>&1)
check_code "POST /api/v1/auth/login wrong password → 401" "401" "$LE_BAD"

# ═══════════════════════════════════════════════════════════════
section "3. TOKEN REFRESH"
# ═══════════════════════════════════════════════════════════════
if [ -n "$LE_REFRESH" ]; then
    LE_REFRESH_R=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/auth/refresh" \
        -H "Content-Type: application/json" \
        -d "{\"refresh_token\":\"$LE_REFRESH\"}" 2>&1)
    check "POST /api/v1/auth/refresh (LE)" '"access_token"' "$LE_REFRESH_R"
    LE_TOKEN=$(echo "$LE_REFRESH_R" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token',''))" 2>/dev/null || echo "$LE_TOKEN")
else
    echo -e "  ${YELLOW}⚠ No refresh token to test${NC}"
    WARN=$((WARN + 1)); TESTS+=("WARN: no LE refresh token")
fi

# ═══════════════════════════════════════════════════════════════
section "4. PASSWORD RESET"
# ═══════════════════════════════════════════════════════════════
R=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/auth/password-reset-request" \
    -H "Content-Type: application/json" -d "{\"email\":\"$LE_EMAIL\"}" 2>&1)
check "POST /api/v1/auth/password-reset-request" 'ok\|message' "$R"

LE_OTP=$(grep -oP 'reset_token=\K[a-f0-9]+' /tmp/backend.log | tail -1 2>/dev/null || echo "")
if [ -n "$LE_OTP" ]; then
    echo -e "  ${GREEN}✓${NC} Reset token available"
    PASS=$((PASS + 1)); TESTS+=("PASS: reset token generated")
    LE_NEW_PASS="NewTestPass456!"
    R=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/auth/password-reset" \
        -H "Content-Type: application/json" \
        -d "{\"token\":\"$LE_OTP\",\"password\":\"$LE_NEW_PASS\",\"email\":\"$LE_EMAIL\"}" 2>&1)
    check "POST /api/v1/auth/password-reset success" 'ok\|success' "$R"
    LE_LOGIN_NEW=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/auth/login" \
        "${LE_HDR[@]}" -H "Content-Type: application/json" \
        -d "{\"email\":\"$LE_EMAIL\",\"password\":\"$LE_NEW_PASS\"}" 2>&1)
    check "LE login with new password" '"access_token"' "$LE_LOGIN_NEW"
    LE_TOKEN=$(echo "$LE_LOGIN_NEW" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token',''))" 2>/dev/null || echo "$LE_TOKEN")
else
    echo -e "  ${YELLOW}⚠ No reset token found in logs${NC}"
    WARN=$((WARN + 1)); TESTS+=("WARN: no reset token in logs")
fi

# ═══════════════════════════════════════════════════════════════
section "5. LE LICENSE KEYS"
# ═══════════════════════════════════════════════════════════════
if [ -n "$LE_TOKEN" ]; then
    LE_KEY_RESULT=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/keys/dev-issue" \
        -H "Content-Type: application/json" \
        -d "{\"plan\":\"creator\",\"admin_secret\":\"$ADMIN_SECRET\"}" 2>&1)
    check "POST /api/v1/keys/dev-issue (LE)" 'key\|access_key' "$LE_KEY_RESULT"
    LE_KEY=$(echo "$LE_KEY_RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('key','') or d.get('access_key',''))" 2>/dev/null || echo "")

    if [ -n "$LE_KEY" ]; then
        LE_VALIDATE=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/keys/validate" \
            "${LE_HDR[@]}" -H "Authorization: Bearer $LE_TOKEN" \
            -H "Content-Type: application/json" -H "x-device-id: test-device-001" \
            -d "{\"key\":\"$LE_KEY\",\"device_id\":\"test-device-001\"}" 2>&1)
        check "POST /api/v1/keys/validate (LE)" '"valid":true' "$LE_VALIDATE"

        R=$(curl -sf $TIMEOUT "$BASE/api/v1/keys/status" \
            "${LE_HDR[@]}" -H "Authorization: Bearer $LE_TOKEN" 2>&1)
        check "GET /api/v1/keys/status (LE)" '"valid":true\|"valid":false\|access_key' "$R"
    fi

    R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/keys/validate" \
        -H "Authorization: Bearer $LE_TOKEN" -H "Content-Type: application/json" -d '{}' 2>&1)
    check_code "POST /api/v1/keys/validate without product → 400" "400" "$R"
fi

# ═══════════════════════════════════════════════════════════════
section "6. LE CREDITS, STREAMING, SETTINGS"
# ═══════════════════════════════════════════════════════════════
if [ -n "$LE_TOKEN" ]; then
    R=$(curl -sf $TIMEOUT "$BASE/api/v1/credits/balance" "${LE_HDR[@]}" -H "Authorization: Bearer $LE_TOKEN" 2>&1)
    check "GET /api/v1/credits/balance (LE)" 'credit_balance' "$R"

    R=$(curl -sf $TIMEOUT "$BASE/api/v1/credits/balance" "${LE_HDR[@]}" -H "Authorization: Bearer $LE_TOKEN" 2>&1)
    check "GET /api/v1/credits/balance (LE)" 'credit_balance' "$R"

    LE_SESSION=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/streaming/session-start" \
        "${LE_HDR[@]}" -H "Authorization: Bearer $LE_TOKEN" \
        -H "Content-Type: application/json" -d '{"model":"lucy-2.1"}' 2>&1)
    check "POST /api/v1/streaming/session-start (LE)" 'session_id' "$LE_SESSION"
    LE_SESSION_ID=$(echo "$LE_SESSION" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('session_id',''))" 2>/dev/null || echo "")

    LE_END=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/streaming/end" \
        "${LE_HDR[@]}" -H "Authorization: Bearer $LE_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"session_id\":\"$LE_SESSION_ID\",\"reason\":\"test\"}" 2>&1)
    check "POST /api/v1/streaming/end (LE)" 'ok' "$LE_END"
fi

for endpoint in settings/plans settings/credit-burn-rate settings/platform-settings \
            settings/payment-gateway settings/crypto settings/streaming-availability \
            settings/api-endpoint settings/dashboard-maintenance settings/dashboard-notification \
            streaming/background-presets public/feature-flags; do
    R=$(curl -sf $TIMEOUT "$BASE/api/v1/$endpoint" "${LE_HDR[@]}" 2>&1)
    if [ -n "$R" ]; then
        echo -e "  ${GREEN}✓${NC} GET /api/v1/$endpoint"
        PASS=$((PASS + 1)); TESTS+=("PASS: GET /api/v1/$endpoint")
    else
        echo -e "  ${RED}✗${NC} GET /api/v1/$endpoint empty"
        FAIL=$((FAIL + 1)); TESTS+=("FAIL: GET /api/v1/$endpoint")
    fi
done

# ═══════════════════════════════════════════════════════════════
section "7. STARTER-PACK / ACTIVATION ORDERS"
# ═══════════════════════════════════════════════════════════════
if [ -n "$LE_TOKEN" ]; then
    R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" "$BASE/api/v1/starter-pack/status" \
        -H "Authorization: Bearer $LE_TOKEN" 2>&1)
    check_code "GET /api/v1/starter-pack/status (authed)" "200" "$R"

    R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" "$BASE/api/v1/starter-pack/status" 2>&1)
    check_code "GET /api/v1/starter-pack/status (no auth) → 401" "401" "$R"

    # Activation order (dev_mode order, no real Paystack)
    LE_ACT=$(curl -s $TIMEOUT -X POST "$BASE/api/v1/activation/pay" \
        "${LE_HDR[@]}" -H "Authorization: Bearer $LE_TOKEN" \
        -H "Content-Type: application/json" -d '{"plan_id":"creator","email":"'$LE_EMAIL'"}' 2>&1)
    check "POST /api/v1/activation/pay (LE)" 'order_id' "$LE_ACT"
    LE_ORDER=$(echo "$LE_ACT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('order_id',''))" 2>/dev/null || echo "")

    SP=$(curl -s $TIMEOUT -X POST "$BASE/api/v1/starter-pack/pay" \
        "${LE_HDR[@]}" -H "Authorization: Bearer $LE_TOKEN" \
        -H "Content-Type: application/json" -d '{"plan_id":"starter"}' 2>&1)
    check "POST /api/v1/starter-pack/pay (LE)" 'order_id' "$SP"
fi

# ═══════════════════════════════════════════════════════════════
section "8. REFERRAL / CREATOR / SUPPORT"
# ═══════════════════════════════════════════════════════════════
if [ -n "$LE_TOKEN" ]; then
    R=$(curl -sf $TIMEOUT "$BASE/api/v1/referral/my-code" "${LE_HDR[@]}" -H "Authorization: Bearer $LE_TOKEN" 2>&1)
    check "GET /api/v1/referral/my-code (LE)" 'code' "$R"

    R=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/creator/payout-details" \
        "${LE_HDR[@]}" -H "Authorization: Bearer $LE_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"account_name":"Test","bank_name":"Bank","account_number":"123456"}' 2>&1)
    check "POST /api/v1/creator/payout-details (LE)" 'ok\|details' "$R"

    R=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/support/tickets" \
        "${LE_HDR[@]}" -H "Authorization: Bearer $LE_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"subject":"Test","message":"Integration test"}' 2>&1)
    check "POST /api/v1/support/tickets (LE)" 'ticket_id' "$R"
fi

R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" "$BASE/api/v1/referral/my-code" 2>&1)
check_code "GET /api/v1/referral/my-code without token → 401" "401" "$R"

# ═══════════════════════════════════════════════════════════════
section "9. ADMIN CREDITS (secret gated)"
# ═══════════════════════════════════════════════════════════════
if [ -n "$LE_TOKEN" ]; then
    LE_ADD=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/credits/add" \
        "${LE_HDR[@]}" -H "Authorization: Bearer $LE_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"amount\":1000,\"admin_secret\":\"$ADMIN_SECRET\"}" 2>&1)
    check "POST /api/v1/credits/add (LE admin)" 'balance\|ok\|total' "$LE_ADD"
fi

# ═══════════════════════════════════════════════════════════════
section "9b. MANUAL CREDIT KEYS (issue + redeem + reuse guard)"
# ═══════════════════════════════════════════════════════════════
if [ -n "$LE_TOKEN" ]; then
    CK=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/credits/keys/issue" \
        -H "Content-Type: application/json" \
        -d "{\"admin_secret\":\"$ADMIN_SECRET\",\"credits\":250,\"product\":\"liveescape\"}" 2>&1)
    check "POST /api/v1/credits/keys/issue" 'keys' "$CK"
    CK_KEY=$(echo "$CK" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('keys',[''])[0])" 2>/dev/null || echo "")

    if [ -n "$CK_KEY" ]; then
        CK_REDEEM=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/credits/add" \
            "${LE_HDR[@]}" -H "Authorization: Bearer $LE_TOKEN" \
            -H "Content-Type: application/json" \
            -d "{\"credit_key\":\"$CK_KEY\"}" 2>&1)
        check "POST /api/v1/credits/add redeem key" '"total"\|"ok"' "$CK_REDEEM"

        CK_DUP=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/credits/add" \
            "${LE_HDR[@]}" -H "Authorization: Bearer $LE_TOKEN" \
            -H "Content-Type: application/json" \
            -d "{\"credit_key\":\"$CK_KEY\"}" 2>&1)
        check_code "POST /api/v1/credits/add reuse key → 409" "409" "$CK_DUP"
    fi
fi

# ═══════════════════════════════════════════════════════════════
section "9c. UPGRADE DISCOUNTED PRICING (starter → creator = \$50)"
# ═══════════════════════════════════════════════════════════════
if [ -n "$LE_TOKEN" ]; then
    SK=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/keys/dev-issue" \
        -H "Content-Type: application/json" \
        -d "{\"admin_secret\":\"$ADMIN_SECRET\",\"plan\":\"starter\"}" 2>&1)
    SK_KEY=$(echo "$SK" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('key',''))" 2>/dev/null || echo "")
    if [ -n "$SK_KEY" ]; then
        curl -sf $TIMEOUT -X POST "$BASE/api/v1/keys/validate" \
            "${LE_HDR[@]}" -H "Authorization: Bearer $LE_TOKEN" \
            -H "Content-Type: application/json" -H "x-device-id: upgrade-test-device" \
            -d "{\"key\":\"$SK_KEY\",\"device_id\":\"upgrade-test-device\"}" >/dev/null 2>&1 || true
        UP=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/upgrade/pay" \
            "${LE_HDR[@]}" -H "Authorization: Bearer $LE_TOKEN" \
            -H "Content-Type: application/json" \
            -d "{\"plan_id\":\"creator\",\"email\":\"$LE_EMAIL\"}" 2>&1)
        check "POST /api/v1/upgrade/pay starter→creator order" 'order_id' "$UP"
        check "Upgrade price discounted to \$50" '"amount_usd":50' "$UP"
    fi
fi

# ═══════════════════════════════════════════════════════════════
section "10. LE CREDITS BURN"
# ═══════════════════════════════════════════════════════════════
if [ -n "$LE_TOKEN" ]; then
    R=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/credits/burn" \
        "${LE_HDR[@]}" -H "Authorization: Bearer $LE_TOKEN" \
        -H "Content-Type: application/json" -d '{"amount":1.0,"reason":"integration_test"}' 2>&1)
    check "POST /api/v1/credits/burn (LE)" 'total\|ok' "$R"
fi

# ═══════════════════════════════════════════════════════════════
section "11. VERSION / UPDATE"
# ═══════════════════════════════════════════════════════════════
R=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/update/check" \
    -H "Content-Type: application/json" -d '{"version":"1.8.0","platform":"linux"}' 2>&1)
check "POST /api/v1/update/check" 'latest\|force\|update' "$R"

# ═══════════════════════════════════════════════════════════════
section "12. LM AUTH FLOW (product header)"
# ═══════════════════════════════════════════════════════════════
LM_REG=$(curl -s $TIMEOUT -X POST "$BASE/api/v1/auth/register" \
    "${LM_HDR[@]}" -H "Content-Type: application/json" \
    -d "{\"email\":\"$LM_EMAIL\",\"password\":\"$LM_PASS\",\"display_name\":\"Test LM\"}" 2>&1)
check "POST /api/v1/auth/register (LM)" 'access_token\|conflict\|success' "$LM_REG"

LM_LOGIN=$(curl -s $TIMEOUT -X POST "$BASE/api/v1/auth/login" \
    "${LM_HDR[@]}" -H "Content-Type: application/json" \
    -d "{\"email\":\"$LM_EMAIL\",\"password\":\"$LM_PASS\"}" 2>&1)
check "POST /api/v1/auth/login (LM)" 'access_token' "$LM_LOGIN"
LM_TOKEN=$(echo "$LM_LOGIN" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token',''))" 2>/dev/null || echo "")

if [ -n "$LM_TOKEN" ]; then
    LM_BAL=$(curl -sf $TIMEOUT "$BASE/api/v1/credits/balance" "${LM_HDR[@]}" -H "Authorization: Bearer $LM_TOKEN" 2>&1)
    check "GET /api/v1/credits/balance (LM)" 'total\|credit_balance' "$LM_BAL"

    R=$(curl -sf $TIMEOUT "$BASE/api/v1/catalog" "${LM_HDR[@]}" 2>&1)
    check "GET /api/v1/catalog" 'characters\|id' "$R"

    R=$(curl -sf $TIMEOUT "$BASE/api/v1/payments/packages" "${LM_HDR[@]}" 2>&1)
    check "GET /api/v1/payments/packages" 'packages\|paystack' "$R"
fi

# ═══════════════════════════════════════════════════════════════
section "12b. UNIFIED ROUTES — register / logout-all / orders / characters / downloads"
# ═══════════════════════════════════════════════════════════════
LE2_EMAIL="le2_${TEST_ID}@test.local"
LE2_SIGNUP=$(curl -s $TIMEOUT -X POST "$BASE/api/v1/auth/register" \
    "${LE_HDR[@]}" -H "Content-Type: application/json" \
    -d "{\"email\":\"$LE2_EMAIL\",\"password\":\"$LE_PASS\",\"name\":\"Signup User\",\"phone\":\"08012345678\",\"accepted_terms\":true}" 2>&1)
check "POST /api/v1/auth/register (LE signup) → access_token" '"access_token"' "$LE2_SIGNUP"

# logout-all (single unified route: underscore) — runs last in this section because it revokes refresh tokens
if [ -n "$LE_TOKEN" ]; then
    R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/auth/logout_all" \
        "${LE_HDR[@]}" -H "Authorization: Bearer $LE_TOKEN" 2>&1)
    check_code "POST /api/v1/auth/logout_all" "200" "$R"
fi

# Order-verify / order-status exist (bad body → 400, not 404)
R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/payments/orders/verify" \
    -H "Content-Type: application/json" -d '{}' 2>&1)
check_code "POST /api/v1/payments/orders/verify (no body) → 400" "400" "$R"

if [ -n "$LE_TOKEN" ]; then
    R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" "$BASE/api/v1/payments/orders/nonexistent-order" \
        "${LE_HDR[@]}" -H "Authorization: Bearer $LE_TOKEN" 2>&1)
    check_code "GET /api/v1/payments/orders/nonexistent-order → 404" "404" "$R"
fi

# User characters CRUD (LiveMorph feature)
if [ -n "$LM_TOKEN" ]; then
    R=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/characters/mine" \
        "${LM_HDR[@]}" -H "Authorization: Bearer $LM_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"name":"Test Char","prompt":"a bold hero"}' 2>&1)
    check "POST /api/v1/characters/mine" '"character"\|"id"' "$R"
    CHAR_ID=$(echo "$R" | python3 -c "import sys,json; d=json.load(sys.stdin); c=d.get('character',d); print(c.get('id',''))" 2>/dev/null || echo "")

    R=$(curl -sf $TIMEOUT "$BASE/api/v1/characters/mine" "${LM_HDR[@]}" -H "Authorization: Bearer $LM_TOKEN" 2>&1)
    check "GET /api/v1/characters/mine" 'characters' "$R"

    if [ -n "$CHAR_ID" ]; then
        R=$(curl -sf $TIMEOUT -X DELETE "$BASE/api/v1/characters/mine/$CHAR_ID" \
            "${LM_HDR[@]}" -H "Authorization: Bearer $LM_TOKEN" 2>&1)
        check "DELETE /api/v1/characters/mine/{id}" 'ok\|deleted' "$R"
    fi
fi

# Downloads list + background select (LE)
if [ -n "$LE_TOKEN" ]; then
    R=$(curl -sf $TIMEOUT "$BASE/api/v1/downloads/list" "${LE_HDR[@]}" -H "Authorization: Bearer $LE_TOKEN" 2>&1)
    check "GET /api/v1/downloads/list (LE)" 'downloads' "$R"

    R=$(curl -s $TIMEOUT -X POST "$BASE/api/v1/streaming/background-select" \
        "${LE_HDR[@]}" -H "Authorization: Bearer $LE_TOKEN" \
        -H "Content-Type: application/json" -d '{"preset_id":"cyber"}' 2>&1)
    check "POST /api/v1/streaming/background-select (LE)" 'ok\|prompt' "$R"
fi

# ═══════════════════════════════════════════════════════════════
section "13. AUTH GUARDS (no token → 401)"
# ═══════════════════════════════════════════════════════════════
for endpoint in credits/balance credits/ledger metrics; do
    R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" "$BASE/api/v1/$endpoint" 2>&1)
    check_code "GET /api/v1/$endpoint no token → 401" "401" "$R"
done

for endpoint in stream/start streaming/session-start keys/validate; do
    R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/$endpoint" \
        -H "Content-Type: application/json" -d '{}' 2>&1)
    check_code "POST /api/v1/$endpoint no token → 401" "401" "$R"
done

# ═══════════════════════════════════════════════════════════════
section "14. WEBHOOK SIGNATURE VERIFICATION"
# ═══════════════════════════════════════════════════════════════
R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/payments/webhook/paystack" \
    -H "Content-Type: application/json" -H "X-Paystack-Signature: invalid_signature" \
    -d '{"event":"charge.success","data":{"reference":"test_ref"}}' 2>&1)
check_code "Paystack webhook invalid sig → 403" "403" "$R"

R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/payments/webhook/nowpayments" \
    -H "Content-Type: application/json" -H "X-Nowpayments-Signature: invalid" \
    -d '{"payment_id":123,"order_id":"test","payment_status":"finished"}' 2>&1)
if [ "$R" = "403" ] || [ "$R" = "401" ]; then
    echo -e "  ${GREEN}✓${NC} NOWPayments webhook invalid sig → $R"
    PASS=$((PASS + 1)); TESTS+=("PASS: NOWPayments webhook rejects invalid sig")
else
    check_code "NOWPayments webhook invalid sig → 401/403" "403" "$R"
fi

# ═══════════════════════════════════════════════════════════════
section "15. EDGE CASES"
# ═══════════════════════════════════════════════════════════════
R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/auth/login" \
    -H "Content-Type: application/json" -d 'not json' 2>&1)
check_code "Invalid JSON → 4xx" "400" "$R"

R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" "$BASE/api/v1/this/does/not/exist" 2>&1)
check_code "Nonexistent endpoint → 404" "404" "$R"

R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" "$BASE/legacy/root/path" 2>&1)
check_code "Root legacy path → 404 (dropped)" "404" "$R"

# Summary
section "TEST RESULTS SUMMARY"
TOTAL=$((PASS + FAIL + WARN))
echo ""
echo -e "  Total tests:  ${TOTAL}"
echo -e "  ${GREEN}Passed:${NC}       $PASS"
echo -e "  ${RED}Failed:${NC}       $FAIL"
echo -e "  ${YELLOW}Warnings:${NC}     $WARN"
echo ""
if [ $FAIL -gt 0 ]; then
    echo -e "${RED}═══════════════════════════════════════════════════════${NC}"
    echo -e "${RED}  FAILED TESTS:${NC}"
    echo -e "${RED}═══════════════════════════════════════════════════════${NC}"
    for t in "${TESTS[@]}"; do
        [[ "$t" == FAIL:* ]] && echo -e "  ${RED}✗${NC} ${t#FAIL: }"
    done
fi
echo ""
if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║  ALL TESTS PASSED ✓                                  ║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"
else
    echo -e "${RED}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║  $FAIL TEST(S) FAILED                                ║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════╝${NC}"
fi
exit $FAIL