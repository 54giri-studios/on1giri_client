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
    //should call get_server_channels(sever_id) from backend
    let button = document.getElementById("channel" + serverid);
    if (button == null) {
        channel_id = 1;
        console.log("loading")
        button = document.createElement("button");
        button.className = "channel";
        button.textContent = "channel1";
        button.id = "channel" + serverid;
        serverchannels.appendChild(button);
        button.addEventListener("click", async (e)=>{
            await loadChannelMessages(e, channel_id);
            }, false);
    } else {
        //channel was already loaded
        button.style.display = "block";
        console.log("already loaded");
    }
}

async function loadChannelMessages(e, channelid) {
    // get latest30msg(channelid)
    get_in_channel(e).then(async (response)=>{
        await loadChannelUsers(channelid);
        let author = "user0";
        let content = "hello";
        let messageBloc = new Message(author, content).display();
        chat.appendChild(messageBloc);
    }).catch((response)=>console.log(response));
}


async function loadChannelUsers(channelid) {
    
}

function clearMessages() {
    chat.textContent = "";
}