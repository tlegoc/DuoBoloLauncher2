use crate::endpoints::{COGNITO_CLIENTID, REGION};

use std::collections::HashMap;
use tauri::{AppHandle, Manager};

use aws_config::meta::region::RegionProviderChain;
use aws_config::BehaviorVersion;
use aws_config::Region;

use crate::AppData;
use aws_sdk_cognitoidentityprovider::error::ProvideErrorMetadata;
use aws_sdk_cognitoidentityprovider::types::{AttributeType, AuthFlowType};
use aws_sdk_cognitoidentityprovider::Client;

#[tauri::command]
pub async fn login(app: AppHandle, username: String, password: String) -> Result<String, String> {
    let region_provider = RegionProviderChain::first_try(Region::new(REGION));

    let config = aws_config::defaults(BehaviorVersion::latest())
        .region(region_provider)
        .load()
        .await;

    let cognito_client = Client::new(&config);

    let mut auth_params = HashMap::new();
    auth_params.insert("USERNAME".to_string(), username.to_string());
    auth_params.insert("PASSWORD".to_string(), password.to_string());

    let response = cognito_client
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
                    let app_data = app.state::<AppData>();
                    let mut auth_data = app_data.auth_data.lock().unwrap();

                    auth_data.logged_in = true;
                    auth_data.access_token = access_token.to_string();
                    auth_data.id_token = authentication_result
                        .id_token()
                        .unwrap_or_default()
                        .to_string();
                    auth_data.refresh_token = authentication_result
                        .refresh_token()
                        .unwrap_or_default()
                        .to_string();
                    auth_data.username = username.to_string();

                    return Ok("Successfully logged in".to_string());
                }
            }

            Err("Authentication failed".to_string())
        }
        Err(err) => Err(match err.code() {
            Some("NotAuthorizedException") => "Invalid username or password".to_string(),
            Some("UserNotFoundException") => "User not found".to_string(),
            Some("UserNotConfirmedException") => "User not confirmed".to_string(),
            Some("PasswordResetRequiredException") => "Password reset required".to_string(),
            _ => format!("Error: {}", err),
        }),
    }
}

#[tauri::command]
pub async fn create_account(
    username: String,
    email: String,
    password: String,
) -> Result<String, String> {
    let region_provider = RegionProviderChain::first_try(Region::new(REGION));

    let config = aws_config::defaults(BehaviorVersion::latest())
        .region(region_provider)
        .load()
        .await;

    let cognito_client = Client::new(&config);

    let mut user_attributes = Vec::new();
    user_attributes.push(
        AttributeType::builder()
            .name("email")
            .value(email)
            .build()
            .unwrap(),
    );

    let response = cognito_client
        .sign_up()
        .client_id(COGNITO_CLIENTID) // Use the Cognito App Client ID
        .username(username)
        .password(password)
        .set_user_attributes(Some(user_attributes))
        .send()
        .await;

    match response {
        Ok(response) => {
            if response.user_confirmed() {
                Ok("Account created.".to_string())
            } else {
                Err("Account created. Please check your email.".to_string())
            }
        }
        Err(err) => Err(match err.code() {
            Some("UsernameExistsException") => "Username already exists".to_string(),
            Some("InvalidParameterException") => "Invalid parameters".to_string(),
            _ => format!("Error: {}", err.message().unwrap()),
        }),
    }
}

#[tauri::command]
pub fn logout(app: AppHandle) -> Result<(), ()> {
    let app_data = app.state::<AppData>();
    let mut auth_data = app_data.auth_data.lock().unwrap();

    auth_data.logged_in = false;
    auth_data.access_token = "".to_string();
    auth_data.id_token = "".to_string();
    auth_data.refresh_token = "".to_string();
    auth_data.username = "".to_string();

    Ok(())
}

#[tauri::command]
pub fn get_username(app: AppHandle) -> Result<String, ()> {
    let app_data = app.state::<AppData>();
    let auth_data = app_data.auth_data.lock().unwrap();

    if auth_data.username == ""
    {
        return Err(());
    }

    Ok(auth_data.username.clone())
}

#[tauri::command]
pub fn get_token(app: AppHandle) -> Result<String, ()> {
    let app_data = app.state::<AppData>();
    let auth_data = app_data.auth_data.lock().unwrap();

    if auth_data.id_token == ""
    {
        return Err(());
    }

    Ok(auth_data.id_token.clone())
}