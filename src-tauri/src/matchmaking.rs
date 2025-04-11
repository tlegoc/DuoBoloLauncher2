use std::sync::Arc;
use crate::endpoints::MATCHMAKING_WEBSOCKET;
use crate::{AuthData, MatchmakingState};
use tauri::{AppHandle, Manager, State};
use tokio::sync::Mutex;

#[tauri::command]
pub async fn get_matchmaking_url(app: AppHandle) -> Result<String, ()> {
    let auth_data = app.state::<AuthData>();

    Ok(format!(
        "{}?token={}",
        MATCHMAKING_WEBSOCKET, auth_data.id_token
    ))
}

#[tauri::command]
pub async fn start_matchmaking(matchmaking_state: State<Arc<Mutex<MatchmakingState>>>) -> Result<(), String> {

    Ok(())
}
