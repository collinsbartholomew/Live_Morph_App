use crate::db::Db;
use crate::error::AppResult;
use crate::models::CharacterPublic;
use crate::product::ProductId;
use actix_web::{get, web, HttpRequest, HttpResponse};
use futures_util::TryStreamExt;
use mongodb::bson::doc;
use mongodb::options::FindOptions;

pub fn configure(cfg: &mut web::ServiceConfig) {
    cfg.service(get_catalog);
}

#[get("/catalog")]
async fn get_catalog(db: web::Data<Db>, req: HttpRequest) -> AppResult<HttpResponse> {
    // Per-product isolation: the secondary slot serves its own catalog.
    let coll = match ProductId::from_request(&req) {
        ProductId::Secondary => db.characters_secondary(),
        ProductId::LiveMorph => db.characters(),
    };
    let opts = FindOptions::builder()
        .sort(doc! { "sort_order": 1, "name": 1 })
        .limit(500)
        .build();
    let mut cursor = coll.find(doc! {}).with_options(opts).await?;
    let mut items = Vec::new();
    while let Some(c) = cursor.try_next().await? {
        items.push(CharacterPublic::from(&c));
    }
    Ok(HttpResponse::Ok().json(items))
}
