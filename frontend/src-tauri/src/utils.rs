use super::*;
use std::collections::HashMap;


pub fn get_and_parse_server_url() -> Result<tauri::Url, result::OperationResult> {
    let server = std::env::var("SERVER_URL")
        .ok()
        .unwrap_or(String::from("http://127.0.0.1:8000"));

    match reqwest::Url::parse(&server) {
        Ok(e) => Ok(e),
        Err(_) => Err(result::OperationResult::new(
            None,
            result::ResultCode::ERROR,
            Some("Cannot parse server's url".into()),
        )),
    }
}

pub fn get_endpoint(command: &str, args: &[&str]) -> Result<String, result::OperationResult> {
    let endpoints: HashMap<&str, String> = {
        let mut map = HashMap::new();

        map.insert("login", String::from("/auth/login"));
        map.insert("logout", String::from("/auth/logout"));
        map.insert("register", String::from("/auth/register"));
        map.insert("user_delete", String::from("/users/{}"));
        map.insert("user_get_by_id", String::from("/users/{}"));
        map.insert("user_create", String::from("/users/create"));
        map.insert("user_update", String::from("/users/{}"));
        map.insert("add_user_to_guild", String::from("/guilds/{}/members/{}/join"));
        map.insert("get_user_guilds", String::from("/users/{}/guilds"));
        map.insert("create_guild", String::from("/guilds/create"));
        map.insert("get_a_guild_info", String::from("/guilds/{}"));
        map.insert("update_a_guild", String::from("/guilds/{}"));
        map.insert("get_a_guild_roles", String::from("/guilds/{}/roles"));
        map.insert("get_a_guild_members", String::from("/guilds/{}/roles"));
        map.insert("get_a_guild_channels", String::from("/guilds/{}/channels"));
        map.insert("get_a_guild_member_info", String::from("/guilds/{}/members/{}"));
        map.insert("get_channel_permission_from_guild", String::from("/guilds/{}/channels/{}/permissions"));

        map.insert("get_a_role_of_channel_permission_from_guild", String::from("/guilds/{}/channels/{}/roles/{}/permissions"));

        map.insert("update_channel_role_permission_from_guild", String::from("/guilds/{}/channels/{}/roles/{}/permissions"));

        map.insert("send_message", String::from("/messages"));
        map.insert("create_channel", String::from("/channels/create"));
        map.insert("get_a_channel_info", String::from("/channels/{}"));
        map.insert("get_members_of_a_channel", String::from("/channels/{}/members"));
        map.insert("subscribe_to_a_channel", String::from("/channels/{}/subscribe"));
        map.insert("get_history_of_messages_of_channel", String::from("/channels/{}/messages/history"));
        map.insert("get_a_message_info", String::from("/channels/{}/messages/{}"));
        map
    };

    let Some(endpoint) = endpoints.get(command) else {
        return Err(result::OperationResult::new(
                    None,
                    result::ResultCode::ERROR,
            Some("Url not found in the registered map of url, verify the key".into()),
        ));
    };

    let mut endpoint: String = endpoint.clone();

    for param in args {
        endpoint = endpoint.replacen("{}", &param, 1);
    }

    Ok(endpoint)
    
}


async fn handle_response(
    call: Result<reqwest::Response, reqwest::Error>,
) -> Result<result::OperationResult, result::OperationResult> {
    let response: reqwest::Response;

    if call.is_ok() {
        response = call.unwrap();

        match &response {
            r if r.status().is_success() => {
                let res: serde_json::Value = serde_json::from_str(response.text().await.unwrap().as_str()).unwrap();

                let string_res = res.to_string();
                if string_res.contains("status") {
                    return Err(result::OperationResult::new(
                    None,
                    result::ResultCode::ERROR,
                        Some(string_res),
                    ));
                }

                return Ok(result::OperationResult::new(
                    Some(res),
                    result::ResultCode::SUCCESS,
                    None,
                ));
            }
            r if r.status().is_server_error() => {
                return Err(result::OperationResult::new(
                    None,
                    result::ResultCode::ERROR,
                    Some("Internal server error".to_string()),
                ));
            }
            r if r.status().is_client_error() => {
                return Err(result::OperationResult::new(
                    None,
                    result::ResultCode::ERROR,
                    Some("Client error: verify your request".to_string()),
                ));
            }
            _ => {
                return Err(result::OperationResult::new(
                    None,
                    result::ResultCode::ERROR,
                    Some("Unknown error".to_string()),
                ));
            }
        }
    } else {
        log::warn!("{:?}", call);
        return Err(result::OperationResult::new(None, result::ResultCode::ERROR, Some(String::from("Cannot contact the server, redirect loop was detected or redirect limit was exhausted."))));
    }
}

