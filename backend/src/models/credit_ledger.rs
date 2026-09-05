use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreditLedgerEntry {
    #[serde(rename = "_id")]
    pub id: String,
    pub user_id: String,
    pub delta: f64,
    pub balance_after: f64,
    pub kind: String, // signup_bonus | purchase | generation | adjustment | refund
    pub ref_id: Option<String>,
    pub note: Option<String>,
    pub created_at: bson::DateTime,
}
