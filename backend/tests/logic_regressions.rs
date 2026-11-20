//! Regression tests for logic fixed during the production-readiness audit.
//! Every test calls the REAL library functions (no mirrors).

use livemorph_backend::config::Config;
use livemorph_backend::product::ProductId;
use livemorph_backend::routes::referral::{code_for_email, referrals_enabled};
use livemorph_backend::services::{billing, flutterwave};

#[test]
fn flutterwave_never_rounds_underpayment_up() {
    // 9.995 against a 10.00 order must NOT pass (previously rounded to 1000).
    assert!(!flutterwave::amount_matches(1000, Some(9.995)));
    assert!(!flutterwave::amount_matches(1000, Some(9.99)));
    assert!(flutterwave::amount_matches(1000, Some(10.0)));
    assert!(flutterwave::amount_matches(1000, Some(10.01)));
    assert!(!flutterwave::amount_matches(1000, Some(f64::NAN)));
    assert!(!flutterwave::amount_matches(1000, Some(f64::INFINITY)));
    assert!(!flutterwave::amount_matches(1000, None));
}

#[test]
fn funding_analysis_exposes_underfunded_packs() {
    let cfg = Config::from_env().expect("test env loads");
    // $5 at the default 0.65 funded share and $0.02/s funds 162.5s; 500
    // credits at 2 credits/s sells 250s — the analysis must surface that.
    let (funded, sold) = billing::funding_analysis(&cfg, 5.0, 500.0);
    assert!(funded > 0.0 && sold > 0.0);
    assert!(sold > funded, "expected the documented mismatch to be visible");
    let underfunded = billing::underfunded_packs(&cfg);
    assert!(!underfunded.is_empty());
    assert!(underfunded.iter().all(|(_, f, s)| s > f));
}

#[test]
fn referral_codes_have_80_bits_and_unambiguous_alphabet() {
    for _ in 0..64 {
        let code = code_for_email("ignored@example.com");
        assert_eq!(code.len(), 18, "LM prefix + 16 chars");
        assert!(code.starts_with("LM"));
        assert!(code[2..]
            .chars()
            .all(|c| "ABCDEFGHJKLMNPQRSTUVWXYZ23456789".contains(c)));
    }
    let a = code_for_email("a@x.co");
    let b = code_for_email("a@x.co");
    assert_ne!(a, b, "codes must be random, not email-derived");
}

#[test]
fn referrals_only_enabled_for_secondary() {
    assert!(!referrals_enabled(ProductId::LiveMorph));
    assert!(referrals_enabled(ProductId::Secondary));
}

fn prod_cfg() -> Config {
    std::env::set_var("OTP_PEPPER", "unit-test-pepper-0123456789");
    let mut cfg = Config::from_env().expect("test env loads");
    cfg.rust_env = "production".into();
    cfg.allow_credits_adjust = false;
    cfg.allow_manual_payments = false;
    cfg.log_otp_codes = false;
    cfg.decart_signaling_url = "wss://api3.decart.ai/v1/stream".into();
    cfg.public_base_url = "https://api.example.com".into();
    cfg.admin_secret = Some("unit-test-admin-secret-0123456789".into());
    cfg.cors_origins = None;
    cfg.smtp_host = None;
    cfg.smtp_username = None;
    cfg.smtp_password = None;
    cfg.ice_servers_json = None;
    cfg.mongodb_uri = "mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true".into();
    cfg
}

#[test]
fn mongo_tls_must_be_a_real_option_not_a_substring() {
    let mut cfg = prod_cfg();
    // tls=true embedded in the PASSWORD must not satisfy the TLS requirement.
    cfg.mongodb_uri = "mongodb://user:tls=true@db.internal:27017/livemorph".into();
    assert!(cfg.validate().is_err());
    // Real option passes.
    cfg.mongodb_uri = "mongodb://db.internal:27017/livemorph?tls=true".into();
    assert!(cfg.validate().is_ok(), "{:?}", cfg.validate().err());
    // Legacy ssl=true is accepted too.
    cfg.mongodb_uri = "mongodb://db.internal:27017/livemorph?ssl=true".into();
    assert!(cfg.validate().is_ok());
    // SRV with an explicit tls=false is rejected.
    cfg.mongodb_uri = "mongodb+srv://user:pass@cluster.mongodb.net/?tls=false".into();
    assert!(cfg.validate().is_err());
    // Insecure compatibility flags are rejected even with TLS on.
    cfg.mongodb_uri =
        "mongodb+srv://user:pass@cluster.mongodb.net/?tlsAllowInvalidCertificates=true".into();
    assert!(cfg.validate().is_err());
    cfg.mongodb_uri = "mongodb://db.internal:27017/livemorph?tls=true&tlsInsecure=true".into();
    assert!(cfg.validate().is_err());
}

#[test]
fn public_base_url_trailing_slash_rejected() {
    let mut cfg = prod_cfg();
    cfg.public_base_url = "https://api.example.com/".into();
    assert!(cfg.validate().is_err());
    cfg.public_base_url = "https://api.example.com".into();
    assert!(cfg.validate().is_ok());
}

#[test]
fn ice_servers_json_validated_at_boot() {
    let mut cfg = prod_cfg();
    cfg.ice_servers_json = Some("{not json".into());
    assert!(cfg.validate().is_err());
    cfg.ice_servers_json = Some("[{\"urls\":\"stun:stun.l.google.com:19302\"}]".into());
    assert!(cfg.validate().is_ok(), "{:?}", cfg.validate().err());
    cfg.ice_servers_json = Some("{\"iceServers\":[{\"urls\":\"stun:x\"}]}".into());
    assert!(cfg.validate().is_ok());
    cfg.ice_servers_json = Some("42".into());
    assert!(cfg.validate().is_err());
}

#[test]
fn production_cors_must_be_https() {
    let mut cfg = prod_cfg();
    cfg.cors_origins = Some("https://app.example.com".into());
    assert!(cfg.validate().is_ok());
    cfg.cors_origins = Some("http://app.example.com".into());
    assert!(cfg.validate().is_err());
}

#[test]
fn empty_option_strings_are_normalized_to_unset() {
    std::env::set_var("SMTP_HOST", "");
    std::env::set_var("PAYSTACK_PUBLIC_KEY", "   ");
    let cfg = Config::load().expect("config loads");
    assert!(cfg.smtp_host.is_none());
    assert!(cfg.paystack_public_key.is_none());
    std::env::remove_var("SMTP_HOST");
    std::env::remove_var("PAYSTACK_PUBLIC_KEY");
}
