use serde::{Deserialize, Serialize};
use uuid::Uuid;

/// Live Escape license / access key (isolated LE DB).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AccessKey {
    #[serde(rename = "_id")]
    pub id: String,
    pub key: String,
    #[serde(default)]
    pub user_id: String,
    /// First device that successfully activated this key (SHA-stable machine id).
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub device_id: Option<String>,
    pub plan: String,
    #[serde(default)]
    pub credits_granted: f64,
    pub active: bool,
    pub created_at: bson::DateTime,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub activated_at: Option<bson::DateTime>,
}

impl AccessKey {
    pub fn new(plan: &str, credits: f64) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            key: gen_key(),
            user_id: String::new(),
            device_id: None,
            plan: plan.into(),
            credits_granted: credits,
            active: true,
            created_at: bson::DateTime::from_chrono(chrono::Utc::now()),
            activated_at: None,
        }
    }
}

fn gen_key() -> String {
    use rand::RngExt;
    let mut rng = rand::rng();
    let mut part = |n: usize| {
        (0..n)
            .map(|_| {
                let c: u8 = rng.random_range(0..36);
                if c < 10 {
                    (b'0' + c) as char
                } else {
                    (b'A' + (c - 10)) as char
                }
            })
            .collect::<String>()
    };
    format!("SS-{}-{}-{}", part(4), part(4), part(4))
}
