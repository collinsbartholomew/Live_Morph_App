//! Unified license key routes – product aware via X-Frontend-Id header.
//!
//! Access-key licensing is a Secondary capability, blended into the unified
//! backend. Registration order matters: ownership/device checks run BEFORE any
//! mutation so a wrong-account claim can never partially re-bind a key.

use crate::auth::middleware::require_user;
use crate::config::Config;
use crate::db::{new_id, Db};
use crate::error::{AppError, AppResult};
use crate::models::{AccessKey, CreditLedgerEntry};
use crate::product::ProductId;
use crate::services::plans;
use actix_web::{get, post, web, HttpRequest, HttpResponse};
use chrono::Utc;
use mongodb::bson::doc;
use serde::Deserialize;
use serde_json::json;
use std::sync::Arc;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(keys_validate)
        .service(keys_lookup)
        .service(keys_status)
        .service(keys_status_post)
        .service(keys_dev_issue);
}

#[derive(Deserialize)]
struct ValidateKeyBody {
    #[serde(default)]
    key: Option<String>,
    #[serde(default)]
    access_key: Option<String>,
    #[serde(default)]
    device_id: Option<String>,
    #[serde(default)]
    user_id: Option<String>,
}

fn resolve_license_key(body: &ValidateKeyBody) -> String {
    body.key
        .as_ref()
        .or(body.access_key.as_ref())
        .map(|s| s.trim().to_uppercase())
        .unwrap_or_default()
}

fn resolve_device_id(req: &HttpRequest, body_device: Option<&str>) -> String {
    // Device ids are persisted on keys/users — cap them so a crafted request
    // cannot embed an unbounded string in every later document.
    if let Some(d) = body_device.map(str::trim).filter(|s| !s.is_empty()) {
        return d.chars().take(128).collect();
    }
    for h in ["x-device-id", "X-Device-Id"] {
        if let Some(v) = req.headers().get(h).and_then(|v| v.to_str().ok()) {
            let t = v.trim();
            if !t.is_empty() {
                return t.chars().take(128).collect();
            }
        }
    }
    String::new()
}

fn require_secondary(req: &HttpRequest) -> AppResult<ProductId> {
    let product = ProductId::from_request(req);
    if product != ProductId::Secondary {
        return Err(AppError::BadRequest(
            "license keys are only supported for the secondary product".into(),
        ));
    }
    Ok(product)
}

fn expires_at_string(exp: Option<bson::DateTime>) -> Option<String> {
    exp.map(|e| e.to_chrono().to_rfc3339())
}

#[post("/keys/validate")]
async fn keys_validate(
    db: web::Data<Db>,
    req: HttpRequest,
    body: web::Json<ValidateKeyBody>,
) -> AppResult<HttpResponse> {
    let _auth = require_user(&req)?;
    require_secondary(&req)?;
    validate_license_key_inner(db, req, body.into_inner()).await
}

