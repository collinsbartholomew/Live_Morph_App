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
    /// Wire id of the second product slot (the next desktop client).
    /// Unset means "secondary".
    #[serde(default = "default_secondary_product_id")]
    pub secondary_product_id: String,
    /// Separate Mongo database for the second product (avoids user/order
    /// conflicts). Defaults to `SECONDARY_PRODUCT_ID` when not set explicitly.
    #[serde(default = "default_db_secondary")]
    pub mongodb_db_secondary: String,

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

    /// Secondary admin operations
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
    #[serde(default = "default_true")]
    pub smtp_starttls: bool,

    /// JSON ICE servers for clients (STUN/TURN). Example:
    /// [{"urls":"stun:stun.l.google.com:19302"},{"urls":"turn:turn.example.com","username":"...","credential":"..."}]
    #[serde(default)]
    pub ice_servers_json: Option<String>,

    /// Max simultaneous morph sessions per user (must be >= 1; 0 is rejected
    /// by validate() — "unlimited" is intentionally not offered).
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
    // Fail closed: an unset RUST_ENV means production, so the startup safety
    // guards (manual payments, credits adjust, OTP logging, CORS) can never
    // be silently skipped on a misconfigured deploy.
    "production".into()
}
fn default_max_body() -> usize {
    8 * 1024 * 1024
}

fn default_host() -> String {
    "127.0.0.1".into()
}

