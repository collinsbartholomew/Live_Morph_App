use serde::{Deserialize, Serialize};

/// Catalog of purchasable token packs (platform credits → user balance).
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TokenPackage {
    pub key: String,
    pub name: String,
    /// Platform credits granted to the user after successful payment
    pub credits: f64,
    /// Price in major units (e.g. 20.0 = $20)
    pub price_usd: f64,
    /// Price in kobo for Paystack NGN (optional display)
    pub price_ngn_kobo: i64,
    pub popular: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaymentOrder {
    #[serde(rename = "_id")]
    pub id: String,
    pub user_id: String,
    #[serde(default = "default_order_product")]
    pub product: String,
    pub package_key: String,
    pub credits: f64,
    pub amount_usd: f64,
    /// Amount charged in the payment provider's subunit (e.g. kobo, cents)
    pub amount_subunit: i64,
    pub currency: String,             // NGN | USD
    pub provider: String,             // paystack | manual | crypto | nowpayments
    pub status: String,               // pending | paid | failed | expired | provisioned
    pub provider_ref: Option<String>, // Paystack reference or NOWPayments payment_id
    pub provider_access_code: Option<String>,
    pub authorization_url: Option<String>,
    /// Crypto invoice fields (USDT / NOWPayments)
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pay_address: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pay_amount: Option<f64>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pay_currency: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub network: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub crypto_status: Option<String>,
    /// LiveEscape order kind: activation | starter_pack | upgrade | renew | credits
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub kind: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub plan: Option<String>,
    /// Access key generated for an activation order (surfaced to the client).
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub access_key: Option<String>,
    /// Device fingerprint sent by the client for abuse detection / multi-device.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub device_id: Option<String>,
    pub created_at: bson::DateTime,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub paid_at: Option<bson::DateTime>,
    /// When a settle worker claimed the order for provisioning (crash-recovery
    /// staleness is measured from this, never from paid_at).
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub claimed_at: Option<bson::DateTime>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub provisioned_at: Option<bson::DateTime>,
}

impl TokenPackage {
    pub fn catalog() -> Vec<Self> {
        vec![
            Self {
                key: "basic".into(),
                name: "Spark".into(),
                credits: 500.0,
                price_usd: 5.0,
                price_ngn_kobo: 750_000,
                popular: false,
            },
            Self {
                key: "starter".into(),
                name: "Creator".into(),
                credits: 1_200.0,
                price_usd: 10.0,
                price_ngn_kobo: 1_500_000,
                popular: false,
            },
            Self {
                key: "mid".into(),
                name: "Studio".into(),
                credits: 3_000.0,
                price_usd: 20.0,
                price_ngn_kobo: 3_000_000,
                popular: true,
            },
            Self {
                key: "pro".into(),
                name: "Stage".into(),
                credits: 8_000.0,
                price_usd: 45.0,
                price_ngn_kobo: 6_750_000,
                popular: false,
            },
        ]
    }

    pub fn by_key(key: &str) -> Option<Self> {
        Self::catalog().into_iter().find(|p| p.key == key)
    }
}

fn default_order_product() -> String {
    "livemorph".into()
}
