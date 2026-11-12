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
        let message = match self {
            // Never leak internal/upstream details (they embed provider errors,
            // URLs, mongo messages) — log them server-side instead.
            AppError::Internal(detail) => {
                tracing::error!(error = %detail, "internal error");
                "internal error".to_string()
            }
            other => other.to_string(),
        };
        builder.json(ErrorBody {
            error: code.into(),
            message,
        })
    }
}

impl From<reqwest::Error> for AppError {
    fn from(e: reqwest::Error) -> Self {
        tracing::error!(error = %e, "upstream http error");
        AppError::Internal("upstream request failed".into())
    }
}

impl From<serde_json::Error> for AppError {
    fn from(e: serde_json::Error) -> Self {
        tracing::error!(error = %e, "serde error");
        AppError::Internal("invalid json".into())
    }
}

impl From<mongodb::error::Error> for AppError {
    fn from(e: mongodb::error::Error) -> Self {
        tracing::error!(error = %e, "mongodb error");
        AppError::Internal("database error".into())
    }
}

impl From<jsonwebtoken::errors::Error> for AppError {
    fn from(_e: jsonwebtoken::errors::Error) -> Self {
        // Never echo the JWT error kind (signature/expiry details) to clients.
        AppError::Unauthorized("invalid token".into())
    }
}

pub type AppResult<T> = Result<T, AppError>;
