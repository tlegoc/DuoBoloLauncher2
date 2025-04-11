#[allow(dead_code)]
mod auth;
mod endpoints;
mod matchmaking;

use std::env;
use tauri::Manager;
use tokio::sync::Mutex;

#[derive(Default, Debug)]
pub struct AuthData {
    pub logged_in: bool,
    pub id_token: String,
    pub access_token: String,
    pub refresh_token: String,
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_websocket::init())
        .setup(|app| {
            app.manage(Mutex::new(AuthData {
                logged_in: false,
                id_token: "".to_string(),
                access_token: "".to_string(),
                refresh_token: "".to_string(),
            }));

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            auth::login,
            auth::create_account,
            auth::logout,
            matchmaking::get_matchmaking_url,
            matchmaking::start_matchmaking
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
