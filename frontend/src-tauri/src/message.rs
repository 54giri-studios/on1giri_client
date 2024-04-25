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

#[derive(serde::Serialize, serde::Deserialize, Clone, Debug)]
pub struct HistoryConfig {
    limit: Option<i32>,
    before: Option<DateTime<Utc>>,
    after: Option<DateTime<Utc>>,
}

impl HistoryConfig {
    pub fn new(limit: Option<i32>, before: Option<DateTime<Utc>>, after: Option<DateTime<Utc>>) -> Self {
        HistoryConfig {
            limit,
            before,
            after,
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
    let url = utils::build_url(endpoint)?;
    utils::fetch_data(url, token).await
}

#[tauri::command]
pub async fn get_latest_messages(
    channel_id: i32,
    amount: Option<i32>,
    before: Option<DateTime<Utc>>,
    after: Option<DateTime<Utc>>,
    token: String,
) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = format!("/channels/{}/messages/history", channel_id);

    let config;

    if amount.is_some() {
        config = HistoryConfig::new(amount, before, after);
    } else {
        config = HistoryConfig::new(Some(30), before, after);
    }
    let config = serde_json::to_string(&config).unwrap();
    let endpoint = utils::build_url(endpoint)?;
    utils::post_server(endpoint, Some(config), Some(token)).await
}
