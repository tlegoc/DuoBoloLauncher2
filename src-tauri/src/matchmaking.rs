use crate::endpoints::MATCHMAKING_WEBSOCKET;
use crate::{AuthData, MatchmakingData};
use std::net::TcpStream;
use std::thread;
use tauri::State;
use thread::spawn;
use tokio::sync::Mutex;
use tungstenite::stream::MaybeTlsStream;
use tungstenite::{connect, WebSocket};

#[tauri::command]
pub async fn start_matchmaking(auth_state: State<'_, Mutex<AuthData>>) -> () {
    let auth_data = auth_state.lock().await;

    let token = auth_data.id_token.clone();

    spawn(async || {
        // since it locks the auth state, it will not start until the auth is available (meaning you can't disconnect)
        // TODO DO THIS BETTER

        if let Ok((mut socket, _)) = connect(format!(
            "{}?token={}",
            MATCHMAKING_WEBSOCKET, token
        )) {
            loop {
                let msg = socket.read();

                if msg.unwrap().is_close() {
                    println!("Connection closed");
                    break;
                }
            }
        }
    });
}
