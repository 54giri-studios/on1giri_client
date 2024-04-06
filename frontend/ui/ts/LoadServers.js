async function loadServerButtons() {
    //should call get_servers from rust backend
    let serverid = 42; //dummy value
    let button = document.createElement("button");
    button.className = "server-button";
    button.textContent = "server1";
    button.id = "server" + serverid;
    servertab.appendChild(button);
    button.addEventListener("click", loadServerChannels)
}

async function loadServerChannels(serverid) {
    let button = document.getElementById("channel" + serverid);
    if (button == null) {
        //should call get_server_channels(sever_id) from backend
        channel_id = 1;
        console.log("loading")
        button = document.createElement("button");
        button.className = "channel";
        button.textContent = "channel1";
        button.id = "channel" + serverid;
        serverchannels.appendChild(button);
        button.addEventListener("click", ()=>loadChannelMessages(channel_id), false);
    } else {
        //channel was already loaded
        button.style.display = "block";
        console.log("already loaded");
    }
}

async function loadChannelMessages(channelid) {
    // get latest30msg(channelid)
    await loadChannelUsers(channelid);
    await subscribeToChannel(channelid);
    let author = "user0";
    let content = "hello";
    let messageBloc = new Message(author, content).display();
    chat.appendChild(messageBloc);
    
}

async function subscribeToChannel(id) {
    clearMessages();
    console.log(id);
    invoke('susbcribe_to_channel', {channelId:id});
}

async function loadChannelUsers(channelid) {
    
}

function clearMessages() {
    console.log(chat);
    chat.textContent = "";
}