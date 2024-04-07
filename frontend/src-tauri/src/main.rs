// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenv::dotenv;
use std::collections::HashMap;
use tokio::sync::Mutex;

pub mod channel;

fn main() {
    simple_logger::init().unwrap();
    dotenv().ok();

    tauri::Builder::default()
        .manage(channel::ChannelState {
            state: Mutex::new(HashMap::new()),
        })
        .invoke_handler(tauri::generate_handler![
            channel::subscribe,
            channel::send_message
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