async fn validate_license_key_inner(
    db: web::Data<Db>,
    req: HttpRequest,
    body: ValidateKeyBody,
) -> AppResult<HttpResponse> {
    let auth = require_user(&req)?;
    let ip = crate::auth::client_ip(&req);
    if !crate::auth::check_rate_limit(&ip, "sec_key_validate", 10, 60) {
        return Err(AppError::RateLimited(
            "too many validation attempts — try again in 60 seconds".into(), None));
    }
    let key = resolve_license_key(&body);
    if key.is_empty() {
        return Err(AppError::BadRequest(
            "license key required (send `key` or `access_key`)".into(),
        ));
    }
    // Keys are stored hashed at rest; all lookups go through key_hash.
    let key_hash = crate::routes::auth::hash_token(&key);
    let device_id = resolve_device_id(&req, body.device_id.as_deref());
    if device_id.is_empty() {
        return Err(AppError::BadRequest(
            "device_id required for activation — client must send a stable machine id".into(),
        ));
    }
    if let Some(ref claimed) = body.user_id {
        if !claimed.is_empty() && claimed != &auth.user_id {
            return Err(AppError::Forbidden(
                "user_id does not match authenticated session".into(),
            ));
        }
    }

    let now = Utc::now();
    let bson_now = bson::DateTime::from_chrono(now);

    // 1) READ-ONLY resolution + ownership checks (no mutation here).
    let ak = db
        .access_keys_secondary()
        .find_one(doc! { "key_hash": &key_hash, "active": true })
        .await?
        .ok_or_else(|| AppError::NotFound("invalid or inactive license key".into()))?;

    // Expiry check (annual license): an expired key cannot be (re)activated.
    if let Some(ref exp) = ak.expires_at {
        if exp.to_chrono() < Utc::now() {
            return Err(AppError::Forbidden(
                "license key has expired — please renew".into(),
            ));
        }
    }

    if !ak.user_id.is_empty() && ak.user_id != auth.user_id {
        return Err(AppError::Forbidden(
            "this license key is already bound to another account".into(),
        ));
    }
    if let Some(ref bound) = ak.device_id {
        if !bound.is_empty() && *bound != device_id {
            return Err(AppError::Forbidden(
                "this license is activated on another device — sign in on the original device or contact support to transfer".into(),
            ));
        }
    }

    // 2) Claim the grant atomically (only if still unclaimed). The guard
    //    `credits_granted > 0` + ownership filter prevents cross-account
    //    rebinds. The original amount is preserved in credits_consumed so a
    //    crash between this claim and the user increment is resumable.
    let mut grant = 0.0;
    if ak.credits_granted > 0.0 {
        let claimed = db
            .access_keys_secondary()
            .find_one_and_update(
                doc! { "key_hash": &key_hash, "active": true, "credits_granted": { "$gt": 0.0 } },
                doc! { "$set": {
                    "user_id": &auth.user_id,
                    "device_id": &device_id,
                    "activated_at": bson_now,
                    "credits_granted": 0.0,
                    "credits_consumed": ak.credits_granted,
                }},
            )
            .await?;
        match claimed {
            Some(_) => {
                // Grant EXACTLY the amount stored on the key (custom-amount
                // issues must not be recomputed from the plan catalog).
                grant = ak.credits_granted;
            }
            None => {
                // Another request claimed it concurrently; re-read and validate
                // the FULL state (ownership AND device), not just ownership.
                let latest = db
                    .access_keys_secondary()
                    .find_one(doc! { "key_hash": &key_hash, "active": true })
                    .await?
                    .ok_or_else(|| AppError::NotFound("invalid or inactive license key".into()))?;
                if latest.credits_granted > 0.0
                    || (!latest.user_id.is_empty() && latest.user_id != auth.user_id)
                {
                    return Err(AppError::Conflict(
                        "license key was activated concurrently by another request".into(),
                    ));
                }
                if let Some(ref bound) = latest.device_id {
                    if !bound.is_empty() && *bound != device_id {
                        return Err(AppError::Forbidden(
                            "this license is activated on another device — sign in on the original device or contact support to transfer".into(),
                        ));
                    }
                }
                grant = 0.0;
            }
        }
    } else {
        // Zero-grant keys (paid activations) must bind to the first activating
        // device too — otherwise every later device passes validation.
        db.access_keys_secondary()
            .update_one(
                doc! { "_id": &ak.id, "$or": [ { "device_id": { "$exists": false } }, { "device_id": "" } ] },
                doc! { "$set": {
                    "device_id": &device_id,
                    "user_id": &auth.user_id,
                    "activated_at": bson_now,
                }},
            )
            .await?;
        db.access_keys_secondary()
            .update_one(
                doc! { "_id": &ak.id },
                doc! { "$set": { "activated_at": bson_now } },
            )
            .await?;
        // Resume an interrupted redemption: the key was claimed by THIS user
        // (amount preserved in credits_consumed) but the credit may never have
        // reached the user document.
        if ak.credits_consumed > 0.0 && ak.user_id == auth.user_id {
            let already = db
                .users_secondary()
                .count_documents(doc! { "_id": &auth.user_id, "redeemed_access_keys": &ak.id })
                .await?
                > 0;
            if !already {
                grant = ak.credits_consumed;
            }
        }
    }

    let user = db
        .users_secondary()
        .find_one(doc! { "_id": &auth.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;

    if grant > 0.0 {
        // Exactly-once credit anchored on the user document: the
        // redeemed_access_keys marker makes retries/crash-resume idempotent.
        use mongodb::options::{FindOneAndUpdateOptions, ReturnDocument};
        let credited = db
            .users_secondary()
            .find_one_and_update(
                doc! { "_id": &user.id, "redeemed_access_keys": { "$ne": &ak.id } },
                doc! {
                    "$inc": { "credit_balance": grant },
                    "$push": { "redeemed_access_keys": { "$each": [&ak.id], "$slice": -10_000 } },
                    "$set": {
                        "access_key_hash": crate::routes::auth::hash_token(&key),
                        "plan": &ak.plan,
                        "product": ProductId::Secondary.as_str(),
                        "device_id": &device_id,
                        "updated_at": now,
                    }
                },
            )
            .with_options(
                FindOneAndUpdateOptions::builder()
                    .return_document(ReturnDocument::After)
                    .build(),
            )
            .await?;
        let balance_after = credited
            .as_ref()
            .map(|u| u.total_credits())
            .unwrap_or_else(|| user.total_credits());
        if credited.is_some() {
            if let Err(e) = db.ledger_secondary().insert_one(CreditLedgerEntry {
                id: new_id(),
                user_id: user.id.clone(),
                delta: grant,
                balance_after,
                kind: "access_key".into(),
                ref_id: Some(ak.id.clone()),
                note: Some(format!("plan={}", ak.plan)),
                created_at: bson_now,
            })
            .await
            {
                if !e.to_string().contains("E11000") {
                    tracing::warn!(error = %e, "access-key ledger insert failed");
                }
            }
        }
    } else {
        db.users_secondary()
            .update_one(
                doc! { "_id": &user.id },
                doc! { "$set": {
                    "access_key_hash": crate::routes::auth::hash_token(&key),
                    "plan": &ak.plan,
                    "product": ProductId::Secondary.as_str(),
                    "device_id": &device_id,
                    "updated_at": now,
                }},
            )
            .await?;
    }

    // Re-fetch so the response reflects post-grant balances.
    let user = db
        .users_secondary()
        .find_one(doc! { "_id": &user.id })
        .await?
        .unwrap_or(user);
    // Return the PERSISTED binding (the concurrent-claim winner's device),
    // never the caller-supplied device echo.
    let ak_final = db
        .access_keys_secondary()
        .find_one(doc! { "_id": &ak.id })
        .await?
        .unwrap_or(ak);
    let bound_device = ak_final
        .device_id
        .clone()
        .filter(|d| !d.is_empty())
        .unwrap_or_else(|| device_id.clone());

    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "valid": true,
        "access_key": &key,
        "key": &key,
        "plan": ak_final.plan,
        "device_id": bound_device,
        "expires_at": expires_at_string(ak_final.expires_at),
        "credits": {
            "total": user.total_credits(),
            "used": 0.0,
            "remaining": user.total_credits(),
            "credit_balance": user.credit_balance,
            "bonus_balance": user.bonus_balance,
            "plan": ak_final.plan,
        },
        "product": ProductId::Secondary.as_str(),
    })))
}

