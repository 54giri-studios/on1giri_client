async function loadServerButtons() {
    //should call get_servers from rust backend
    let serverid = 1515; //dummy value
    let button = document.createElement("button");
    button.className = "server-button";
    button.textContent = "couille";
    button.id = "server" + serverid;
    servertab.appendChild(button);
    button.addEventListener("click", ()=> loadServerChannels(serverid));
    invoke("get_user_guilds", {userId: userId}).then((result)=>{
        for (server in result.data) {
            let serverid = server.id; //dummy value
            let button = document.createElement("button");
            button.className = "server-button";
            button.textContent = server.name;
            button.id = "server" + serverid;
            servertab.appendChild(button);
            button.addEventListener("click", ()=> loadServerChannels(serverid));
        }
    }).catch(()=>{
        console.log("failed to get server ids");
    });
}

async function loadServerChannels(serverid) {
    clearChannels();
    let channel = {name: "bite", id:42 }
    let button = document.getElementById("channel" + channel.id);
    if (button == null) {
        channel_id = 1;
        console.log("loading")
        button = document.createElement("button");
        button.className = "channel";
        button.textContent = channel.name;
        button.id = "channel" + channel.id;
        serverchannels.appendChild(button);
        button.addEventListener("click", async (e)=>{
            document.getElementById("convo").style.display = "flex";
            channelid = channel_id;
            await loadChannelMessages(e, channel_id);
        }, false);
    }
    invoke("get_guild_channels", {guildId: serverid}).then((result)=>{
        let channelList = result.data;

        for (channel in channelList) {
            let button = document.getElementById("channel" + channel.id);
            if (button == null) {
                channel_id = 0;
                console.log("loading")
                button = document.createElement("button");
                button.className = "channel";
                button.textContent = channel.name;
                button.id = "channel" + channel.id;
                serverchannels.appendChild(button);
                button.addEventListener("click", async (e)=>{
                    document.getElementById("convo").style.display = "flex";
                    channelid = channel_id;
                    await loadChannelMessages(e, channel_id);
                    }, false);
            } else {
                //channel was already loaded
                button.style.display = "block";
                console.log("already loaded");
            }
        }


    }).catch(()=>{
        console.log("failed to get guild channels");
    });
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

function clearChannels() {
    serverchannels.textContent = "";
}

function clearMessages() {
    chat.textContent = "";
}