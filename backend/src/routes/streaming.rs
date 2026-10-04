//! Unified streaming routes – product aware via headers.
//! Single canonical registration under /api/v1.

use crate::auth::middleware::require_user;
use crate::config::Config;
use crate::db::{new_id, Db};
use crate::error::{AppError, AppResult};
use crate::product::ProductId;
use actix_web::{get, post, web, HttpRequest, HttpResponse};
use chrono::Utc;
use mongodb::bson::doc;
use serde::Deserialize;
use serde_json::json;
use std::sync::Arc;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(session_start)
        .service(session_end)
        .service(background_presets)
        .service(background_select);
}

fn product(req: &HttpRequest) -> ProductId {
    ProductId::from_request(req)
}

fn users_coll(db: &Db, p: ProductId) -> mongodb::Collection<crate::models::User> {
    match p {
        ProductId::LiveEscape => db.users_le(),
        ProductId::LiveMorph => db.users(),
    }
}

#[derive(Deserialize)]
struct StartBody {
    model: Option<String>,
    character_id: Option<String>,
    tier: Option<String>,
}

#[post("/streaming/session-start")]
async fn session_start(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Json<StartBody>,
) -> AppResult<HttpResponse> {
    let product_id = product(&req);
    let auth = require_user(&req)?;
    let user = users_coll(&db, product_id)
        .find_one(doc! { "_id": &auth.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("user".into()))?;
    if user.total_credits() < cfg.min_credits_to_start {
        return Err(AppError::InsufficientCredits);
    }
    // Concurrent session limit — mirrors the WS proxy guard. Only rows that
    // actually own a Decart stream ("connecting"/"generating") count; the REST
    // intent row itself is stamped "live" below and must not collide with it.
    if cfg.max_concurrent_sessions > 0 {
        let active = match product_id {
            ProductId::LiveEscape => {
                db.sessions_le()
                    .count_documents(doc! {
                        "user_id": &auth.user_id,
                        "status": { "$in": ["connecting", "generating"] }
                    })
                    .await?
            }
            ProductId::LiveMorph => {
                db.db
                    .collection::<mongodb::bson::Document>("morph_sessions")
                    .count_documents(doc! {
                        "user_id": &auth.user_id,
                        "status": { "$in": ["connecting", "generating"] }
                    })
                    .await?
            }
        };
        if active >= cfg.max_concurrent_sessions as u64 {
            return Err(AppError::RateLimited(
                "maximum concurrent sessions reached".into(),
            ));
        }
    }
    let sid = new_id();
    let model = body
        .model
        .clone()
        .unwrap_or_else(|| cfg.decart_default_model.clone());
    let session_doc = doc! {
        "_id": &sid,
        "user_id": &auth.user_id,
        "model": &model,
        "character_id": body.character_id.clone(),
        "tier": body.tier.clone(),
        "status": "live",
        "product": product_id.as_str(),
        "started_at": Utc::now(),
        "credits_burned": 0.0,
    };
    match product_id {
        ProductId::LiveEscape => {
            db.sessions_le().insert_one(session_doc).await?;
        }
        ProductId::LiveMorph => {
            db.db
                .collection::<mongodb::bson::Document>("morph_sessions")
                .insert_one(session_doc)
                .await?;
        }
    }
    let base = cfg.public_base_url.trim_end_matches('/');
    let ws = if base.starts_with("https://") {
        base.replacen("https://", "wss://", 1)
    } else if base.starts_with("http://") {
        base.replacen("http://", "ws://", 1)
    } else {
        format!("ws://{base}")
    };
    Ok(HttpResponse::Ok().json(json!({
        "session_id": sid,
        "model": model,
        "realtime_url": format!("{}/api/v1/realtime", ws),
        "credits": {"total": user.total_credits(), "remaining": user.total_credits()},
        "credits_per_second": cfg.credits_per_second,
        "product": product_id.as_str(),
    })))
}

#[derive(Deserialize)]
struct EndBody {
    session_id: Option<String>,
    reason: Option<String>,
}

#[post("/streaming/end")]
async fn session_end(
    db: web::Data<Db>,
    req: HttpRequest,
    body: web::Json<EndBody>,
) -> AppResult<HttpResponse> {
    let product_id = product(&req);
    let auth = require_user(&req)?;
    let filter = if let Some(ref sid) = body.session_id {
        doc! { "_id": sid, "user_id": &auth.user_id }
    } else {
        // End BOTH the REST intent row ("live") and any WS-created rows
        // ("connecting"/"generating") — the full lifecycle must be closable.
        doc! {
            "user_id": &auth.user_id,
            "status": { "$in": ["live", "connecting", "generating"] }
        }
    };
    let update = doc! {
        "$set": {
            "status": "ended",
            "ended_at": Utc::now(),
            "end_reason": body.reason.clone().unwrap_or_else(|| "client".into()),
        }
    };
    match product_id {
        ProductId::LiveEscape => {
            db.sessions_le().update_many(filter, update).await?;
        }
        ProductId::LiveMorph => {
            db.db
                .collection::<mongodb::bson::Document>("morph_sessions")
                .update_many(filter, update)
                .await?;
        }
    }
    Ok(HttpResponse::Ok().json(json!({ "ok": true })))
}

const BACKGROUND_PRESETS: &[(&str, &str, &str)] = &[
    ("none", "None", ""),
    ("studio", "Studio", "clean studio backdrop"),
    ("cyber", "Cyber City", "neon cyberpunk city night"),
    ("forest", "Forest", "misty forest morning"),
    ("city", "City", "modern city skyline at dusk"),
    ("ocean", "Ocean", "calm ocean horizon with soft light"),
];

#[get("/streaming/background-presets")]
async fn background_presets(req: HttpRequest) -> HttpResponse {
    let p = product(&req);
    let presets = json!(BACKGROUND_PRESETS
        .iter()
        .map(|(id, name, prompt)| json!({
            "id": id,
            "name": name,
            "prompt": prompt,
            "premium": false,
        }))
        .collect::<Vec<_>>());
    HttpResponse::Ok().json(json!({ "presets": presets, "product": p.as_str() }))
}

#[derive(Deserialize)]
struct BgSelect {
    preset_id: String,
    prompt: Option<String>,
}

#[post("/streaming/background-select")]
async fn background_select(
    db: web::Data<Db>,
    req: HttpRequest,
    body: web::Json<BgSelect>,
) -> AppResult<HttpResponse> {
    let product_id = product(&req);
    let auth = require_user(&req)?;
    let preset_id = body.preset_id.trim().to_string();
    let prompt = body
        .prompt
        .clone()
        .or_else(|| {
            BACKGROUND_PRESETS
                .iter()
                .find(|(id, _, _)| *id == preset_id)
                .map(|(_, _, pr)| pr.to_string())
        })
        .unwrap_or_default();
    // Persist the active background on the session-less profile so the client can
    // reconcile after reconnect (and for audit). Uses upsert to avoid TOCTOU race.
    let coll = match product_id {
        ProductId::LiveEscape => db.db_le.collection::<mongodb::bson::Document>("background_selections"),
        ProductId::LiveMorph => db.db.collection::<mongodb::bson::Document>("background_selections"),
    };
    coll.find_one_and_update(
        doc! { "user_id": &auth.user_id },
        doc! {
            "$set": {
                "user_id": &auth.user_id,
                "preset_id": &preset_id,
                "prompt": &prompt,
                "product": product_id.as_str(),
                "selected_at": Utc::now(),
            }
        },
    )
    .upsert(true)
    .await?;
    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "preset_id": preset_id,
        "prompt": prompt,
        "product": product_id.as_str(),
    })))
}