#[derive(Deserialize)]
#[allow(dead_code)]
struct LookupBody {
    #[serde(default)]
    key: Option<String>,
    #[serde(default)]
    access_key: Option<String>,
    #[serde(default)]
    device_id: Option<String>,
    #[serde(default)]
    user_id: Option<String>,
}

/// Boot-time reconciliation: restore a user's bound license key.
#[post("/keys/lookup")]
async fn keys_lookup(
    db: web::Data<Db>,
    req: HttpRequest,
    body: web::Json<LookupBody>,
) -> AppResult<HttpResponse> {
    let _auth = require_user(&req)?;
    require_secondary(&req)?;
    let auth = _auth;
    let ip = crate::auth::client_ip(&req);
    if !crate::auth::check_rate_limit(&ip, "sec_key_lookup", 10, 60) {
        return Err(AppError::RateLimited(
            "too many lookup attempts — try again in 60 seconds".into(), None));
    }
    let key = body
        .key
        .as_ref()
        .or(body.access_key.as_ref())
        .map(|s| s.trim().to_uppercase())
        .unwrap_or_default();

    let key_hash = if key.is_empty() {
        None
    } else {
        Some(crate::routes::auth::hash_token(&key))
    };
    let mut ak = if let Some(ref kh) = key_hash {
        db.access_keys_secondary()
            .find_one(doc! { "key_hash": kh, "active": true })
            .await?
    } else {
        None
    };
    if ak.is_none() {
        ak = db
            .access_keys_secondary()
            .find_one(doc! { "user_id": &auth.user_id, "active": true })
            .await?;
    }
    match ak {
        Some(ak) => {
            let expired = ak
                .expires_at
                .as_ref()
                .map(|e| e.to_chrono() < Utc::now())
                .unwrap_or(false);
            // Owner-only oracle: ANY caller-supplied key not bound to the caller
            // must look like "not found" — including unbound keys, otherwise a
            // leaked unactivated key could be confirmed redeemable and raced.
            let own = !ak.user_id.is_empty() && ak.user_id == auth.user_id;
            if !key.is_empty() && !own {
                return Ok(HttpResponse::Ok().json(json!({ "found": false })));
            }
            let device_id = if own { ak.device_id.clone() } else { None };
            let owner_id = if own { Some(ak.user_id.clone()) } else { None };
            // Echo the presented key only — the plaintext is never stored on
            // the user row (hash-at-rest), so without a supplied key there is
            // nothing to echo back.
            let key_out = if !key.is_empty() { key.clone() } else { String::new() };
            Ok(HttpResponse::Ok().json(json!({
                "found": true,
                "active": ak.active,
                "expired": expired,
                "key": key_out,
                "access_key": key_out,
                "plan": ak.plan,
                "device_id": device_id,
                "user_id": owner_id,
                "expires_at": expires_at_string(ak.expires_at),
            })))
        }
        None => Ok(HttpResponse::Ok().json(json!({ "found": false, "active": false, "expired": false }))),
    }
}

