# Multi-stage Docker build for PhoneVerse 2026 Rust Backend
FROM rust:1.80-slim as builder

WORKDIR /usr/src/phoneverse-backend
COPY Cargo.toml ./
COPY src ./src

RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y ca-certificates libssl3 && rm -rf /var/lib/apt/lists/*

COPY --from=builder /usr/src/phoneverse-backend/target/release/phoneverse-backend /app/phoneverse-backend

EXPOSE 8080
ENV PORT=8080
CMD ["/app/phoneverse-backend"]