/// Process-constant CONFIG_REVISION, cached: `std::env::var` locks and scans
/// the whole environ on every call, and balance_ws reads it per tick per
/// connected WS.
pub fn config_revision() -> &'static str {
    static R: std::sync::LazyLock<String> = std::sync::LazyLock::new(|| {
        std::env::var("CONFIG_REVISION").unwrap_or_else(|_| env!("CARGO_PKG_VERSION").into())
    });
    R.as_str()
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
fn default_secondary_product_id() -> String {
    "secondary".into()
}
fn default_db_secondary() -> String {
    "secondary".into()
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
        // Load .env if present; only fall back to .test.env behind an explicit
        // opt-in, otherwise a deploy started without .env would silently boot
        // with the shipped test secrets and all dev-mode guards.
        if dotenvy::dotenv().is_err()
            && std::env::var("ALLOW_TEST_ENV").as_deref() == Ok("1")
        {
            let _ = dotenvy::from_filename(".test.env");
        }
        envy::from_env::<Config>()
    }

    /// Build the config, then fill in the derived defaults that envy cannot
    /// express (a field default may not depend on another field).
    pub fn load() -> Result<Self, envy::Error> {
        let mut cfg = Self::from_env()?;
        // The second product's database defaults to its wire id, so claiming
        // the slot only needs SECONDARY_PRODUCT_ID.
        if std::env::var("MONGODB_DB_SECONDARY").is_err()
            && !cfg.secondary_product_id.trim().is_empty()
        {
            cfg.mongodb_db_secondary = cfg.secondary_product_id.trim().to_string();
        }
        Ok(cfg)
    }

    pub fn bind_addr(&self) -> String {
        format!("{}:{}", self.host, self.port)
    }

    pub fn is_production(&self) -> bool {
        // Fail closed: only an explicit dev allowlist is non-production.
        // Any other value (prod, staging, typos) gets full production guards.
        !matches!(
            self.rust_env.trim().to_ascii_lowercase().as_str(),
            "development" | "dev" | "local" | "test"
        )
    }

    /// Reject non-finite or nonsensical numeric config. envy happily parses
    /// "0"/"NaN" for f64 — e.g. credits_per_second=0 would mean free streaming
    /// and usd_ngn_rate=0 a division by zero when converting kobo to USD.
    pub fn validate(&self) -> Result<(), String> {
        fn pos(name: &str, v: f64) -> Result<(), String> {
            if v.is_finite() && v > 0.0 {
                Ok(())
            } else {
                Err(format!("{name} must be a finite number > 0, got {v}"))
            }
        }
        fn nonneg(name: &str, v: f64) -> Result<(), String> {
            if v.is_finite() && v >= 0.0 {
                Ok(())
            } else {
                Err(format!("{name} must be a finite number >= 0, got {v}"))
            }
        }
        pos("CREDITS_PER_SECOND", self.credits_per_second)?;
        pos("DECART_USD_PER_SECOND", self.decart_usd_per_second)?;
        pos("USD_NGN_RATE", self.usd_ngn_rate)?;
        pos("HD_CREDIT_MULTIPLIER", self.hd_credit_multiplier)?;
        nonneg("SIGNUP_BONUS_CREDITS", self.signup_bonus_credits)?;
        nonneg("MIN_CREDITS_TO_START", self.min_credits_to_start)?;
        if let Some(r) = self.referral_credits {
            nonneg("REFERRAL_CREDITS", r)?;
        }
        if !self.platform_margin_ratio.is_finite()
            || !(0.0..=0.9).contains(&self.platform_margin_ratio)
        {
            return Err(format!(
                "PLATFORM_MARGIN_RATIO must be in [0, 0.9], got {}",
                self.platform_margin_ratio
            ));
        }
        if !(6..=12).contains(&self.otp_length) {
            return Err(format!("OTP_LENGTH must be 6..=12, got {}", self.otp_length));
        }
        if self.max_concurrent_sessions < 1 {
            return Err(format!(
                "MAX_CONCURRENT_SESSIONS must be >= 1, got {}",
                self.max_concurrent_sessions
            ));
        }
        if self.max_body_bytes == 0 {
            return Err("MAX_BODY_BYTES must be > 0".into());
        }
        if self.max_body_bytes > 64 * 1024 * 1024 {
            return Err(format!(
                "MAX_BODY_BYTES must be <= 64 MiB, got {}",
                self.max_body_bytes
            ));
        }
        if self.otp_ttl_secs <= 0 || self.auth_lockout_secs <= 0 {
            return Err("OTP_TTL_SECS and AUTH_LOCKOUT_SECS must be > 0".into());
        }
        // JWT TTLs: sane bounds; overflow at issue time panics otherwise, and
        // non-positive TTLs brick auth entirely.
        for (name, v) in [
            ("JWT_ACCESS_TTL_SECS", self.jwt_access_ttl_secs),
            ("JWT_REFRESH_TTL_SECS", self.jwt_refresh_ttl_secs),
        ] {
            if !(1..=31_536_000).contains(&v) {
                return Err(format!("{name} must be in 1..=31536000 (1y), got {v}"));
            }
        }
        if self.jwt_refresh_ttl_secs <= self.jwt_access_ttl_secs {
            return Err("JWT_REFRESH_TTL_SECS must be > JWT_ACCESS_TTL_SECS".into());
        }
        if self.auth_max_attempts < 1 {
            return Err(format!("AUTH_MAX_ATTEMPTS must be >= 1, got {}", self.auth_max_attempts));
        }
        if self.port == 0 {
            return Err("PORT must be >= 1".into());
        }
        // An explicitly empty HOST= (present-but-empty env) would bind 0.0.0.0
        // and expose the API on all interfaces, overriding the localhost-only
        // default — reject it rather than silently widening the bind.
        if self.host.trim().is_empty() {
            return Err("HOST must not be empty (use 127.0.0.1 for localhost-only)".into());
        }
        if self.mongodb_db == self.mongodb_db_secondary {
            return Err("MONGODB_DB and MONGODB_DB_SECONDARY must differ — they would merge both products' data".into());
        }
        if self.secondary_product_id.trim().is_empty() {
            return Err("SECONDARY_PRODUCT_ID must not be empty".into());
        }
        if self.secondary_product_id.trim().eq_ignore_ascii_case("livemorph") {
            return Err("SECONDARY_PRODUCT_ID must differ from the primary product id".into());
        }
        // The primary product's aliases resolve to LiveMorph before the
        // configured-id fallback runs, so an alias here would make the slot
        // unreachable via its own id.
        if matches!(
            self.secondary_product_id.trim().to_ascii_lowercase().as_str(),
            "lm" | "morph" | "live-morph"
        ) {
            return Err("SECONDARY_PRODUCT_ID must not be a livemorph alias (lm/morph/live-morph)".into());
        }
        if self.signup_bonus_credits > 1_000_000.0 {
            return Err(format!("SIGNUP_BONUS_CREDITS unreasonably large: {}", self.signup_bonus_credits));
        }
        // Mongo DB names: reject empty and invalid-namespace characters up front
        // so a bad value fails here with a clear message instead of an obscure
        // "invalid namespace" error deep inside ensure_indexes at boot.
        fn valid_db_name(name: &str, field: &str) -> Result<(), String> {
            let t = name.trim();
            if t.is_empty() {
                return Err(format!("{field} must not be empty"));
            }
            if t.len() > 63 {
                return Err(format!("{field} too long (max 63 bytes), got {} bytes", t.len()));
            }
            const BAD: &[char] = &['/', '\\', '.', '"', ' ', '$', '*', '<', '>', ':', '|', '?'];
            if let Some(c) = t.chars().find(|c| BAD.contains(c)) {
                return Err(format!("{field} contains invalid character {c:?}"));
            }
            Ok(())
        }
        valid_db_name(&self.mongodb_db, "MONGODB_DB")?;
        valid_db_name(&self.mongodb_db_secondary, "MONGODB_DB_SECONDARY")?;
        // The secondary product id becomes the default secondary DB name and a
        // JWT aud value, so it must be a sane identifier too.
        valid_db_name(&self.secondary_product_id, "SECONDARY_PRODUCT_ID")?;
        // If an explicit model allowlist is set, the default model must be in it
        // (after alias resolution) or every session 400s at runtime — a full
        // outage discovered only when a client connects.
        if let Some(allow) = &self.decart_allowed_models {
            if !allow.trim().is_empty() {
                let default = match self.decart_default_model.trim() {
                    "lucy-latest" => "lucy-2.6",
                    m => m,
                };
                if default.is_empty() {
                    return Err("DECART_DEFAULT_MODEL must not be empty when DECART_ALLOWED_MODELS is set".into());
                }
                if !allow.split(',').map(str::trim).any(|x| x == default) {
                    return Err(format!(
                        "DECART_DEFAULT_MODEL '{default}' is not in DECART_ALLOWED_MODELS — every session would 400"
                    ));
                }
            }
        }
        // CORS origins must be explicit absolute http(s) URIs; a literal "*"
        // (or garbage) would either fail actix-cors init obscurely or widen the
        // allowlist. Empty list is fine (deny-all in production).
        if let Some(cors) = &self.cors_origins {
            for origin in cors.split(',').map(str::trim).filter(|s| !s.is_empty()) {
                if origin == "*" {
                    return Err("CORS_ORIGINS must not contain a wildcard '*'; list explicit origins".into());
                }
                let valid = (origin.starts_with("https://") || origin.starts_with("http://"))
                    && url::Url::parse(origin)
                        .map(|u| u.host_str().is_some())
                        .unwrap_or(false);
                if !valid {
                    return Err(format!("CORS_ORIGINS entry '{origin}' must be an absolute http(s):// URI with a host"));
                }
            }
        }
        // Bound the OTP/auth lockout attempts so a huge value can't effectively
        // disable the lockout.
        if self.auth_max_attempts > 1_000 {
            return Err(format!("AUTH_MAX_ATTEMPTS must be <= 1000, got {}", self.auth_max_attempts));
        }
        // JWT secret floor in every environment (main.rs additionally refuses the
        // shipped test secrets), and it must not collide with other secrets.
        if self.jwt_secret.len() < 32 {
            return Err(format!("JWT_SECRET must be >= 32 chars, got {}", self.jwt_secret.len()));
        }
        if let Some(admin) = &self.admin_secret {
            if !admin.is_empty() && admin == &self.jwt_secret {
                return Err("JWT_SECRET must differ from ADMIN_SECRET".into());
            }
        }
        if let Ok(pepper) = std::env::var("OTP_PEPPER") {
            if !pepper.is_empty() && pepper == self.jwt_secret {
                return Err("JWT_SECRET must differ from OTP_PEPPER".into());
            }
        }
        // Production-only hard requirements.
        if self.is_production() {
            if self.allow_credits_adjust || self.allow_manual_payments {
                return Err("ALLOW_CREDITS_ADJUST / ALLOW_MANUAL_PAYMENTS must be false in production".into());
            }
            if !self.decart_signaling_url.starts_with("wss://") {
                return Err("DECART_SIGNALING_URL must be wss:// in production (a ws:// URL leaks DECART_API_KEY)".into());
            }
            if !self.public_base_url.starts_with("https://") {
                return Err("PUBLIC_BASE_URL must be https:// in production".into());
            }
            if self.mongodb_uri.starts_with("mongodb://") && !self.mongodb_uri.contains("tls=true") {
                return Err("MONGODB_URI must use mongodb+srv:// or tls=true in production".into());
            }
            if self.smtp_host.is_some() && (self.smtp_username.is_none() || self.smtp_password.is_none()) {
                return Err("SMTP_HOST requires SMTP_USERNAME and SMTP_PASSWORD".into());
            }
            if !std::env::var("OTP_PEPPER").map(|p| p.len() >= 16).unwrap_or(false) {
                return Err("OTP_PEPPER (>= 16 chars) is required in production".into());
            }
            if !self.admin_secret.as_deref().map(|s| s.len() >= 16).unwrap_or(false) {
                return Err("ADMIN_SECRET (>= 16 chars) is required in production".into());
            }
        }
        // SMTP: default to STARTTLS on the submission port — cleartext auth
        // must be an explicit opt-out.
        if self.smtp_host.is_some() && !self.smtp_starttls && self.smtp_port == 587 {
            return Err("SMTP_STARTTLS must be true on port 587 (set SMTP_STARTTLS=true)".into());
        }
        Ok(())
    }

    pub fn resolve_model(&self, requested: Option<&str>) -> Result<String, String> {
        let requested = requested.map(str::trim).filter(|s| !s.is_empty());
        // Alias: lucy-latest tracks the newest realtime model.
        let model = match requested {
            Some("lucy-latest") => "lucy-2.6",
            Some(m) => m,
            None => self.decart_default_model.as_str(),
        };
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
        // Hardcoded fallback used ONLY when DECART_ALLOWED_MODELS is unset/empty.
        // Includes lucy-2.6 (the documented DECART_DEFAULT_MODEL) so the default
        // config never 400s every session.
        const DEFAULTS: &[&str] = &["lucy-2.1", "lucy-2.5", "lucy-2.6", "lucy-restyle-2"];
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
                secondary_product_id: "secondary".into(),
                mongodb_db_secondary: "secondary".into(),
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
