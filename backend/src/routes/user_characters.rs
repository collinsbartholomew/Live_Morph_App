use crate::auth::middleware::require_user;
use crate::db::{new_id, Db};
use crate::error::{AppError, AppResult};
use crate::models::{UserCharacter, UserCharacterPublic};
use crate::product::ProductId;
use actix_web::{get, post, put, delete, web, HttpRequest, HttpResponse};
use chrono::Utc;
use futures_util::TryStreamExt;
use mongodb::bson::doc;
use mongodb::options::{FindOneAndUpdateOptions, ReturnDocument};
use mongodb::Collection;
use serde_json::json;

// Per-product isolation: a Secondary user's characters must live in the
// secondary DB, never in LiveMorph's collection (and vice versa).
fn uc_coll(db: &Db, req: &HttpRequest) -> Collection<UserCharacter> {
    match ProductId::from_request(req) {
        ProductId::Secondary => db.user_characters_secondary(),
        ProductId::LiveMorph => db.user_characters(),
    }
}

// image_url allowlist, parsed properly: https (any host) or http to loopback
// ONLY — a bare starts_with("http://127.0.0.1") would also match
// "http://127.0.0.1@evil.com" (host evil.com). file:// is deliberately NOT
// allowed: the client uploads local images itself via the set_image WS frame,
// so a stored file:// URL would only let a stored character row point the
// client at an arbitrary local file to be read and sent upstream.
fn valid_image_url(u: &str) -> bool {
    if u.len() > 2000 {
        return false;
    }
    if u.starts_with("https://") {
        return true;
    }
    if u.starts_with("http://") {
        if let Ok(parsed) = url::Url::parse(u) {
            if parsed.scheme() != "http" {
                return false;
            }
            let h = parsed.host_str().unwrap_or("");
            return h == "127.0.0.1" || h == "::1" || h == "localhost";
        }
    }
    false
}

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(list_user_characters)
        .service(create_user_character)
        .service(get_user_character)
        .service(update_user_character)
        .service(delete_user_character);
}

#[get("/characters/mine")]
async fn list_user_characters(
    db: web::Data<Db>,
    req: HttpRequest,
) -> AppResult<HttpResponse> {
    let auth = require_user(&req)?;
    let mut cursor = uc_coll(&db, &req)
        .find(doc! { "user_id": &auth.user_id })
        .sort(doc! { "created_at": -1 })
        .await?;
    let mut items = Vec::new();
    while let Some(result) = cursor.try_next().await? {
        let c = result;
        items.push(UserCharacterPublic::from(&c));
    }
    Ok(HttpResponse::Ok().json(json!({ "characters": items })))
}

#[post("/characters/mine")]
async fn create_user_character(
    db: web::Data<Db>,
    req: HttpRequest,
    body: web::Json<crate::models::CreateUserCharacterBody>,
) -> AppResult<HttpResponse> {
    let auth = require_user(&req)?;
    // Bound every field: an 8MB body x 50 chars would otherwise allow ~400MB/user.
    let name = body.name.trim().chars().take(100).collect::<String>();
    if name.is_empty() {
        return Err(AppError::BadRequest("name is required".into()));
    }
    let prompt = body.prompt.trim().chars().take(4000).collect::<String>();
    if prompt.is_empty() {
        return Err(AppError::BadRequest("prompt is required".into()));
    }
    let image_url = match body.image_url.as_deref() {
        Some(s) => {
            let u = s.trim();
            if !valid_image_url(u) {
                return Err(AppError::BadRequest("image_url must be https, loopback http, or a local file".into()));
            }
            Some(u.chars().take(2000).collect::<String>())
        }
        None => None,
    };
    // Limit: max 50 user characters per user
    let count = uc_coll(&db, &req)
        .count_documents(doc! { "user_id": &auth.user_id })
        .await?;
    if count >= 50 {
        return Err(AppError::BadRequest(
            "maximum 50 custom characters reached".into(),
        ));
    }
    let now = Utc::now();
    let character = UserCharacter {
        id: new_id(),
        user_id: auth.user_id.clone(),
        name,
        prompt,
        image_url,
        is_favorite: false,
        created_at: now,
        updated_at: now,
    };
    uc_coll(&db, &req).insert_one(&character).await?;
    Ok(HttpResponse::Created().json(json!({
        "character": UserCharacterPublic::from(&character),
    })))
}

#[get("/characters/mine/{id}")]
async fn get_user_character(
    db: web::Data<Db>,
    req: HttpRequest,
    path: web::Path<String>,
) -> AppResult<HttpResponse> {
    let auth = require_user(&req)?;
    let character = uc_coll(&db, &req)
        .find_one(doc! { "_id": path.as_str(), "user_id": &auth.user_id })
        .await?
        .ok_or_else(|| AppError::NotFound("character".into()))?;
    Ok(HttpResponse::Ok().json(json!({
        "character": UserCharacterPublic::from(&character),
    })))
}

#[put("/characters/mine/{id}")]
async fn update_user_character(
    db: web::Data<Db>,
    req: HttpRequest,
    path: web::Path<String>,
    body: web::Json<crate::models::UpdateUserCharacterBody>,
) -> AppResult<HttpResponse> {
    let auth = require_user(&req)?;
    let mut set = doc! { "updated_at": Utc::now() };
    if let Some(ref name) = body.name {
        let name: String = name.trim().chars().take(100).collect();
        if name.is_empty() {
            return Err(AppError::BadRequest("name cannot be empty".into()));
        }
        set.insert("name", name);
    }
    if let Some(ref prompt) = body.prompt {
        let prompt: String = prompt.trim().chars().take(4000).collect();
        if prompt.is_empty() {
            return Err(AppError::BadRequest("prompt cannot be empty".into()));
        }
        set.insert("prompt", prompt);
    }
    if let Some(Some(ref image_url)) = body.image_url {
        let u = image_url.trim();
        if !valid_image_url(u) {
            return Err(AppError::BadRequest("image_url must be https, loopback http, or a local file".into()));
        }
        set.insert("image_url", u.to_string());
    }
    if let Some(fav) = body.is_favorite {
        set.insert("is_favorite", fav);
    }
    // One atomic op: conditional update returning the fresh row (avoids the
    // update-then-read round trip and any read of a concurrently-changed row).
    let character = uc_coll(&db, &req)
        .find_one_and_update(
            doc! { "_id": path.as_str(), "user_id": &auth.user_id },
            doc! { "$set": set },
        )
        .with_options(
            FindOneAndUpdateOptions::builder()
                .return_document(ReturnDocument::After)
                .build(),
        )
        .await?
        .ok_or_else(|| AppError::NotFound("character".into()))?;
    Ok(HttpResponse::Ok().json(json!({
        "character": UserCharacterPublic::from(&character),
    })))
}

#[delete("/characters/mine/{id}")]
async fn delete_user_character(
    db: web::Data<Db>,
    req: HttpRequest,
    path: web::Path<String>,
) -> AppResult<HttpResponse> {
    let auth = require_user(&req)?;
    let result = uc_coll(&db, &req)
        .delete_one(doc! { "_id": path.as_str(), "user_id": &auth.user_id })
        .await?;
    if result.deleted_count == 0 {
        return Err(AppError::NotFound("character".into()));
    }
    Ok(HttpResponse::Ok().json(json!({ "ok": true })))
}
