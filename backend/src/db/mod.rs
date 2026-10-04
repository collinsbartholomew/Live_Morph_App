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
    /// to maintain the MongoDB connection pool for `db` and `db_le`.
    #[allow(dead_code)]
    client: Client,
    /// LiveMorph database (primary)
    pub db: Database,
    /// Live Escape database (isolated)
    pub db_le: Database,
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
        let db_le = client.database(&cfg.mongodb_db_liveescape);
        let this = Self { client, db, db_le };
        this.ensure_indexes().await?;
        if cfg.seed_starter_catalog {
            this.seed_catalog_if_empty().await?;
        }
        Ok(this)
    }

    pub fn users(&self) -> Collection<User> {
        self.db.collection("users")
    }

    /// Live Escape isolated collections
    pub fn users_le(&self) -> Collection<User> {
        self.db_le.collection("users")
    }
    pub fn access_keys_le(&self) -> Collection<crate::models::AccessKey> {
        self.db_le.collection("access_keys")
    }
    pub fn ledger_le(&self) -> Collection<crate::models::CreditLedgerEntry> {
        self.db_le.collection("credit_ledger")
    }
    pub fn sessions_le(&self) -> Collection<mongodb::bson::Document> {
        self.db_le.collection("sessions")
    }
    pub fn payment_orders_le(&self) -> Collection<mongodb::bson::Document> {
        self.db_le.collection("payment_orders")
    }
    pub fn payment_orders_le_typed(&self) -> Collection<crate::models::PaymentOrder> {
        self.db_le.collection("payment_orders")
    }
    pub fn refresh_tokens_le(&self) -> Collection<mongodb::bson::Document> {
        self.db_le.collection("refresh_tokens")
    }
    pub fn otps(&self) -> Collection<crate::models::OtpChallenge> {
        self.db.collection("otp_challenges")
    }
    pub fn otps_le(&self) -> Collection<crate::models::OtpChallenge> {
        self.db_le.collection("otp_challenges")
    }
    pub fn password_reset_tokens(&self) -> Collection<mongodb::bson::Document> {
        self.db.collection("password_reset_tokens")
    }
    pub fn password_reset_tokens_le(&self) -> Collection<mongodb::bson::Document> {
        self.db_le.collection("password_reset_tokens")
    }
    pub fn credit_keys(&self) -> Collection<mongodb::bson::Document> {
        self.db.collection("credit_keys")
    }
    pub fn credit_keys_le(&self) -> Collection<mongodb::bson::Document> {
        self.db_le.collection("credit_keys")
    }
    pub fn characters(&self) -> Collection<Character> {
        self.db.collection("characters")
    }
    pub fn user_characters(&self) -> Collection<crate::models::UserCharacter> {
        self.db.collection("user_characters")
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
        // Live Escape DB indexes
        let email_idx_le = IndexModel::builder()
            .keys(doc! { "email": 1 })
            .options(IndexOptions::builder().unique(true).build())
            .build();
        let _ = self.users_le().create_index(email_idx_le).await;
        let key_idx = IndexModel::builder()
            .keys(doc! { "key": 1 })
            .options(IndexOptions::builder().unique(true).build())
            .build();
        let _ = self.access_keys_le().create_index(key_idx).await;
        let device_idx = IndexModel::builder().keys(doc! { "device_id": 1 }).build();
        let _ = self.access_keys_le().create_index(device_idx).await;

        let otp_email = IndexModel::builder()
            .keys(doc! { "email": 1, "created_at": -1 })
            .build();
        self.otps().create_index(otp_email.clone()).await?;

        let otp_ttl = IndexModel::builder()
            .keys(doc! { "expires_at": 1 })
            .options(
                IndexOptions::builder()
                    .expire_after(std::time::Duration::from_secs(0))
                    .build(),
            )
            .build();
        let _ = self.otps().create_index(otp_ttl.clone()).await;
        // Product-branched auth challenges — mirror OTP + reset-token indexes in LE DB
        let _ = self.otps_le().create_index(otp_email).await;
        let _ = self.otps_le().create_index(otp_ttl).await;
        let rt_hash = IndexModel::builder()
            .keys(doc! { "token_hash": 1, "product": 1 })
            .build();
        let _ = self.password_reset_tokens().create_index(rt_hash.clone()).await;
        let _ = self.password_reset_tokens_le().create_index(rt_hash).await;
        let rt_tok_ttl = IndexModel::builder()
            .keys(doc! { "expires_at": 1 })
            .options(
                IndexOptions::builder()
                    .expire_after(std::time::Duration::from_secs(0))
                    .build(),
            )
            .build();
        let _ = self.password_reset_tokens().create_index(rt_tok_ttl.clone()).await;
        let _ = self.password_reset_tokens_le().create_index(rt_tok_ttl).await;

        let sess_user = IndexModel::builder()
            .keys(doc! { "user_id": 1, "started_at": -1 })
            .build();
        self.sessions().create_index(sess_user).await?;

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
        let _ = self
            .db
            .collection::<mongodb::bson::Document>("payment_orders")
            .create_index(pay_ref)
            .await;

        let pay_user = IndexModel::builder()
            .keys(doc! { "user_id": 1, "created_at": -1 })
            .build();
        let _ = self
            .db
            .collection::<mongodb::bson::Document>("payment_orders")
            .create_index(pay_user)
            .await;

        // User characters: compound index for user queries
        let uc_user = IndexModel::builder()
            .keys(doc! { "user_id": 1, "created_at": -1 })
            .build();
        let _ = self.user_characters().create_index(uc_user).await;

        // Refresh tokens by hash
        let rt = IndexModel::builder()
            .keys(doc! { "token_hash": 1 })
            .options(IndexOptions::builder().unique(true).build())
            .build();
        let _ = self.refresh_tokens().create_index(rt).await;

        // Refresh tokens TTL — auto-expire stale tokens (30 days + buffer)
        let rt_ttl = IndexModel::builder()
            .keys(doc! { "created_at": 1 })
            .options(
                IndexOptions::builder()
                    .expire_after(std::time::Duration::from_secs(30 * 24 * 3600 + 86400))
                    .build(),
            )
            .build();
        let _ = self.refresh_tokens().create_index(rt_ttl).await;

        // LE refresh tokens TTL
        let rt_le_ttl = IndexModel::builder()
            .keys(doc! { "created_at": 1 })
            .options(
                IndexOptions::builder()
                    .expire_after(std::time::Duration::from_secs(30 * 24 * 3600 + 86400))
                    .build(),
            )
            .build();
        let _ = self.refresh_tokens_le().create_index(rt_le_ttl).await;

        // LE payment orders idempotency
        let le_pay_ref = IndexModel::builder()
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
        let _ = self.payment_orders_le().create_index(le_pay_ref).await;

        let ledger_user = IndexModel::builder()
            .keys(doc! { "user_id": 1, "created_at": -1 })
            .build();

        let _ = self.ledger().create_index(ledger_user).await;

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
        let _ = self.users().create_index(google_sub).await;

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
        let _ = self.sessions_le().create_index(sess_ttl.clone()).await;
        // LE sessions: user + status indexes (were missing entirely)
        let sess_le_user = IndexModel::builder()
            .keys(doc! { "user_id": 1, "started_at": -1 })
            .build();
        let _ = self.sessions_le().create_index(sess_le_user.clone()).await;
        let sess_le_status = IndexModel::builder()
            .keys(doc! { "user_id": 1, "status": 1 })
            .build();
        let _ = self.sessions_le().create_index(sess_le_status).await;

        let audit_idx = IndexModel::builder()
            .keys(doc! { "user_id": 1, "at": -1 })
            .build();
        let _ = self
            .db
            .collection::<mongodb::bson::Document>("audit_log")
            .create_index(audit_idx)
            .await;

        // Password reset tokens TTL (Live Escape)
        let pr_ttl = IndexModel::builder()
            .keys(doc! { "expires_at": 1 })
            .options(
                IndexOptions::builder()
                    .expire_after(std::time::Duration::from_secs(0))
                    .build(),
            )
            .build();
        let _ = self
            .db_le
            .collection::<mongodb::bson::Document>("password_reset_tokens")
            .create_index(pr_ttl)
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
