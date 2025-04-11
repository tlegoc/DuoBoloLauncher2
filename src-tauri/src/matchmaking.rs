use crate::endpoints::MATCHMAKING_WEBSOCKET;
use crate::AuthData;
use std::net::TcpStream;
use tauri::{AppHandle, Emitter, Manager, State};
use tokio::sync::Mutex;
use tungstenite::stream::MaybeTlsStream;
use tungstenite::WebSocket;

#[tauri::command]
pub async fn get_matchmaking_url(app: AppHandle) -> Result<String, ()> {
    let auth_data = app.state::<AuthData>();

    Ok(format!(
        "{}?token={}",
        MATCHMAKING_WEBSOCKET, auth_data.id_token
    ))
}

pub type Socket = WebSocket<MaybeTlsStream<TcpStream>>;

#[tauri::command]
pub async fn start_matchmaking(app: AppHandle, state: State<'_, Mutex<AuthData>>) -> Result<(), ()> {
    println!("Starting matchmaking");

    let auth_data = state.lock().await;

    let _ = matchmaking_loop(app, auth_data.id_token.clone());

    Ok(())
}

pub async fn matchmaking_loop(app: AppHandle, token: String) {
    let (mut socket, response) =
        tungstenite::connect(format!("{}?token={}", MATCHMAKING_WEBSOCKET, token))
            .expect("Can't connect");

    println!("Connected to the server");
    println!("Response HTTP code: {}", response.status());
    println!("Response contains the following headers:");
    for (header, _value) in response.headers() {
        println!("* {header}");
    }

    loop {
        let msg = socket.read().expect("Error reading message");

        app.emit("matchmaking_message", msg.to_string());

        if msg.is_close() {
            break;
        }

        println!("{}", msg);
    }

    socket.close(None);
}
