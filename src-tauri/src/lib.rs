#[allow(dead_code)]
mod auth;
mod endpoints;
mod matchmaking;

use std::env;
use std::thread::Thread;
use tauri::Manager;
use std::net::TcpStream;
use tokio::sync::Mutex;
use tungstenite::stream::MaybeTlsStream;
use tungstenite::WebSocket;

#[derive(Default, Debug)]
pub struct AuthData {
    pub logged_in: bool,
    pub id_token: String,
    pub access_token: String,
    pub refresh_token: String,
}

impl AuthData {
    pub fn new() -> Self {
        AuthData {
            logged_in: false,
            id_token: String::new(),
            access_token: String::new(),
            refresh_token: String::new(),
        }
    }
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_websocket::init())
        .setup(|app| {
            app.manage(Mutex::new(AuthData::new()));

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            auth::login,
            auth::create_account,
            auth::logout,
            matchmaking::start_matchmaking
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
