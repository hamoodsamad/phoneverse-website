use axum::{
    extract::{Path, Query},
    http::StatusCode,
    response::IntoResponse,
    Json,
};
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Debug, Deserialize)]
pub struct SmartphoneFilter {
    pub search: Option<String>,
    pub brand: Option<String>,
}

pub async fn list_smartphones(Query(_filter): Query<SmartphoneFilter>) -> impl IntoResponse {
    let mock_list = vec![
        json!({
            "name": "iPhone 16 Pro Max",
            "brand": "Apple",
            "base_price_pkr": 494999.0,
            "pta_status": "PTA Approved",
            "chipset": "Apple A18 Pro (3nm)",
            "primary_image_url": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80"
        }),
        json!({
            "name": "Galaxy S25 Ultra",
            "brand": "Samsung",
            "base_price_pkr": 449999.0,
            "pta_status": "PTA Approved",
            "chipset": "Snapdragon 8 Elite for Galaxy",
            "primary_image_url": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80"
        })
    ];

    (StatusCode::OK, Json(json!({ "success": true, "data": mock_list })))
}

pub async fn get_smartphone(Path(slug): Path<String>) -> impl IntoResponse {
    (StatusCode::OK, Json(json!({
        "success": true,
        "data": {
            "slug": slug,
            "currency": "PKR",
            "market": "Pakistan"
        }
    })))
}
