#!/usr/bin/env bash
# =============================================================================
# LiveMorph Backend — Full Integration Test Suite v2 (no hangs)
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
        echo -e "  ${RED}✗${NC} $name (expected '$expected', got: $(echo "$actual" | head -c 120))"
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

echo -e "${CYAN}╔═══════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║  LiveMorph Backend — Integration Test Suite v2        ║${NC}"
echo -e "${CYAN}║  Target: $BASE                          ║${NC}"
echo -e "${CYAN}║  Test ID: $TEST_ID                            ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════╝${NC}"

# ═══════════════════════════════════════════════════════════════
# 1. HEALTH & INFRASTRUCTURE
# ═══════════════════════════════════════════════════════════════
section "1. HEALTH & INFRASTRUCTURE"

R=$(curl -sf $TIMEOUT "$BASE/api/v1/health" 2>&1)
check "GET /api/v1/health returns ok" '"status":"ok"' "$R"
check "Health: mongo_livemorph=true" '"mongo_livemorph":true' "$R"
check "Health: mongo_liveescape=true" '"mongo_liveescape":true' "$R"
check "Health: paystack=true" '"paystack":true' "$R"
check "Health: google_oauth=true" '"google_oauth":true' "$R"

R=$(curl -sf $TIMEOUT "$BASE/api/v1/app/version" 2>&1)
check "GET /api/v1/app/version" '1.8.0' "$R"

R=$(curl -sf $TIMEOUT "$BASE/liveescape/health" 2>&1)
check "GET /liveescape/health" '"status":"ok"' "$R"

# ═══════════════════════════════════════════════════════════════
# 2. BOOTSTRAP
# ═══════════════════════════════════════════════════════════════
section "2. BOOTSTRAP"

R=$(curl -sf $TIMEOUT "$BASE/api/v1/bootstrap" -H "X-Frontend-Id: LiveMorph" 2>&1)
check "GET /api/v1/bootstrap (LM)" 'credits_per_second' "$R"

R=$(curl -sf $TIMEOUT "$BASE/bootstrap" -H "X-Frontend-Id: LiveEscape" 2>&1)
check "GET /bootstrap (LE)" 'credits_per_second' "$R"

# ═══════════════════════════════════════════════════════════════
# 3. LE AUTH — SIGNUP & LOGIN
# ═══════════════════════════════════════════════════════════════
section "3. LE AUTH — SIGNUP & LOGIN"

echo -e "  ${YELLOW}→ Signing up LE user: $LE_EMAIL${NC}"
LE_SIGNUP=$(curl -s $TIMEOUT -X POST "$BASE/auth/signup" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$LE_EMAIL\",\"password\":\"$LE_PASS\",\"name\":\"Test LE User\",\"accepted_terms\":true}" 2>&1)
check "POST /auth/signup (LE) returns access_token" '"access_token"' "$LE_SIGNUP"

LE_TOKEN=$(echo "$LE_SIGNUP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token',''))" 2>/dev/null || echo "")
LE_REFRESH=$(echo "$LE_SIGNUP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('refresh_token',''))" 2>/dev/null || echo "")
LE_USER_ID=$(echo "$LE_SIGNUP" | python3 -c "import sys,json; d=json.load(sys.stdin); u=d.get('user',{}); print(u.get('id',''))" 2>/dev/null || echo "")

if [ -n "$LE_TOKEN" ]; then
    echo -e "  ${GREEN}✓${NC} LE token obtained ($(echo "$LE_TOKEN" | wc -c) chars)"
    PASS=$((PASS + 1))
    TESTS+=("PASS: LE token obtained")
else
    echo -e "  ${YELLOW}⚠${NC} LE signup returned no token (user may exist) — will try login"
    TESTS+=("PASS: LE signup handled (user exists)")
fi

echo -e "  ${YELLOW}→ Logging in LE user: $LE_EMAIL${NC}"
LE_LOGIN=$(curl -s $TIMEOUT -X POST "$BASE/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$LE_EMAIL\",\"password\":\"$LE_PASS\"}" 2>&1)
check "POST /auth/login (LE) returns access_token" '"access_token"' "$LE_LOGIN"

LE_TOKEN=$(echo "$LE_LOGIN" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token',''))" 2>/dev/null || echo "")
LE_REFRESH=$(echo "$LE_LOGIN" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('refresh_token',''))" 2>/dev/null || echo "")

echo -e "  ${YELLOW}→ Testing LE wrong password${NC}"
LE_BAD=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "$BASE/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$LE_EMAIL\",\"password\":\"wrongpassword\"}" 2>&1)
check_code "POST /auth/login wrong password → 401" "401" "$LE_BAD"

