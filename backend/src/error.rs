//! Unified API error type → HTTP responses.

use actix_web::{http::StatusCode, HttpResponse, ResponseError};
use serde::Serialize;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("unauthorized: {0}")]
    Unauthorized(String),
    #[error("payment required: {0}")]
    PaymentRequired(String),
    #[error("forbidden: {0}")]
    Forbidden(String),
    #[error("not found: {0}")]
    NotFound(String),
    #[error("bad request: {0}")]
    BadRequest(String),
    #[error("conflict: {0}")]
    Conflict(String),
    #[error("rate limited: {0}")]
    RateLimited(String),
    #[error("insufficient credits")]
    InsufficientCredits,
    #[error("internal: {0}")]
    Internal(String),
}

#[derive(Serialize)]
struct ErrorBody {
    error: String,
    message: String,
}

impl ResponseError for AppError {
    fn status_code(&self) -> StatusCode {
        match self {
            AppError::Unauthorized(_) => StatusCode::UNAUTHORIZED,
            AppError::PaymentRequired(_) => StatusCode::PAYMENT_REQUIRED,
            AppError::Forbidden(_) => StatusCode::FORBIDDEN,
            AppError::NotFound(_) => StatusCode::NOT_FOUND,
            AppError::BadRequest(_) => StatusCode::BAD_REQUEST,
            AppError::Conflict(_) => StatusCode::CONFLICT,
            AppError::RateLimited(_) => StatusCode::TOO_MANY_REQUESTS,
            AppError::InsufficientCredits => StatusCode::PAYMENT_REQUIRED,
            AppError::Internal(_) => StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    fn error_response(&self) -> HttpResponse {
        let code = match self {
            AppError::Unauthorized(_) => "unauthorized",
            AppError::PaymentRequired(_) => "payment_required",
            AppError::Forbidden(_) => "forbidden",
            AppError::NotFound(_) => "not_found",
            AppError::BadRequest(_) => "bad_request",
            AppError::Conflict(_) => "conflict",
            AppError::RateLimited(_) => "rate_limited",
            AppError::InsufficientCredits => "insufficient_credits",
            AppError::Internal(_) => "internal",
        };
        let mut builder = HttpResponse::build(self.status_code());
        if matches!(self, AppError::RateLimited(_)) {
            builder.insert_header(("Retry-After", "60"));
            builder.insert_header(("X-RateLimit-Reset", "60"));
        }
        // Avoid caching error payloads
        builder.insert_header(("Cache-Control", "no-store"));
        builder.json(ErrorBody {
            error: code.into(),
            message: self.to_string(),
        })
    }
}

impl From<mongodb::error::Error> for AppError {
    fn from(e: mongodb::error::Error) -> Self {
        tracing::error!(error = %e, "mongodb error");
        AppError::Internal("database error".into())
    }
}

impl From<jsonwebtoken::errors::Error> for AppError {
    fn from(e: jsonwebtoken::errors::Error) -> Self {
        AppError::Unauthorized(format!("token: {e}"))
    }
}

pub type AppResult<T> = Result<T, AppError>;
