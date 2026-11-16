use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OrderItem {
    pub smartphone_id: Uuid,
    pub variant_id: Option<Uuid>,
    pub product_name: String,
    pub quantity: i32,
    pub unit_price_pkr: f64,
    pub total_price_pkr: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateOrderPayload {
    pub customer_name: String,
    pub customer_email: String,
    pub customer_phone: String,
    pub shipping_address: String,
    pub shipping_city: String,
    pub shipping_province: String,
    pub payment_method: String,
    pub items: Vec<OrderItem>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Order {
    pub id: Uuid,
    pub order_number: String,
    pub customer_name: String,
    pub customer_email: String,
    pub shipping_city: String,
    pub payment_method: String,
    pub order_status: String,
    pub total_pkr: f64,
}
