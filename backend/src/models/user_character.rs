use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserCharacter {
    #[serde(rename = "_id")]
    pub id: String,
    pub user_id: String,
    pub name: String,
    pub prompt: String,
    #[serde(default)]
    pub image_url: Option<String>,
    #[serde(default)]
    pub is_favorite: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserCharacterPublic {
    pub id: String,
    pub name: String,
    pub prompt: String,
    pub image_url: Option<String>,
    pub is_favorite: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

impl From<&UserCharacter> for UserCharacterPublic {
    fn from(c: &UserCharacter) -> Self {
        Self {
            id: c.id.clone(),
            name: c.name.clone(),
            prompt: c.prompt.clone(),
            image_url: c.image_url.clone(),
            is_favorite: c.is_favorite,
            created_at: c.created_at,
            updated_at: c.updated_at,
        }
    }
}

#[derive(Debug, Deserialize)]
pub struct CreateUserCharacterBody {
    pub name: String,
    pub prompt: String,
    pub image_url: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateUserCharacterBody {
    pub name: Option<String>,
    pub prompt: Option<String>,
    pub image_url: Option<Option<String>>,
    pub is_favorite: Option<bool>,
}
