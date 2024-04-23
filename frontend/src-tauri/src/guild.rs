use super::*;

#[derive(serde::Serialize, serde::Deserialize)]
struct Guild {
    name: String,
    owner_id: i32,
    description: String,
}

impl Guild {
    pub fn new(name: String, owner_id: i32, description: String) -> Self {
        Self {
            name,
            owner_id,
            description
        }
    }
}

#[tauri::command]
pub async fn get_guild_channels(guild_id: i32, token: String) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = format!("/guilds/{}/channels", guild_id);

    match utils::build_url(endpoint) {
        Ok(url) => utils::fetch_data(url, token).await,
        Err(e) => Err(e),
    }
}

#[tauri::command]
pub async fn add_user_to_guild(guild_id: i32, user_id: i32, token: String) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = format!("/guilds/add_user/{}/{}", guild_id, user_id);

    match utils::build_url(endpoint) {
        Ok(url) => utils::fetch_data(url, token).await,
        Err(e) => Err(e),
    }
}

#[tauri::command]
pub async fn create_guild(name: String, owner_id: i32, description: String, token: String) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = "/guilds/create";
    let new_guild = Guild::new(name, owner_id, description);
    let config = serde_json::to_string(&new_guild).unwrap();
    let endpoint = utils::build_url(endpoint)?;

    utils::post_server(endpoint, config, Some(token)).await
}
