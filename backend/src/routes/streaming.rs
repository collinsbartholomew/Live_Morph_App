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
        ProductId::Secondary => db.users_secondary(),
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
    // Concurrent session limit — atomic counter claim on the user doc (the old
    // count-then-insert race let both racers pass, or both fail). The REST
    // intent row itself is stamped "live" below and must not collide with it.
    // NOTE: no user-slot claim here — the REST row is an intent marker; the
    // real concurrency slot is claimed by the realtime WS proxy on connect
    // (claiming both would double-count one session and 429 the WS).
    {
        let ip = crate::auth::client_ip(&req);
        if !crate::auth::check_rate_limit(&ip, "session-start", 10, 60) {
            return Err(AppError::RateLimited("too many session starts".into()));
        }
    }
    let sid = new_id();
    let model_raw: String = body.model.clone().unwrap_or_else(|| cfg.decart_default_model.clone());
    let model = model_raw.trim().chars().take(64).collect::<String>();
    if model.is_empty() || cfg.resolve_model(Some(&model)).is_err() {
        return Err(AppError::BadRequest("unknown model".into()));
    }
    let character_id: String = body.character_id.clone().unwrap_or_default().chars().take(64).collect();
    let tier = body.tier.clone().unwrap_or_else(|| "standard".into());
    let tier = if tier == "hd" || tier == "standard" { tier } else { "standard".into() };
    let session_doc = doc! {
        "_id": &sid,
        "user_id": &auth.user_id,
        "model": &model,
        "character_id": character_id,
        "tier": tier,
        "status": "live",
        "product": product_id.as_str(),
        "instance_id": crate::INSTANCE_ID.as_str(),
        "started_at": Utc::now(),
        "credits_burned": 0.0,
    };
    match product_id {
        ProductId::Secondary => {
            db.sessions_secondary().insert_one(session_doc).await?;
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
    let tasks = req
        .app_data::<web::Data<crate::realtime::ProxyTasks>>()
        .cloned();
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
    let sess_coll = match product_id {
        ProductId::Secondary => db.sessions_secondary(),
        ProductId::LiveMorph => db.db.collection::<mongodb::bson::Document>("morph_sessions"),
    };
    // Per-row conditional transition (same contract as the reaper and
    // mark_session_ended): only the caller that actually flips a non-ended row
    // to "ended" releases the active_sessions slot. Without this, a REST end
    // of a WS-owned row left the slot claimed forever (the WS task's later
    // mark_session_ended no-ops on the already-ended row) → permanent 429.
    use futures_util::TryStreamExt;
    let projection = mongodb::options::FindOptions::builder()
        .projection(doc! { "_id": 1, "status": 1 })
        .build();
    let mut cur = sess_coll
        .find(filter)
        .with_options(projection)
        .await?;
    while let Some(d) = cur.try_next().await? {
        let (Ok(id), Ok(status)) = (d.get_str("_id"), d.get_str("status")) else {
            continue;
        };
        // Never re-release a row that is already ended — only the first
        // transition winner owns the slot release.
        if status == "ended" {
            continue;
        }
        let transitioned = sess_coll
            .find_one_and_update(
                doc! { "_id": id, "status": status },
                doc! { "$set": {
                    "status": "ended",
                    "ended_at": Utc::now(),
                    "end_reason": body.reason.clone().unwrap_or_else(|| "client".into()),
                } },
            )
            .await;
        if matches!(transitioned, Ok(Some(_)))
            && (status == "connecting" || status == "generating")
        {
            let _ = users_coll(&db, product_id)
                .update_one(
                    doc! { "_id": &auth.user_id },
                    vec![doc! { "$set": { "active_sessions": { "$max": [
                        { "$subtract": [{ "$ifNull": ["$active_sessions", 0] }, 1] }, 0 ] } } }],
                )
                .await;
            // Also close the live proxy WS for this session, otherwise the
            // stream keeps running (and billing) after a REST end while the
            // slot is already freed for a new connection.
            if let Some(t) = &tasks {
                t.close_session(id).await;
            }
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
        ProductId::Secondary => db.db_secondary.collection::<mongodb::bson::Document>("background_selections"),
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