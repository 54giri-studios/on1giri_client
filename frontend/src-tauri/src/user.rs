use super::*;
use std::collections::HashMap;

#[tauri::command]
pub async fn login(
    username: String,
    password: String
) -> Result<result::OperationResult, result::OperationResult> {

    log::info!("Logging in user: {}", username);

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
        Ok(url) => utils::post_server(url, body, None).await,
        Err(e) => Err(e),
    };

    return result;
}


#[tauri::command]
pub async fn create_user(username: String, email: String, description: String, picture: String) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = "/user/create";

    let mut body = HashMap::new();
    body.insert("username", username);
    body.insert("email", email);
    body.insert("description", description);
    body.insert("picture", picture);

    if let Ok(body) = utils::convert_to_json_str(body) {
        match utils::build_url(endpoint) {
            Ok(u) => utils::post_server(u, body, None).await,
            Err(e) => Err(e)
        }
    } else {
        return Err(result::OperationResult::new("Cannot convert these values to json string".to_string(), result::ResultCode::ERROR));
    }
}


#[tauri::command]
pub async fn get_user_info(user_id: i32, token: String) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = format!("/user/{}", user_id);

    match utils::build_url(endpoint) {
        Ok(url) => utils::fetch_data(url, token).await,
        Err(e) => Err(e),
    }
}

#[tauri::command]
pub async fn get_user_guilds(user_id: i32, token: String) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = format!("/user/{}/guilds", user_id);
    match utils::build_url(endpoint) {
        Ok(url) => utils::fetch_data(url, token).await,
        Err(e) => Err(e),
    }
}


#[cfg(test)]
mod test {
    use super::*;
    use httpmock::prelude::*;


    #[tokio::test]
    async fn should_retrieve_user_guilds_if_exists() {
        let server = MockServer::start();
        std::env::set_var("SERVER_URL", server.base_url());

        let _m = server.mock(|when, then| {
            when.method(GET).path("/user/1/guilds");
            then.status(200)
                .header("Content-Type", "application/json")
                .body("{ \"guilds\": [ { \"id\": 1, \"name\": \"Guild 1\" }, { \"id\": 2, \"name\": \"Guild 2\" } ] }");
        });

        match get_user_guilds(1, "flkdjsalfkjsdlfk2857625".into()).await {
            Ok(res) => {
                assert_eq!(res.code, result::ResultCode::SUCCESS);
                assert_eq!(res.content, "{ \"guilds\": [ { \"id\": 1, \"name\": \"Guild 1\" }, { \"id\": 2, \"name\": \"Guild 2\" } ] }");
            },
            Err(e) => { panic!("{e:?}"); }
        }
    }


    #[tokio::test]
    async fn should_retrieve_user_info_if_exists() {
        let server = MockServer::start();
        std::env::set_var("SERVER_URL", server.base_url());

        let _m = server.mock(|when, then| {
            when.method(GET).path("/user/1");
            then.status(200)
                .header("Content-Type", "application/json")
                .body("{ \"id\": 1, \"username\": \"test\", \"email\": \"user@gmail.com\"}");
        });
        
        match get_user_info(1, String::from("fldjsafkljsadlkfj29527u5")).await {
            Ok(res) => {
                assert_eq!(res.code, result::ResultCode::SUCCESS);
                assert!(res.content == "{ \"id\": 1, \"username\": \"test\", \"email\": \"user@gmail.com\"}");
            }
            Err(e) => { panic!("{e:?}"); }
        }
    }


    #[tokio::test]
    async fn should_create_user(){
        let server = MockServer::start();
        std::env::set_var("SERVER_URL", server.base_url());

        let _m = server.mock(|when, then| {
            when.method(GET).path("/user/create");
            then.status(200)
                .header("Content-Type", "application/json")
                .body("{ \"token\" : \"fljdasf85425fklhafasflas\" }");
        });

        match create_user("username".into(), "user@gmail.com".into(), "Etudiant en info".into(), "user23457525.png".into()).await {
            Ok(res) => {
                assert_eq!(res.code, result::ResultCode::SUCCESS);
                assert_eq!(res.content, "{ \"token\" : \"fljdasf85425fklhafasflas\" }");
            }
            Err(e) => { panic!("{e:?}"); }
        }
    }


}
