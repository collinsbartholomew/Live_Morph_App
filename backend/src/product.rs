//! Frontend / product identity for unified routes.
//!
//! Clients send one of:
//!   Header:  X-Frontend-Id: livemorph | secondary
//!            X-Client-Product: … (alias)
//!   Query:   ?product=… or ?frontend_id=…
//!   JSON body field: "product" | "frontend_id" (when applicable)
//!
//! Default: livemorph (LiveMorph Qt is the primary desktop client on this stack).
//!
//! ## The second product slot
//!
//! `ProductId::Secondary` is an **unclaimed slot reserved for the next
//! desktop client**. Its wire id and its database are configurable, so a new
//! frontend can be onboarded without touching Rust code:
//!
//! ```text
//! SECONDARY_PRODUCT_ID=myclient     # what clients send in X-Frontend-Id
//! MONGODB_DB_SECONDARY=myclient_db  # its isolated database
//! ```
//!
//! With both unset the slot answers to `secondary` and uses the `secondary`
//! database. Every product-scoped behaviour (own user store, own ledger, own
//! order collection, own bootstrap payload, own plan catalogue, own license
//! key flow) is driven from this single slot.

use std::sync::OnceLock;

use actix_web::HttpRequest;

/// Wire id of the second product slot before `SECONDARY_PRODUCT_ID` is applied.
pub const DEFAULT_SECONDARY_ID: &str = "secondary";

/// Wire id bound to the second product slot at startup.
static SECONDARY_ID: OnceLock<String> = OnceLock::new();

/// Install the configured wire id for the second product slot.
/// Called once during startup; later calls are ignored.
pub fn init_secondary_id(id: &str) {
    let id = id.trim();
    if id.is_empty() {
        return;
    }
    let _ = SECONDARY_ID.set(id.to_string());
}

/// The wire id currently bound to the second product slot.
pub fn secondary_id() -> &'static str {
    SECONDARY_ID
        .get()
        .map(|s| s.as_str())
        .unwrap_or(DEFAULT_SECONDARY_ID)
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ProductId {
    /// The primary desktop client.
    LiveMorph,
    /// The second desktop client slot (unclaimed).
    Secondary,
}

impl ProductId {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::LiveMorph => "livemorph",
            Self::Secondary => secondary_id(),
        }
    }

    pub fn parse(raw: &str) -> Option<Self> {
        let trimmed = raw.trim();
        match trimmed.to_ascii_lowercase().as_str() {
            "livemorph" | "lm" | "morph" | "live-morph" => Some(Self::LiveMorph),
            "secondary" | "sec" | "second" | "product2" | "p2" => Some(Self::Secondary),
            _ => {
                // The configured id for the second slot wins over nothing else.
                if trimmed.eq_ignore_ascii_case(secondary_id()) {
                    Some(Self::Secondary)
                } else {
                    None
                }
            }
        }
    }

    /// Resolve from headers + query string only (works for both HttpRequest
    /// and ServiceRequest in middleware).
    pub fn from_headers_query(headers: &actix_web::http::header::HeaderMap, query: &str) -> Self {
        if let Some(h) = headers
            .get("X-Frontend-Id")
            .or_else(|| headers.get("x-frontend-id"))
            .or_else(|| headers.get("X-Client-Product"))
            .or_else(|| headers.get("x-client-product"))
            .and_then(|v| v.to_str().ok())
        {
            if let Some(p) = Self::parse(h) {
                return p;
            }
        }
        for pair in query.split('&') {
            let mut it = pair.splitn(2, '=');
            let k = it.next().unwrap_or("");
            let v = it.next().unwrap_or("");
            if k == "product" || k == "frontend_id" {
                if let Some(p) = Self::parse(v) {
                    return p;
                }
            }
        }
        Self::LiveMorph
    }

    /// Resolve from request headers + query (body is left to handlers).
    pub fn from_request(req: &HttpRequest) -> Self {
        Self::from_headers_query(req.headers(), req.query_string())
    }
}

impl std::fmt::Display for ProductId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(self.as_str())
    }
}
