//! Application configuration loaded exclusively from environment variables.
//! See `.env.example` for every key and comments.

use serde::Deserialize;

#[derive(Debug, Clone, Deserialize)]
pub struct Config {
    // Server
    #[serde(default = "default_host")]
    pub host: String,
    #[serde(default = "default_port")]
    pub port: u16,
    #[serde(default = "default_public_base")]
    pub public_base_url: String,

    // Mongo
    pub mongodb_uri: String,
    #[serde(default = "default_db")]
    pub mongodb_db: String,
    /// Separate Mongo database for Live Escape (avoids user/order conflicts).
    #[serde(default = "default_db_le")]
    pub mongodb_db_liveescape: String,

    // Auth
    pub jwt_secret: String,
    #[serde(default = "default_access_ttl")]
    pub jwt_access_ttl_secs: i64,
    #[serde(default = "default_refresh_ttl")]
    pub jwt_refresh_ttl_secs: i64,
    #[serde(default = "default_otp_len")]
    pub otp_length: u8,
    #[serde(default = "default_otp_ttl")]
    pub otp_ttl_secs: i64,
    #[serde(default = "default_max_attempts")]
    pub auth_max_attempts: u32,
    #[serde(default = "default_lockout")]
    pub auth_lockout_secs: i64,
    #[serde(default = "default_issuer")]
    pub jwt_issuer: String,

    // Credits
    #[serde(default = "default_cps")]
    pub credits_per_second: f64,
    /// Decart realtime cost (USD) per second of active generation (platform pays Decart).
    #[serde(default = "default_decart_usd_per_sec")]
    pub decart_usd_per_second: f64,
    /// Fraction of user payment kept as platform margin (0.0–0.9). Rest funds Decart budget.
    #[serde(default = "default_platform_margin")]
    pub platform_margin_ratio: f64,
    #[serde(default = "default_signup_bonus")]
    pub signup_bonus_credits: f64,
    #[serde(default)]
    pub referral_credits: Option<f64>,
    #[serde(default = "default_min_start")]
    pub min_credits_to_start: f64,
    #[serde(default = "default_hd_mult")]
    pub hd_credit_multiplier: f64,

    // Decart
    pub decart_api_key: String,
    #[serde(default = "default_decart_url")]
    pub decart_signaling_url: String,
    #[serde(default = "default_model")]
    pub decart_default_model: String,
    #[serde(default)]
    pub decart_allowed_models: Option<String>,

    // Stream
    #[serde(default = "default_stream_port")]
    pub stream_default_port: u16,

    // Catalog
    #[serde(default = "default_true")]
    pub seed_starter_catalog: bool,

    // Payments (Paystack → your merchant account; then we provision platform tokens)
    #[serde(default)]
    pub paystack_secret_key: Option<String>,
    #[serde(default)]
    pub paystack_public_key: Option<String>,
    #[serde(default)]
    pub paystack_callback_url: Option<String>,
    /// Default charge currency for Paystack (NGN recommended for Paystack)
    #[serde(default = "default_pay_currency")]
    pub paystack_currency: String,

    // Crypto (NOWPayments) — optional; enables USDT and other coins
    #[serde(default)]
    pub nowpayments_api_key: Option<String>,
    #[serde(default)]
    pub nowpayments_ipn_callback_url: Option<String>,
    /// IPN HMAC secret from NOWPayments dashboard (required to verify webhooks in production)
    #[serde(default)]
    pub nowpayments_ipn_secret: Option<String>,
    /// Default pay currency for crypto invoices (e.g. usdttrc20, usdterc20)
    #[serde(default = "default_crypto_pay_currency")]
    pub nowpayments_default_pay_currency: String,

    // Google OAuth (optional — enables "Continue with Google")
    #[serde(default)]
    pub google_client_id: Option<String>,
    #[serde(default)]
    pub google_client_secret: Option<String>,
    /// Must match Google Cloud Console authorized redirect URI
    #[serde(default)]
    pub google_redirect_uri: Option<String>,

