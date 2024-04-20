use super::*;
use chrono::{DateTime, Utc};

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Message {
    channel_id: i32,
    author_id: i32,
    content: String,
}

impl Message {
    pub fn new(channel_id: i32, author_id: i32, content: String) -> Self {
        Message {
            channel_id,
            author_id,
            content,
        }
    }
}

#[tauri::command]
pub async fn get_messages(
    channel_id: i32,
    message_id: i32,
    amount: i32,
    token: String,
) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = format!(
        "/message/get_amount_prec_messages/{}/{}/{}",
        channel_id, message_id, amount
    );

    match utils::build_url(endpoint) {
        Ok(url) => utils::fetch_data(url, token).await,
        Err(e) => Err(e),
    }
}

#[tauri::command]
pub async fn get_latest_messages(
    channel_id: i32,
    amount: i32,
    token: String,
) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = format!("/channels/{}/messages/history", channel_id);
    println!("getting latest{} msgs of channel {}", channel_id, amount);
    match utils::build_url(endpoint) {
        Ok(url) => utils::post_server(url, String::from("{}"), None).await,
        Err(e) => Err(e),
    }
}
