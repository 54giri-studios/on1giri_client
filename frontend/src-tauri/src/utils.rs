use super::*;
use std::collections::HashMap;



async fn handle_response(call: Result<reqwest::Response, reqwest::Error>) -> Result<result::OperationResult, result::OperationResult> {


    let response: reqwest::Response;

    if call.is_ok() {
        response = call.unwrap();
    }else{
        return Err(result::OperationResult::new(String::from("Cannot contact the server, redirect loop was detected or redirect limit was exhausted."), result::ResultCode::ERROR));
    }
    

    match response {
        r if r.status().is_success() => Ok(result::OperationResult::new(
            r.json().await.unwrap(),
            result::ResultCode::SUCCESS,
        )),
        r if r.status().is_client_error() => Err(result::OperationResult::new(
            "Client error, make sure you are connected to the internet".to_string(),
            result::ResultCode::ERROR,
        )),
        r if r.status().is_server_error() => Err(result::OperationResult::new(
            "Server error, try again later".to_string(),
            result::ResultCode::ERROR,
        )),
        _ => Err(result::OperationResult::new(
            "Unknown error".to_string(),
            result::ResultCode::ERROR,
        )),
    }
}


pub fn convert_to_json_str(map: HashMap<&str, String>) -> Result<String, result::OperationResult> {

    match serde_json::to_string(&map) {
        Ok(body) => Ok(body),
        Err(e) => Err(result::OperationResult::new(String::from("Error in data, could not be parse"), result::ResultCode::ERROR))
    }

}

pub fn build_url(endpoint: String) -> Result<reqwest::Url, result::OperationResult> {
    let server_url = std::env::var("SERVER_URL")
        .ok()
        .unwrap_or(String::from("http://127.0.0.1:8000"));

    let url = format!("{}{}", server_url, endpoint);
    let url = reqwest::Url::parse(url.as_str());

    match url {
        Ok(u) => Ok(u),
        Err(e) => Err(result::OperationResult::new(
            String::from("Bad url format"),
            result::ResultCode::ERROR,
        )),
    }
}



pub async fn fetch_data(
    url: reqwest::Url,
) -> Result<result::OperationResult, result::OperationResult> {
    let client = reqwest::Client::new();

    let call = client.get(url).send().await;

    handle_response(call).await
}

pub async fn post_server(url: reqwest::Url, body: String) -> Result<result::OperationResult, result::OperationResult> {

    let client = reqwest::Client::new();

    let call = client.post(url).json(&body).send().await;

    handle_response(call).await
}
