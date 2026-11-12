use crate::config::Config;
use crate::models::{Character, User};
use chrono::Utc;
use mongodb::{
    bson::doc,
    options::{ClientOptions, IndexOptions},
    Client, Collection, Database, IndexModel,
};
use uuid::Uuid;

#[derive(Clone)]
pub struct Db {
    /// Connection pool handle — never read directly, but must be kept alive
    /// to maintain the MongoDB connection pool for `db` and `db_secondary`.
    #[allow(dead_code)]
    client: Client,
    /// LiveMorph database (primary)
    pub db: Database,
    /// Secondary database (isolated)
    pub db_secondary: Database,
}

impl Db {
    pub async fn connect(cfg: &Config) -> anyhow::Result<Self> {
        let mut opts = ClientOptions::parse(&cfg.mongodb_uri).await?;
        opts.app_name = Some("livemorph-backend".into());
        let client = Client::with_options(opts)?;
        // Ping
        client
            .database("admin")
            .run_command(doc! { "ping": 1 })
            .await?;
        let db = client.database(&cfg.mongodb_db);
        let db_secondary = client.database(&cfg.mongodb_db_secondary);
        let this = Self { client, db, db_secondary };
        this.ensure_indexes().await?;
        if cfg.seed_starter_catalog {
            this.seed_catalog_if_empty().await?;
        }
        Ok(this)
    }

    pub fn users(&self) -> Collection<User> {
        self.db.collection("users")
    }

    /// Secondary isolated collections
    pub fn users_secondary(&self) -> Collection<User> {
        self.db_secondary.collection("users")
    }
    pub fn access_keys_secondary(&self) -> Collection<crate::models::AccessKey> {
        self.db_secondary.collection("access_keys")
    }
    pub fn ledger_secondary(&self) -> Collection<crate::models::CreditLedgerEntry> {
        self.db_secondary.collection("credit_ledger")
    }
    pub fn sessions_secondary(&self) -> Collection<mongodb::bson::Document> {
        self.db_secondary.collection("sessions")
    }
    pub fn payment_orders_secondary(&self) -> Collection<mongodb::bson::Document> {
        self.db_secondary.collection("payment_orders")
    }
    pub fn payment_orders_secondary_typed(&self) -> Collection<crate::models::PaymentOrder> {
        self.db_secondary.collection("payment_orders")
    }
    pub fn refresh_tokens_secondary(&self) -> Collection<mongodb::bson::Document> {
        self.db_secondary.collection("refresh_tokens")
    }
    pub fn otps(&self) -> Collection<crate::models::OtpChallenge> {
        self.db.collection("otp_challenges")
    }
    pub fn otps_secondary(&self) -> Collection<crate::models::OtpChallenge> {
        self.db_secondary.collection("otp_challenges")
    }
    pub fn password_reset_tokens(&self) -> Collection<mongodb::bson::Document> {
        self.db.collection("password_reset_tokens")
    }
    pub fn password_reset_tokens_secondary(&self) -> Collection<mongodb::bson::Document> {
        self.db_secondary.collection("password_reset_tokens")
    }
    pub fn credit_keys(&self) -> Collection<mongodb::bson::Document> {
        self.db.collection("credit_keys")
    }
    pub fn credit_keys_secondary(&self) -> Collection<mongodb::bson::Document> {
        self.db_secondary.collection("credit_keys")
    }
    pub fn characters(&self) -> Collection<Character> {
        self.db.collection("characters")
    }
    pub fn characters_secondary(&self) -> Collection<Character> {
        self.db_secondary.collection("characters")
    }
    pub fn user_characters(&self) -> Collection<crate::models::UserCharacter> {
        self.db.collection("user_characters")
    }
    pub fn user_characters_secondary(&self) -> Collection<crate::models::UserCharacter> {
        self.db_secondary.collection("user_characters")
    }
    pub fn sessions(&self) -> Collection<crate::models::MorphSession> {
        self.db.collection("morph_sessions")
    }
    pub fn ledger(&self) -> Collection<crate::models::CreditLedgerEntry> {
        self.db.collection("credit_ledger")
    }
    pub fn refresh_tokens(&self) -> Collection<bson::Document> {
        self.db.collection("refresh_tokens")
    }

