use super::*;
use eventsource::reqwest::Client;
use log::{info, warn};
use std::collections::HashMap;
use tauri::{AppHandle, Manager, State};
use tokio::sync::Mutex;
use tokio_util::sync::CancellationToken;

// Struct that will store the Cancellationtokens // corresponding to the different channels that the client // subscribed to
pub struct ChannelState {
    pub state: Mutex<HashMap<i32, CancellationToken>>,
}

#[derive(serde::Serialize, serde::Deserialize)]
struct NewChannel {
    guild_id: i32,
    name: String,
    kind: String,
}

impl NewChannel {
    pub fn new(guild_id: i32, name: String, kind: String) -> Self {
        Self {
            guild_id,
            name,
            kind,
        }
    }
}

async fn verify_server_is_up(url: tauri::Url) -> Option<result::OperationResult> {
    match reqwest::get(url).await {
        Ok(r) => {
            if r.status().is_server_error() {
                warn!("Server is down");
                return Some(result::OperationResult::new(
                    None,
                    result::ResultCode::ERROR,
                    Some("Internal server error, contact the mainteners".into()),
                ));
            } else {
                return None;
            }
        }
        Err(e) => Some(result::OperationResult::new(
            None,
            result::ResultCode::ERROR,
            Some(e.to_string()),
        )),
    }
}

fn verify_user_isnt_listening(
    channel_id: i32,
    tokens: &HashMap<i32, CancellationToken>,
) -> Result<(), String> {
    let token: Option<&CancellationToken> = tokens.get(&channel_id);

    if token.is_some() {
        return Err(format!(
            "Client is already listening for this channel's {} message",
            channel_id
        ));
    }

    Ok(())
}

async fn listen_and_emit_messages(
    server: tauri::Url,
    channel_id: i32,
    app: AppHandle,
    token: CancellationToken,
) -> Result<(), result::OperationResult> {
    let url = reqwest::Url::parse(format!("{}/channels/{}/subscribe", server, channel_id).as_str())
        .unwrap();

    let client = Client::new(url);

    for event in client {
        info!("listening--------------------------------");
        if token.is_cancelled() {
            break;
        }
        match event {
            Ok(message) => {
                info!(
                    "----------------- RECEIVED SOMETHING : {} ------------------",
                    message.to_string()
                );
                let mess = serde_json::to_value(message.data.as_str());
                if let Ok(mess) = mess {
                    app.emit_all("new_message", mess)
                        .expect("Cannot send to front");
                };
            }
            Err(_) => (),
        }
    }

    Ok(())
}

fn get_and_parse_url() -> Result<tauri::Url, result::OperationResult> {
    let server = std::env::var("SERVER_URL")
        .ok()
        .unwrap_or(String::from("http://127.0.0.1:8000"));

    match reqwest::Url::parse(&server) {
        Ok(e) => Ok(e),
        Err(_) => Err(result::OperationResult::new(
            None,
            result::ResultCode::ERROR,
            Some("Cannot parse server's url".into()),
        )),
    }
}

#[tauri::command]
pub async fn subscribe(
    channel_id: i32,
    app: AppHandle,
    state: State<'_, ChannelState>,
) -> Result<result::OperationResult, result::OperationResult> {
    let url = get_and_parse_url()?;

    info!("\n\n------------------------------------- SUBSCRIBE TO THE CHANNEL {} ------------------------ \n\n", channel_id);

    if let Some(e) = verify_server_is_up(url.clone()).await {
        return Err(e);
    }

    let mut tokens = state.state.lock().await;

    match verify_user_isnt_listening(channel_id, &tokens) {
        Ok(_) => {}
        Err(e) => {
            return Err(result::OperationResult::new(
                None,
                result::ResultCode::ERROR,
                Some(e),
            ));
        }
    }

    tokens.insert(channel_id, CancellationToken::new());

    let token = tokens.get(&channel_id);

    tokio::spawn(listen_and_emit_messages(
        url,
        channel_id,
        app,
        token
            .expect(format!("Token registered for channel {} is invalid", channel_id).as_str())
            .clone(),
    ));

    Ok(result::OperationResult::new(
        Some(
            serde_json::from_str(
                "{\"message\":\"left channel\"}"
            )
            .unwrap(),
        ),
        result::ResultCode::SUCCESS,
        None,
    ))
}

#[tauri::command]
pub async fn unsubscribe(
    channel_id: i32,
    state: State<'_, ChannelState>,
) -> Result<result::OperationResult, result::OperationResult> {
    let tokens = state.state.lock().await;
    let token = tokens.get(&channel_id);

    if token.is_none() {
        return Err(result::OperationResult::new(
            None,
            result::ResultCode::ERROR,
            Some(format!(
                "The user didn't subscribe to this channel before {}",
                channel_id
            )),
        ));
    }

    let token = token.unwrap();

    token.cancel();

    Ok(result::OperationResult::new(
        Some(serde_json::Value::String(format!(
            "Success, the user will no more receive messages from this channel: {}",
            channel_id
        ))),
        result::ResultCode::SUCCESS,
        None,
    ))
}

#[tauri::command]
pub async fn send_message(
    channel_id: i32,
    author_id: i32,
    content: String,
) -> Result<result::OperationResult, result::OperationResult> {
    let message = message::Message::new(channel_id, author_id, content);
    let message = serde_json::to_string(&message).unwrap();

    let url = reqwest::Url::parse(
        format!(
            "{}/messages/",
            std::env::var("SERVER_URL")
                .ok()
                .unwrap_or(String::from("http://127.0.0.1:8000")),
        )
        .as_str(),
    )
    .unwrap();
    let client = reqwest::Client::new();

    let response = client
        .post(url)
        .header("Content-Type", "application/json")
        .body(message)
        .send()
        .await
        .unwrap();

    match response {
        r if r.status().is_success() => {
            return Ok(result::OperationResult::new(
                Some(serde_json::Value::String(
                    "Message sent successfully".to_string(),
                )),
                result::ResultCode::SUCCESS,
                None,
            ));
        }
        r if r.status().is_server_error() => {
            return Err(result::OperationResult::new(
                None,
                result::ResultCode::ERROR,
                Some("Internal server error".to_string()),
            ));
        }
        r if r.status().is_client_error() => {
            return Err(result::OperationResult::new(
                None,
                result::ResultCode::ERROR,
                Some("Client error: verify your request".to_string()),
            ));
        }
        _ => {
            return Err(result::OperationResult::new(
                None,
                result::ResultCode::ERROR,
                Some("Unknown error".to_string()),
            ));
        }
    }
}

#[tauri::command]
pub async fn get_channel_users(
    channel_id: i32,
    token: String,
) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = format!("/channels/{}/members", channel_id);

    match utils::build_url(endpoint.as_str()) {
        Ok(url) => utils::fetch_data(url, token).await,
        Err(e) => Err(e),
    }
}

#[tauri::command]
pub async fn create_channel(
    guild_id: i32,
    name: String,
    kind: String,
    token: String,
) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = "/channels/create";
    let new_channel = NewChannel::new(guild_id, name, kind);
    let new_channel = serde_json::to_string(&new_channel).unwrap();
    let endpoint = utils::build_url(endpoint)?;

    utils::post_server(endpoint, Some(new_channel), Some(token)).await
}
