use crate::auth::middleware::require_user;
use crate::error::AppResult;
use crate::product::ProductId;
use actix_web::{get, post, web, HttpRequest, HttpResponse};
use serde::Deserialize;
use serde_json::json;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(start)
        .service(stop)
        .service(finalize)
        .service(directory);
}

#[derive(Deserialize, Default)]
struct StartBody {
    #[serde(default)]
    path: Option<String>,
    #[serde(default)]
    source: Option<String>,
}

#[post("/recording/start")]
async fn start(req: HttpRequest, body: web::Json<StartBody>) -> AppResult<HttpResponse> {
    let _ = require_user(&req)?;
    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "status": "recording",
        "path": body.path,
        "source": body.source.as_deref().unwrap_or("local_camera")
    })))
}

#[derive(Deserialize, Default)]
struct StopBody {
    #[serde(default)]
    reason: Option<String>,
    #[serde(default)]
    path: Option<String>,
}

#[post("/recording/stop")]
async fn stop(req: HttpRequest, body: web::Json<StopBody>) -> AppResult<HttpResponse> {
    let _ = require_user(&req)?;
    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "status": "stopped",
        "path": body.path,
        "reason": body.reason
    })))
}

#[post("/recording/finalize")]
async fn finalize(req: HttpRequest) -> AppResult<HttpResponse> {
    let _ = require_user(&req)?;
    Ok(HttpResponse::Ok().json(json!({ "ok": true })))
}

#[get("/recordings/directory")]
async fn directory(req: HttpRequest) -> AppResult<HttpResponse> {
    let _ = require_user(&req)?;
    let product = ProductId::from_request(&req);
    Ok(HttpResponse::Ok().json(json!({
        "directory": dirs_recording_default(&product)
    })))
}

fn dirs_recording_default(product: &ProductId) -> String {
    let app_name = match product {
        ProductId::LiveEscape => "LiveEscape",
        _ => "LiveMorph",
    };
    std::env::var("HOME")
        .map(|h| format!("{h}/Videos/{app_name}"))
        .unwrap_or_else(|_| format!("/tmp/{app_name:?}-recording").to_lowercase())
}
