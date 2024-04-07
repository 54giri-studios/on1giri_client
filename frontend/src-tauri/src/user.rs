use super::*;
use std::collections::HashMap;

#[tauri::command]
pub async fn login(
    username: String,
    password: String,
) -> Result<result::OperationResult, result::OperationResult> {
    // I've concerned about the security of this way of handle login's logic
    // This is boilerplate that should be handle in a safer way
    // TODO
    let endpoint = format!("/login");

    let json = {
        let mut map = HashMap::new();
        map.insert("username", username);
        map.insert("password", password);
        map
    };

    let body: String;
    let result = utils::convert_to_json_str(json);
    if result.is_ok() {
        body = result.ok().unwrap();
    } else {
        return Err(result.err().unwrap());
    }

    let result = match utils::build_url(endpoint) {
        Ok(url) => utils::post_server(url, body).await,
        Err(e) => Err(e),
    };

    if result.is_ok() {
        // Save the token to the database
    }

    return result;
}


#[tauri::command]
pub async fn get_user_info(user_id: i32) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = format!("/user/{}", user_id);

    match utils::build_url(endpoint) {
        Ok(url) => utils::fetch_data(url).await,
        Err(e) => Err(e),
    }
}

#[tauri::command]
pub async fn get_user_guilds(user_id: i32) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = format!("/user/{}/guilds", user_id);

    match utils::build_url(endpoint) {
        Ok(url) => utils::fetch_data(url).await,
        Err(e) => Err(e),
    }
}
