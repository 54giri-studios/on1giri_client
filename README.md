# Welcome to On1giri

This is the client of our small instant messaging app written (partly) in Rust .

# Dependencies

The client has been tested on linux: Debian and Arch (btw).

For Mac users, see the [Docker](#setup-with-docker) section.

We haven't tested anything on Windows yet.

## Rust

You need to have Rust installed (rustc version >=1.76). Installation instructions can be found at https://www.rust-lang.org/tools/install.

## Tauri

Our client also uses the framework [Tauri](https://tauri.app) that can be installed using the following command: 

`cargo install tauri-cli`

# Configuration

By default, the server address is `http://127.0.0.1:8000`.

From the root of the cloned repo, it can be changed at `./frontend/src-tauri/.env` under `SERVER_URL`.

Obviously you need an instance of the [server](https://github.com/54giri-studios/on1giri_server.git) running at the specified address for the client to function properly.

# Launch

You can now launch the app in dev mode from the root of the repo using the command:

`cargo tauri dev`

In this mode you can modify the source code and the app will refresh automatically with your modifications.

You can also launch the app in release mode with this command:

`cargo tauri build`

The executable can then be found at `./frontend/src-tauri/target/release/onigiri-front`.

# Setup with Docker

#TODO
