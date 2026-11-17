//! Unified creator / payout routes – product aware, auth enforced.

use crate::auth::middleware::require_user;
use crate::db::{new_id, Db};
use crate::error::{AppError, AppResult};
use crate::product::ProductId;
use actix_web::{get, post, web, HttpRequest, HttpResponse};
use mongodb::bson::doc;
use serde::{Deserialize, Serialize};
use serde_json::json;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(payout_get)
        .service(payout_post);
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PayoutDetails {
    #[serde(rename = "_id")]
    pub id: String,
    pub user_id: String,
    pub account_name: String,
    pub bank_name: String,
    pub account_number: String,
    pub routing_number: Option<String>,
    pub country: Option<String>,
    pub product: String,
    pub updated_at: bson::DateTime,
}

#[get("/creator/payout-details")]
async fn payout_get(db: web::Data<Db>, req: HttpRequest) -> AppResult<HttpResponse> {
    let auth = require_user(&req)?;
    let product = ProductId::from_request(&req);
    let coll = match product {
        ProductId::Secondary => {
            db.db_secondary
                .collection::<PayoutDetails>("creator_payouts")
        }
        ProductId::LiveMorph => {
            db.db.collection::<PayoutDetails>("creator_payouts")
        }
    };
    let details = coll
        .find_one(doc! { "user_id": &auth.user_id })
        .await?;
    Ok(HttpResponse::Ok().json(json!({
        "details": details,
        "product": product.as_str(),
    })))
}

#[derive(Deserialize)]
struct PayoutBody {
    #[serde(default)]
    account_name: Option<String>,
    #[serde(default)]
    bank_name: Option<String>,
    #[serde(default)]
    account_number: Option<String>,
    #[serde(default)]
    routing_number: Option<String>,
    #[serde(default)]
    country: Option<String>,
}

#[post("/creator/payout-details")]
async fn payout_post(
    db: web::Data<Db>,
    req: HttpRequest,
    body: web::Json<PayoutBody>,
) -> AppResult<HttpResponse> {
    let auth = require_user(&req)?;
    let product = ProductId::from_request(&req);

    // Cap every field by chars — the body is bounded by MAX_BODY_BYTES (8 MiB),
    // but unbounded strings still bloat the DB; owner-only readback, so this
    // is storage hygiene, not exposure.
    let cap_field = |v: &Option<String>, name: &str, max: usize| -> AppResult<String> {
        let s = v
            .clone()
            .map(|s| s.trim().to_string())
            .filter(|s| !s.is_empty())
            .ok_or_else(|| AppError::BadRequest(format!("{name} required")))?;
        if s.chars().count() > max {
            return Err(AppError::BadRequest(format!(
                "{name} too long (max {max} chars)"
            )));
        }
        Ok(s)
    };
    let account_name = cap_field(&body.account_name, "account_name", 120)?;
    let bank_name = cap_field(&body.bank_name, "bank_name", 120)?;
    let account_number = cap_field(&body.account_number, "account_number", 34)?;
    let routing_number = body
        .routing_number
        .clone()
        .map(|s| s.trim().to_string())
        .filter(|s| !s.is_empty());
    if let Some(ref r) = routing_number {
        if r.chars().count() > 20 {
            return Err(AppError::BadRequest("routing_number too long (max 20 chars)".into()));
        }
    }
    if let Some(ref c) = body.country {
        if c.chars().count() > 64 {
            return Err(AppError::BadRequest("country too long (max 64 chars)".into()));
        }
    }

    let coll = match product {
        ProductId::Secondary => db.db_secondary.collection::<PayoutDetails>("creator_payouts"),
        ProductId::LiveMorph => db.db.collection::<PayoutDetails>("creator_payouts"),
    };

    // One atomic upsert keyed on user_id (unique index) — a concurrent
    // find-then-insert could create two rows for the same user.
    let set_doc = doc! {
        "account_name": &account_name,
        "bank_name": &bank_name,
        "account_number": &account_number,
        "routing_number": &body.routing_number,
        "country": &body.country,
        "product": product.as_str(),
        "updated_at": bson::DateTime::from_chrono(chrono::Utc::now()),
    };
    let e = coll
        .find_one_and_update(
            doc! { "user_id": &auth.user_id },
            doc! {
                "$set": set_doc,
                "$setOnInsert": {
                    "_id": new_id(),
                    "user_id": &auth.user_id,
                },
            },
        )
        .with_options(
            mongodb::options::FindOneAndUpdateOptions::builder()
                .upsert(true)
                .return_document(mongodb::options::ReturnDocument::After)
                .build(),
        )
        .await?
        .ok_or_else(|| AppError::Internal("payout upsert failed".into()))?;
    Ok(HttpResponse::Ok().json(json!({ "ok": true, "details": e, "product": product.as_str() })))
}