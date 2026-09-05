use crate::auth::AuthUser;
use crate::config::Config;
use actix_web::{get, post, web, HttpMessage, HttpRequest, HttpResponse};
use serde::Deserialize;
use serde_json::json;
use std::sync::Arc;
use uuid::Uuid;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(check_updates_post)
        .service(check_updates_get)
        .service(support_tickets)
        .service(version_check);
}

fn update_payload(cfg: &Config) -> serde_json::Value {
    let latest =
        std::env::var("APP_LATEST_VERSION").unwrap_or_else(|_| env!("CARGO_PKG_VERSION").into());
    let current = env!("CARGO_PKG_VERSION");
    let download = std::env::var("APP_DOWNLOAD_URL").unwrap_or_default();
    let notes = std::env::var("APP_UPDATE_NOTES").unwrap_or_default();
    let force = std::env::var("APP_FORCE_UPDATE")
        .map(|v| v == "1" || v.eq_ignore_ascii_case("true"))
        .unwrap_or(false);
    let available = latest != current && !latest.is_empty();
    json!({
        "update_available": available,
        "force": force,
        "current_version": current,
        "latest_version": latest,
        "latest": latest,
        "download_url": download,
        "url": download,
        "notes": notes,
        "env": cfg.rust_env,
        "products": ["livemorph", "liveescape"],
    })
}

#[post("/update/check")]
async fn check_updates_post(cfg: web::Data<Arc<Config>>) -> HttpResponse {
    HttpResponse::Ok().json(update_payload(&cfg))
}

#[get("/update/check")]
async fn check_updates_get(cfg: web::Data<Arc<Config>>) -> HttpResponse {
    HttpResponse::Ok().json(update_payload(&cfg))
}

#[derive(Deserialize)]
struct VersionBody {
    #[serde(default)]
    version: Option<String>,
    #[serde(default)]
    platform: Option<String>,
}

/// Shared version check (LiveMorph + Live Escape clients).
#[post("/version/check")]
async fn version_check(cfg: web::Data<Arc<Config>>, body: web::Json<VersionBody>) -> HttpResponse {
    let mut p = update_payload(&cfg);
    if let Some(obj) = p.as_object_mut() {
        obj.insert("platform".into(), json!(body.platform));
        obj.insert("current".into(), json!(body.version));
        obj.insert("product".into(), json!("shared"));
    }
    HttpResponse::Ok().json(p)
}

#[derive(Deserialize)]
struct TicketBody {
    #[serde(default)]
    subject: Option<String>,
    #[serde(default)]
    message: Option<String>,
    #[serde(default)]
    email: Option<String>,
}

/// Shared support ticket endpoint (both products).
#[post("/support/tickets")]
async fn support_tickets(req: HttpRequest, body: web::Json<TicketBody>) -> HttpResponse {
    let user = req.extensions().get::<AuthUser>().cloned();
    let email = body
        .email
        .clone()
        .or_else(|| user.as_ref().map(|u| u.email.clone()));
    let user_id = user.as_ref().map(|u| u.user_id.clone());
    HttpResponse::Ok().json(json!({
        "ok": true,
        "ticket_id": Uuid::new_v4().to_string(),
        "subject": body.subject.clone(),
        "message": body.message.clone(),
        "email": email,
        "user_id": user_id,
    }))
}
