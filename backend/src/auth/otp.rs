use crate::error::{AppError, AppResult};
use hmac::digest::KeyInit;
use hmac::{Hmac, Mac};
use rand::RngExt;
use sha2::Sha256;

/// Server-side pepper for OTP hashes. Required in production (checked at
/// boot); in development a fixed local pepper is used with a loud warning so
/// a DB dump still can't be brute-forced without the pepper.
pub fn otp_pepper_pub() -> &'static [u8] {
    otp_pepper()
}

fn otp_pepper() -> &'static [u8] {
    use std::sync::LazyLock;
    static PEPPER: LazyLock<Vec<u8>> = LazyLock::new(|| {
        match std::env::var("OTP_PEPPER") {
            Ok(p) if p.len() >= 16 => p.into_bytes(),
            _ => {
                tracing::warn!("OTP_PEPPER unset/short — using dev-only pepper; set a >=16-char OTP_PEPPER in production");
                b"livemorph-dev-otp-pepper-not-for-production".to_vec()
            }
        }
    });
    &PEPPER
}

pub fn generate_otp(len: u8) -> String {
    let len = len.clamp(6, 12) as usize;
    let mut rng = rand::rng();
    (0..len)
        .map(|_| std::char::from_digit(rng.random_range(0..10), 10).unwrap())
        .collect()
}

pub fn hash_otp(code: &str) -> String {
    // HMAC-SHA256 keyed with the server pepper — a DB leak alone does not
    // expose the 10^8 code space.
    let mut mac = <Hmac<Sha256> as KeyInit>::new_from_slice(otp_pepper())
        .expect("HMAC accepts any key length");
    mac.update(code.as_bytes());
    hex::encode(mac.finalize().into_bytes())
}

pub fn verify_otp(code: &str, hash: &str) -> bool {
    use subtle::ConstantTimeEq;
    let a = hash_otp(code);
    if a.len() != hash.len() {
        let dummy = vec![0u8; a.len().max(hash.len())];
        let _ = dummy.ct_eq(&dummy);
        return false;
    }
    a.as_bytes().ct_eq(hash.as_bytes()).into()
}

pub fn validate_email(email: &str) -> AppResult<()> {
    let e = email.trim().to_lowercase();
    if e.len() < 5 || e.len() > 254 {
        return Err(AppError::BadRequest("invalid email".into()));
    }
    // Control chars / non-ASCII anywhere — an address like "a@exa\nmple.com"
    // must never reach an SMTP header builder.
    if e.chars().any(|c| c.is_control() || !c.is_ascii()) {
        return Err(AppError::BadRequest("invalid email".into()));
    }
    if e.contains(' ') || e.contains("..") || e.starts_with('.') || e.ends_with('.') {
        return Err(AppError::BadRequest("invalid email".into()));
    }
    let Some((local, domain)) = e.split_once('@') else {
        return Err(AppError::BadRequest("invalid email".into()));
    };
    if local.is_empty()
        || domain.is_empty()
        || !domain.contains('.')
        || domain.starts_with('.')
        || domain.ends_with('.')
        || domain.starts_with('-')
        || domain.ends_with('-')
    {
        return Err(AppError::BadRequest("invalid email".into()));
    }
    if local
        .chars()
        .any(|c| !(c.is_ascii_alphanumeric() || matches!(c, '.' | '_' | '%' | '+' | '-')))
    {
        return Err(AppError::BadRequest("invalid email".into()));
    }
    if domain
        .chars()
        .any(|c| !(c.is_ascii_alphanumeric() || matches!(c, '-' | '.')))
    {
        return Err(AppError::BadRequest("invalid email".into()));
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn otp_length_bounds() {
        let c = generate_otp(8);
        assert_eq!(c.len(), 8);
        assert!(c.chars().all(|ch| ch.is_ascii_digit()));
    }

    #[test]
    fn otp_hash_roundtrip() {
        let c = "12345678";
        let h = hash_otp(c);
        assert!(verify_otp(c, &h));
        assert!(!verify_otp("00000000", &h));
    }

    #[test]
    fn email_validation() {
        assert!(validate_email("a@b.co").is_ok());
        assert!(validate_email("user@example.com").is_ok());
        assert!(validate_email("a.b+tag@mail.co.uk").is_ok());
        assert!(validate_email("bad").is_err());
        assert!(validate_email("no spaces@x.com").is_err());
        assert!(validate_email("").is_err());
        assert!(validate_email("a@b").is_err());
        assert!(validate_email("a@b.").is_err());
        assert!(validate_email(".a@b.com").is_err());
        assert!(validate_email("a@b..com").is_err());
        // Control chars / non-ASCII must be rejected (SMTP header safety)
        assert!(validate_email("a@exa\nmple.com").is_err());
        assert!(validate_email("a@exa\rmple.com").is_err());
        assert!(validate_email("a@exa\tmple.com").is_err());
        assert!(validate_email("a@exämple.com").is_err());
        assert!(validate_email("a@exa mple.com").is_err());
        assert!(validate_email("a@-ex.com").is_err());
        assert!(validate_email("a@ex.com-").is_err());
    }
}
