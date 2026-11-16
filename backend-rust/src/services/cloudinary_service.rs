pub struct CloudinaryService {
    pub cloud_name: Option<String>,
    pub api_key: Option<String>,
    pub api_secret: Option<String>,
}

impl CloudinaryService {
    pub fn new(cloud_name: Option<String>, api_key: Option<String>, api_secret: Option<String>) -> Self {
        Self {
            cloud_name,
            api_key,
            api_secret,
        }
    }

    pub fn get_optimized_url(&self, public_id: &str, width: u32) -> String {
        if let Some(cloud) = &self.cloud_name {
            format!("https://res.cloudinary.com/{}/image/upload/f_auto,q_auto,w_{}/{}", cloud, width, public_id)
        } else {
            public_id.to_string()
        }
    }
}
