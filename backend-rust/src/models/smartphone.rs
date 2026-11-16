use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Smartphone {
    pub id: Uuid,
    pub brand_id: Uuid,
    pub brand_name: String,
    pub name: String,
    pub model_name: Option<String>,
    pub slug: String,
    pub status: String,
    pub is_unconfirmed: bool,
    pub is_featured: bool,
    pub is_trending: bool,
    pub pta_status: String,
    pub base_price_pkr: f64,
    pub original_price_pkr: Option<f64>,
    pub primary_image_url: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SmartphoneSpecifications {
    pub display_type: String,
    pub display_size_inches: f64,
    pub resolution: String,
    pub refresh_rate_hz: i32,
    pub peak_brightness_nits: i32,
    pub chipset: String,
    pub cpu: String,
    pub gpu: String,
    pub os_name: String,
    pub rear_camera_setup: String,
    pub front_camera_setup: String,
    pub battery_capacity_mah: i32,
    pub wired_charging_watts: i32,
    pub supports_5g: bool,
    pub ip_rating: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SmartphoneVariant {
    pub id: Uuid,
    pub smartphone_id: Uuid,
    pub sku: String,
    pub ram_gb: i32,
    pub storage_gb: i32,
    pub color_name: String,
    pub color_hex: String,
    pub pta_status: String,
    pub price_pkr: f64,
    pub stock_quantity: i32,
}
