use crate::endpoints::MATCHMAKING_WEBSOCKET;
use crate::AppData;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub fn get_matchmaking_url(app: AppHandle) -> Result<String, String> {
    let app_data = app.state::<AppData>();
    let auth_data = app_data.auth_data.lock().unwrap();

    if !auth_data.logged_in {
        return Err("Can't create matchmaking url: layer not logged in.".to_string());
    }

    Ok(format!(
        "{}?token={}",
        MATCHMAKING_WEBSOCKET, auth_data.id_token
    ))
}