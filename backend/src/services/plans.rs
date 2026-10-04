//! Unified plan catalog — single source of truth for pricing/credits.
//!
//! Two Live Escape plan families (matching the Electron reference):
//!   * Activation (annual license) plans — what a key/activation grants.
//!   * Credit top-up plans — what the PlanGate sells.
//!
//! LiveMorph uses token packs (`TokenPackage::catalog`), mapped here for
//! products that request plan-shaped payloads.

use crate::models::TokenPackage;
use crate::product::ProductId;
use serde_json::{json, Value};

#[derive(Debug, Clone, Copy)]
pub struct Plan {
    pub id: &'static str,
    pub name: &'static str,
    pub dollars: f64,
    pub credits: f64,
    pub popular: bool,
}

/// Annual-license activation plans (Electron gate plans).
pub const ACTIVATION_PLANS: &[Plan] = &[
    Plan { id: "starter", name: "Starter", dollars: 20.0, credits: 300.0, popular: false },
    Plan { id: "creator", name: "Creator", dollars: 75.0, credits: 500.0, popular: true },
    Plan { id: "pro", name: "Pro", dollars: 120.0, credits: 2_000.0, popular: false },
];

/// Credit top-up plans (Electron `DEFAULT_PLANS`).
pub const CREDIT_PLANS: &[Plan] = &[
    Plan { id: "test", name: "Test", dollars: 0.5, credits: 50.0, popular: false },
    Plan { id: "starter", name: "Starter", dollars: 20.0, credits: 1_000.0, popular: false },
    Plan { id: "pro", name: "Pro", dollars: 60.0, credits: 5_000.0, popular: true },
    Plan { id: "premium", name: "Premium", dollars: 150.0, credits: 10_000.0, popular: false },
    Plan { id: "elite", name: "Elite", dollars: 550.0, credits: 50_000.0, popular: false },
];

/// Starter Pack ("try first") pricing — a distinct trial option in Live Escape,
/// separate from the annual activation plans and the credit top-up plans.
pub const STARTER_PACK: (f64, f64) = (10.0, 500.0);

/// Activation plan by id → (usd, credits). Used for key grants + activation orders.
pub fn activation_plan(id: &str) -> Option<Plan> {
    ACTIVATION_PLANS.iter().copied().find(|p| p.id == id)
}

/// Feature list for the annual-license activation gate (reference gate grid).
pub fn activation_features(id: &str) -> Vec<&'static str> {
    match id {
        "starter" => vec!["Face Swap", "Recording / Snapshots", "Video Tutorials"],
        "creator" => vec![
            "Everything in Starter",
            "Voice Changer",
            "Creator Program",
            "15% Referral Commission",
            "Background Change",
        ],
        "pro" => vec!["Everything in Creator", "1-on-1 Setup Call", "Priority Support"],
        _ => vec![],
    }
}

/// Discounted upgrade pricing (reference `UPGRADE_TARGETS`). Credits carried
/// over; the client pays the discounted rate for the target plan.
pub fn upgrade_pricing(from_plan: &str, to_plan: &str) -> Option<(f64, f64)> {
    let from = from_plan.to_ascii_lowercase();
    let to = to_plan.to_ascii_lowercase();
    let (dollars, _credits) = match (from.as_str(), to.as_str()) {
        ("starter", "creator") => (50.0, 500.0),
        ("starter", "pro") => (100.0, 2_000.0),
        ("creator", "pro") => (40.0, 2_000.0),
        _ => return None,
    };
    Some((dollars, _credits))
}

/// Credit top-up plan by id → (usd, credits).
pub fn credit_plan(id: &str) -> Option<Plan> {
    CREDIT_PLANS.iter().copied().find(|p| p.id == id)
}

/// Resolve a plan id used across the platform.
/// Activation-style ids (starter/creator/pro) fall back to credit-plan ids too.
#[allow(dead_code)]
pub fn resolve_plan(id: &str) -> Option<Plan> {
    activation_plan(id).or_else(|| credit_plan(id))
}

/// JSON payload for GET /settings/plans (product aware).
pub fn plans_for(product: ProductId) -> Value {
    match product {
        ProductId::LiveEscape => {
            let time_label = |id: &str| match id {
                "test" => "~25 sec",
                "starter" => "~8 min",
                "pro" => "~42 min",
                "premium" => "~83 min",
                "elite" => "~417 min",
                _ => "",
            };
            let features = |id: &str| -> Vec<&str> {
                let base = vec!["Full AI engine access", "OBS / Theatre mode"];
                match id {
                    "test" => base,
                    "starter" => {
                        vec!["Full AI engine access", "All presets included", "OBS / Theatre mode"]
                    }
                    _ => vec![
                        "Full AI engine access",
                        "All presets included",
                        "OBS / Theatre mode",
                        "Priority Support",
                    ],
                }
            };
            json!(CREDIT_PLANS
                .iter()
                .map(|p| json!({
                    "id": p.id,
                    "name": p.name,
                    "dollars": p.dollars,
                    "credits": p.credits,
                    "popular": p.popular,
                    "timeLabel": time_label(p.id),
                    "features": features(p.id),
                }))
                .collect::<Vec<_>>())
        }
        ProductId::LiveMorph => {
            let packs = TokenPackage::catalog();
            json!(packs
                .iter()
                .map(|p| json!({
                    "id": p.key,
                    "name": p.name,
                    "dollars": p.price_usd,
                    "credits": p.credits,
                    "popular": p.popular,
                }))
                .collect::<Vec<_>>())
        }
    }
}

/// Activation gate plans for the access gate UI (product aware).
#[allow(dead_code)]
pub fn activation_plans_json() -> Value {
    json!(ACTIVATION_PLANS
        .iter()
        .map(|p| json!({
            "id": p.id,
            "name": p.name,
            "dollars": p.dollars,
            "credits": p.credits,
            "popular": p.popular,
            "features": activation_features(p.id),
        }))
        .collect::<Vec<_>>())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn activation_and_credit_plans_are_consistent() {
        assert!(ACTIVATION_PLANS.iter().all(|p| p.dollars > 0.0 && p.credits > 0.0));
        assert!(CREDIT_PLANS.iter().all(|p| p.dollars > 0.0 && p.credits > 0.0));
        assert_eq!(activation_plan("creator").unwrap().dollars, 75.0);
        assert_eq!(credit_plan("elite").unwrap().credits, 50_000.0);
        assert!(resolve_plan("starter").is_some());
        assert!(resolve_plan("does-not-exist").is_none());
    }

    #[test]
    fn plans_for_is_product_aware() {
        let le = plans_for(ProductId::LiveEscape);
        let lm = plans_for(ProductId::LiveMorph);
        assert!(le.as_array().unwrap().iter().any(|p| p["id"] == "elite"));
        assert!(lm.as_array().unwrap().iter().any(|p| p["id"] == "basic"));
    }
}