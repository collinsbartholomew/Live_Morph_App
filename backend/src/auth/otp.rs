use crate::error::{AppError, AppResult};
use rand::RngExt;
use sha2::{Digest, Sha256};

pub fn generate_otp(len: u8) -> String {
    let len = len.clamp(6, 12) as usize;
    let mut rng = rand::rng();
    (0..len)
        .map(|_| std::char::from_digit(rng.random_range(0..10), 10).unwrap())
        .collect()
}

pub fn hash_otp(code: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(code.as_bytes());
    hex::encode(hasher.finalize())
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
    {
        return Err(AppError::BadRequest("invalid email".into()));
    }
    if local
        .chars()
        .any(|c| !(c.is_ascii_alphanumeric() || matches!(c, '.' | '_' | '%' | '+' | '-')))
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
    }
}
