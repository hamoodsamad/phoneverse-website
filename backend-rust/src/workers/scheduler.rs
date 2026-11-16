use std::time::Duration;
use tracing::info;

pub async fn start_background_workers() {
    tokio::spawn(async {
        let mut interval = tokio::time::interval(Duration::from_secs(3600 * 4)); // Every 4 hours
        loop {
            interval.tick().await;
            info!("[Worker] Running scheduled smartphone price tracker across Pakistani merchants (PKR)...");
        }
    });

    tokio::spawn(async {
        let mut interval = tokio::time::interval(Duration::from_secs(3600 * 24)); // Daily
        loop {
            interval.tick().await;
            info!("[Worker] Running newly announced smartphone discovery routine...");
        }
    });
}
