use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OtpChallenge {
    #[serde(rename = "_id")]
    pub id: String,
    pub email: String,
    /// SHA-256 hex of the code (never store plaintext)
    pub code_hash: String,
    pub attempts: u32,
    pub max_attempts: u32,
    pub expires_at: bson::DateTime,
    pub created_at: bson::DateTime,
    pub consumed: bool,
}
