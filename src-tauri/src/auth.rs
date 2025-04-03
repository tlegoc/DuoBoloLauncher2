use crate::endpoints::COGNITO_CLIENTID;
use aws_sdk_cognitoidentityprovider::error::ProvideErrorMetadata;
use aws_sdk_cognitoidentityprovider::types::AuthFlowType;
use std::collections::HashMap;
use tauri::State;
use tokio::sync::Mutex;

#[tauri::command]
pub async fn login(
    state: State<'_, Mutex<crate::AppData>>,
    username: String,
    password: String,
) -> Result<String, String> {
    let mut state = state.lock().await;

    let mut auth_params = HashMap::new();
    auth_params.insert("USERNAME".to_string(), username.to_string());
    auth_params.insert("PASSWORD".to_string(), password.to_string());

    let response = state
        .cognito_client
        .as_ref()
        .unwrap()
        .initiate_auth()
        .auth_flow(AuthFlowType::UserPasswordAuth)
        .client_id(COGNITO_CLIENTID)
        .set_auth_parameters(Some(auth_params))
        .send()
        .await;

    match response {
        Ok(response) => {
            if let Some(challenge_name) = response.challenge_name() {
                return Err(challenge_name.to_string());
            }

            if let Some(authentication_result) = response.authentication_result() {
                if let Some(access_token) = authentication_result.access_token() {
                    return Ok(access_token.to_string());
                }
            }
            Err("Authentication failed".to_string())
        }
        Err(err) => Err(format!(
            "Error (code {}): {}",
            err.code().unwrap(),
            err.message().unwrap()
        )),
    }
}