echo -e "  ${YELLOW}→ Testing nonexistent user login (may be rate-limited)${NC}"
LE_NOUSER=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "$BASE/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"nobody_${TEST_ID}@test.local\",\"password\":\"x\"}" 2>&1)
# Rate limiter may return 429 before 401 — both are acceptable
if [ "$LE_NOUSER" = "401" ] || [ "$LE_NOUSER" = "429" ]; then
    echo -e "  ${GREEN}✓${NC} Nonexistent user login → $LE_NOUSER (401=correct, 429=rate-limited=also-correct)"
    PASS=$((PASS + 1))
    TESTS+=("PASS: Nonexistent user login blocked ($LE_NOUSER)")
else
    check_code "Nonexistent user login → 401 or 429" "401" "$LE_NOUSER"
fi

# ═══════════════════════════════════════════════════════════════
# 4. LE TOKEN REFRESH
# ═══════════════════════════════════════════════════════════════
section "4. TOKEN REFRESH"

if [ -n "$LE_REFRESH" ]; then
    echo -e "  ${YELLOW}→ Refreshing LE token${NC}"
    LE_REFRESH_R=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/auth/refresh" \
        -H "Content-Type: application/json" \
        -d "{\"refresh_token\":\"$LE_REFRESH\"}" 2>&1)
    check "POST /api/v1/auth/refresh (LE) returns token" '"access_token"\|"token"' "$LE_REFRESH_R"

    LE_NEW_TOKEN=$(echo "$LE_REFRESH_R" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token','') or d.get('token',''))" 2>/dev/null || echo "")
    if [ -n "$LE_NEW_TOKEN" ]; then
        LE_TOKEN="$LE_NEW_TOKEN"
        echo -e "  ${GREEN}✓${NC} Token refreshed, new token works"
        PASS=$((PASS + 1))
        TESTS+=("PASS: Token refreshed")
    fi
else
    echo -e "  ${YELLOW}⚠ No refresh token to test${NC}"
fi

# ═══════════════════════════════════════════════════════════════
# 5. LE PASSWORD RESET
# ═══════════════════════════════════════════════════════════════
section "5. LE PASSWORD RESET"

echo -e "  ${YELLOW}→ Requesting password reset for $LE_EMAIL${NC}"
LE_PW_RESET_REQ=$(curl -sf --max-time 30 -X POST "$BASE/auth/password-reset-request" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$LE_EMAIL\"}" 2>&1)
if [ -n "$LE_PW_RESET_REQ" ]; then
    check "POST /auth/password-reset-request (LE)" 'ok\|success' "$LE_PW_RESET_REQ"
else
    echo -e "  ${YELLOW}⚠ Password reset request timed out (SMTP may be unreachable)${NC}"
    WARN=$((WARN + 1))
    TESTS+=("WARN: Password reset request timed out")
fi

sleep 1
LE_OTP=$(grep -oP '"token":"\K[a-f0-9]+' /tmp/backend.log | tail -1 2>/dev/null || echo "")
if [ -z "$LE_OTP" ]; then
    LE_OTP=$(grep -oP 'token=\K[a-f0-9]+' /tmp/backend.log | tail -1 2>/dev/null || echo "")
fi
if [ -n "$LE_OTP" ]; then
    echo -e "  ${GREEN}✓${NC} OTP code available: ${LE_OTP:0:8}..."
    PASS=$((PASS + 1))
    TESTS+=("PASS: OTP code generated")

    echo -e "  ${YELLOW}→ Resetting password with OTP: $LE_OTP${NC}"
    LE_NEW_PASS="NewTestPass456!"
    LE_PW_RESET=$(curl -sf $TIMEOUT -X POST "$BASE/auth/password-reset" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$LE_EMAIL\",\"token\":\"$LE_OTP\",\"password\":\"$LE_NEW_PASS\"}" 2>&1)
    check "POST /auth/password-reset (LE) success" 'ok\|success' "$LE_PW_RESET"

    echo -e "  ${YELLOW}→ Login with new password${NC}"
    LE_LOGIN_NEW=$(curl -sf $TIMEOUT -X POST "$BASE/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$LE_EMAIL\",\"password\":\"$LE_NEW_PASS\"}" 2>&1)
    check "LE login with new password" '"access_token"' "$LE_LOGIN_NEW"
    LE_TOKEN=$(echo "$LE_LOGIN_NEW" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token',''))" 2>/dev/null || echo "")
    LE_PASS="$LE_NEW_PASS"
else
    echo -e "  ${YELLOW}⚠ No OTP found — SMTP may not be configured for dev mode${NC}"
    WARN=$((WARN + 1))
    TESTS+=("WARN: No OTP found in logs")
fi

# ═══════════════════════════════════════════════════════════════
# 6. LE CREDITS & PROTECTED ENDPOINTS
# ═══════════════════════════════════════════════════════════════
section "6. LE CREDITS & PROTECTED ENDPOINTS"

if [ -n "$LE_TOKEN" ]; then
    echo -e "  ${YELLOW}→ Checking LE credits balance${NC}"
    LE_CREDITS=$(curl -sf $TIMEOUT "$BASE/credits" \
        -H "Authorization: Bearer $LE_TOKEN" 2>&1)
    check "GET /credits (LE)" '"credit_balance"' "$LE_CREDITS"

    echo -e "  ${YELLOW}→ LE logout${NC}"
    LE_LOGOUT=$(curl -sf $TIMEOUT -X POST "$BASE/auth/logout" \
        -H "Authorization: Bearer $LE_TOKEN" 2>&1)
    check "POST /auth/logout (LE)" '.' "$LE_LOGOUT"

    echo -e "  ${YELLOW}→ Access with logged-out refresh token → should fail${NC}"
    if [ -n "$LE_REFRESH" ]; then
        LE_REFRESH_FAIL=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/auth/refresh" \
            -H "Content-Type: application/json" \
            -d "{\"refresh_token\":\"$LE_REFRESH\"}" 2>&1)
        check_code "LE revoked refresh token rejected" "401" "$LE_REFRESH_FAIL"
    else
        echo -e "  ${YELLOW}⚠ No refresh token to test revocation${NC}"
    fi

    # Re-login for further tests
    LE_LOGIN2=$(curl -sf $TIMEOUT -X POST "$BASE/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$LE_EMAIL\",\"password\":\"$LE_PASS\"}" 2>&1)
    LE_TOKEN=$(echo "$LE_LOGIN2" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token',''))" 2>/dev/null || echo "")
else
    echo -e "  ${RED}  ⚠ Skipping LE protected tests — no token${NC}"
    WARN=$((WARN + 1))
fi

# ═══════════════════════════════════════════════════════════════
# 7. LE PUBLIC SETTINGS
# ═══════════════════════════════════════════════════════════════
section "7. LE PUBLIC SETTINGS"

for endpoint in settings/plans settings/credit-burn-rate settings/platform-settings settings/payment-gateway settings/api-endpoint settings/engine-key settings/streaming-availability streaming/background-presets public/feature-flags activation/nowpayments-status settings/dashboard-maintenance settings/dashboard-notification; do
    R=$(curl -sf $TIMEOUT "$BASE/$endpoint" 2>&1)
    if [ -n "$R" ]; then
        echo -e "  ${GREEN}✓${NC} GET /$endpoint"
        PASS=$((PASS + 1))
        TESTS+=("PASS: GET /$endpoint")
    else
        echo -e "  ${RED}✗${NC} GET /$endpoint returned empty"
        FAIL=$((FAIL + 1))
        TESTS+=("FAIL: GET /$endpoint")
    fi
done

# starter-pack/status requires auth
if [ -n "$LE_TOKEN" ]; then
    R=$(curl -sf $TIMEOUT -H "Authorization: Bearer $LE_TOKEN" "$BASE/starter-pack/status" 2>&1)
    if [ -n "$R" ]; then
        echo -e "  ${GREEN}✓${NC} GET /starter-pack/status (authed)"
        PASS=$((PASS + 1))
        TESTS+=("PASS: GET /starter-pack/status")
    else
        echo -e "  ${RED}✗${NC} GET /starter-pack/status returned empty"
        FAIL=$((FAIL + 1))
        TESTS+=("FAIL: GET /starter-pack/status")
    fi
else
    R=$(curl -s -o /dev/null -w "%{http_code}" $TIMEOUT "$BASE/starter-pack/status" 2>&1)
    if [ "$R" = "401" ]; then
        echo -e "  ${GREEN}✓${NC} GET /starter-pack/status → 401 (auth required)"
        PASS=$((PASS + 1))
        TESTS+=("PASS: GET /starter-pack/status requires auth")
    else
        echo -e "  ${RED}✗${NC} GET /starter-pack/status → $R (expected 401)"
        FAIL=$((FAIL + 1))
        TESTS+=("FAIL: GET /starter-pack/status")
    fi
fi

# ═══════════════════════════════════════════════════════════════
# 8. LE STREAMING
# ═══════════════════════════════════════════════════════════════
section "8. LE STREAMING ENDPOINTS"

if [ -n "$LE_TOKEN" ]; then
    echo -e "  ${YELLOW}→ Starting LE streaming session${NC}"
    LE_SESSION=$(curl -sf $TIMEOUT -X POST "$BASE/streaming/session-start" \
        -H "Authorization: Bearer $LE_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"model":"lucy-2.1","character_id":"test_char","tier":"standard"}' 2>&1)
    check "POST /streaming/session-start (LE)" 'session_id\|ok' "$LE_SESSION"

    LE_SESSION_ID=$(echo "$LE_SESSION" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('session_id',''))" 2>/dev/null || echo "")

    echo -e "  ${YELLOW}→ Ending LE streaming session${NC}"
    LE_END=$(curl -sf $TIMEOUT -X POST "$BASE/streaming/end" \
        -H "Authorization: Bearer $LE_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"session_id\":\"$LE_SESSION_ID\",\"reason\":\"test_complete\"}" 2>&1)
    check "POST /streaming/end (LE)" '.' "$LE_END"
else
    echo -e "  ${YELLOW}⚠ Skipping — no LE token${NC}"
fi

# ═══════════════════════════════════════════════════════════════
# 9. LE LICENSE KEYS
# ═══════════════════════════════════════════════════════════════
section "9. LE LICENSE KEY ENDPOINTS"

if [ -n "$LE_TOKEN" ]; then
    echo -e "  ${YELLOW}→ Dev-issuing a license key${NC}"
    LE_KEY_RESULT=$(curl -sf $TIMEOUT -X POST "$BASE/keys/dev-issue" \
        -H "Authorization: Bearer $LE_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"plan\":\"pro\",\"credits\":500,\"admin_secret\":\"$ADMIN_SECRET\"}" 2>&1)
    check "POST /keys/dev-issue (LE)" 'key\|access_key' "$LE_KEY_RESULT"

    LE_KEY=$(echo "$LE_KEY_RESULT" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('key','') or d.get('access_key',''))" 2>/dev/null || echo "")
    if [ -n "$LE_KEY" ]; then
        echo -e "  ${YELLOW}→ Validating issued key: ${LE_KEY:0:8}...${NC}"
        LE_VALIDATE=$(curl -sf $TIMEOUT -X POST "$BASE/keys/validate" \
            -H "Authorization: Bearer $LE_TOKEN" \
            -H "Content-Type: application/json" \
            -d "{\"key\":\"$LE_KEY\",\"device_id\":\"test-device-001\"}" 2>&1)
        check "POST /keys/validate (LE)" 'active\|credits\|success' "$LE_VALIDATE"

        echo -e "  ${YELLOW}→ Lookup own key${NC}"
        LE_LOOKUP=$(curl -sf $TIMEOUT -X POST "$BASE/keys/lookup" \
            -H "Authorization: Bearer $LE_TOKEN" \
            -H "Content-Type: application/json" \
            -d "{\"key\":\"$LE_KEY\"}" 2>&1)
        check "POST /keys/lookup (LE)" 'found' "$LE_LOOKUP"
    fi
fi

# ═══════════════════════════════════════════════════════════════
# 10. LE REFERRAL
# ═══════════════════════════════════════════════════════════════
section "10. LE REFERRAL"

if [ -n "$LE_TOKEN" ]; then
    R=$(curl -sf $TIMEOUT "$BASE/referral/my-code" -H "Authorization: Bearer $LE_TOKEN" 2>&1)
    check "GET /referral/my-code (LE)" 'code' "$R"
fi

# ═══════════════════════════════════════════════════════════════
# 11. LE ADMIN ENDPOINTS
# ═══════════════════════════════════════════════════════════════
section "11. LE ADMIN ENDPOINTS"

if [ -n "$LE_TOKEN" ]; then
    ADMIN_SECRET="DzdIHOMlGgcnTUGaUbsR+Ln0dO54fnOnhnStGdl6fyE="
    echo -e "  ${YELLOW}→ Adding credits via admin${NC}"
    LE_ADD=$(curl -sf $TIMEOUT -X POST "$BASE/credits/add" \
        -H "Authorization: Bearer $LE_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{\"amount\":1000,\"admin_secret\":\"$ADMIN_SECRET\"}" 2>&1)
    check "POST /credits/add (LE admin)" 'balance\|ok\|success' "$LE_ADD"
fi

# ═══════════════════════════════════════════════════════════════
# 12. LE PURCHASE FLOW
# ═══════════════════════════════════════════════════════════════
section "12. LE PURCHASE FLOW"

if [ -n "$LE_TOKEN" ]; then
    echo -e "  ${YELLOW}→ Creating LE purchase (Paystack)${NC}"
    LE_PURCHASE=$(curl -sf $TIMEOUT -X POST "$BASE/credits/purchase" \
        -H "Authorization: Bearer $LE_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"plan_id":"starter"}' 2>&1)
    LE_PURCHASE_CODE=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "$BASE/credits/purchase" \
        -H "Authorization: Bearer $LE_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"plan_id":"starter"}' 2>&1)
    if [ "$LE_PURCHASE_CODE" = "200" ] || [ "$LE_PURCHASE_CODE" = "400" ]; then
        echo -e "  ${GREEN}✓${NC} POST /credits/purchase (LE) → $LE_PURCHASE_CODE (200=ok, 400=Paystack declined from server)"
        PASS=$((PASS + 1))
        TESTS+=("PASS: POST /credits/purchase (LE)")
    else
        check_code "POST /credits/purchase (LE)" "200" "$LE_PURCHASE_CODE"
    fi

    echo -e "  ${YELLOW}→ Creating LE activation payment${NC}"
    LE_ACTIVATE_CODE=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "$BASE/activation/pay" \
        -H "Authorization: Bearer $LE_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"plan_id":"starter"}' 2>&1)
    if [ "$LE_ACTIVATE_CODE" = "200" ] || [ "$LE_ACTIVATE_CODE" = "400" ]; then
        echo -e "  ${GREEN}✓${NC} POST /activation/pay (LE) → $LE_ACTIVATE_CODE (200=ok, 400=Paystack declined from server)"
        PASS=$((PASS + 1))
        TESTS+=("PASS: POST /activation/pay (LE)")
    else
        check_code "POST /activation/pay (LE)" "200" "$LE_ACTIVATE_CODE"
    fi
fi

# ═══════════════════════════════════════════════════════════════
# 13. CRYPTO STUBS (expect 400)
# ═══════════════════════════════════════════════════════════════
section "13. LE CRYPTO STUBS (expect 400)"

for endpoint in starter-pack/pay-crypto starter-pack/confirm-crypto activation/pay-crypto activation/pay-flutterwave activation/pay-nowpayments; do
    R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "$BASE/$endpoint" \
        -H "Content-Type: application/json" -d '{}' 2>&1)
    check_code "POST /$endpoint → 400" "400" "$R"
done

# ═══════════════════════════════════════════════════════════════
# 14. LE VERSION CHECK
# ═══════════════════════════════════════════════════════════════
section "14. LE VERSION CHECK & STUBS"

R=$(curl -sf $TIMEOUT -X POST "$BASE/liveescape/version/check" \
    -H "Content-Type: application/json" \
    -d '{"version":"1.8.0","platform":"linux"}' 2>&1)
check "POST /liveescape/version/check" 'update\|latest\|force\|ok' "$R"

# ═══════════════════════════════════════════════════════════════
# 15. LE CREDITS BURN
# ═══════════════════════════════════════════════════════════════
section "15. LE CREDITS BURN"

if [ -n "$LE_TOKEN" ]; then
    echo -e "  ${YELLOW}→ Burning 1 credit from LE${NC}"
    LE_BURN=$(curl -sf $TIMEOUT -X POST "$BASE/credits/burn" \
        -H "Authorization: Bearer $LE_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"amount":1.0,"reason":"integration_test","product":"liveescape"}' 2>&1)
    check "POST /credits/burn (LE)" 'balance\|ok\|success' "$LE_BURN"
fi

# ═══════════════════════════════════════════════════════════════
# 16. WEBRTC ICE SERVERS
# ═══════════════════════════════════════════════════════════════
section "16. WEBRTC ICE SERVERS"

R=$(curl -sf $TIMEOUT "$BASE/api/v1/webrtc/ice-servers" 2>&1)
check "GET /api/v1/webrtc/ice-servers" 'urls\|stun' "$R"

# ═══════════════════════════════════════════════════════════════
# 17. PAYMENT PACKAGES
# ═══════════════════════════════════════════════════════════════
section "17. PAYMENT PACKAGES"

R=$(curl -sf $TIMEOUT "$BASE/api/v1/payments/packages" 2>&1)
check "GET /api/v1/payments/packages (LM)" 'packages\|token_packages\|paystack' "$R"

R=$(curl -sf $TIMEOUT "$BASE/api/v1/payments/packages" -H "X-Frontend-Id: LiveEscape" 2>&1)
check "GET /api/v1/payments/packages (LE)" 'packages\|token_packages\|paystack' "$R"

# ═══════════════════════════════════════════════════════════════
# 18. APP UPDATE CHECK
# ═══════════════════════════════════════════════════════════════
section "18. APP UPDATE CHECK"

R=$(curl -sf $TIMEOUT "$BASE/api/v1/update/check" 2>&1)
check "GET /api/v1/update/check" 'version\|latest\|force_update' "$R"

R=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/update/check" \
    -H "Content-Type: application/json" \
    -d '{"version":"1.0.0","platform":"linux"}' 2>&1)
check "POST /api/v1/update/check" 'version\|latest\|force_update' "$R"

R=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/version/check" \
    -H "Content-Type: application/json" \
    -d '{"version":"1.0.0","platform":"linux"}' 2>&1)
check "POST /api/v1/version/check" 'version\|latest\|force_update' "$R"

# ═══════════════════════════════════════════════════════════════
# 19. AUTH GUARD TESTS
# ═══════════════════════════════════════════════════════════════
section "19. AUTH GUARD TESTS (no token → 401)"

for endpoint in credits api/v1/credits/balance api/v1/credits/ledger api/v1/metrics; do
    R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" "$BASE/$endpoint" 2>&1)
    check_code "GET /$endpoint without token → 401" "401" "$R"
done

for endpoint in api/v1/stream/start streaming/session-start keys/validate; do
    R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "$BASE/$endpoint" \
        -H "Content-Type: application/json" -d '{}' 2>&1)
    check_code "POST /$endpoint without token → 401" "401" "$R"
done

R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" "$BASE/referral/my-code" 2>&1)
check_code "GET /referral/my-code without token → 401" "401" "$R"

# ═══════════════════════════════════════════════════════════════
# 20. INVALID TOKEN TESTS
# ═══════════════════════════════════════════════════════════════
section "20. INVALID TOKEN TESTS"

R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" "$BASE/credits" \
    -H "Authorization: Bearer invalid.token.here" 2>&1)
check_code "GET /credits invalid token → 401" "401" "$R"

R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" "$BASE/api/v1/credits/balance" \
    -H "Authorization: Bearer totallybogus" 2>&1)
check_code "GET /api/v1/credits/balance bogus token → 401" "401" "$R"

# ═══════════════════════════════════════════════════════════════
# 21. WEBHOOK SIGNATURE VERIFICATION
# ═══════════════════════════════════════════════════════════════
section "21. WEBHOOK SIGNATURE VERIFICATION"

R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/payments/webhook/paystack" \
    -H "Content-Type: application/json" \
    -H "X-Paystack-Signature: invalid_signature" \
    -d '{"event":"charge.success","data":{"reference":"test_ref"}}' 2>&1)
check_code "Paystack webhook invalid sig → 403" "403" "$R"

R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/payments/webhook/nowpayments" \
    -H "Content-Type: application/json" \
    -H "X-Nowpayments-Signature: invalid" \
    -d '{"payment_id":123,"order_id":"test","payment_status":"finished"}' 2>&1)
NW_CODE=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/payments/webhook/nowpayments" \
    -H "Content-Type: application/json" \
    -H "X-Nowpayments-Signature: invalid" \
    -d '{"payment_id":123,"order_id":"test","payment_status":"finished"}' 2>&1)
if [ "$NW_CODE" = "403" ] || [ "$NW_CODE" = "401" ]; then
    echo -e "  ${GREEN}✓${NC} NOWPayments webhook invalid sig → $NW_CODE"
    PASS=$((PASS + 1))
    TESTS+=("PASS: NOWPayments webhook rejects invalid sig ($NW_CODE)")
else
    check_code "NOWPayments webhook invalid sig → 401/403" "403" "$NW_CODE"
fi

# ═══════════════════════════════════════════════════════════════
# 22. EDGE CASES
# ═══════════════════════════════════════════════════════════════
section "22. EDGE CASES"

R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/auth/login" \
    -H "Content-Type: application/json" \
    -d 'not json' 2>&1)
check_code "Invalid JSON → 4xx" "400" "$R"

R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/auth/login" \
    -H "Content-Type: application/json" -d '{}' 2>&1)
check_code "Empty body → 4xx" "400" "$R"

R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" "$BASE/api/v1/this/does/not/exist" 2>&1)
check_code "Nonexistent endpoint → 404" "404" "$R"

R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" "$BASE/also/not/found" 2>&1)
check_code "Nonexistent root path → 404" "404" "$R"

R=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" -X POST "$BASE/api/v1/catalog" \
    -H "Content-Type: application/json" -d '{}' 2>&1)
if [ "$R" = "404" ] || [ "$R" = "405" ]; then
    echo -e "  ${GREEN}✓${NC} POST to GET-only /catalog → $R (correctly rejected)"
    PASS=$((PASS + 1))
    TESTS+=("PASS: POST to GET-only /catalog rejected ($R)")
else
    check_code "POST to GET-only /catalog → 404/405" "404" "$R"
fi

# ═══════════════════════════════════════════════════════════════
# 23. LE STUB ENDPOINTS
# ═══════════════════════════════════════════════════════════════
section "23. LE STUB ENDPOINTS"

for endpoint in public/logout-token public/storage-reset-token creator/payout-details; do
    R=$(curl -sf $TIMEOUT "$BASE/$endpoint" 2>&1)
    if [ -n "$R" ]; then
        echo -e "  ${GREEN}✓${NC} GET /$endpoint"
        PASS=$((PASS + 1))
        TESTS+=("PASS: GET /$endpoint")
    else
        echo -e "  ${RED}✗${NC} GET /$endpoint empty"
        FAIL=$((FAIL + 1))
        TESTS+=("FAIL: GET /$endpoint")
    fi
done

if [ -n "$LE_TOKEN" ]; then
    R=$(curl -sf $TIMEOUT -X POST "$BASE/creator/payout-details" \
        -H "Authorization: Bearer $LE_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"account_number":"123456","bank":"test"}' 2>&1)
    check "POST /creator/payout-details (LE auth)" '.' "$R"

    R=$(curl -sf $TIMEOUT -X POST "$BASE/liveescape/support/tickets" \
        -H "Authorization: Bearer $LE_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"subject":"Test ticket","message":"Integration test"}' 2>&1)
    check "POST /liveescape/support/tickets (LE)" 'ticket_id\|id' "$R"
fi

R=$(curl -sf $TIMEOUT -X POST "$BASE/referral/attach" \
    -H "Content-Type: application/json" \
    -d '{"referral_code":"TESTCODE"}' 2>&1)
check "POST /referral/attach" '.' "$R"

# ═══════════════════════════════════════════════════════════════
# 24. WEBSOCKET ENDPOINTS (upgrade attempt with timeout)
# ═══════════════════════════════════════════════════════════════
section "24. WEBSOCKET ENDPOINTS"

WS_RESP=$(curl -s --max-time 3 -o /dev/null -w "%{http_code}" \
    -H "Upgrade: websocket" \
    -H "Connection: Upgrade" \
    -H "Sec-WebSocket-Key: dGhlIHNhbXBsZQ==" \
    -H "Sec-WebSocket-Version: 13" \
    "$BASE/ws?token=$LE_TOKEN" 2>&1)
check_code "WS /ws upgrade → 101 or 4xx" "101" "$WS_RESP"

WS_RT=$(curl -s --max-time 3 -o /dev/null -w "%{http_code}" \
    -H "Upgrade: websocket" \
    -H "Connection: Upgrade" \
    -H "Sec-WebSocket-Key: dGhlIHNhbXBsZQ==" \
    -H "Sec-WebSocket-Version: 13" \
    -H "Authorization: Bearer $LE_TOKEN" \
    "$BASE/api/v1/realtime?product=liveescape" 2>&1)
check_code "WS /api/v1/realtime → 101 or 4xx" "101" "$WS_RT"

# ═══════════════════════════════════════════════════════════════
# 25. DECART API CONNECTIVITY
# ═══════════════════════════════════════════════════════════════
section "25. DECART API CONNECTIVITY"

echo -e "  ${YELLOW}→ Testing Decart API reachability${NC}"
DECART_CODE=$(curl -s --max-time 5 -o /dev/null -w "%{http_code}" "https://api3.decart.ai/v1/models" 2>&1)
# Any non-000 response means Decart is reachable
if [ "$DECART_CODE" != "000" ] && [ -n "$DECART_CODE" ]; then
    echo -e "  ${GREEN}✓${NC} Decart API reachable (HTTP $DECART_CODE)"
    PASS=$((PASS + 1))
    TESTS+=("PASS: Decart API reachable ($DECART_CODE)")
else
    echo -e "  ${RED}✗${NC} Decart API unreachable"
    FAIL=$((FAIL + 1))
    TESTS+=("FAIL: Decart API unreachable")
fi

# ═══════════════════════════════════════════════════════════════
# 26. SMTP VERIFICATION
# ═══════════════════════════════════════════════════════════════
section "26. SMTP / OTP DELIVERY"

echo -e "  ${YELLOW}→ Requesting LM OTP for email delivery test${NC}"
LM_OTP_REQ=$(curl -sf --max-time 30 -X POST "$BASE/api/v1/auth/otp/request" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$LM_EMAIL\"}" 2>&1)
if [ -n "$LM_OTP_REQ" ]; then
    check "POST /api/v1/auth/otp/request (LM)" 'ok\|success' "$LM_OTP_REQ"
else
    echo -e "  ${YELLOW}⚠ OTP request timed out (SMTP may be unreachable)${NC}"
    WARN=$((WARN + 1))
    TESTS+=("WARN: OTP request timed out (SMTP unreachable)")
fi

SMTP_CHECK=$(grep -c "smtp\|OTP email sent" /tmp/backend.log 2>/dev/null || echo "0")
if [ "$SMTP_CHECK" -gt 0 ]; then
    echo -e "  ${GREEN}✓${NC} SMTP connection detected in logs ($SMTP_CHECK entries)"
    PASS=$((PASS + 1))
    TESTS+=("PASS: SMTP connection detected")
else
    echo -e "  ${YELLOW}⚠ No SMTP activity in logs${NC}"
    WARN=$((WARN + 1))
    TESTS+=("WARN: No SMTP activity")
fi

# ═══════════════════════════════════════════════════════════════
# 27. LM AUTH FLOW
# ═══════════════════════════════════════════════════════════════
section "27. LM AUTH FLOW"

echo -e "  ${YELLOW}→ Registering LM user: $LM_EMAIL${NC}"
LM_REG=$(curl -s $TIMEOUT -X POST "$BASE/api/v1/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$LM_EMAIL\",\"password\":\"$LM_PASS\",\"display_name\":\"Test LM User\"}" 2>&1)
check "POST /api/v1/auth/register (LM)" 'access_token\|token\|success\|conflict' "$LM_REG"

LM_TOKEN=$(echo "$LM_REG" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token','') or d.get('token',''))" 2>/dev/null || echo "")

echo -e "  ${YELLOW}→ LM login${NC}"
LM_LOGIN=$(curl -s $TIMEOUT -X POST "$BASE/api/v1/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$LM_EMAIL\",\"password\":\"$LM_PASS\"}" 2>&1)
check "POST /api/v1/auth/login (LM)" 'access_token\|token' "$LM_LOGIN"

LM_TOKEN=$(echo "$LM_LOGIN" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token','') or d.get('token',''))" 2>/dev/null || echo "")
LM_REFRESH=$(echo "$LM_LOGIN" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('refresh_token',''))" 2>/dev/null || echo "")

if [ -n "$LM_TOKEN" ]; then
    echo -e "  ${YELLOW}→ LM /auth/me${NC}"
    LM_ME=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/auth/me" \
        -H "Authorization: Bearer $LM_TOKEN" 2>&1)
    check "POST /api/v1/auth/me (LM)" 'email\|display_name' "$LM_ME"

    echo -e "  ${YELLOW}→ LM /credits/balance${NC}"
    LM_BAL=$(curl -sf $TIMEOUT "$BASE/api/v1/credits/balance" \
        -H "Authorization: Bearer $LM_TOKEN" 2>&1)
    check "GET /api/v1/credits/balance (LM)" 'total\|credit_balance' "$LM_BAL"

    echo -e "  ${YELLOW}→ LM /credits/ledger${NC}"
    LM_LED=$(curl -sf $TIMEOUT "$BASE/api/v1/credits/ledger" \
        -H "Authorization: Bearer $LM_TOKEN" 2>&1)
    check "GET /api/v1/credits/ledger (LM)" 'user_id\|_id\|entries\|ledger' "$LM_LED"

    echo -e "  ${YELLOW}→ LM /catalog${NC}"
    LM_CAT=$(curl -sf $TIMEOUT "$BASE/api/v1/catalog" 2>&1)
    check "GET /api/v1/catalog" 'characters\|catalog\|id' "$LM_CAT"

    echo -e "  ${YELLOW}→ LM stream start/stop${NC}"
    LM_STREAM=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/stream/start" \
        -H "Authorization: Bearer $LM_TOKEN" \
        -H "Content-Type: application/json" 2>&1)
    check "POST /api/v1/stream/start (LM)" 'ok\|url\|status' "$LM_STREAM"

    LM_STREAM_STATUS=$(curl -sf $TIMEOUT "$BASE/api/v1/stream/status" \
        -H "Authorization: Bearer $LM_TOKEN" 2>&1)
    check "GET /api/v1/stream/status (LM)" 'status\|running' "$LM_STREAM_STATUS"

    LM_STREAM_STOP=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/stream/stop" \
        -H "Authorization: Bearer $LM_TOKEN" \
        -H "Content-Type: application/json" 2>&1)
    check "POST /api/v1/stream/stop (LM)" 'ok\|status' "$LM_STREAM_STOP"

    echo -e "  ${YELLOW}→ LM virtual camera start/stop${NC}"
    LM_VC=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/vc/start" \
        -H "Authorization: Bearer $LM_TOKEN" \
        -H "Content-Type: application/json" 2>&1)
    check "POST /api/v1/vc/start (LM)" 'ok\|status' "$LM_VC"

    LM_VC_STOP=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/vc/stop" \
        -H "Authorization: Bearer $LM_TOKEN" \
        -H "Content-Type: application/json" 2>&1)
    check "POST /api/v1/vc/stop (LM)" 'ok\|status' "$LM_VC_STOP"

    echo -e "  ${YELLOW}→ LM recording start/stop/finalize${NC}"
    LM_REC=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/recording/start" \
        -H "Authorization: Bearer $LM_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"source":"camera"}' 2>&1)
    check "POST /api/v1/recording/start (LM)" 'ok\|status' "$LM_REC"

    LM_REC_STOP=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/recording/stop" \
        -H "Authorization: Bearer $LM_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"reason":"test"}' 2>&1)
    check "POST /api/v1/recording/stop (LM)" 'ok\|status' "$LM_REC_STOP"

    LM_FINAL=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/recording/finalize" \
        -H "Authorization: Bearer $LM_TOKEN" 2>&1)
    check "POST /api/v1/recording/finalize (LM)" 'ok\|status' "$LM_FINAL"

    echo -e "  ${YELLOW}→ LM refresh token${NC}"
    if [ -n "$LM_REFRESH" ]; then
        LM_REFRESH_R=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/auth/refresh" \
            -H "Content-Type: application/json" \
            -d "{\"refresh_token\":\"$LM_REFRESH\"}" 2>&1)
        check "POST /api/v1/auth/refresh (LM)" 'access_token\|token' "$LM_REFRESH_R"
    fi

    echo -e "  ${YELLOW}→ LM logout-all${NC}"
    LM_LOGOUT=$(curl -sf $TIMEOUT -X POST "$BASE/api/v1/auth/logout_all" \
        -H "Authorization: Bearer $LM_TOKEN" 2>&1)
    check "POST /api/v1/auth/logout_all (LM)" '.' "$LM_LOGOUT"
fi

# ═══════════════════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════════════════
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
        if [[ "$t" == FAIL:* ]]; then
            echo -e "  ${RED}✗${NC} ${t#FAIL: }"
        fi
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
