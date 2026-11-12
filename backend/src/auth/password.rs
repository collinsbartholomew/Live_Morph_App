use crate::error::{AppError, AppResult};

pub fn hash_password(plain: &str) -> AppResult<String> {
    // bcrypt truncates at 72 bytes — reject longer input as a client error
    // instead of silently truncating (and returning a 500 from bcrypt).
    if plain.len() > 72 {
        return Err(AppError::BadRequest("password too long (max 72 bytes)".into()));
    }
    bcrypt::hash(plain, 12).map_err(|e| AppError::Internal(format!("hash: {e}")))
}

pub fn verify_password(plain: &str, hash: &str) -> AppResult<bool> {
    bcrypt::verify(plain, hash).map_err(|e| AppError::Internal(format!("verify: {e}")))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn password_hash_and_verify() {
        let h = hash_password("correct horse battery").unwrap();
        assert!(verify_password("correct horse battery", &h).unwrap());
        assert!(!verify_password("wrong", &h).unwrap());
    }

    #[test]
    fn malformed_hash_is_an_error_not_a_false() {
        // bcrypt::verify ERRORS on malformed hashes — a miss-path that verifies
        // against an invalid "dummy" hash would surface as a 500, not a 401.
        // Login therefore generates a REAL dummy hash per process.
        assert!(verify_password("x", "$2b$12$not-a-real-bcrypt-hash").is_err());
        assert!(verify_password("x", "").is_err());
    }
}
