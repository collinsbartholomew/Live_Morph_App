use crate::error::{AppError, AppResult};

pub fn hash_password(plain: &str) -> AppResult<String> {
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
}
