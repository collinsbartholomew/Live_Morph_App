//! Unified streaming routes – product aware.

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
    cfg.service(session_start_v1)
        .service(session_start_legacy)
        .service(session_end_v1)
        .service(session_end_legacy)
        .service(background_presets_v1)
        .service(background_presets_legacy)
        .service(background_select_v1)
        .service(background_select_legacy);
}

fn product(req: &HttpRequest) -> ProductId {
    ProductId::from_request(req)
}

#[derive(Deserialize)]
struct StartBody {
    model: Option<String>,
    character_id: Option<String>,
    tier: Option<String>,
}

async fn session_start_inner(
    db: web::Data<Db>,
    cfg: web::Data<Arc<Config>>,
    req: HttpRequest,
    body: web::Json<StartBody>,
) -> AppResult<HttpResponse> {
    let product_id = product(&req);
    let auth = require_user(&req)?;
    let user = match product_id {
        ProductId::LiveEscape => db.users_le().find_one(doc! { "_id": &auth.user_id }).await?.ok_or_else(|| AppError::NotFound("user".into()))?,
        ProductId::LiveMorph => db.users().find_one(doc! { "_id": &auth.user_id }).await?.ok_or_else(|| AppError::NotFound("user".into()))?,
    };
    if user.total_credits() < cfg.min_credits_to_start {
        return Err(AppError::InsufficientCredits);
    }
    let sid = new_id();
    let model = body.model.clone().unwrap_or_else(|| cfg.decart_default_model.clone());
    match product_id {
        ProductId::LiveEscape => {
            db.sessions_le().insert_one(doc! {
                "_id": &sid,
                "user_id": &auth.user_id,
                "model": &model,
                "character_id": body.character_id.clone(),
                "tier": body.tier.clone(),
                "status": "live",
                "product": "liveescape",
                "started_at": Utc::now(),
                "credits_burned": 0.0,
            }).await?;
        }
        ProductId::LiveMorph => {
            // Insert as raw document to avoid typed model mismatch
            db.db.collection::<mongodb::bson::Document>("morph_sessions").insert_one(doc! {
                "_id": &sid,
                "user_id": &auth.user_id,
                "model": &model,
                "character_id": body.character_id.clone(),
                "tier": body.tier.clone(),
                "status": "live",
                "product": "livemorph",
                "started_at": Utc::now(),
                "credits_burned": 0.0,
            }).await?;
        }
    }
    let base = cfg.public_base_url.trim_end_matches('/');
    Ok(HttpResponse::Ok().json(json!({
        "session_id": sid,
        "model": model,
        "realtime_url": format!("{}/v1/realtime", base),
        "credits": {"total": user.total_credits(), "remaining": user.total_credits()},
        "credits_per_second": cfg.credits_per_second,
        "product": product_id.as_str(),
    })))
}
#[post("/api/v1/streaming/session-start")]
async fn session_start_v1(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<StartBody>) -> AppResult<HttpResponse> { session_start_inner(db,cfg,req,body).await }
#[post("/streaming/session-start")]
async fn session_start_legacy(db: web::Data<Db>, cfg: web::Data<Arc<Config>>, req: HttpRequest, body: web::Json<StartBody>) -> AppResult<HttpResponse> { session_start_inner(db,cfg,req,body).await }

#[derive(Deserialize)]
struct EndBody { session_id: Option<String>, reason: Option<String>, }

async fn session_end_inner(db: web::Data<Db>, req: HttpRequest, body: web::Json<EndBody>) -> AppResult<HttpResponse> {
    let product_id = product(&req);
    let auth = require_user(&req)?;
    let filter = if let Some(ref sid) = body.session_id { doc! { "_id": sid, "user_id": &auth.user_id } } else { doc! { "user_id": &auth.user_id, "status": "live" } };
    match product_id {
        ProductId::LiveEscape => { db.sessions_le().update_many(filter, doc! { "$set": { "status": "ended", "ended_at": Utc::now(), "end_reason": body.reason.clone().unwrap_or_else(|| "client".into()) } }).await?; }
        ProductId::LiveMorph => { db.db.collection::<mongodb::bson::Document>("morph_sessions").update_many(filter, doc! { "$set": { "status": "ended", "ended_at": Utc::now(), "end_reason": body.reason.clone().unwrap_or_else(|| "client".into()) } }).await?; }
    }
    Ok(HttpResponse::Ok().json(json!({ "ok": true })))
}
#[post("/api/v1/streaming/end")]
async fn session_end_v1(db: web::Data<Db>, req: HttpRequest, body: web::Json<EndBody>) -> AppResult<HttpResponse> { session_end_inner(db,req,body).await }
#[post("/streaming/end")]
async fn session_end_legacy(db: web::Data<Db>, req: HttpRequest, body: web::Json<EndBody>) -> AppResult<HttpResponse> { session_end_inner(db,req,body).await }

async fn background_presets_inner() -> HttpResponse {
    HttpResponse::Ok().json(json!({"presets": [
        {"id": "none", "name": "None", "prompt": ""},
        {"id": "studio", "name": "Studio", "prompt": "clean studio backdrop"},
        {"id": "cyber", "name": "Cyber City", "prompt": "neon cyberpunk city night"},
        {"id": "forest", "name": "Forest", "prompt": "misty forest morning"},
    ]}))
}
#[get("/api/v1/streaming/background-presets")]
async fn background_presets_v1() -> HttpResponse { background_presets_inner().await }
#[get("/streaming/background-presets")]
async fn background_presets_legacy() -> HttpResponse { background_presets_inner().await }

#[derive(Deserialize)]
struct BgSelect { preset_id: String, prompt: Option<String>, }

async fn background_select_inner(body: web::Json<BgSelect>) -> HttpResponse {
    HttpResponse::Ok().json(json!({"ok": true, "preset_id": body.preset_id, "prompt": body.prompt}))
}
#[post("/api/v1/streaming/background-select")]
async fn background_select_v1(body: web::Json<BgSelect>) -> HttpResponse { background_select_inner(body).await }
#[post("/streaming/background-select")]
async fn background_select_legacy(body: web::Json<BgSelect>) -> HttpResponse { background_select_inner(body).await }