/// Reconciliation status used by the client boot (key + device validity).
#[get("/keys/status")]
async fn keys_status(
    db: web::Data<Db>,
    req: HttpRequest,
    query: web::Query<std::collections::HashMap<String, String>>,
) -> AppResult<HttpResponse> {
    keys_status_impl(
        db,
        req,
        query.get("key").cloned(),
        query.get("device_id").cloned(),
    )
    .await
}

/// POST variant: keeps the license key out of reverse-proxy/browser logs and
/// request-history tooling (query strings are retained by intermediaries).
#[post("/keys/status")]
async fn keys_status_post(
    db: web::Data<Db>,
    req: HttpRequest,
    body: web::Json<LookupBody>,
) -> AppResult<HttpResponse> {
    keys_status_impl(
        db,
        req,
        body.key.clone().or(body.access_key.clone()),
        body.device_id.clone(),
    )
    .await
}

async fn keys_status_impl(
    db: web::Data<Db>,
    req: HttpRequest,
    key_raw: Option<String>,
    device_raw: Option<String>,
) -> AppResult<HttpResponse> {
    let _auth = require_user(&req)?;
    require_secondary(&req)?;
    let auth = _auth;
    let ip = crate::auth::client_ip(&req);
    if !crate::auth::check_rate_limit(&ip, "sec_key_status", 10, 60) {
        return Err(AppError::RateLimited(
            "too many status attempts — try again in 60 seconds".into(), None));
    }
    let device_check = device_raw
        .as_deref()
        .map(|d| d.trim().to_string())
        .filter(|d| !d.is_empty());
    let key = key_raw.as_deref().map(|s| s.trim().to_uppercase());
    let key_supplied = key.as_ref().map(|k| !k.is_empty()).unwrap_or(false);
    let key_hash = key.as_deref().filter(|k| !k.is_empty()).map(crate::routes::auth::hash_token);
    let ak = if let Some(ref kh) = key_hash {
        db.access_keys_secondary()
            .find_one(doc! { "key_hash": kh, "active": true })
            .await?
    } else {
        db.access_keys_secondary()
            .find_one(doc! { "user_id": &auth.user_id, "active": true })
            .await?
    };
    match ak {
        Some(ak) => {
            let expired = ak
                .expires_at
                .as_ref()
                .map(|e| e.to_chrono() < Utc::now())
                .unwrap_or(false);
            let own = !ak.user_id.is_empty() && ak.user_id == auth.user_id;
            // Owner-only oracle: ANY caller-supplied key not bound to the caller
            // must look like "not found" — including unbound keys (see /keys/lookup).
            if key_supplied && !own {
                return Ok(HttpResponse::Ok().json(json!({
                    "valid": false,
                    "found": false,
                    "expired": false,
                    "product": ProductId::Secondary.as_str(),
                })));
            }
            let device_id = if own { ak.device_id.clone() } else { None };
            // A supplied device id must match the persisted binding — a key
            // bound to another machine is not valid on THIS machine.
            if own {
                if let (Some(bound), Some(supplied)) = (&ak.device_id, &device_check) {
                    if !bound.is_empty() && bound != supplied {
                        return Ok(HttpResponse::Ok().json(json!({
                            "valid": false,
                            "found": true,
                            "reason": "device_mismatch",
                            "expired": expired,
                            "product": ProductId::Secondary.as_str(),
                        })));
                    }
                }
            }
            let key_out = if let Some(ref k) = key {
                k.clone()
            } else {
                // Plaintext is hash-at-rest on the user row; nothing to echo.
                String::new()
            };
            Ok(HttpResponse::Ok().json(json!({
                "valid": ak.active && !expired && (ak.user_id.is_empty() || ak.user_id == auth.user_id),
                "found": true,
                "expired": expired,
                "access_key": key_out,
                "plan": ak.plan,
                "device_id": device_id,
                "expires_at": expires_at_string(ak.expires_at),
                "activated_at": ak.activated_at.map(|e| e.to_chrono().to_rfc3339()),
                "product": ProductId::Secondary.as_str(),
            })))
        }
        None => Ok(HttpResponse::Ok().json(json!({
            "valid": false,
            "found": false,
            "expired": false,
            "product": ProductId::Secondary.as_str(),
        }))),
    }
}