pub fn convert_to_json_str(map: HashMap<&str, String>) -> Result<String, result::OperationResult> {
    match serde_json::to_string(&map) {
        Ok(body) => Ok(body),
        Err(_) => Err(result::OperationResult::new(
            None,
            result::ResultCode::ERROR,
            Some(String::from(
                "Error in data, could not be parse into json string",
            )),
        )),
    }
}

pub fn build_url(endpoint: impl Into<String>) -> Result<reqwest::Url, result::OperationResult> {
    let server_url = std::env::var("SERVER_URL")
        .ok()
        .unwrap_or(String::from("http://127.0.0.1:8000"));

    let url = format!("{}{}", server_url, endpoint.into());
    let url = reqwest::Url::parse(url.as_str());

    match url {
        Ok(u) => Ok(u),
        Err(_) => Err(result::OperationResult::new(
            None,
            result::ResultCode::ERROR,
            Some(String::from("Bad url format")),
        )),
    }
}

pub async fn fetch_data(
    url: reqwest::Url,
    token: impl Into<String>,
) -> Result<result::OperationResult, result::OperationResult> {
    let client = reqwest::Client::new();

    let call = client
        .get(url)
        .header("AUTHORIZATION", format!("Bearer {}", token.into()))
        .send()
        .await;

    handle_response(call).await
}

pub async fn post_server(
    url: reqwest::Url,
    body: Option<String>,
    token: Option<String>,
) -> Result<result::OperationResult, result::OperationResult> {
    let client = reqwest::Client::new();

    let mut call = client.post(url).header("Content-type", "application/json");

    if let Some(bod) = body {
        call = call.body(bod);
    }

    if let Some(tok) = token {
        call = call.header("AUTHORIZATION", format!("Bearer {}", tok));
    }

    handle_response(call.send().await).await
}



pub async fn post_form_server(
    url: reqwest::Url,
    form: Option<HashMap<&str, String>>,
    token: Option<String>,
) -> Result<result::OperationResult, result::OperationResult> {
    let client = reqwest::Client::new();

    let mut call = client.post(url).header("Content-Type", "application/x-www-form-urlencoded");

    if let Some(f) = form {
        call = call.form(&f);
    }

    if let Some(tok) = token {
        call = call.header("AUTHORIZATION", format!("Bearer {}", tok));
    }

    handle_response(call.send().await).await
}

#[cfg(test)]
mod test {

    use super::*;
    use httpmock::prelude::*;

    #[test]
    fn correct_url_should_build() {
        let url = build_url("/api/v1/").unwrap();
        assert_eq!(
            url.as_str(),
            format!("{}{}", std::env::var("SERVER_URL").unwrap(), "/api/v1/")
        );
    }

    #[test]
    fn incorrect_url_should_not_be_built() {
        let url = build_url("http::/127.0.0.1");

        match url {
            Ok(u) => panic!("Should not be able to build url {}", u),
            Err(e) => assert_eq!(e.code, result::ResultCode::ERROR),
        }
    }
    
    #[test]
    fn correct_json_should_be_converted() {
        let mut to_send = HashMap::new();
        to_send.insert("name", "John".to_string());
        to_send.insert("age", "20".to_string());

        let converted = convert_to_json_str(to_send).unwrap();
        assert!(
            converted == String::from("{\"name\":\"John\",\"age\":\"20\"}")
                || converted == String::from("{\"age\":\"20\",\"name\":\"John\"}")
        );
    }

    #[tokio::test]
    async fn good_request_should_return_json_data() {
        let server = MockServer::start();
        std::env::set_var("SERVER_URL", server.base_url());

        let _m = server.mock(|when, then| {
            when.method(GET)
                .path("/api/v1/")
                .header("AUTHORIZATION", "Bearer testjfhwer90923y45fksajf");
            then.status(200)
                .header("Content-Type", "application/json")
                .body("{\"name\": \"John\", \"age\": 20}");
        });

        println!("{}", server.url("/api/v1/").as_str());

        let url = reqwest::Url::parse(server.url("/api/v1/").as_str()).unwrap();
        let response = fetch_data(url, "testjfhwer90923y45fksajf".to_string()).await;

        match response {
            Ok(res) => {
                assert_eq!(res.code, result::ResultCode::SUCCESS);
                assert_eq!(
                    res.content,
                    Some(serde_json::from_str("{\"name\": \"John\", \"age\": 20}").unwrap())
                );
            }
            Err(e) => {
                eprintln!("{e:?}");
            }
        }
    }
}
