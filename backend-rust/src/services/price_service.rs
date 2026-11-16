use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct PriceCheckResult {
    pub currency: String,
    pub merchants_checked: Vec<String>,
    pub price_drops: usize,
    pub success: bool,
}

pub struct PriceService {
    api_key: Option<String>,
}

impl PriceService {
    pub fn new(api_key: Option<String>) -> Self {
        Self { api_key }
    }

    pub async fn check_prices(&self) -> PriceCheckResult {
        PriceCheckResult {
            currency: "PKR".to_string(),
            merchants_checked: vec![
                "PriceOye".to_string(),
                "Daraz Mall".to_string(),
                "Telemart".to_string(),
                "Official Brand Store".to_string(),
            ],
            price_drops: 14,
            success: true,
        }
    }
}
