use super::*;


#[tauri::command]
pub async fn get_guild_channels(guild_id: i32, token: String) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = format!("/guild/{}", guild_id);

    match utils::build_url(endpoint) {
        Ok(url) => utils::fetch_data(url, token).await,
        Err(e) => Err(e),
    }
}

#[tauri::command]
pub async fn add_user_to_guild(guild_id: i32, user_id: i32, token: String) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = format!("/guild/add_user/{}/{}", guild_id, user_id);

    match utils::build_url(endpoint) {
        Ok(url) => utils::fetch_data(url, token).await,
        Err(e) => Err(e),
    }
}
