# LiveMorph API — multi-stage production image
FROM rust:1.88-bookworm AS builder
WORKDIR /app
COPY Cargo.toml Cargo.lock* ./
# Dummy src for dependency cache
RUN mkdir src && echo "fn main(){}" > src/main.rs && cargo build --release
COPY src ./src
COPY tests ./tests
RUN touch src/main.rs && cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=builder /app/target/release/livemorph-backend /usr/local/bin/livemorph-backend
ENV RUST_LOG=info
ENV RUST_ENV=production
EXPOSE 3874
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3874/api/v1/health || exit 1
USER nobody
CMD ["livemorph-backend"]
