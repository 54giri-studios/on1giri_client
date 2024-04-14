use super::*;

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
pub enum MessageType {
    CONNECT,
    SEND,
    QUIT,
    NONE,
}

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct Message {
    channel_id: u32,
    message_type: MessageType,
    message_content: String,
}

impl Message {
    pub fn new(channel_id: u32, message_type: MessageType, message_content: String) -> Self {
        Message {
            channel_id,
            message_type,
            message_content,
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
    let endpoint = format!("/message/get_history_messages/{}/{}", channel_id, amount);
    println!("getting latest{} msgs of channel {}", channel_id, amount);
    match utils::build_url(endpoint) {
        Ok(url) => utils::fetch_data(url, token).await,
        Err(e) => Err(e),
    }
}
