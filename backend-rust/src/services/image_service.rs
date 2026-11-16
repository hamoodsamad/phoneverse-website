pub struct ImageDiscoveryService {
    pub api_key: Option<String>,
}

impl ImageDiscoveryService {
    pub fn new(api_key: Option<String>) -> Self {
        Self { api_key }
    }

    pub async fn find_official_images(&self, model: &str) -> Vec<String> {
        if self.api_key.is_none() {
            return vec![];
        }
        vec![format!("https://example.com/images/{}.webp", model)]
    }
}
