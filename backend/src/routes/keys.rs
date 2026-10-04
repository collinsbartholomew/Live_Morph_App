//! Unified license key routes – product aware via X-Frontend-Id header.
//!
//! Access-key licensing is a LiveEscape capability, blended into the unified
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
    if let Some(d) = body_device.map(str::trim).filter(|s| !s.is_empty()) {
        return d.to_string();
    }
    for h in ["x-device-id", "X-Device-Id"] {
        if let Some(v) = req.headers().get(h).and_then(|v| v.to_str().ok()) {
            let t = v.trim();
            if !t.is_empty() {
                return t.to_string();
            }
        }
    }
    String::new()
}

fn require_liveescape(req: &HttpRequest) -> AppResult<ProductId> {
    let product = ProductId::from_request(req);
    if product != ProductId::LiveEscape {
        return Err(AppError::BadRequest(
            "license keys only supported for liveescape".into(),
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
    require_liveescape(&req)?;
    validate_license_key_inner(db, req, body.into_inner()).await
}

async fn validate_license_key_inner(
    db: web::Data<Db>,
    req: HttpRequest,
    body: ValidateKeyBody,
) -> AppResult<HttpResponse> {
    let auth = require_user(&req)?;
    let ip = crate::auth::client_ip(&req);
    if !crate::auth::check_rate_limit(&ip, "le_key_validate", 10, 60) {
        return Err(AppError::RateLimited(
            "too many validation attempts — try again in 60 seconds".into(),
        ));
    }
    let key = resolve_license_key(&body);
    if key.is_empty() {
        return Err(AppError::BadRequest(
            "license key required (send `key` or `access_key`)".into(),
        ));
    }
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
        .access_keys_le()
        .find_one(doc! { "key": &key, "active": true })
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

    // 2) Claim the credits atomically (only if still unclaimed). The guard
    //    `credits_granted > 0` + ownership filter prevents cross-account rebinds.
    let mut grant = 0.0;
    if ak.credits_granted > 0.0 {
        let claimed = db
            .access_keys_le()
            .find_one_and_update(
                doc! { "key": &key, "active": true, "credits_granted": { "$gt": 0.0 } },
                doc! { "$set": {
                    "user_id": &auth.user_id,
                    "device_id": &device_id,
                    "activated_at": bson_now,
                    "credits_granted": 0.0,
                }},
            )
            .await?;
        match claimed {
            Some(_) => {
                grant = plans::activation_plan(&ak.plan)
                    .map(|p| p.credits)
                    .unwrap_or_else(|| plans::credit_plan(&ak.plan).map(|p| p.credits).unwrap_or(0.0));
            }
            None => {
                // Another request claimed it concurrently; re-read and validate state.
                let latest = db
                    .access_keys_le()
                    .find_one(doc! { "key": &key, "active": true })
                    .await?
                    .ok_or_else(|| AppError::NotFound("invalid or inactive license key".into()))?;
                if latest.credits_granted > 0.0
                    || (!latest.user_id.is_empty() && latest.user_id != auth.user_id)
                {
                    return Err(AppError::Conflict(
                        "license key was activated concurrently by another request".into(),
                    ));
                }
                grant = 0.0;
            }
        }
    } else {
        // Already activated for this account/device — refresh binding idempotently.
        db.access_keys_le()
            .update_one(
                doc! { "_id": &ak.id },
                doc! { "$set": { "activated_at": bson_now } },
            )
            .await?;
    }

    let user = db
        .users_le()
        .find_one(doc! { "_id": &auth.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;

    if grant > 0.0 {
        db.users_le()
            .update_one(
                doc! { "_id": &user.id },
                doc! {
                    "$inc": { "credit_balance": grant },
                    "$set": {
                        "access_key": &ak.key,
                        "plan": &ak.plan,
                        "product": ProductId::LiveEscape.as_str(),
                        "device_id": &device_id,
                        "updated_at": now,
                    }
                },
            )
            .await?;
        db.ledger_le().insert_one(CreditLedgerEntry {
            id: new_id(),
            user_id: user.id.clone(),
            delta: grant,
            balance_after: user.total_credits() + grant,
            kind: "access_key".into(),
            ref_id: Some(ak.id.clone()),
            note: Some(format!("plan={}", ak.plan)),
            created_at: bson_now,
        })
        .await?;
    } else {
        db.users_le()
            .update_one(
                doc! { "_id": &user.id },
                doc! { "$set": {
                    "access_key": &ak.key,
                    "plan": &ak.plan,
                    "product": ProductId::LiveEscape.as_str(),
                    "device_id": &device_id,
                    "updated_at": now,
                }},
            )
            .await?;
    }

    // Re-fetch so the response reflects post-grant balances.
    let user = db
        .users_le()
        .find_one(doc! { "_id": &user.id })
        .await?
        .unwrap_or(user);

    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "valid": true,
        "access_key": ak.key,
        "key": ak.key,
        "plan": ak.plan,
        "device_id": device_id,
        "expires_at": expires_at_string(ak.expires_at),
        "credits": {
            "total": user.total_credits(),
            "used": 0.0,
            "remaining": user.total_credits(),
            "credit_balance": user.credit_balance,
            "bonus_balance": user.bonus_balance,
            "plan": ak.plan,
        },
        "product": ProductId::LiveEscape.as_str(),
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
    require_liveescape(&req)?;
    let auth = _auth;
    let key = body
        .key
        .as_ref()
        .or(body.access_key.as_ref())
        .map(|s| s.trim().to_uppercase())
        .unwrap_or_default();

    let mut ak = if !key.is_empty() {
        db.access_keys_le()
            .find_one(doc! { "key": &key, "active": true })
            .await?
    } else {
        None
    };
    if ak.is_none() {
        ak = db
            .access_keys_le()
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
            Ok(HttpResponse::Ok().json(json!({
                "found": true,
                "active": ak.active,
                "expired": expired,
                "key": ak.key,
                "access_key": ak.key,
                "plan": ak.plan,
                "device_id": ak.device_id,
                "user_id": ak.user_id,
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
    let _auth = require_user(&req)?;
    require_liveescape(&req)?;
    let auth = _auth;
    let key = query.get("key").map(|s| s.trim().to_uppercase());
    let ak = if let Some(k) = key.filter(|k| !k.is_empty()) {
        db.access_keys_le()
            .find_one(doc! { "key": &k, "active": true })
            .await?
    } else {
        db.access_keys_le()
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
            Ok(HttpResponse::Ok().json(json!({
                "valid": ak.active && !expired && (ak.user_id.is_empty() || ak.user_id == auth.user_id),
                "found": true,
                "expired": expired,
                "access_key": ak.key,
                "plan": ak.plan,
                "device_id": ak.device_id,
                "expires_at": expires_at_string(ak.expires_at),
                "activated_at": ak.activated_at.map(|e| e.to_chrono().to_rfc3339()),
                "product": ProductId::LiveEscape.as_str(),
            })))
        }
        None => Ok(HttpResponse::Ok().json(json!({
            "valid": false,
            "found": false,
            "expired": false,
            "product": ProductId::LiveEscape.as_str(),
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
    body: web::Json<DevIssueBody>,
) -> AppResult<HttpResponse> {
    if cfg.is_production() {
        return Err(AppError::Forbidden("dev-issue disabled in production".into()));
    }
    let expected = cfg.admin_secret.as_deref().unwrap_or("");
    let provided = body.admin_secret.as_deref().unwrap_or("");
    if expected.is_empty() || expected.as_bytes() != provided.as_bytes() {
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
    db.access_keys_le().insert_one(&ak).await?;
    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "key": ak.key,
        "plan": ak.plan,
        "credits_granted": ak.credits_granted,
    })))
}