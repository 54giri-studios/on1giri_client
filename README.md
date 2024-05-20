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

Le project peut se lancer de manière isolée avec Docker. Cependant il est plus simple de lancer le projet avec docker compose.

Afin de correctement utiliser les commandes suivantes, la hierarchie de fichiers supposee est la suivante :

```
  drwxr-xr-x@  7 samuelmichaelvanie  staff  224 May 20 09:23 .
  drwxr-xr-x@  3 samuelmichaelvanie  staff   96 Apr  9 14:54 ..
  drwxr-xr-x@ 15 samuelmichaelvanie  staff  480 May 20 09:35 .git
  -rw-r--r--@  1 samuelmichaelvanie  staff  208 Apr  9 14:54 .gitmodules
  -rw-r--r--@  1 samuelmichaelvanie  staff  947 May 20 09:23 docker-compose.yml
  drwxr-xr-x@  6 samuelmichaelvanie  staff  192 May 20 09:32 on1giri_client
  drwxr-xr-x@ 19 samuelmichaelvanie  staff  608 May 20 09:33 on1giri_server
```

Il s'agit la d'un dossier contenant le serveur et le client ainsi que le fichier docker-compose.yml.
Ce depot peut-etre retrouve sur ![](https://github.com/SamuelVanie/the_social_network). Si vous utilisez ce depot il faudra recuperer les mise a jour des depots du serveur et du client avec la commande : 

```
git submodule update --remote
```


Pour lancer le frontend de manière isolée, il suffit de lancer les commandes suivantes:

```bash
docker build -t on1giri-front .
docker run -it --rm -p 8000:8000 on1giri-front
```

Cependant pour cela vous devez disposer du serveur, ainsi que la base de donnees. 
L'adresse du serveur peut etre modifiee dans le fichier `./frontend/src-tauri/.env` sous `SERVER_URL`.

Pour lancer le projet avec docker compose, vous devrez, pour commencer, creer le containeur db et ensuite ajouter les tables necessaires a la base de donnees. Cette etape est necessaire car dans le fonctionnement de docker, le service backend malgre qu'il depend du service db, n'attends pas que la base de donnees soit prete avant de se lancer. Ce qui cause des erreurs a l'execution de l'etape de migration. (le script wait-for-db.sh est une tentative de resolution de ce probleme mais qui n'a pas aboutie dans son etat actuel).

```bash
docker compose up db
docker compose run --rm backend diesel migration run
```


Pour continuer il faudra que docker ait acces au serveur X de votre machine. Sur linux, cela se fait directement a travers le socket de la machine, il faudra donc vous assurer que la variable d'environnement `DISPLAY` est bien definie et que sa valeur est `DISPLAY=$DISPLAY:0`. Apres cette etape vous devrez autoriser l'acces a votre serveur X en lancant la commande : `xhost +local:`. Sur Mac, il faudra installer XQuartz et lancer la commande `xhost +si:hostname:$(hostname)` pour autoriser les connexions X11 par votre hote a votre machine. Par contre la valeur de la variable d'environnement `DISPLAY` sera differente, il vous faudra renseigner votre adresse IP a la place de $DISPLAY. Ce sera donc `DISPLAY=$IP:0`.

Vous pourrez ensuite demarrer le projet avec les commandes suivantes:

```bash
docker compose up
```

Cette commande lancera tous les services necessaires pour le projet. Vous pouvez acceder a l'application a l'adresse `http://127.0.0.1:8000` (par defaut).
