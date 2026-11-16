use std::env;

#[derive(Clone, Debug)]
pub struct AppConfig {
    pub database_url: String,
    pub port: u16,
    pub jwt_secret: String,
    pub openai_api_key: Option<String>,
    pub cloudinary_cloud_name: Option<String>,
    pub cloudinary_api_key: Option<String>,
    pub cloudinary_api_secret: Option<String>,
    pub smartphone_data_api_key: Option<String>,
    pub price_tracking_api_key: Option<String>,
}

impl AppConfig {
    pub fn from_env() -> Self {
        dotenvy::dotenv().ok();

        Self {
            database_url: env::var("DATABASE_URL")
                .unwrap_or_else(|_| "postgres://postgres:password@localhost:5432/phoneverse_db".to_string()),
            port: env::var("PORT")
                .unwrap_or_else(|_| "8080".to_string())
                .parse()
                .unwrap_or(8080),
            jwt_secret: env::var("JWT_SECRET")
                .unwrap_or_else(|_| "phoneverse-jwt-secret-key-32-chars-minimum".to_string()),
            openai_api_key: env::var("OPENAI_API_KEY").ok(),
            cloudinary_cloud_name: env::var("CLOUDINARY_CLOUD_NAME").ok(),
            cloudinary_api_key: env::var("CLOUDINARY_API_KEY").ok(),
            cloudinary_api_secret: env::var("CLOUDINARY_API_SECRET").ok(),
            smartphone_data_api_key: env::var("SMARTPHONE_DATA_API_KEY").ok(),
            price_tracking_api_key: env::var("PRICE_TRACKING_API_KEY").ok(),
        }
    }
}
