use crate::config::Config;
use crate::error::AppResult;
use actix_web::{get, post, web, HttpRequest, HttpResponse};
use serde_json::json;
use std::sync::Arc;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(start)
        .service(stop)
        .service(toggle)
        .service(frame)
        .service(status)
        .service(url)
        .service(vc_start)
        .service(vc_stop)
        .service(vc_status);
}

/// Intent APIs only — actual MJPEG is local to the desktop StreamServer.
#[post("/stream/start")]
async fn start(cfg: web::Data<Arc<Config>>, req: HttpRequest) -> AppResult<HttpResponse> {
    let _ = crate::auth::middleware::require_user(&req)?;
    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "port": cfg.stream_default_port,
        "url": format!("http://127.0.0.1:{}/stream", cfg.stream_default_port),
        "status": "running"
    })))
}

#[post("/stream/stop")]
async fn stop(req: HttpRequest) -> AppResult<HttpResponse> {
    let _ = crate::auth::middleware::require_user(&req)?;
    Ok(HttpResponse::Ok().json(json!({ "ok": true, "status": "stopped" })))
}

#[post("/stream/toggle")]
async fn toggle(cfg: web::Data<Arc<Config>>, req: HttpRequest) -> AppResult<HttpResponse> {
    let _ = crate::auth::middleware::require_user(&req)?;
    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "port": cfg.stream_default_port,
        "url": format!("http://127.0.0.1:{}/stream", cfg.stream_default_port),
        "status": "toggled"
    })))
}

/// Desktop may push frames locally; backend acknowledges for telemetry.
#[post("/stream/frame")]
async fn frame(req: HttpRequest) -> AppResult<HttpResponse> {
    let _ = crate::auth::middleware::require_user(&req)?;
    Ok(HttpResponse::Ok().json(json!({ "ok": true })))
}

#[get("/stream/status")]
async fn status(req: HttpRequest) -> AppResult<HttpResponse> {
    let _ = crate::auth::middleware::require_user(&req)?;
    Ok(HttpResponse::Ok().json(json!({ "status": "idle" })))
}

#[get("/stream/url")]
async fn url(cfg: web::Data<Arc<Config>>, req: HttpRequest) -> AppResult<HttpResponse> {
    let _ = crate::auth::middleware::require_user(&req)?;
    Ok(HttpResponse::Ok().json(json!({
        "url": format!("http://127.0.0.1:{}/stream", cfg.stream_default_port)
    })))
}

/// Virtual camera is a native helper on the desktop; API records intent only.
#[post("/vc/start")]
async fn vc_start(req: HttpRequest) -> AppResult<HttpResponse> {
    let _ = crate::auth::middleware::require_user(&req)?;
    Ok(HttpResponse::Ok().json(json!({
        "ok": true,
        "status": "requested",
        "message": "Start local virtual-camera helper if installed"
    })))
}

#[post("/vc/stop")]
async fn vc_stop(req: HttpRequest) -> AppResult<HttpResponse> {
    let _ = crate::auth::middleware::require_user(&req)?;
    Ok(HttpResponse::Ok().json(json!({ "ok": true, "status": "stopped" })))
}

#[get("/vc/status")]
async fn vc_status(req: HttpRequest) -> AppResult<HttpResponse> {
    let _ = crate::auth::middleware::require_user(&req)?;
    Ok(HttpResponse::Ok().json(json!({ "status": "unavailable", "active": false })))
}
