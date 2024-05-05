// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenv::dotenv;
use std::collections::HashMap;
use tokio::sync::Mutex;

pub mod channel;
pub mod guild;
pub mod message;
pub mod result;
pub mod user;
pub mod utils;
use tauri_plugin_log::LogTarget;

fn main() {
    dotenv().ok();

    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().targets([
            LogTarget::LogDir,
            LogTarget::Stdout,
            LogTarget::Webview,
        ]).build())
        .manage(channel::ChannelState {
            state: Mutex::new(HashMap::new()),
        })
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            channel::subscribe,
            channel::unsubscribe,
            channel::send_message,
            channel::get_channel_users,
            channel::create_channel,
            guild::get_guild_channels,
            guild::add_user_to_guild,
            guild::create_guild,
            guild::patch_guild,
            message::get_message,
            message::get_latest_messages,
            user::login,
            user::register,
            user::create_user,
            user::get_user_info,
            user::get_user_guilds
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
