use crate::db::Db;
use crate::error::AppResult;
use crate::models::CharacterPublic;
use actix_web::{get, web, HttpResponse};
use futures_util::TryStreamExt;
use mongodb::bson::doc;
use mongodb::options::FindOptions;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(get_catalog);
}

#[get("/catalog")]
async fn get_catalog(db: web::Data<Db>) -> AppResult<HttpResponse> {
    let opts = FindOptions::builder()
        .sort(doc! { "sort_order": 1, "name": 1 })
        .build();
    let mut cursor = db.characters().find(doc! {}).with_options(opts).await?;
    let mut items = Vec::new();
    while let Some(c) = cursor.try_next().await? {
        items.push(CharacterPublic::from(&c));
    }
    Ok(HttpResponse::Ok().json(items))
}
