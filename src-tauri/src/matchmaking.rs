use crate::endpoints::MATCHMAKING_WEBSOCKET;
use crate::AppData;
use futures_util::TryStreamExt;
use reqwest::Client;
use reqwest_websocket::{CloseCode, Message, RequestBuilderExt};
use std::sync::atomic::Ordering;
use tauri::{AppHandle, Emitter, Manager};

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

#[tauri::command]
pub fn start_matchmaking(app: AppHandle) -> Result<(), String> {
    println!("Starting matchmaking!");

    let state = app.state::<AppData>();

    if  state.continue_mm.load(Ordering::Relaxed) {
        println!("Already in matchmaking!");
        return Err("Matchmaking already started".to_string());
    }

    state.continue_mm.store(true, Ordering::Relaxed);

    match get_matchmaking_url(app.clone()) {
        Ok(url) => {
            println!("Launching mm thread...");
            tauri::async_runtime::spawn(matchmaking_loop(app, url));
        }
        Err(e) => {
            println!("Error: {e}");
            return Err(format!("Couldn't start matchmaking: {}", e));
        }
    }

    println!("Matchmaking started!");

    Ok(())
}

#[tauri::command]
pub fn stop_matchmaking(app: AppHandle) -> Result<(), String> {
    println!("Stopping matchmaking!");
    if !is_matchmaking(app.clone()) {
        println!("Not in matchmaking!");
        return Err("Matchmaking not started".to_string());
    }

    let state = app.state::<AppData>();

    state.continue_mm.store(false, Ordering::Relaxed);
    println!("Matchmaking stopped!");

    Ok(())
}

#[tauri::command]
pub fn is_matchmaking(app: AppHandle) -> bool {
    let state = app.state::<AppData>();

    let result = state.continue_mm.load(Ordering::Relaxed);

    println!("Getting current matchmaking state: {result}");

    return result;
}

pub async fn matchmaking_loop(app: AppHandle, url: String) {
    let state = app.state::<AppData>();

    // state.continue_mm.store(true, Ordering::Relaxed);

    let response = Client::default().get(url).upgrade().send().await;

    if let Err(_) = response.as_ref() {
        app.emit("matchmaking_event", "error").unwrap();
    }

    let response = response.unwrap();

    let websocket = response.into_websocket().await;

    if let Err(_) = websocket.as_ref() {
        app.emit("matchmaking_event", "error").unwrap();
    }

    let mut websocket = websocket.unwrap();

    while state.continue_mm.load(Ordering::Relaxed) {
        println!("Waiting for message");
        let message = websocket.try_next().await;

        if let Err(_) = message.as_ref() {
            app.emit("matchmaking_event", "error").unwrap();

            state.continue_mm.store(false, Ordering::Relaxed);
        }

        if let Some(message) = message.unwrap() {
            if let Message::Text(text) = message {
                println!("received: {text}");
                app.emit("matchmaking_event", "found").unwrap();
                break;
            }
        } else {
            app.emit("matchmaking_event", "aborted").unwrap();
            break;
        }
    }

    println!("Matchmaking ended");

    let _ = websocket.close(CloseCode::Normal, None).await;
}
