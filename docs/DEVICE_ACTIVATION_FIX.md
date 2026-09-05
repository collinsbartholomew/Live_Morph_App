# Device ID + activation — production fix

## Root cause (why activation “could not be handled”)

1. **Field name mismatch:** SmokeScreen sent JSON `access_key`; unified backend only deserialized `key` → empty key → 400/404 / opaque failure.
2. **Weak device binding:** Key activation did not lock `device_id` on the license; re-activation and multi-device behavior was undefined.
3. **Empty machine id edge case:** If machine seed failed, client could send blank `device_id`.

## Fixes

### Backend (`routes/liveescape.rs` + `models/access_key.rs`)

| Change | Behavior |
|--------|----------|
| Accept `key` **or** `access_key` | Activation no longer fails on field name |
| Require non-empty `device_id` (body or `x-device-id`) | Clear `400 device_id required…` |
| Bind `AccessKey.device_id` on first success | Later different device → `403` with transfer message |
| Bind/update `User.device_id` | Session tracks machine |
| `POST /activate` | Real alias of `/keys/validate` (not a no-op) |
| Lookup accepts `access_key` | Consistent |
| Login reads `x-device-id` | Device tracked without body |

### Live Escape Qt

| Change | Behavior |
|--------|----------|
| Validate body sends **both** `key` and `access_key` | Compatible with any server |
| `x-device-id` on **all** requests | Activation/streaming always see device |
| `MachineIdProvider` never returns empty | Fallback hash |
| `ApiClient::setDeviceId` at startup | Headers ready before login |
| `keyValidationFailed` toast | Surfaces server message (device lock, bad key) |

## Expected client flow

1. App starts → stable `deviceId` → `setDeviceId`  
2. Signup/login with `device_id`  
3. Access gate → `POST /keys/validate` `{ key, access_key, device_id }` + Bearer  
4. Success → credits + plan + device lock  
5. Other machine same key → **403** explicit message  

## Test checklist

```bash
# after API up:
# 1) signup LE user, get token
# 2) dev-issue key (non-prod)
curl -X POST http://127.0.0.1:3001/keys/dev-issue -H "X-Frontend-Id: liveescape" -d '{"plan":"starter","credits":100}'
# 3) validate with device
curl -X POST http://127.0.0.1:3001/keys/validate \
  -H "Authorization: Bearer $TOKEN" -H "X-Frontend-Id: liveescape" -H "x-device-id: DEV-AAA" \
  -d '{"access_key":"SS-...","device_id":"DEV-AAA"}'
# 4) same key other device → 403
curl ... -d '{"access_key":"SS-...","device_id":"DEV-BBB"}'
```
