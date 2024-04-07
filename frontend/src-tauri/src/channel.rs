use eventsource::reqwest::Client;
use serde::Serialize;
use std::collections::HashMap;
use tauri::{AppHandle, Manager, State};
use tokio::sync::Mutex;
use tokio_util::sync::CancellationToken;
use super::*;

// Struct that will store the Cancellationtokens
// corresponding to the different channels that the client
// subscribed to
pub struct ChannelState {
    pub state: Mutex<HashMap<i32, CancellationToken>>,
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

fn listen_and_emit_messages(channel_id: i32, app: AppHandle, token: CancellationToken) {
    let url =
        reqwest::Url::parse(format!("{}/subscribe/{}", std::env::var("SERVER_URL").ok().unwrap_or(String::from("http://127.0.0.1:8000")), channel_id).as_str())
            .unwrap();

    let client = Client::new(url);

    for event in client {
        if token.is_cancelled() {
            break;
        }
        let message = event.unwrap().data;
        app.emit_all("new_message", message).unwrap();
    }
}

#[tauri::command]
pub async fn subscribe(
    channel_id: i32,
    app: AppHandle,
    state: State<'_, ChannelState>,
) -> Result<result::OperationResult, result::OperationResult> {
    log::trace!("Subscribe function called");
    let mut tokens = state.state.lock().await;

    match verify_user_isnt_listening(channel_id, &tokens) {
        Ok(_) => {}
        Err(e) => {
            return Err(result::OperationResult::new(
                e,
                result::ResultCode::ERROR,
            ));
        }
    }

    tokens.insert(channel_id, CancellationToken::new());

    let token = tokens.get(&channel_id);
    listen_and_emit_messages(
        channel_id,
        app,
        token
            .expect(format!("Token registered for channel {} is invalid", channel_id).as_str())
            .clone(),
    );

    return Ok(result::OperationResult::new(
        format!(
            "Stopped listening for messages from channel: {}",
            channel_id
        ),
        result::ResultCode::SUCCESS,
    ));
}


#[tauri::command]
pub async fn send_message(channel_id: u32, message_type: message::MessageType, message_content: String) -> Result<result::OperationResult, result::OperationResult> {
    let message = message::Message::new(channel_id, message_type, message_content);

    let message = serde_json::to_string(&message).unwrap();
    
    // WARNING should precise the endpoint
    let url = reqwest::Url::parse(std::env::var("SERVER_URL").ok().unwrap_or(String::from("http://127.0.0.1:8000")).as_str()).unwrap();

    let client = reqwest::Client::new();

    let response = client.post(url)
        .body(message)
        .send()
        .await
        .unwrap();

    match response {
        r if r.status().is_success() => {
            return Ok(result::OperationResult::new(
                "Message sent successfully".to_string(),
                result::ResultCode::SUCCESS,
            ));
        }
        r if r.status().is_server_error() => {
            return Err(result::OperationResult::new(
                "Server error".to_string(),
                result::ResultCode::ERROR,
            ));
        }
        r if r.status().is_client_error() => {
            return Err(result::OperationResult::new(
                "Client error".to_string(),
                result::ResultCode::ERROR,
            ));
        }
        _ => {
            return Err(result::OperationResult::new(
                "Unknown error".to_string(),
                result::ResultCode::ERROR,
            ));
        }
    }

}



#[tauri::command]
pub async fn get_channel_users(channel_id: i32) -> Result<result::OperationResult, result::OperationResult> {

    let endpoint = format!("/channel/{}", channel_id);

    match utils::build_url(endpoint) {
        Ok(url) => utils::fetch_data(url).await,
        Err(e) => Err(e),
    }
}