    // ── Production safety ──────────────────────────────────────────────
    /// development | production. Production tightens CORS, OTP logging, etc.
    #[serde(default = "default_rust_env")]
    pub rust_env: String,
    /// Comma-separated allowed origins. Empty + production = no browser CORS.
    #[serde(default)]
    pub cors_origins: Option<String>,
    /// Allow provider=manual (free token provision). MUST be false in production.
    #[serde(default)]
    pub allow_manual_payments: bool,
    /// Allow POST /credits/adjust self-top-up. MUST be false in production.
    #[serde(default)]
    pub allow_credits_adjust: bool,
    /// Log OTP codes to tracing (dev only). MUST be false in production.
    #[serde(default)]
    pub log_otp_codes: bool,
    /// Max JSON body size in bytes (images / prompts).
    #[serde(default = "default_max_body")]
    pub max_body_bytes: usize,
    /// Paystack webhook HMAC secret (usually same as secret key for signature)
    #[serde(default)]
    pub paystack_webhook_secret: Option<String>,

    /// Live Escape admin operations
    #[serde(default)]
    pub admin_secret: Option<String>,
    #[serde(default = "default_usd_ngn")]
    pub usd_ngn_rate: f64,
    #[serde(default)]
    pub flutterwave_secret_key: Option<String>,
    /// Public key handed to the client for hosted/inline Flutterwave checkout.
    #[serde(default)]
    pub flutterwave_public_key: Option<String>,

    // SMTP (OTP delivery)
    #[serde(default)]
    pub smtp_host: Option<String>,
    #[serde(default = "default_smtp_port")]
    pub smtp_port: u16,
    #[serde(default)]
    pub smtp_username: Option<String>,
    #[serde(default)]
    pub smtp_password: Option<String>,
    #[serde(default = "default_smtp_from")]
    pub smtp_from: String,
    #[serde(default)]
    pub smtp_starttls: bool,

    /// JSON ICE servers for clients (STUN/TURN). Example:
    /// [{"urls":"stun:stun.l.google.com:19302"},{"urls":"turn:turn.example.com","username":"...","credential":"..."}]
    #[serde(default)]
    pub ice_servers_json: Option<String>,

    /// Max simultaneous morph sessions per user (0 = unlimited)
    #[serde(default = "default_max_sessions")]
    pub max_concurrent_sessions: u32,
}

fn default_max_sessions() -> u32 {
    1
}

fn default_smtp_port() -> u16 {
    587
}
fn default_smtp_from() -> String {
    "LiveMorph <noreply@livemorph.local>".into()
}

fn default_pay_currency() -> String {
    "NGN".into()
}
fn default_crypto_pay_currency() -> String {
    "usdttrc20".into()
}
fn default_rust_env() -> String {
    "development".into()
}
fn default_max_body() -> usize {
    8 * 1024 * 1024
}

fn default_host() -> String {
    "127.0.0.1".into()
}
fn default_port() -> u16 {
    3874
}
fn default_public_base() -> String {
    "http://127.0.0.1:3874".into()
}
fn default_db() -> String {
    "livemorph".into()
}
fn default_db_le() -> String {
    "liveescape".into()
}
fn default_usd_ngn() -> f64 {
    1600.0
}
fn default_access_ttl() -> i64 {
    900
}
fn default_refresh_ttl() -> i64 {
    2_592_000
}
fn default_otp_len() -> u8 {
    8
}
fn default_otp_ttl() -> i64 {
    600
}
fn default_max_attempts() -> u32 {
    5
}
fn default_lockout() -> i64 {
    60
}
fn default_issuer() -> String {
    "livemorph".into()
}
fn default_cps() -> f64 {
    2.0
}
fn default_signup_bonus() -> f64 {
    100.0
}
fn default_min_start() -> f64 {
    5.0
}
fn default_hd_mult() -> f64 {
    1.5
}
fn default_decart_url() -> String {
    "wss://api3.decart.ai/v1/stream".into()
}
fn default_decart_usd_per_sec() -> f64 {
    0.02
}
fn default_platform_margin() -> f64 {
    0.35
}
fn default_model() -> String {
    "lucy-2.1".into()
}
fn default_stream_port() -> u16 {
    4789
}
fn default_true() -> bool {
    true
}

impl Config {
    pub fn from_env() -> Result<Self, envy::Error> {
        // Load .env if present; fall back to .test.env for testing
        if dotenvy::dotenv().is_err() {
            let _ = dotenvy::from_filename(".test.env");
        }
        envy::from_env::<Config>()
    }

    pub fn bind_addr(&self) -> String {
        format!("{}:{}", self.host, self.port)
    }

