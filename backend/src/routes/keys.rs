//! Unified license key routes – product aware via X-Frontend-Id header.
//!
//! Replaces the LiveEscape-only handlers from routes/liveescape.rs.
//! Supports both LiveMorph and LiveEscape; LiveMorph currently no-ops.

use crate::auth::{AuthUser, middleware::require_user};
use crate::config::Config;
use crate::db::{new_id, Db};
use crate::error::{AppError, AppResult};
use crate::models::{AccessKey, CreditLedgerEntry};
use crate::product::ProductId;
use actix_web::{get, post, web, HttpRequest, HttpResponse};
use chrono::Utc;
use mongodb::bson::doc;
use serde::Deserialize;
use serde_json::json;
use std::sync::Arc;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(keys_validate)
        .service(keys_lookup)
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

fn plan_credits(plan_id: &str) -> (f64, f64) {
    match plan_id {
        "test" => (0.5, 50.0),
        "starter" => (20.0, 1000.0),
        "pro" | "creator" => (60.0, 5000.0),
        "premium" => (150.0, 10000.0),
        "elite" => (550.0, 50000.0),
        _ => (20.0, 1000.0),
    }
}

#[post("/keys/validate")]
async fn keys_validate(
    db: web::Data<Db>,
    req: HttpRequest,
    body: web::Json<ValidateKeyBody>,
) -> AppResult<HttpResponse> {
    let product = ProductId::from_request(&req);
    if product != ProductId::LiveEscape {
        return Err(AppError::BadRequest("license keys only supported for liveescape".into()));
    }
    validate_license_key_inner(db, req, body.into_inner()).await
}

async fn validate_license_key_inner(
    db: web::Data<Db>,
    req: HttpRequest,
    body: ValidateKeyBody,
) -> AppResult<HttpResponse> {
    let auth = require_user(&req)?;
    let ip = req.peer_addr().map(|a| a.ip().to_string()).unwrap_or_else(|| "unknown".into());
    if !crate::auth::check_rate_limit(&ip, "le_key_validate", 10, 60) {
        return Err(AppError::RateLimited("too many validation attempts — try again in 60 seconds".into()));
    }
    let key = resolve_license_key(&body);
    if key.is_empty() {
        return Err(AppError::BadRequest("license key required (send `key` or `access_key`)".into()));
    }
    let device_id = resolve_device_id(&req, body.device_id.as_deref());
    if device_id.is_empty() {
        return Err(AppError::BadRequest("device_id required for activation — client must send a stable machine id".into()));
    }
    if let Some(ref claimed) = body.user_id {
        if !claimed.is_empty() && claimed != &auth.user_id {
            return Err(AppError::Forbidden("user_id does not match authenticated session".into()));
        }
    }

    let now = Utc::now();
    let bson_now = bson::DateTime::from_chrono(now);
    let claimed_key = db.access_keys()
        .find_one_and_update(
            doc! { "key": &key, "active": true, "credits_granted": { "$gt": 0.0 } },
            doc! { "$set": {
                "user_id": &auth.user_id,
                "device_id": &device_id,
                "credits_granted": 0.0,
                "activated_at": bson_now,
            }},
        )
        .await?;

    let grant = if let Some(ref claimed) = claimed_key {
        let (_, plan_credits) = plan_credits(&claimed.plan);
        plan_credits
    } else {
        0.0
    };

    let mut ak = match claimed_key {
        Some(claimed) => claimed,
        None => db.access_keys()
            .find_one(doc! { "key": &key, "active": true })
            .await?
            .ok_or_else(|| AppError::NotFound("invalid or inactive license key".into()))?,
    };

    if !ak.user_id.is_empty() && ak.user_id != auth.user_id {
        return Err(AppError::Forbidden("this license key is already bound to another account".into()));
    }
    if let Some(ref bound) = ak.device_id {
        if !bound.is_empty() && *bound != device_id {
            return Err(AppError::Forbidden(
                "this license is activated on another device — sign in on the original device or contact support to transfer".into(),
            ));
        }
    }

    if grant == 0.0 && !ak.user_id.is_empty() {
    } else if grant == 0.0 {
        db.access_keys()
            .update_one(
                doc! { "_id": &ak.id },
                doc! { "$set": {
                    "user_id": &auth.user_id,
                    "device_id": &device_id,
                    "activated_at": bson_now,
                }},
            )
            .await?;
        ak.user_id = auth.user_id.clone();
        ak.device_id = Some(device_id.clone());
        ak.activated_at = Some(bson_now);
    }

    let user = db.users_le()
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
                        "product": "liveescape",
                        "device_id": &device_id,
                        "updated_at": now,
                    }
                },
            )
            .await?;
        // ledger
        db.ledger_le().insert_one(CreditLedgerEntry {
            id: new_id(),
            user_id: user.id.clone(),
            delta: grant,
            balance_after: user.total_credits() + grant,
            kind: "access_key".into(),
            ref_id: Some(ak.id.clone()),
            note: Some(format!("plan={}", ak.plan)),
            created_at: bson_now,
        }).await?;
    } else {
        db.users_le()
            .update_one(
                doc! { "_id": &user.id },
                doc! { "$set": {
                    "access_key": &ak.key,
                    "plan": &ak.plan,
                    "product": "liveescape",
                    "device_id": &device_id,
                    "updated_at": now,
                }},
            )
            .await?;
    }

    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "valid": true,
        "access_key": ak.key,
        "key": ak.key,
        "plan": ak.plan,
        "device_id": device_id,
        "credits": {
            "total": user.total_credits(),
            "used": 0.0,
            "remaining": user.total_credits(),
            "credit_balance": user.credit_balance,
            "bonus_balance": user.bonus_balance,
            "plan": ak.plan,
        },
        "product": "liveescape",
    })))
}

#[post("/keys/lookup")]
async fn keys_lookup(
    db: web::Data<Db>,
    req: HttpRequest,
    body: web::Json<serde_json::Value>,
) -> AppResult<HttpResponse> {
    let _auth = require_user(&req)?;
    // minimal implementation
    let key = body.get("key")
        .and_then(|v| v.as_str())
        .or_else(|| body.get("access_key").and_then(|v| v.as_str()))
        .map(|s| s.trim().to_uppercase())
        .unwrap_or_default();
    if key.is_empty() {
        return Ok(HttpResponse::Ok().json(json!({ "found": false })));
    }
    let ak = db.access_keys().find_one(doc! { "key": &key }).await?;
    Ok(HttpResponse::Ok().json(json!({
        "found": ak.is_some(),
        "active": ak.as_ref().map(|a| a.active).unwrap_or(false),
    })))
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
    let plan = body.plan.clone().unwrap_or_else(|| "starter".into());
    let credits = body.credits.unwrap_or(1000.0).clamp(0.0, 50000.0);
    let ak = AccessKey::new(&plan, credits);
    db.access_keys().insert_one(&ak).await?;
    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "key": ak.key,
        "plan": ak.plan,
        "credits_granted": ak.credits_granted,
    })))
}
