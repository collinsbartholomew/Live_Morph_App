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
        ProductId::Secondary => db.users_secondary(),
        ProductId::LiveMorph => db.users(),
    }
}

pub fn code_for_email(_email: &str) -> String {
    // Random per-user code — never derived from the email (predictable codes
    // enable referral farming and collisions).
    use rand::RngExt;
    const ALPHABET: &[u8] = b"ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1
    let mut rng = rand::rng();
    let mut code = String::from("LM");
    for _ in 0..8 {
        code.push(ALPHABET[rng.random_range(0..ALPHABET.len())] as char);
    }
    code
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
    let mut code = user.referral_code.clone();
    if code.is_none() {
        let generated = code_for_email(&user.email);
        // Persist on first read so the code actually resolves in /referral/attach
        // (which looks the referrer up by the referral_code field). The
        // conditional update avoids clobbering a code set concurrently.
        let _ = users_coll(&db, product)
            .update_one(
                doc! { "_id": &auth.user_id, "referral_code": { "$exists": false } },
                doc! { "$set": { "referral_code": &generated } },
            )
            .await;
        code = Some(generated);
    }
    let code = code.unwrap_or_else(|| code_for_email(&user.email));
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
    let ip = crate::auth::client_ip(&req);
    if !crate::auth::check_rate_limit(&ip, "referral-attach", 5, 60) {
        return Err(AppError::RateLimited("too many referral attempts".into()));
    }
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

    // Can't refer yourself.
    let own = user.referral_code.clone().unwrap_or_else(|| code_for_email(&user.email));
    if own == code {
        return Err(AppError::BadRequest("you cannot use your own referral code".into()));
    }

    // Find + validate the referrer BEFORE binding, so a bad/cyclic code never
    // leaves the attacher bound to it.
    let referrer = users_coll(&db, product)
        .find_one(doc! { "referral_code": &code })
        .await?;
    match &referrer {
        Some(r) if r.is_active => {
            // Kill 2-cycles (A refers B, B refers A): if the referrer was
            // themselves referred by this same code, reject.
            if r.referred_by.as_deref() == Some(code.as_str()) {
                return Err(AppError::BadRequest("referral cycle not allowed".into()));
            }
        }
        Some(_) => return Err(AppError::BadRequest("referral code is not active".into())),
        None => return Err(AppError::NotFound("referral code".into())),
    }

    // Atomic bind: only the first attach wins, so two concurrent attaches can
    // never both credit the referrer (the read-then-set race double-credited).
    let bound = users_coll(&db, product)
        .update_one(
            doc! { "_id": &auth.user_id, "referred_by": { "$exists": false } },
            doc! { "$set": { "referred_by": &code, "updated_at": chrono::Utc::now() } },
        )
        .await?;
    if bound.matched_count == 0 {
        // Already referred (idempotent).
        return Ok(HttpResponse::Ok().json(json!({
            "ok": true,
            "already": true,
            "product": product.as_str(),
        })));
    }

    // Credit the (validated) referrer.
    let bonus = {
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
    };

    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "referrer_credited": bonus,
        "product": product.as_str(),
    })))
}