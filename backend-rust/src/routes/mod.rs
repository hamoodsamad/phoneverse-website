use axum::{
    routing::{get, post},
    Router,
};
use crate::controllers::{auth_controller, order_controller, smartphone_controller};

pub fn app_router() -> Router {
    Router::new()
        // Health check
        .route("/health", get(|| async { "OK" }))
        // Auth
        .route("/api/auth/login", post(auth_controller::login))
        // Smartphones
        .route("/api/smartphones", get(smartphone_controller::list_smartphones))
        .route("/api/smartphones/:slug", get(smartphone_controller::get_smartphone))
        // Orders
        .route("/api/orders", post(order_controller::create_order))
}
