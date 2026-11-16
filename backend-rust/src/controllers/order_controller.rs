use axum::{http::StatusCode, response::IntoResponse, Json};
use serde_json::json;
use crate::models::CreateOrderPayload;
use uuid::Uuid;

pub async fn create_order(Json(payload): Json<CreateOrderPayload>) -> impl IntoResponse {
    let order_number = format!("PK-{}", Uuid::new_v4().to_string().chars().take(8).collect::<String>());

    (StatusCode::CREATED, Json(json!({
        "success": true,
        "order_number": order_number,
        "customer": payload.customer_name,
        "payment_method": payload.payment_method,
        "status": "confirmed"
    })))
}
