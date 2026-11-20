//! Unified referral routes – product aware via headers.
//! Auth enforced; codes + earnings persisted on the product user document.

use crate::auth::middleware::require_user;
use crate::config::Config;
use crate::db::{new_id, Db};
use crate::error::{AppError, AppResult};
use crate::models::CreditLedgerEntry;
use crate::product::ProductId;
use actix_web::{get, post, web, HttpRequest, HttpResponse};
use chrono::Utc;
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

/// Referrals are a Secondary-slot feature; LiveMorph advertises
/// referral_enabled=false, so the API must enforce that, not just the UI.
pub fn referrals_enabled(product: ProductId) -> bool {
    matches!(product, ProductId::Secondary)
}

pub fn code_for_email(_email: &str) -> String {
    // Random per-user code — never derived from the email (predictable codes
    // enable referral farming and collisions). 16 base32 chars = 80 bits, so
    // birthday collisions stay negligible at any realistic user count.
    use rand::RngExt;
    const ALPHABET: &[u8] = b"ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1
    let mut rng = rand::rng();
    let mut code = String::from("LM");
    for _ in 0..16 {
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
    if !referrals_enabled(product) {
        return Err(AppError::Forbidden(
            "referrals are not enabled for this product".into(),
        ));
    }
    let users = users_coll(&db, product);
    let user = users
        .find_one(doc! { "_id": &auth.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;
    let mut code = user.referral_code.clone();
    if code.is_none() {
        // Persist on first read so the code actually resolves in
        // /referral/attach. Retry on unique-index collisions and always return
        // the code that actually WON in the database — never a locally
        // generated value that a concurrent request or collision replaced.
        for _ in 0..5 {
            let generated = code_for_email(&user.email);
            match users
                .update_one(
                    doc! { "_id": &auth.user_id, "referral_code": { "$exists": false } },
                    doc! { "$set": { "referral_code": &generated } },
                )
                .await
            {
                Ok(_) => {}
                Err(e) => {
                    let dup = e.to_string().contains("E11000");
                    if !dup {
                        return Err(e.into());
                    }
                    continue;
                }
            }
            let persisted = users
                .find_one(doc! { "_id": &auth.user_id })
                .await?
                .and_then(|u| u.referral_code);
            if persisted.is_some() {
                code = persisted;
                break;
            }
        }
    }
    let code = code.ok_or_else(|| {
        AppError::Internal("could not allocate a referral code — please retry".into())
    })?;
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
        return Err(AppError::RateLimited("too many referral attempts".into(), None));
    }
    let auth = require_user(&req)?;
    let product = ProductId::from_request(&req);
    if !referrals_enabled(product) {
        return Err(AppError::Forbidden(
            "referrals are not enabled for this product".into(),
        ));
    }
    let _ = &cfg;
    let code = body
        .referral_code
        .as_deref()
        .or(body.code.as_deref())
        .map(|s| s.trim().to_uppercase())
        .filter(|s| !s.is_empty())
        .ok_or_else(|| AppError::BadRequest("referral code required".into()))?;
    if code.len() > 32 || !code.chars().all(|c| c.is_ascii_alphanumeric()) {
        return Err(AppError::BadRequest("invalid referral code".into()));
    }

    let users = users_coll(&db, product);
    let user = users
        .find_one(doc! { "_id": &auth.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;

    // Can't refer yourself (compare against the persisted code AND the owner id).
    if user.referral_code.as_deref() == Some(code.as_str()) {
        return Err(AppError::BadRequest("you cannot use your own referral code".into()));
    }

    // Find + validate the referrer BEFORE binding, so a bad/cyclic code never
    // leaves the attacher bound to it.
    let referrer = users
        .find_one(doc! { "referral_code": &code })
        .await?;
    match &referrer {
        Some(r) if r.is_active => {
            if r.id == auth.user_id {
                return Err(AppError::BadRequest("you cannot use your own referral code".into()));
            }
            // Kill 2-cycles (A refers B, then B refers A): the referrer's own
            // referred_by must not point back at the ATTACHER's code.
            if let Some(own) = &user.referral_code {
                if r.referred_by.as_deref() == Some(own.as_str()) {
                    return Err(AppError::BadRequest("referral cycle not allowed".into()));
                }
            }
        }
        Some(_) => return Err(AppError::BadRequest("referral code is not active".into())),
        None => return Err(AppError::NotFound("referral code".into())),
    }

    // Atomic bind: only the first attach wins. The reward itself is NOT granted
    // here — it is granted by grant_referral_reward_after_purchase once the
    // attacher has a settled paid order, so Sybil rings cannot farm bonuses
    // with free signups alone.
    let bound = users
        .update_one(
            doc! { "_id": &auth.user_id, "referred_by": { "$exists": false } },
            doc! { "$set": { "referred_by": &code, "updated_at": chrono::Utc::now() } },
        )
        .await?;
    if bound.matched_count == 0 {
        return Ok(HttpResponse::Ok().json(json!({
            "ok": true,
            "already": true,
            "product": product.as_str(),
        })));
    }

    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "referrer_credited": 0.0,
        "reward": "pending_first_purchase",
        "product": product.as_str(),
    })))
}

