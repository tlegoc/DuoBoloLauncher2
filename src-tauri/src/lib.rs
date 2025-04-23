#[allow(dead_code)]
mod auth;
mod endpoints;
mod matchmaking;

use std::env;
use std::sync::atomic::AtomicBool;
use std::sync::Arc;
use std::sync::Mutex;
use tauri::Manager;

#[derive(Default, Debug)]
pub struct AuthData {
    pub logged_in: bool,
    pub id_token: String,
    pub access_token: String,
    pub refresh_token: String,
}

#[derive(Default)]
pub struct AppData {
    pub auth_data: Arc<Mutex<AuthData>>
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_websocket::init())
        .setup(|app| {
            app.manage(AppData {
                auth_data: Arc::new(Mutex::new(AuthData {
                    logged_in: false,
                    id_token: "".to_string(),
                    access_token: "".to_string(),
                    refresh_token: "".to_string(),
                })),
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            auth::login,
            auth::create_account,
            auth::logout,
            matchmaking::get_matchmaking_url
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
