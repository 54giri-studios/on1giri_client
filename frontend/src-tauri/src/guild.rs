use super::*;

#[derive(serde::Serialize, serde::Deserialize)]
struct Guild {
    name: Option<String>,
    owner_id: Option<i32>,
    description: Option<String>,
}

impl Guild {
    pub fn new(name: Option<String>, owner_id: Option<i32>, description: Option<String>) -> Self {
        Self {
            name,
            owner_id,
            description,
        }
    }
}

#[tauri::command]
pub async fn get_guild_channels(
    guild_id: i32,
    token: String,
) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = utils::get_endpoint("get_a_guild_channels", &[&guild_id.to_string()])?;

    match utils::build_url(endpoint) {
        Ok(url) => utils::fetch_data(url, token).await,
        Err(e) => Err(e),
    }
}

#[tauri::command]
pub async fn add_user_to_guild(
    guild_id: i32,
    user_id: i32,
    token: String,
) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = utils::get_endpoint(
        "add_user_to_guild",
        &[&guild_id.to_string(), &user_id.to_string()],
    )?;

    let url = utils::build_url(endpoint)?;
    utils::post_server(url, None, Some(token)).await
}

#[tauri::command]
pub async fn create_guild(
    name: String,
    owner_id: i32,
    description: String,
    token: String,
) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = utils::get_endpoint("create_guild", &[])?;
    let new_guild = Guild::new(Some(name), Some(owner_id), Some(description));
    let new_guild = serde_json::to_string(&new_guild).unwrap();
    let endpoint = utils::build_url(endpoint)?;

    utils::post_server(endpoint, Some(new_guild), Some(token)).await
}

#[tauri::command]
pub async fn get_guild_info(
    guild_id: i32,
    token: String,
) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = utils::get_endpoint("get_guild_info", &[&guild_id.to_string()])?;
    let url = utils::build_url(endpoint)?;
    utils::fetch_data(url, token).await
}

#[tauri::command]
pub async fn patch_guild(name: Option<String>, owner_id: Option<i32>, description: Option<String>, guild_id: i32, token: String) -> Result<result::OperationResult, result::OperationResult> {

    let endpoint = utils::get_endpoint("update_a_guild", &[&guild_id.to_string()])?;
    let url = utils::build_url(endpoint)?;

    let fake_guild = Guild::new(name, owner_id, description);
    let fake_guild = serde_json::to_string(&fake_guild).unwrap();

    utils::patch_data(url, token, fake_guild).await
}

#[tauri::command]
pub async fn get_guild_roles(
    guild_id: i32,
    token: String,
) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = utils::get_endpoint("get_a_guild_roles", &[&guild_id.to_string()])?;
    let url = utils::build_url(endpoint)?;
    utils::fetch_data(url, token).await
}

#[tauri::command]
pub async fn get_guild_members(
    guild_id: i32,
    token: String,
) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = utils::get_endpoint("get_a_guild_members", &[&guild_id.to_string()])?;
    let url = utils::build_url(endpoint)?;
    utils::fetch_data(url, token).await
}



#[tauri::command]
pub async fn get_a_guild_member_info(
    guild_id: i32,
    member_id: i32,
    token: String,
) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = utils::get_endpoint("get_a_guild_member_info", &[&guild_id.to_string(), &member_id.to_string()])?;
    let url = utils::build_url(endpoint)?;
    utils::fetch_data(url, token).await
}

#[tauri::command]
pub async fn get_guild_channel_permissions(guild_id: i32, channel_id: i32, token: String) -> Result<result::OperationResult, result::OperationResult> {
     let endpoint = utils::get_endpoint("get_guild_channel_permissions", &[&guild_id.to_string(), &channel_id.to_string()])?;
    let url = utils::build_url(endpoint)?;
    utils::fetch_data(url, token).await
}

#[tauri::command]
pub async fn get_guild_channel_role_permissions(guild_id: i32, channel_id: i32, role_id: i32, token: String) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = utils::get_endpoint("get_guild_channel_role_permissions", &[&guild_id.to_string(), &channel_id.to_string(), &role_id.to_string()])?;
    let url = utils::build_url(endpoint)?;
    utils::fetch_data(url, token).await
}

#[derive(serde::Serialize, serde::Deserialize)]
struct ChannelPermissions {
    can_read: Option<bool>,
    can_write: Option<bool>
}

impl ChannelPermissions {
    pub fn new(can_read: Option<bool>, can_write: Option<bool>) -> Self {
        Self {
            can_read,
            can_write
        }
    }
}


#[tauri::command]
pub async fn patch_guild_channel_role_permissions(guild_id: i32, channel_id: i32, role_id: i32, token: String, can_read: Option<bool>, can_write: Option<bool>) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = utils::get_endpoint("patch_guild_channel_role_permissions", &[&guild_id.to_string(), &channel_id.to_string(), &role_id.to_string()])?;

    let fake_perm = ChannelPermissions::new(can_read, can_write);
    let Ok(fake_perm) = serde_json::to_string(&fake_perm) else {
        return Err(result::OperationResult::new(None, result::ResultCode::ERROR, Some("wrong data passed as permissions, verify".into())));
    };

    let url = utils::build_url(endpoint)?;
    utils::patch_data(url, token, fake_perm).await
    
}
