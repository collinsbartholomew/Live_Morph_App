use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Character {
    #[serde(rename = "_id")]
    pub id: String,
    pub name: String,
    pub category: String,
    pub image: String,
    pub prompt: String,
    pub is_premium: bool,
    pub is_starter: bool,
    pub sort_order: i32,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CharacterPublic {
    pub id: String,
    pub name: String,
    pub category: String,
    pub image: String,
    pub prompt: String,
    pub is_premium: bool,
    pub is_starter: bool,
}

impl From<&Character> for CharacterPublic {
    fn from(c: &Character) -> Self {
        Self {
            id: c.id.clone(),
            name: c.name.clone(),
            category: c.category.clone(),
            image: c.image.clone(),
            prompt: c.prompt.clone(),
            is_premium: c.is_premium,
            is_starter: c.is_starter,
        }
    }
}
