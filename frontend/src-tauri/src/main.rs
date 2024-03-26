// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]


use tokio::sync::Mutex;
use std::collections::HashMap;

mod channel;

#[tauri::command]
fn say_hello(name: &str) -> String {
  format!("Hello {} and welcome to 0n1g1r1", name)
}

#[derive(serde::Serialize)]
struct Message {
  message: String,
  author: String,
}

#[tauri::command]
async fn get_message() -> Result<Message, String> {
  let m: Message = Message {
    message: String::from("Bonjour."),
    author: String::from("origaniels")
  };
  Ok(m)
}


fn main() {
    simple_logger::init().unwrap();

    tauri::Builder::default()
        .manage(channel::ChannelState {
            state: Mutex::new(HashMap::new()),
        })
        .invoke_handler(tauri::generate_handler![
            say_hello,
            channel::susbcribe_to_channel,
            channel::post_message
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