    async fn ensure_indexes(&self) -> anyhow::Result<()> {
        let email_idx = IndexModel::builder()
            .keys(doc! { "email": 1 })
            .options(IndexOptions::builder().unique(true).build())
            .build();
        self.users().create_index(email_idx).await?;
        // Secondary DB indexes
        let email_idx_secondary = IndexModel::builder()
            .keys(doc! { "email": 1 })
            .options(IndexOptions::builder().unique(true).build())
            .build();
        // secondary unique email index must fail loudly like the LM one — a silent
        // failure here would allow duplicate accounts in the secondary DB.
        self.users_secondary().create_index(email_idx_secondary).await?;
        let key_idx = IndexModel::builder()
            .keys(doc! { "key": 1 })
            .options(IndexOptions::builder().unique(true).build())
            .build();
        self.access_keys_secondary().create_index(key_idx).await?;
        let device_idx = IndexModel::builder().keys(doc! { "device_id": 1 }).build();
        if let Err(e) = self.access_keys_secondary().create_index(device_idx).await {
            tracing::warn!(error = %e, "access_keys device_id index create failed (non-fatal lookup index)");
        }

        let otp_email = IndexModel::builder()
            .keys(doc! { "email": 1, "product": 1, "created_at": -1 })
            .build();
        if let Err(e) = self.otps().create_index(otp_email.clone()).await {
            tracing::warn!(error = %e, "otps email lookup index create failed (non-fatal)");
        }

        // Credit-key redemption is looked up by key — unique so a key can
        // never be inserted (or claimed) twice, and indexed for the lookup.
        let ck_key = IndexModel::builder()
            .keys(doc! { "key": 1 })
            .options(IndexOptions::builder().unique(true).build())
            .build();
        self.credit_keys().create_index(ck_key).await?;
        // Secondary credit-key unique index must fail loudly like the primary
        // above: a silent miss here would let a key row be duplicated and a key
        // redeemed twice.
        self.credit_keys_secondary().create_index(
            IndexModel::builder()
                .keys(doc! { "key": 1 })
                .options(IndexOptions::builder().unique(true).build())
                .build(),
        ).await?;

        // Access-key lookups by owner (keys/status, claim binding).
        let ak_user = IndexModel::builder().keys(doc! { "user_id": 1 }).build();
        if let Err(e) = self.access_keys_secondary().create_index(ak_user).await {
            tracing::warn!(error = %e, "access_keys user_id index create failed (non-fatal lookup index)");
        }

        let otp_ttl = IndexModel::builder()
            .keys(doc! { "expires_at": 1 })
            .options(
                IndexOptions::builder()
                    .expire_after(std::time::Duration::from_secs(0))
                    .build(),
            )
            .build();
        let _ = self.otps().create_index(otp_ttl.clone()).await;
        // Product-branched auth challenges — mirror OTP + reset-token indexes in secondary DB
        let _ = self.otps_secondary().create_index(otp_email).await;
        let _ = self.otps_secondary().create_index(otp_ttl).await;
        let rt_hash = IndexModel::builder()
            .keys(doc! { "token_hash": 1, "product": 1 })
            .build();
        let _ = self.password_reset_tokens().create_index(rt_hash.clone()).await;
        let _ = self.password_reset_tokens_secondary().create_index(rt_hash).await;
        let rt_tok_ttl = IndexModel::builder()
            .keys(doc! { "expires_at": 1 })
            .options(
                IndexOptions::builder()
                    .expire_after(std::time::Duration::from_secs(0))
                    .build(),
            )
            .build();
        let _ = self.password_reset_tokens().create_index(rt_tok_ttl.clone()).await;
        let _ = self.password_reset_tokens_secondary().create_index(rt_tok_ttl).await;

        let sess_user = IndexModel::builder()
            .keys(doc! { "user_id": 1, "started_at": -1 })
            .build();
        if let Err(e) = self.sessions().create_index(sess_user).await {
            tracing::warn!(error = %e, "sessions user lookup index create failed (non-fatal)");
        }

        // Payment idempotency: unique provider reference when present
        let pay_ref = IndexModel::builder()
            .keys(doc! { "provider_ref": 1 })
            .options(
                IndexOptions::builder()
                    .unique(true)
                    .partial_filter_expression(doc! {
                        "provider_ref": { "$type": "string" }
                    })
                    .build(),
            )
            .build();
        self
            .db
            .collection::<mongodb::bson::Document>("payment_orders")
            .create_index(pay_ref)
            .await?;

        let pay_user = IndexModel::builder()
            .keys(doc! { "user_id": 1, "created_at": -1 })
            .build();
        if let Err(e) = self
            .db
            .collection::<mongodb::bson::Document>("payment_orders")
            .create_index(pay_user)
            .await
        {
            tracing::warn!(error = %e, "payment_orders user lookup index create failed (non-fatal)");
        }

        // User characters: compound index for user queries
        let uc_user = IndexModel::builder()
            .keys(doc! { "user_id": 1, "created_at": -1 })
            .build();
        let _ = self.user_characters().create_index(uc_user.clone()).await;
        let _ = self.user_characters_secondary().create_index(uc_user).await;

        // Refresh tokens by hash
        let rt = IndexModel::builder()
            .keys(doc! { "token_hash": 1 })
            .options(IndexOptions::builder().unique(true).build())
            .build();
        self.refresh_tokens().create_index(rt).await?;

        // Refresh tokens TTL — auto-expire stale tokens. Sized to cover the max
        // JWT_REFRESH_TTL_SECS (1 year) plus a buffer. create_index hard-errors
        // (IndexOptionsConflict) when an equivalent index already exists with a
        // different expireAfterSeconds, which would abort boot on existing DBs —
        // so fall back to a collMod that updates the TTL in place, and never let
        // a TTL-index tweak fail startup.
        let ttl_secs: i64 = 366 * 24 * 3600;
        let rt_ttl = IndexModel::builder()
            .keys(doc! { "created_at": 1 })
            .options(
                IndexOptions::builder()
                    .expire_after(std::time::Duration::from_secs(ttl_secs as u64))
                    .build(),
            )
            .build();
        let rt_coll = self.refresh_tokens();
        if let Err(e) = rt_coll.create_index(rt_ttl).await {
            tracing::warn!(error = %e, "refresh_tokens TTL index create failed; trying collMod");
            let _ = self.db
                .run_command(
                    doc! {
                        "collMod": rt_coll.name(),
                        "index": { "keyPattern": doc! { "created_at": 1 }, "expireAfterSeconds": ttl_secs },
                    },
                                    )
                .await;
        }

        // secondary refresh tokens TTL (same non-fatal pattern)
        let rt_le_ttl = IndexModel::builder()
            .keys(doc! { "created_at": 1 })
            .options(
                IndexOptions::builder()
                    .expire_after(std::time::Duration::from_secs(ttl_secs as u64))
                    .build(),
            )
            .build();
        let rt_le_coll = self.refresh_tokens_secondary();
        if let Err(e) = rt_le_coll.create_index(rt_le_ttl).await {
            tracing::warn!(error = %e, "secondary refresh_tokens TTL index create failed; trying collMod");
            let _ = self.db_secondary
                .run_command(
                    doc! {
                        "collMod": rt_le_coll.name(),
                        "index": { "keyPattern": doc! { "created_at": 1 }, "expireAfterSeconds": ttl_secs },
                    },
                                    )
                .await;
        }
        // Unique token_hash so the atomic find_one_and_delete rotation claim
        // is race-free (mirrors the LM index above).
        let rt_le_unique = IndexModel::builder()
            .keys(doc! { "token_hash": 1 })
            .options(
                IndexOptions::builder()
                    .unique(true)
                    .name("uniq_token_hash_secondary".to_string())
                    .build(),
            )
            .build();
        self.refresh_tokens_secondary().create_index(rt_le_unique).await?;

        // user_id index on both refresh-token stores: revocation paths
        // (token-theft reuse detection, logout_all, delete_account) run
        // delete_many({user_id}) and would otherwise collscan the TTL'd store.
        let rt_user = IndexModel::builder().keys(doc! { "user_id": 1 }).build();
        let _ = self.refresh_tokens().create_index(rt_user.clone()).await;
        let _ = self.refresh_tokens_secondary().create_index(rt_user).await;

        // background_selections: one active selection per user (unique), per product DB.
        let bs_user = IndexModel::builder()
            .keys(doc! { "user_id": 1 })
            .options(IndexOptions::builder().unique(true).build())
            .build();
        let _ = self.db.collection::<mongodb::bson::Document>("background_selections").create_index(bs_user.clone()).await;
        let _ = self.db_secondary.collection::<mongodb::bson::Document>("background_selections").create_index(bs_user).await;

        // password_reset_tokens: reset requests look up by email, per product DB.
        let prt_email = IndexModel::builder().keys(doc! { "email": 1 }).build();
        let _ = self.password_reset_tokens().create_index(prt_email.clone()).await;
        let _ = self.password_reset_tokens_secondary().create_index(prt_email).await;

        // creator_payouts: one row per user (unique) so the upsert in
        // payout_post is race-free, per product DB.
        let payout_user = IndexModel::builder()
            .keys(doc! { "user_id": 1 })
            .options(IndexOptions::builder().unique(true).build())
            .build();
        let _ = self.db.collection::<mongodb::bson::Document>("creator_payouts").create_index(payout_user.clone()).await;
        let _ = self.db_secondary.collection::<mongodb::bson::Document>("creator_payouts").create_index(payout_user).await;

        // secondary payment orders idempotency
        let sec_pay_ref = IndexModel::builder()
            .keys(doc! { "provider_ref": 1 })
            .options(
                IndexOptions::builder()
                    .unique(true)
                    .partial_filter_expression(doc! {
                        "provider_ref": { "$type": "string" }
                    })
                    .build(),
            )
            .build();
        self.payment_orders_secondary().create_index(sec_pay_ref).await?;

        let ledger_user = IndexModel::builder()
            .keys(doc! { "user_id": 1, "created_at": -1 })
            .build();

        if let Err(e) = self.ledger().create_index(ledger_user.clone()).await {
            tracing::warn!(error = %e, "ledger user lookup index create failed (non-fatal)");
        }
        if let Err(e) = self.ledger_secondary().create_index(ledger_user).await {
            tracing::warn!(error = %e, "secondary ledger user lookup index create failed (non-fatal)");
        }

        // Ledger idempotency: unique (ref_id, kind) when a ref exists — a crash
        // between credit and finalize must not double-credit on reclaim.
        let ledger_ref = IndexModel::builder()
            .keys(doc! { "ref_id": 1, "kind": 1 })
            .options(
                IndexOptions::builder()
                    .unique(true)
                    .partial_filter_expression(doc! { "ref_id": { "$type": "string" } })
                    .build(),
            )
            .build();
        self.ledger().create_index(ledger_ref.clone()).await?;
        self.ledger_secondary().create_index(ledger_ref).await?;

        // Google OAuth subject → user
        let google_sub = IndexModel::builder()
            .keys(doc! { "google_sub": 1 })
            .options(
                IndexOptions::builder()
                    .unique(true)
                    .partial_filter_expression(doc! {
                        "google_sub": { "$type": "string" }
                    })
                    .build(),
            )
            .build();
        self.users().create_index(google_sub).await?;

        // OAuth CSRF state + one-time tickets (TTL)
        let oauth_state_ttl = IndexModel::builder()
            .keys(doc! { "expires_at": 1 })
            .options(
                IndexOptions::builder()
                    .expire_after(std::time::Duration::from_secs(0))
                    .build(),
            )
            .build();
        let _ = self
            .db
            .collection::<mongodb::bson::Document>("oauth_states")
            .create_index(oauth_state_ttl)
            .await;
        let oauth_ticket_ttl = IndexModel::builder()
            .keys(doc! { "expires_at": 1 })
            .options(
                IndexOptions::builder()
                    .expire_after(std::time::Duration::from_secs(0))
                    .build(),
            )
            .build();
        let _ = self
            .db
            .collection::<mongodb::bson::Document>("oauth_tickets")
            .create_index(oauth_ticket_ttl)
            .await;

        // OAuth poll results TTL — auto-expire after 15 minutes
        let oauth_results_ttl = IndexModel::builder()
            .keys(doc! { "created_at": 1 })
            .options(
                IndexOptions::builder()
                    .expire_after(std::time::Duration::from_secs(900))
                    .build(),
            )
            .build();
        let _ = self
            .db
            .collection::<mongodb::bson::Document>("oauth_results")
            .create_index(oauth_results_ttl)
            .await;

        // Same OAuth TTL indexes on the secondary DB (the slot's own stores).
        let _ = self
            .db_secondary
            .collection::<mongodb::bson::Document>("oauth_states")
            .create_index(
                IndexModel::builder()
                    .keys(doc! { "expires_at": 1 })
                    .options(IndexOptions::builder().expire_after(std::time::Duration::from_secs(0)).build())
                    .build(),
            )
            .await;
        let _ = self
            .db_secondary
            .collection::<mongodb::bson::Document>("oauth_tickets")
            .create_index(
                IndexModel::builder()
                    .keys(doc! { "expires_at": 1 })
                    .options(IndexOptions::builder().expire_after(std::time::Duration::from_secs(0)).build())
                    .build(),
            )
            .await;
        let _ = self
            .db_secondary
            .collection::<mongodb::bson::Document>("oauth_results")
            .create_index(
                IndexModel::builder()
                    .keys(doc! { "created_at": 1 })
                    .options(IndexOptions::builder().expire_after(std::time::Duration::from_secs(900)).build())
                    .build(),
            )
            .await;

        let sess_status = IndexModel::builder()
            .keys(doc! { "user_id": 1, "status": 1 })
            .build();
        let _ = self.sessions().create_index(sess_status).await;

        // Session housekeeping: TTL on ended_at auto-purges ended sessions 30
        // days after they close (active rows have ended_at: null → untouched).
        let sess_ttl = IndexModel::builder()
            .keys(doc! { "ended_at": 1 })
            .options(
                IndexOptions::builder()
                    .expire_after(std::time::Duration::from_secs(30 * 24 * 3600))
                    .build(),
            )
            .build();
        let _ = self.sessions().create_index(sess_ttl.clone()).await;
        let _ = self.sessions_secondary().create_index(sess_ttl.clone()).await;
        // secondary sessions: user + status indexes (were missing entirely)
        let sess_le_user = IndexModel::builder()
            .keys(doc! { "user_id": 1, "started_at": -1 })
            .build();
        let _ = self.sessions_secondary().create_index(sess_le_user.clone()).await;
        let sess_le_status = IndexModel::builder()
            .keys(doc! { "user_id": 1, "status": 1 })
            .build();
        let _ = self.sessions_secondary().create_index(sess_le_status).await;

        let audit_idx = IndexModel::builder()
            .keys(doc! { "user_id": 1, "at": -1 })
            .build();
        let _ = self
            .db
            .collection::<mongodb::bson::Document>("audit_log")
            .create_index(audit_idx)
            .await;

        // Password reset tokens TTL (Secondary)
        let pr_ttl = IndexModel::builder()
            .keys(doc! { "expires_at": 1 })
            .options(
                IndexOptions::builder()
                    .expire_after(std::time::Duration::from_secs(0))
                    .build(),
            )
            .build();
        let _ = self
            .db_secondary
            .collection::<mongodb::bson::Document>("password_reset_tokens")
            .create_index(pr_ttl)
            .await;

                // Catalog seed race guard: unique character id per product DB.
        let char_id = IndexModel::builder()
            .keys(doc! { "id": 1 })
            .options(
                IndexOptions::builder()
                    .unique(true)
                    .partial_filter_expression(doc! { "id": { "$type": "string" } })
                    .build(),
            )
            .build();
        self.characters().create_index(char_id.clone()).await?;
        self.db_secondary.collection::<mongodb::bson::Document>("characters").create_index(char_id).await?;

// ── Second-pass index coverage (hot query paths that were collscans) ──
        // Referral codes are looked up by code on attach — unique per product.
        let ref_code = IndexModel::builder()
            .keys(doc! { "referral_code": 1 })
            .options(
                IndexOptions::builder()
                    .unique(true)
                    .partial_filter_expression(doc! { "referral_code": { "$type": "string" } })
                    .build(),
            )
            .build();
        self.users().create_index(ref_code.clone()).await?;
        self.users_secondary().create_index(ref_code).await?;

        // secondary ledger + secondary payment orders by user
        let ledger_user_secondary = IndexModel::builder()
            .keys(doc! { "user_id": 1, "created_at": -1 })
            .build();
        self.ledger_secondary().create_index(ledger_user_secondary).await?;
        let pay_user_secondary = IndexModel::builder()
            .keys(doc! { "user_id": 1, "created_at": -1 })
            .build();
        let _ = self.payment_orders_secondary().create_index(pay_user_secondary).await;

        // Reaper filter (status + last_activity_at) on all session collections
        let sess_reaper_lm = IndexModel::builder()
            .keys(doc! { "status": 1, "last_activity_at": 1 })
            .build();
        let _ = self
            .db
            .collection::<mongodb::bson::Document>("morph_sessions")
            .create_index(sess_reaper_lm)
            .await;
        let sess_reaper_a = IndexModel::builder()
            .keys(doc! { "status": 1, "last_activity_at": 1 })
            .build();
        let _ = self.sessions().create_index(sess_reaper_a).await;
        let sess_reaper_b = IndexModel::builder()
            .keys(doc! { "status": 1, "last_activity_at": 1 })
            .build();
        let _ = self.sessions_secondary().create_index(sess_reaper_b).await;

        // admin_directives is polled by every client; TTL purges expired ones
        let dir_idx = IndexModel::builder()
            .keys(doc! { "kind": 1, "product": 1, "consumed": 1, "expires_at": 1 })
            .build();
        let _ = self
            .db
            .collection::<mongodb::bson::Document>("admin_directives")
            .create_index(dir_idx)
            .await;
        let dir_ttl = IndexModel::builder()
            .keys(doc! { "expires_at": 1 })
            .options(
                IndexOptions::builder()
                    .expire_after(std::time::Duration::from_secs(0))
                    .build(),
            )
            .build();
        let _ = self
            .db
            .collection::<mongodb::bson::Document>("admin_directives")
            .create_index(dir_ttl)
            .await;

        // creator payouts by user; support tickets by product + time
        let cp_user = IndexModel::builder().keys(doc! { "user_id": 1 }).build();
        let _ = self
            .db
            .collection::<mongodb::bson::Document>("creator_payouts")
            .create_index(cp_user.clone())
            .await;
        let _ = self
            .db_secondary
            .collection::<mongodb::bson::Document>("creator_payouts")
            .create_index(cp_user)
            .await;
        let st_idx = IndexModel::builder()
            .keys(doc! { "product": 1, "created_at": -1 })
            .build();
        let _ = self
            .db
            .collection::<mongodb::bson::Document>("support_tickets")
            .create_index(st_idx.clone())
            .await;
        let _ = self
            .db_secondary
            .collection::<mongodb::bson::Document>("support_tickets")
            .create_index(st_idx)
            .await;

        Ok(())
    }

