mod config;
mod controllers;
mod models;
mod routes;
mod services;
mod workers;

use config::AppConfig;
use routes::app_router;
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tracing::info;
use workers::scheduler::start_background_workers;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt::init();

    let config = AppConfig::from_env();
    info!("Starting PhoneVerse 2026 Axum REST API backend on port {}...", config.port);

    // Start independent background workers
    start_background_workers().await;

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = app_router().layer(cors);

    let addr = SocketAddr::from(([0, 0, 0, 0], config.port));
    info!("PhoneVerse Backend listening on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