#[derive(Deserialize)]
struct DevIssueBody {
    plan: Option<String>,
    credits: Option<f64>,
    admin_secret: Option<String>,
}

#[post("/keys/dev-issue")]
async fn keys_dev_issue(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: actix_web::HttpRequest,
    body: web::Json<DevIssueBody>,
) -> AppResult<HttpResponse> {
    if cfg.is_production() {
        return Err(AppError::Forbidden("dev-issue disabled in production".into()));
    }
    // Rate-limit before the admin-secret compare (no timing/brute-force oracle).
    let ip = crate::auth::client_ip(&req);
    if !crate::auth::check_rate_limit(&ip, "dev-issue", 5, 60) {
        return Err(AppError::RateLimited("too many requests".into(), None));
    }
    let expected = cfg.admin_secret.as_deref().unwrap_or("");
    let provided = body.admin_secret.as_deref().unwrap_or("");
    if expected.is_empty() || !bool::from(subtle::ConstantTimeEq::ct_eq(expected.as_bytes(), provided.as_bytes())) {
        return Err(AppError::Forbidden("admin secret required".into()));
    }
    let plan = body
        .plan
        .clone()
        .unwrap_or_else(|| "starter".into());
    let credits = body
        .credits
        .unwrap_or_else(|| {
            plans::activation_plan(&plan)
                .map(|p| p.credits)
                .unwrap_or(1000.0)
        })
        .clamp(0.0, 50000.0);
    let ak = AccessKey::new(&plan, credits);
    db.access_keys_secondary().insert_one(&ak).await?;
    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "key": ak.key,
        "plan": ak.plan,
        "credits_granted": ak.credits_granted,
    })))
}