use serde::{Deserialize, Serialize};
use uuid::Uuid;

fn default_product() -> String {
    "livemorph".into()
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    #[serde(rename = "_id")]
    pub id: String,
    pub email: String,
    /// Argon2id hash — never returned to clients
    #[serde(skip_serializing_if = "Option::is_none")]
    pub password_hash: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub google_sub: Option<String>,
    pub display_name: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub phone: Option<String>,
    pub credit_balance: f64,
    pub bonus_balance: f64,
    pub tier: String, // free | standard | pro
    /// Product origin: livemorph | liveescape (shared user table, distinct when needed)
    #[serde(default = "default_product")]
    pub product: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub access_key: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub plan: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub device_id: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub referral_code: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub referred_by: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub referral_earned: Option<f64>,
    pub is_active: bool,
    pub created_at: bson::DateTime,
    pub updated_at: bson::DateTime,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_login_at: Option<bson::DateTime>,
}

impl User {
    pub fn new(email: String, display_name: Option<String>, signup_bonus: f64) -> Self {
        let now = bson::DateTime::from_chrono(chrono::Utc::now());
        let name = display_name
            .filter(|s| !s.trim().is_empty())
            .unwrap_or_else(|| email.split('@').next().unwrap_or("user").to_string());
        Self {
            id: Uuid::new_v4().to_string(),
            email: email.to_lowercase(),
            password_hash: None,
            google_sub: None,
            display_name: name,
            phone: None,
            credit_balance: 0.0,
            bonus_balance: signup_bonus,
            tier: "free".into(),
            product: "livemorph".into(),
            access_key: None,
            plan: None,
            device_id: None,
            referral_code: None,
            referred_by: None,
            referral_earned: None,
            is_active: true,
            created_at: now,
            updated_at: now,
            last_login_at: None,
        }
    }

    pub fn total_credits(&self) -> f64 {
        self.credit_balance + self.bonus_balance
    }

    pub fn public_view(&self) -> UserPublic {
        UserPublic {
            id: self.id.clone(),
            email: self.email.clone(),
            display_name: self.display_name.clone(),
            credit_balance: self.credit_balance,
            bonus_balance: self.bonus_balance,
            tier: self.tier.clone(),
            product: self.product.clone(),
            plan: self.plan.clone(),
        }
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UserPublic {
    pub id: String,
    pub email: String,
    pub display_name: String,
    pub credit_balance: f64,
    pub bonus_balance: f64,
    pub tier: String,
    #[serde(default)]
    pub product: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub plan: Option<String>,
}
