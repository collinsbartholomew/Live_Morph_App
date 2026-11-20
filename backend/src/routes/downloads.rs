//! Unified downloads / tutorial-media routes.
//!
//! The Secondary client lists tutorial videos from GET /api/v1/downloads/list.
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
    let items = crate::runtime_env::download_items()
        .iter()
        .map(|d| {
            json!({
                "id": d.id,
                "name": d.name,
                "url": d.url,
                "type": d.mime,
            })
        })
        .collect::<Vec<_>>();
    Ok(HttpResponse::Ok().json(json!({
        "downloads": items,
        "product": product.as_str(),
    })))
}