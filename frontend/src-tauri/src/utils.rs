use super::*;
use std::collections::HashMap;

async fn handle_response(
    call: Result<reqwest::Response, reqwest::Error>,
) -> Result<result::OperationResult, result::OperationResult> {
    let response: reqwest::Response;

    if call.is_ok() {
        response = call.unwrap();
        return Ok(result::OperationResult::new(
            response.text().await.unwrap(),
            result::ResultCode::SUCCESS,
        ));
    } else {
        return Err(result::OperationResult::new(String::from("Cannot contact the server, redirect loop was detected or redirect limit was exhausted."), result::ResultCode::ERROR));
    }

}

pub fn convert_to_json_str(map: HashMap<&str, String>) -> Result<String, result::OperationResult> {
    match serde_json::to_string(&map) {
        Ok(body) => Ok(body),
        Err(_) => Err(result::OperationResult::new(
            String::from("Error in data, could not be parse"),
            result::ResultCode::ERROR,
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
            String::from("Bad url format"),
            result::ResultCode::ERROR,
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
        let url = build_url(String::from("/api/v1/")).unwrap();
        assert_eq!(url.as_str(), "http://127.0.0.1:8000/api/v1/");
    }

    #[test]
    fn incorrect_url_should_not_be_built() {
        let url = build_url(String::from("http::/127.0.0.1"));

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
        assert_eq!(converted, String::from("{\"name\":\"John\",\"age\":\"20\"}"));
    }

    #[tokio::test]
    async fn good_request_should_return_json_data() {
        let server = MockServer::start();

        let _m = server.mock(|when, then| {
            when.method(GET).path("/api/v1/");
            then.status(200)
                .header("Content-Type", "application/json")
                .body("{\"name\": \"John\", \"age\": 20}");
        });

        println!("Server started at {}", server.url("/api/v1/"));

        let url = reqwest::Url::parse(server.url("/api/v1/").as_str()).unwrap();
        let response = fetch_data(url).await;


        match response {
            Ok(res) => {
                assert_eq!(res.code, result::ResultCode::SUCCESS);
                assert_eq!(res.content, "{\"name\": \"John\", \"age\": 20}");
            },
            Err(e) => { eprintln!("{e:?}"); }
        }

    }
}
