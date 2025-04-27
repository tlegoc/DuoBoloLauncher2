pub const COGNITO_CLIENTID: &str = "79tbdve12hgkv5r2fffp3a6525";
pub const DUOBOLO_API_URL: &str = "https://8v66afx0ff.execute-api.us-east-1.amazonaws.com/prod";
pub const REGION: &str = "us-east-1";
pub const MATCHMAKING_WEBSOCKET: &str =
    "wss://2bo1k75735.execute-api.us-east-1.amazonaws.com/prod/";

#[tauri::command]
pub fn get_api_url() -> String {
    DUOBOLO_API_URL.to_string()
}
