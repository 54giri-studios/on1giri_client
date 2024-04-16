use super::*;
use std::collections::HashMap;

async fn handle_response(
    call: Result<reqwest::Response, reqwest::Error>,
) -> Result<result::OperationResult, result::OperationResult> {
    let response: reqwest::Response;

    if call.is_ok() {
        response = call.unwrap();

        match &response {
            r if r.status().is_success() => {
                return Ok(result::OperationResult::new(
                    Some(serde_json::from_str(response.text().await.unwrap().as_str()).unwrap()),
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

pub fn convert_to_urlencoded_str(
    map: HashMap<&str, String>,
) -> Result<String, result::OperationResult> {
    match serde_urlencoded::to_string(&map) {
        Ok(body) => Ok(body),
        Err(_) => Err(result::OperationResult::new(
            None,
            result::ResultCode::ERROR,
            Some(String::from(
                "Error in data, could not be parse into urlencoded type",
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
    body: String,
    token: Option<String>,
) -> Result<result::OperationResult, result::OperationResult> {
    let client = reqwest::Client::new();

    let mut call = client.post(url).json(&body);
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
