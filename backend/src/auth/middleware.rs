use crate::auth::jwt::decode_access;
use crate::config::Config;
use crate::error::AppError;
use actix_web::{
    dev::{Service, ServiceRequest, ServiceResponse, Transform},
    Error, HttpMessage,
};
use futures_util::future::{ok, LocalBoxFuture, Ready};
use std::{
    rc::Rc,
    sync::Arc,
    task::{Context, Poll},
};

/// Extracted identity stored in request extensions after JWT validation.
#[derive(Clone, Debug)]
pub struct AuthUser {
    pub user_id: String,
    pub email: String,
}

pub struct JwtAuth {
    pub config: Arc<Config>,
}

impl<S, B> Transform<S, ServiceRequest> for JwtAuth
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type InitError = ();
    type Transform = JwtAuthMiddleware<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ok(JwtAuthMiddleware {
            service: Rc::new(service),
            config: self.config.clone(),
        })
    }
}

pub struct JwtAuthMiddleware<S> {
    service: Rc<S>,
    config: Arc<Config>,
}

impl<S, B> Service<ServiceRequest> for JwtAuthMiddleware<S>
where
    S: Service<ServiceRequest, Response = ServiceResponse<B>, Error = Error> + 'static,
    S::Future: 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = LocalBoxFuture<'static, Result<Self::Response, Self::Error>>;

    fn poll_ready(&self, cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        self.service.poll_ready(cx)
    }

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let svc = self.service.clone();
        let cfg = self.config.clone();

        Box::pin(async move {
            // Optional auth: extract and validate the token if present, but do NOT
            // reject when missing — individual handlers call require_user() to enforce.
            if let Some(auth_header) = req
                .headers()
                .get("Authorization")
                .and_then(|v| v.to_str().ok())
                .map(|s| s.to_string())
            {
                let token = if auth_header.len() > 7 {
                    let lower = auth_header[..7].to_ascii_lowercase();
                    if lower == "bearer " {
                        Some(auth_header[7..].trim().to_string())
                    } else {
                        None
                    }
                } else {
                    None
                };

                if let Some(token) = token {
                    if !token.is_empty() {
                        if let Ok(claims) = decode_access(&cfg, &token) {
                            req.extensions_mut().insert(AuthUser {
                                user_id: claims.sub,
                                email: claims.email,
                            });
                        }
                    }
                }
            }
            svc.call(req).await
        })
    }
}

/// Helper for handlers: pull AuthUser from request extensions.
pub fn require_user(req: &actix_web::HttpRequest) -> Result<AuthUser, AppError> {
    req.extensions()
        .get::<AuthUser>()
        .cloned()
        .ok_or_else(|| AppError::Unauthorized("not authenticated".into()))
}