    async fn seed_catalog_if_empty(&self) -> anyhow::Result<()> {
        let n = self.characters().count_documents(doc! {}).await?;
        if n > 0 {
            return Ok(());
        }
        let now = Utc::now();
        let starters = vec![
            Character {
                id: "crimson-knight".into(),
                name: "Crimson Knight".into(),
                category: "Fantasy".into(),
                image: "qrc:/assets/starters/crimson-knight.webp".into(),
                prompt: "Armored knight in deep crimson plate, heroic stance".into(),
                is_premium: false,
                is_starter: true,
                sort_order: 1,
                created_at: now,
            },
            Character {
                id: "vampire-lord".into(),
                name: "Vampire Lord".into(),
                category: "Horror".into(),
                image: "qrc:/assets/starters/vampire-lord.webp".into(),
                prompt: "Elegant and deadly vampire noble in gothic attire".into(),
                is_premium: false,
                is_starter: true,
                sort_order: 2,
                created_at: now,
            },
            Character {
                id: "cyber-ronin".into(),
                name: "Cyber Ronin".into(),
                category: "Sci-Fi".into(),
                image: String::new(),
                prompt: "Futuristic samurai with neon accents and chrome armor".into(),
                is_premium: true,
                is_starter: true,
                sort_order: 3,
                created_at: now,
            },
            Character {
                id: "forest-spirit".into(),
                name: "Forest Spirit".into(),
                category: "Fantasy".into(),
                image: String::new(),
                prompt: "Ethereal guardian of the ancient woods, glowing runes".into(),
                is_premium: true,
                is_starter: true,
                sort_order: 4,
                created_at: now,
            },
            Character {
                id: "noir-detective".into(),
                name: "Noir Detective".into(),
                category: "Realistic".into(),
                image: String::new(),
                prompt: "Hard-boiled private eye from the 1940s, trench coat, fedora".into(),
                is_premium: false,
                is_starter: true,
                sort_order: 5,
                created_at: now,
            },
        ];
        self.characters().insert_many(starters).await?;
        tracing::info!("seeded starter character catalog");
        Ok(())
    }
}

/// Helper so routes can generate ids without importing uuid everywhere
pub fn new_id() -> String {
    Uuid::new_v4().to_string()
}
