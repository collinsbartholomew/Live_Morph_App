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
    /// Argon2id hash — never returned to clients: API responses use
    /// UserPublic. (skip_serializing would also drop it from BSON writes.)
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
    /// Product origin: livemorph | secondary (shared user table, distinct when needed)
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
    /// Bumped on logout_all / password reset / account deletion so older
    /// access tokens stop validating (checked in JwtAuth middleware).
    #[serde(default)]
    pub token_version: i64,
    pub created_at: bson::DateTime,
    pub updated_at: bson::DateTime,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub last_login_at: Option<bson::DateTime>,
    /// Atomic count of active realtime sessions (claimed in proxy/streaming,
    /// released in mark_session_ended / reaper / delete_account).
    #[serde(default)]
    pub active_sessions: i32,
}

impl User {
    pub fn new(email: String, display_name: Option<String>, signup_bonus: f64) -> Self {
        let now = bson::DateTime::from_chrono(chrono::Utc::now());
        let name = display_name
            .filter(|s| !s.trim().is_empty())
            .unwrap_or_else(|| email.split('@').next().unwrap_or("user").to_string());
        let referral_code = crate::routes::referral::code_for_email(&email);
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
            referral_code: Some(referral_code),
            referred_by: None,
            referral_earned: None,
            is_active: true,
            token_version: 0,
            created_at: now,
            updated_at: now,
            last_login_at: None,
            active_sessions: 0,
        }
    }

    pub fn total_credits(&self) -> f64 {
        self.credit_balance + self.bonus_balance
    }

    /// Server-side HD entitlement: HD billing is only allowed for paid
    /// higher tiers. The client's `?tier=hd` is a *request*, never the billing
    /// input — without this gate a free/basic user could stream HD while being
    /// billed at the standard rate (undercharge).
    pub fn hd_entitled(&self) -> bool {
        const HD_TIERS: &[&str] = &["pro", "mid", "creator", "premium", "elite"];
        HD_TIERS.contains(&self.tier.as_str())
            || self
                .plan
                .as_deref()
                .map(|p| HD_TIERS.contains(&p))
                .unwrap_or(false)
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
