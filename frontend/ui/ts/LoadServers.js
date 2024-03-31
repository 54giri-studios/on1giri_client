const servertab = document.getElementById("server-nav")
const serverchannels = document.getElementById("channel-list")

function loadServerButtons() {
    //should call get_servers from rust backend
    let serverid = 42; //dummy value
    let button = document.createElement("button");
    button.className = "server-button";
    button.textContent = "server1";
    button.id = "server" + serverid;
    servertab.appendChild(button);
    button.addEventListener("click", loadServerChannels)
}

function loadServerChannels(id) {
    let button = document.getElementById("channel" + id);
    if (button == null) {
        //should call get_server_channels(sever_id) from backend
        console.log("loading")
        button = document.createElement("button");
        button.className = "channel";
        button.textContent = "channel1"
        button.id = "channel" + id;
        serverchannels.appendChild(button);
    } else {
        //channel was already loaded
        button.style.display = "block";
        console.log("already loaded");
    }
}

function loadChannelMessages(serverid, channelid) {
    let author = response.author;
    let content = response.message;
    let messageBloc = new Message(author, content).display();
    chat.appendChild(messageBloc);
}

loadServerButtons();
