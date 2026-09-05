//! Frontend / product identity for unified routes.
//!
//! Clients send one of:
//!   Header:  X-Frontend-Id: livemorph | liveescape
//!            X-Client-Product: … (alias)
//!   Query:   ?product=… or ?frontend_id=…
//!   JSON body field: "product" | "frontend_id" (when applicable)
//!
//! Default: livemorph (LiveMorph Qt is the primary desktop client on this stack).

use actix_web::HttpRequest;
use serde::Deserialize;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ProductId {
    #[serde(alias = "lm", alias = "morph")]
    LiveMorph,
    #[serde(alias = "le", alias = "escape", alias = "smokescreen")]
    LiveEscape,
}

impl ProductId {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::LiveMorph => "livemorph",
            Self::LiveEscape => "liveescape",
        }
    }

    pub fn parse(raw: &str) -> Option<Self> {
        match raw.trim().to_ascii_lowercase().as_str() {
            "livemorph" | "lm" | "morph" | "live-morph" => Some(Self::LiveMorph),
            "liveescape" | "le" | "escape" | "smokescreen" | "live-escape" => {
                Some(Self::LiveEscape)
            }
            _ => None,
        }
    }

    /// Resolve from request headers + query (body is left to handlers).
    pub fn from_request(req: &HttpRequest) -> Self {
        if let Some(h) = req
            .headers()
            .get("X-Frontend-Id")
            .or_else(|| req.headers().get("x-frontend-id"))
            .or_else(|| req.headers().get("X-Client-Product"))
            .or_else(|| req.headers().get("x-client-product"))
            .and_then(|v| v.to_str().ok())
        {
            if let Some(p) = Self::parse(h) {
                return p;
            }
        }
        let q = req.query_string();
        for pair in q.split('&') {
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
}

impl std::fmt::Display for ProductId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(self.as_str())
    }
}
