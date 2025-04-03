#[allow(dead_code)]
mod auth;
mod endpoints;

use aws_config::{Region, SdkConfig};
use aws_sdk_cognitoidentityprovider::Client;
use std::env;
use tauri::Manager;
use tokio::sync::Mutex;
use aws_config::BehaviorVersion;
use aws_config::meta::region::RegionProviderChain;

#[derive(Default)]
pub struct AppData {
    aws_sdk_config: Option<SdkConfig>,
    cognito_client: Option<Client>,
}

pub async fn run() {

    let region_provider = RegionProviderChain::first_try(Region::new("us-east-1"));
    let config = aws_config::defaults(BehaviorVersion::latest())
        .region(region_provider)
        .load()
        .await;

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let cognito_client = Client::new(&config);

            app.manage(Mutex::new(AppData {
                aws_sdk_config: Some(config),
                cognito_client: Some(cognito_client),
            }));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![auth::login])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
