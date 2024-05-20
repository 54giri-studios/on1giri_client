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

The project can be launched in isolation with Docker. However, it is simpler to launch the project with docker compose.

In order to use the following commands correctly, the assumed file hierarchy is as follows:

```
  drwxr-xr-x@  7 samuelmichaelvanie  staff  224 May 20 09:23 .
  drwxr-xr-x@  3 samuelmichaelvanie  staff   96 Apr  9 14:54 ..
  drwxr-xr-x@ 15 samuelmichaelvanie  staff  480 May 20 09:35 .git
  -rw-r--r--@  1 samuelmichaelvanie  staff  208 Apr  9 14:54 .gitmodules
  -rw-r--r--@  1 samuelmichaelvanie  staff  947 May 20 09:23 docker-compose.yml
  drwxr-xr-x@  6 samuelmichaelvanie  staff  192 May 20 09:32 on1giri_client
  drwxr-xr-x@ 19 samuelmichaelvanie  staff  608 May 20 09:33 on1giri_server
```

This is a folder containing the server and client as well as the docker-compose.yml file.
This repository can be found at ![](https://github.com/SamuelVanie/the_social_network). If you use this repository, you'll need to retrieve updates from the server and client repositories with the command : 

```
git submodule update --remote
```


To launch the project in isolation, you can use the following commands:

```bash
docker build -t on1giri-front .
docker run -it --rm -p 8000:8000 on1giri-front
```

To do this, however, you need the server and the database. 
The server address can be changed in the file `./frontend/src-tauri/.env` under `SERVER_URL`.

To launch the project with docker compose, you'll first need to create the db container and then add the necessary database tables. This step is necessary because, as docker works, the backend service, although dependent on the db service, doesn't wait for the database to be ready before starting up. This causes errors during the migration stage. (The wait-for-db.sh script is an attempt to solve this problem, but has failed in its current state).

```bash
docker compose up db
docker compose run --rm backend diesel migration run
```


To continue, docker must have access to the X server on your machine. On Linux, this is done directly through the machine's socket, so make sure that the `DISPLAY` environment variable is set to `DISPLAY=$DISPLAY:0`. After this step, you'll need to authorize access to your X server by issuing the command: `xhost +local:`. On a Mac, you'll need to install XQuartz and run the command `xhost +si:hostname:$(hostname)` to authorize X11 connections from your host to your machine. However, the value of the `DISPLAY` environment variable will be different, so you'll need to enter your IP address instead of $DISPLAY. This will be `DISPLAY=$IP:0`.

You can then start the project with the following commands:

```bash
docker compose up
```

This command will launch all the services required for the project. You can access the application at `http://127.0.0.1:8000` (default).