/// Grant the referral reward exactly once, after the attacher's first settled
/// paid order. Called from payment settlement. Idempotent via the ledger's
/// unique (ref_id, kind) partial index (ref_id = attacher user id).
pub async fn grant_referral_reward_after_purchase(
    db: &Db,
    cfg: &Config,
    product: ProductId,
    attacher_id: &str,
) {
    if !referrals_enabled(product) {
        return;
    }
    let users = users_coll(db, product);
    let attacher = match users.find_one(doc! { "_id": attacher_id }).await {
        Ok(Some(u)) => u,
        _ => return,
    };
    let Some(code) = attacher.referred_by.clone() else {
        return;
    };
    let ledger = match product {
        ProductId::Secondary => db.ledger_secondary(),
        ProductId::LiveMorph => db.ledger(),
    };
    // Already rewarded for this attacher? (also protects concurrent settlements)
    match ledger
        .find_one(doc! { "kind": "referral", "ref_id": attacher_id })
        .await
    {
        Ok(Some(_)) => return,
        Ok(None) => {}
        Err(e) => {
            tracing::warn!(error = %e, "referral reward lookup failed — skipping");
            return;
        }
    }
    let Some(referrer) = (match users
        .find_one(doc! { "referral_code": &code, "is_active": true })
        .await
    {
        Ok(r) => r,
        Err(e) => {
            tracing::warn!(error = %e, "referrer lookup failed — skipping reward");
            return;
        }
    }) else {
        return;
    };
    // Self-referral and 2-cycles registered via the signup referral field are
    // rejected here too (attach-time checks cannot see those bindings).
    if referrer.id == attacher_id {
        return;
    }
    if let Some(own) = &attacher.referral_code {
        if referrer.referred_by.as_deref() == Some(own.as_str()) {
            return;
        }
    }
    let reward = cfg.referral_credits.unwrap_or(100.0);
    if !reward.is_finite() || reward <= 0.0 {
        return;
    }
    const MAX_REFERRALS: i64 = 50;
    use mongodb::options::{FindOneAndUpdateOptions, ReturnDocument};
    let credited = match users
        .find_one_and_update(
            doc! {
                "_id": &referrer.id,
                "$expr": { "$lt": [ { "$ifNull": ["$referral_count", 0] }, MAX_REFERRALS ] },
            },
            doc! {
                "$inc": { "referral_earned": reward, "bonus_balance": reward, "referral_count": 1 },
                "$set": { "updated_at": Utc::now() },
            },
        )
        .with_options(
            FindOneAndUpdateOptions::builder()
                .return_document(ReturnDocument::After)
                .build(),
        )
        .await
    {
        Ok(c) => c,
        Err(e) => {
            tracing::warn!(error = %e, "referral reward credit failed");
            return;
        }
    };
    let Some(credited) = credited else {
        return;
    };
    let entry = CreditLedgerEntry {
        id: new_id(),
        user_id: referrer.id.clone(),
        delta: reward,
        balance_after: credited.total_credits(),
        kind: "referral".into(),
        ref_id: Some(attacher_id.to_string()),
        note: Some(format!("referral bonus for attacher {attacher_id} first purchase")),
        created_at: bson::DateTime::from_chrono(Utc::now()),
    };
    if let Err(e) = ledger.insert_one(&entry).await {
        if e.to_string().contains("E11000") {
            // Another settlement rewarded concurrently — reverse our increment
            // so the referrer is never double-credited.
            let _ = users
                .update_one(
                    doc! { "_id": &referrer.id },
                    doc! {
                        "$inc": { "referral_earned": -reward, "bonus_balance": -reward, "referral_count": -1 },
                        "$set": { "updated_at": Utc::now() },
                    },
                )
                .await;
        } else {
            tracing::error!(error = %e, "referral ledger insert failed after credit");
        }
    }
}
