use serde::{Deserialize, Serialize};

fn default_product() -> String {
    "livemorph".into()
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OtpChallenge {
    #[serde(rename = "_id")]
    pub id: String,
    pub email: String,
    /// Product this challenge was issued for (livemorph | liveescape) so a
    /// Live Escape header can never consume a LiveMorph OTP and vice-versa.
    #[serde(default = "default_product")]
    pub product: String,
    /// SHA-256 hex of the code (never store plaintext)
    pub code_hash: String,
    pub attempts: u32,
    pub max_attempts: u32,
    pub expires_at: bson::DateTime,
    pub created_at: bson::DateTime,
    pub consumed: bool,
}
