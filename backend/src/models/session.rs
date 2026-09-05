use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MorphSession {
    #[serde(rename = "_id")]
    pub id: String,
    pub user_id: String,
    pub model: String,
    pub decart_session_id: Option<String>,
    pub status: String, // connecting | live | ended
    pub started_at: bson::DateTime,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub ended_at: Option<bson::DateTime>,
    pub generation_seconds: f64,
    pub credits_charged: f64,
    pub end_reason: Option<String>,
    pub prompt: Option<String>,
    pub character_id: Option<String>,
    pub tier: String, // standard | hd
}
