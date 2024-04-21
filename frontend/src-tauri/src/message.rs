use super::*;
use chrono::{DateTime, Utc};
use tauri::utils::config;

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
    let config = HistoryConfig::new(Some(30), None, None);
    let config = serde_json::to_string(&config).unwrap();
    println!("{}", config);
    match utils::build_url(endpoint) {
        Ok(url) => {
            let client = reqwest::Client::new();

            let response = client
                .post(url)
                .header("Content-Type", "application/json")
                .body(config)
                .send()
                .await
                .unwrap();
        match &response {
        r if r.status().is_success() => {
                Ok(result::OperationResult::new(
                    Some(serde_json::from_str(response.text().await.unwrap().as_str()).unwrap()),
                    result::ResultCode::SUCCESS,
                    None,
                ))
            }
            r if r.status().is_server_error() => {
                Err(result::OperationResult::new(
                    None,
                    result::ResultCode::ERROR,
                    Some("Internal server error".to_string()),
                ))
            }
            r if r.status().is_client_error() => {
                Err(result::OperationResult::new(
                    None,
                    result::ResultCode::ERROR,
                    Some("Client error: verify your request".to_string()),
                ))
            }
            _ => {
                Err(result::OperationResult::new(
                    None,
                    result::ResultCode::ERROR,
                    Some("Unknown error".to_string()),
                ))
            }
        }
    },
        Err(_)=>Err(result::OperationResult::new(
            None,
            result::ResultCode::ERROR,
            Some("Url parsing error".to_string()),
        ))
}
}
