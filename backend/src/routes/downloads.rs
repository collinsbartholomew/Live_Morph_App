//! Unified downloads / tutorial-media routes.
//!
//! The Live Escape client lists tutorial videos from GET /api/v1/downloads/list.
//! Content is operator-configured via env (comma-separated `DOWNLOAD_URLS`), or
//! an empty list is returned when none are provisioned.

use crate::auth::middleware::require_user;
use crate::error::AppResult;
use crate::product::ProductId;
use actix_web::{get, web, HttpRequest, HttpResponse};
use serde_json::json;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(downloads_list);
}

#[get("/downloads/list")]
async fn downloads_list(req: HttpRequest) -> AppResult<HttpResponse> {
    let _auth = require_user(&req)?;
    let product = ProductId::from_request(&req);
    let items = std::env::var("DOWNLOAD_URLS")
        .map(|s| {
            s.split(',')
                .filter(|v| !v.trim().is_empty())
                .enumerate()
                .map(|(i, v)| {
                    let v = v.trim();
                    json!({
                        "id": format!("dl-{}", i + 1),
                        "name": std::env::var(format!("DOWNLOAD_NAME_{}", i + 1))
                            .unwrap_or_else(|_| format!("Tutorial {}", i + 1)),
                        "url": v,
                        "type": std::env::var(format!("DOWNLOAD_TYPE_{}", i + 1))
                            .unwrap_or_else(|_| "video/mp4".into()),
                    })
                })
                .collect::<Vec<_>>()
        })
        .unwrap_or_default();
    Ok(HttpResponse::Ok().json(json!({
        "downloads": items,
        "product": product.as_str(),
    })))
}