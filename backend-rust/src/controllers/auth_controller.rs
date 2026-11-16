use axum::{http::StatusCode, response::IntoResponse, Json};
use serde_json::json;
use crate::models::{LoginPayload, User};
use uuid::Uuid;

pub async fn login(Json(payload): Json<LoginPayload>) -> impl IntoResponse {
    let is_admin = payload.email.contains("admin");
    let user = User {
        id: Uuid::new_v4(),
        email: payload.email,
        full_name: if is_admin { "System Administrator".to_string() } else { "Customer Pakistan".to_string() },
        role: if is_admin { "admin".to_string() } else { "customer".to_string() },
        is_active: true,
    };

    (StatusCode::OK, Json(json!({
        "success": true,
        "token": "sample-jwt-token-phoneverse-2026",
        "user": user
    })))
}
