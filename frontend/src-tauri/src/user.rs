use super::*;

#[derive(serde::Serialize, serde::Deserialize)]
struct User {
    username: String,
    discrimator: i16,
    picture: String,
    description: String,
}

impl User {
    pub fn new(
        username: String,
        discrimator: i16,
        picture: String,
        description: String,
    ) -> Self {
        Self {
            username,
            discrimator,
            picture,
            description,
        }
    }
}

#[tauri::command]
pub async fn login(
    email: Option<String>,
    password: Option<String>,
    token: Option<String>,
) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = format!("/auth/login");

    if email.is_none() && password.is_none() {
        return match utils::build_url(endpoint) {
            Ok(url) => utils::post_form_server(url, None, token).await,
            Err(e) => Err(e),
        };
    }

    let mut input = HashMap::new();
    input.insert("email", email.unwrap());
    input.insert("password", password.unwrap());

    
    match utils::build_url(endpoint) {
        Ok(url) => utils::post_form_server(url, Some(input), None).await,
        Err(e) => Err(e),
    }
}

#[tauri::command]
pub async fn create_user(
    username: String,
    discriminator: i16,
    description: String,
    picture: String,
) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = "/user/create";

    let new_user = User::new(username, discriminator, description, picture);

    let body = serde_json::to_string(&new_user);

    let Ok(body) = body else {
        return Err(result::OperationResult::new(None, result::ResultCode::ERROR, Some("Cannot convert the user metadata to json, where not able to send it to the backend".into())));
    };

    match utils::build_url(endpoint) {
        Ok(u) => utils::post_server(u, Some(body), None).await,
        Err(e) => Err(e),
    }
}

#[tauri::command]
pub async fn get_user_info(
    user_id: i32,
    token: String,
) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = format!("/users/{}", user_id);

    match utils::build_url(endpoint) {
        Ok(url) => utils::fetch_data(url, token).await,
        Err(e) => Err(e),
    }
}

#[tauri::command]
pub async fn get_user_guilds(
    user_id: i32,
    token: String,
) -> Result<result::OperationResult, result::OperationResult> {
    let endpoint = format!("/users/{}/guilds", user_id);
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
                assert_eq!(res.content, Some(serde_json::from_str("{ \"guilds\": [ { \"id\": 1, \"name\": \"Guild 1\" }, { \"id\": 2, \"name\": \"Guild 2\" } ] }").unwrap()));
            }
            Err(e) => {
                panic!("{e:?}");
            }
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
                assert!(res.content == Some(serde_json::from_str("{ \"id\": 1, \"username\": \"test\", \"email\": \"user@gmail.com\"}").unwrap()));
            }
            Err(e) => {
                panic!("{e:?}");
            }
        }
    }

    #[tokio::test]
    async fn should_create_user() {
        let server = MockServer::start();
        std::env::set_var("SERVER_URL", server.base_url());

        let _m = server.mock(|when, then| {
            when.method(POST).path("/user/create");
            then.status(200)
                .header("Content-Type", "application/json")
                .body("{ \"token\" : \"fljdasf85425fklhafasflas\" }");
        });

        match create_user(
            "username".into(),
            1337,
            "Etudiant en info".into(),
            "user23457525.png".into(),
        )
        .await
        {
            Ok(res) => {
                assert_eq!(res.code, result::ResultCode::SUCCESS);
                assert_eq!(
                    res.content,
                    Some(
                        serde_json::from_str("{ \"token\" : \"fljdasf85425fklhafasflas\" }")
                            .unwrap()
                    )
                );
            }
            Err(e) => {
                panic!("{e:?}");
            }
        }
    }

    #[tokio::test]
    async fn test_login_user() {
        let server = MockServer::start();
        std::env::set_var("SERVER_URL", server.base_url());

        let _m = server.mock(|when, then| {
            when.method(POST).path("/login");
            then.status(200)
                .header("Content-Type", "application/json")
                .body("{ \"token\" : \"fljdasf85425fklhafasflas\" }");
        });

        match login(Some("user".into()), Some("pass".into()), None).await {
            Ok(res) => {
                assert_eq!(res.code, result::ResultCode::SUCCESS);
                assert_eq!(
                    res.content,
                    Some(
                        serde_json::from_str("{ \"token\" : \"fljdasf85425fklhafasflas\" }")
                            .unwrap()
                    )
                );
            }
            Err(e) => {
                panic!("{e:?}");
            }
        }
    }

    #[tokio::test]
    async fn test_login_user_with_wrong_url() {
        let server = MockServer::start();
        std::env::set_var("SERVER_URL", server.base_url());

        let _m = server.mock(|when, then| {
            when.method(POST).path("/login/poulet");
            then.status(200)
                .header("Content-Type", "application/json")
                .body("{ \"token\" : \"fljdasf85425fklhafasflas\" }");
        });

        match login(Some("user".into()), Some("pass".into()), None).await {
            Err(res) => {
                assert_eq!(res.code, result::ResultCode::ERROR);
                assert_eq!(
                    res.error_msg,
                    Some("Client error: verify your request".to_string())
                );
            }
            Ok(e) => {
                panic!("{e:?}");
            }
        }
    }
}
