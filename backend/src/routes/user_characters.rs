use crate::auth::middleware::require_user;
use crate::db::{new_id, Db};
use crate::error::{AppError, AppResult};
use crate::models::{UserCharacter, UserCharacterPublic};
use actix_web::{get, post, put, delete, web, HttpRequest, HttpResponse};
use chrono::Utc;
use futures_util::TryStreamExt;
use mongodb::bson::doc;
use serde_json::json;

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
    let mut cursor = db
        .user_characters()
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
    let name = body.name.trim().to_string();
    if name.is_empty() {
        return Err(AppError::BadRequest("name is required".into()));
    }
    let prompt = body.prompt.trim().to_string();
    if prompt.is_empty() {
        return Err(AppError::BadRequest("prompt is required".into()));
    }
    // Limit: max 50 user characters per user
    let count = db
        .user_characters()
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
        image_url: body.image_url.clone(),
        is_favorite: false,
        created_at: now,
        updated_at: now,
    };
    db.user_characters().insert_one(&character).await?;
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
    let character = db
        .user_characters()
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
        let name = name.trim().to_string();
        if name.is_empty() {
            return Err(AppError::BadRequest("name cannot be empty".into()));
        }
        set.insert("name", name);
    }
    if let Some(ref prompt) = body.prompt {
        let prompt = prompt.trim().to_string();
        if prompt.is_empty() {
            return Err(AppError::BadRequest("prompt cannot be empty".into()));
        }
        set.insert("prompt", prompt);
    }
    if let Some(ref image_url) = body.image_url {
        set.insert("image_url", image_url.clone());
    }
    if let Some(fav) = body.is_favorite {
        set.insert("is_favorite", fav);
    }
    let result = db
        .user_characters()
        .update_one(doc! { "_id": path.as_str(), "user_id": &auth.user_id }, doc! { "$set": set })
        .await?;
    if result.matched_count == 0 {
        return Err(AppError::NotFound("character".into()));
    }
    let character = db
        .user_characters()
        .find_one(doc! { "_id": path.as_str(), "user_id": &auth.user_id })
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
    let result = db
        .user_characters()
        .delete_one(doc! { "_id": path.as_str(), "user_id": &auth.user_id })
        .await?;
    if result.deleted_count == 0 {
        return Err(AppError::NotFound("character".into()));
    }
    Ok(HttpResponse::Ok().json(json!({ "ok": true })))
}