    pub fn is_production(&self) -> bool {
        self.rust_env.eq_ignore_ascii_case("production")
    }

    pub fn resolve_model(&self, requested: Option<&str>) -> Result<String, String> {
        let model = requested
            .map(str::trim)
            .filter(|s| !s.is_empty())
            .unwrap_or(self.decart_default_model.as_str());
        // Cheap path: exact match against default set without allocating HashSet every call
        if let Some(s) = &self.decart_allowed_models {
            if !s.trim().is_empty() {
                let ok = s.split(',').map(str::trim).any(|x| x == model);
                return if ok {
                    Ok(model.to_string())
                } else {
                    Err(format!("model '{model}' is not allowed"))
                };
            }
        }
        const DEFAULTS: &[&str] = &["lucy-2.1", "lucy-2.5", "lucy-restyle-2"];
        if DEFAULTS.contains(&model) {
            Ok(model.to_string())
        } else {
            Err(format!("model '{model}' is not allowed"))
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn cfg_with(allowlist: Option<&str>, default_model: &str) -> Config {
        Config {
            decart_allowed_models: allowlist.map(String::from),
            decart_default_model: default_model.to_string(),
            ..Config::from_env().unwrap_or_else(|_| Config {
                host: "127.0.0.1".into(),
                port: 3001,
                public_base_url: "http://127.0.0.1:3001".into(),
                mongodb_uri: "mongodb://127.0.0.1:27017".into(),
                mongodb_db: "livemorph".into(),
                mongodb_db_liveescape: "liveescape".into(),
                jwt_secret: "x".repeat(64),
                jwt_access_ttl_secs: 900,
                jwt_refresh_ttl_secs: 2_592_000,
                otp_length: 8,
                otp_ttl_secs: 600,
                auth_max_attempts: 5,
                auth_lockout_secs: 60,
                jwt_issuer: "livemorph".into(),
                credits_per_second: 2.0,
                decart_usd_per_second: 0.02,
                platform_margin_ratio: 0.35,
                signup_bonus_credits: 100.0,
                referral_credits: None,
                min_credits_to_start: 5.0,
                hd_credit_multiplier: 1.5,
                decart_api_key: "your-key".into(),
                decart_signaling_url: "wss://api3.decart.ai/v1/stream".into(),
                decart_default_model: "lucy-2.1".into(),
                decart_allowed_models: None,
                stream_default_port: 4789,
                seed_starter_catalog: true,
                paystack_secret_key: None,
                paystack_public_key: None,
                paystack_callback_url: None,
                paystack_currency: "NGN".into(),
                nowpayments_api_key: None,
                nowpayments_ipn_callback_url: None,
                nowpayments_ipn_secret: None,
                nowpayments_default_pay_currency: "usdttrc20".into(),
                google_client_id: None,
                google_client_secret: None,
                google_redirect_uri: None,
                rust_env: "development".into(),
                cors_origins: None,
                allow_manual_payments: false,
                allow_credits_adjust: false,
                log_otp_codes: false,
                max_body_bytes: 8_388_608,
                paystack_webhook_secret: None,
                admin_secret: None,
                usd_ngn_rate: 1600.0,
                flutterwave_secret_key: None,
                flutterwave_public_key: None,
                smtp_host: None,
                smtp_port: 587,
                smtp_username: None,
                smtp_password: None,
                smtp_from: "noreply@x".into(),
                smtp_starttls: true,
                ice_servers_json: None,
                max_concurrent_sessions: 1,
            })
        }
    }

    #[test]
    fn resolve_model_default_when_none_requested() {
        let c = cfg_with(Some("lucy-2.1,lucy-2.5"), "lucy-2.1");
        assert_eq!(c.resolve_model(None).unwrap(), "lucy-2.1");
    }

    #[test]
    fn resolve_model_rejects_unknown() {
        let c = cfg_with(Some("lucy-2.1,lucy-2.5"), "lucy-2.1");
        assert!(c.resolve_model(Some("evil-model")).is_err());
    }

    #[test]
    fn resolve_model_falls_back_to_default_set() {
        let c = cfg_with(None, "lucy-2.5");
        assert_eq!(c.resolve_model(Some("lucy-2.1")).unwrap(), "lucy-2.1");
        assert!(c.resolve_model(Some("unknown")).is_err());
    }
}
