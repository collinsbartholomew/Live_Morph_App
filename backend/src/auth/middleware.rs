use crate::auth::jwt::decode_access;
use crate::product::ProductId;
use crate::config::Config;
use crate::db::Db;
use mongodb::bson::doc;
use crate::error::AppError;
use actix_web::{
    dev::{Service, ServiceRequest, ServiceResponse, Transform},
    Error, HttpMessage,
};
use futures_util::future::{ok, LocalBoxFuture, Ready};
use std::{
    collections::HashMap,
    rc::Rc,
    sync::{Arc, LazyLock, Mutex},
    task::{Context, Poll},
    time::{Duration, Instant},
};

/// Short-TTL cache for the per-request revocation check, keyed by
/// (product, user_id, token_version) so a token_version bump (revoke-all)
/// always misses. Bounded revocation latency <= TTL; the DB user lookup is
/// only hit on cache expiry. Capped so it can't grow unbounded.
static USER_ACTIVE_CACHE: LazyLock<Mutex<HashMap<(String, String, i64), (bool, Instant)>>> =
    LazyLock::new(|| Mutex::new(HashMap::new()));
const USER_ACTIVE_TTL: Duration = Duration::from_secs(10);
const USER_ACTIVE_CAP: usize = 16_384;

fn cached_user_active(product: &str, sub: &str, ver: i64) -> Option<bool> {
    let m = USER_ACTIVE_CACHE.lock().ok()?;
    if let Some((active, at)) = m.get(&(product.to_string(), sub.to_string(), ver)) {
        if at.elapsed() < USER_ACTIVE_TTL {
            return Some(*active);
        }
    }
    None
}

fn put_user_active(product: &str, sub: &str, ver: i64, active: bool) {
    if let Ok(mut m) = USER_ACTIVE_CACHE.lock() {
        if m.len() >= USER_ACTIVE_CAP {
            let oldest = m
                .iter()
                .min_by_key(|(_, (_, at))| *at)
                .map(|(k, _)| k.clone());
            if let Some(k) = oldest {
                m.remove(&k);
            }
        }
        m.insert((product.to_string(), sub.to_string(), ver), (active, Instant::now()));
    }
}

/// Drop cached revocation state for a user — call when `is_active` flips to
/// false (account deletion) so deactivation is honored immediately rather
/// than after the cache TTL. (token_version bumps need no call: they change
/// the cache key, so they always miss.)
pub fn invalidate_user_active(product: ProductId, sub: &str) {
    if let Ok(mut m) = USER_ACTIVE_CACHE.lock() {
        let p = product.as_str();
        m.retain(|(cp, cs, _), _| !(cp == p && cs == sub));
    }
}

/// Extracted identity stored in request extensions after JWT validation.
#[derive(Clone, Debug)]
pub struct AuthUser {
    pub user_id: String,
    pub email: String,
}

/// Parse an `Authorization: Bearer <token>` header value.
/// Never panics on non-ASCII/multibyte input (uses `str::get`, not slicing).
pub fn parse_bearer_token(header: &str) -> Option<String> {
    let h = header.trim();
    match h.get(..7) {
        Some(prefix) if prefix.eq_ignore_ascii_case("bearer ") => {
            h.get(7..).map(|s| s.trim().to_string()).filter(|s| !s.is_empty())
        }
        _ => None,
    }
}


pub struct JwtAuth {
    pub config: Arc<Config>,
    pub db: Db,
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
            db: self.db.clone(),
        })
    }
}

pub struct JwtAuthMiddleware<S> {
    service: Rc<S>,
    config: Arc<Config>,
    db: Db,
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
        let db = self.db.clone();

        Box::pin(async move {
            // Optional auth: extract and validate the token if present, but do NOT
            // reject when missing — individual handlers call require_user() to enforce.
            if let Some(auth_header) = req
                .headers()
                .get("Authorization")
                .and_then(|v| v.to_str().ok())
                .map(|s| s.to_string())
            {
                let token = parse_bearer_token(&auth_header);

                if let Some(token) = token {
                    if !token.is_empty() {
                        if let Ok(claims) = decode_access(&cfg, &token) {
                            // Product binding: the token's aud picks the store AND
                            // must match the request's product — a cross-product
                            // token is treated as unauthenticated (same as the WS paths).
                            let req_product = ProductId::from_headers_query(req.headers(), req.query_string());
                            // Strict compare (same as the WS paths): a token must
                            // carry an aud that exactly matches the request's
                            // product. Tokens with NO aud are rejected too — an
                            // aud-less token would let a client claim any product.
                            if claims.aud.as_deref() != Some(req_product.as_str()) {
                                tracing::warn!(user = %claims.sub, "cross-product/aud-less token rejected");
                            } else {
                                let token_product = ProductId::parse(req_product.as_str())
                                    .unwrap_or(req_product);
                                // Revocation + account state: load the user from the
                                // TOKEN's product store and compare token_version.
                                let store = match token_product {
                                    ProductId::Secondary => db.users_secondary(),
                                    ProductId::LiveMorph => db.users(),
                                };
                                // Revocation + account state: check the short-TTL
                                // cache first (keyed by ver so a revoke always
                                // misses), fall back to the DB lookup on expiry.
                                let key_product = token_product.as_str();
                                let cached = cached_user_active(key_product, &claims.sub, claims.ver);
                                let active = match cached {
                                    Some(a) => Some(a),
                                    None => {
                                        let user = store
                                            .find_one(doc! { "_id": &claims.sub })
                                            .await
                                            .ok()
                                            .flatten();
                                        let a = user
                                            .map(|u| u.is_active && u.token_version == claims.ver)
                                            .unwrap_or(false);
                                        put_user_active(key_product, &claims.sub, claims.ver, a);
                                        Some(a)
                                    }
                                };
                                match active {
                                    Some(true) => {
                                        req.extensions_mut().insert(AuthUser {
                                            user_id: claims.sub,
                                            email: claims.email,
                                        });
                                    }
                                    Some(false) => {
                                        tracing::warn!(user = %claims.sub, "stale/deactivated token rejected");
                                    }
                                    None => {
                                        tracing::warn!(user = %claims.sub, "token for unknown user rejected");
                                    }
                                }
                            }
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn bearer_parsing() {
        assert_eq!(parse_bearer_token("Bearer abc.def"), Some("abc.def".into()));
        assert_eq!(parse_bearer_token("bearer  abc.def "), Some("abc.def".into()));
        assert_eq!(parse_bearer_token("BEARER abc"), Some("abc".into()));
        assert_eq!(parse_bearer_token("Basic abc"), None);
        assert_eq!(parse_bearer_token("Bearer"), None);
        assert_eq!(parse_bearer_token("Bearer "), None);
        assert_eq!(parse_bearer_token(""), None);
    }

    #[test]
    fn bearer_parsing_never_panics_on_multibyte() {
        // First 7 bytes are not a char boundary; slicing would panic here.
        for h in ["éééé", "🔑🔑🔑🔑x", "aaaaaaaaé", "béarer x", "Bearer éééééééé"] {
            let _ = parse_bearer_token(h);
        }
        assert_eq!(parse_bearer_token("Bearer éééééééé"), Some("éééééééé".into()));
    }
}
