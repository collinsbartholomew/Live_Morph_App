//! Unified referral routes – product aware via headers.
//! Auth enforced; codes + earnings persisted on the product user document.

use crate::auth::middleware::require_user;
use crate::config::Config;
use crate::db::Db;
use crate::error::{AppError, AppResult};
use crate::product::ProductId;
use actix_web::{get, post, web, HttpRequest, HttpResponse};
use mongodb::bson::doc;
use serde::Deserialize;
use serde_json::json;
use std::sync::Arc;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(referral_my_code)
        .service(referral_attach);
}

fn users_coll(db: &Db, p: ProductId) -> mongodb::Collection<crate::models::User> {
    match p {
        ProductId::LiveEscape => db.users_le(),
        ProductId::LiveMorph => db.users(),
    }
}

pub fn code_for_email(email: &str) -> String {
    let local = email.split('@').next().unwrap_or("user");
    format!("LE{}", &local[..local.len().min(8)]).to_uppercase()
}

#[get("/referral/my-code")]
async fn referral_my_code(
    db: web::Data<Db>,
    req: HttpRequest,
) -> AppResult<HttpResponse> {
    let auth = require_user(&req)?;
    let product = ProductId::from_request(&req);
    let user = users_coll(&db, product)
        .find_one(doc! { "_id": &auth.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;
    let code = user
        .referral_code
        .clone()
        .unwrap_or_else(|| code_for_email(&user.email));
    let earned = user.referral_earned.unwrap_or(0.0);
    Ok(HttpResponse::Ok().json(json!({
        "code": code,
        "earned": earned,
        "credits_earned": earned,
        "product": product.as_str(),
    })))
}

#[derive(Deserialize)]
#[allow(dead_code)]
struct AttachBody {
    #[serde(default)]
    referral_code: Option<String>,
    #[serde(default)]
    code: Option<String>,
    #[serde(default)]
    device_id: Option<String>,
    #[serde(default)]
    email: Option<String>,
}

#[post("/referral/attach")]
async fn referral_attach(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Json<AttachBody>,
) -> AppResult<HttpResponse> {
    let auth = require_user(&req)?;
    let product = ProductId::from_request(&req);
    let code = body
        .referral_code
        .as_deref()
        .or(body.code.as_deref())
        .map(|s| s.trim().to_uppercase())
        .filter(|s| !s.is_empty())
        .ok_or_else(|| AppError::BadRequest("referral code required".into()))?;

    let user = users_coll(&db, product)
        .find_one(doc! { "_id": &auth.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;

    // Idempotent: don't rebind if already referred.
    if user.referred_by.is_some() {
        return Ok(HttpResponse::Ok().json(json!({
            "ok": true,
            "already": true,
            "product": product.as_str(),
        })));
    }

    // Can't refer yourself.
    let own = user.referral_code.clone().unwrap_or_else(|| code_for_email(&user.email));
    if own == code {
        return Err(AppError::BadRequest("you cannot use your own referral code".into()));
    }

    // Find the referrer and bump their earnings (bonus lands on their next purchase
    // per the Electron contract; we grant immediately for simplicity + fairness).
    let referrer = users_coll(&db, product)
        .find_one(doc! { "referral_code": &code })
        .await?;
    let bonus = if referrer.is_some() {
        let cfg_credits = cfg.referral_credits.unwrap_or(100.0);
        users_coll(&db, product)
            .update_one(
                doc! { "referral_code": &code },
                doc! {
                    "$inc": { "referral_earned": cfg_credits, "bonus_balance": cfg_credits },
                    "$set": { "updated_at": chrono::Utc::now() },
                },
            )
            .await?;
        cfg_credits
    } else {
        0.0
    };

    users_coll(&db, product)
        .update_one(
            doc! { "_id": &auth.user_id },
            doc! { "$set": { "referred_by": &code, "updated_at": chrono::Utc::now() } },
        )
        .await?;

    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "referrer_credited": bonus,
        "product": product.as_str(),
    })))
}