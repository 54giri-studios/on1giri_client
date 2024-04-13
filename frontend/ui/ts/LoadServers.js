let selectedChannel = null;
let selectedServer = null;


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
    if (selectedServer!=null) {
        if (selectedServer === document.getElementById("server" + serverid)) {
            //server was already selected, nothing to do here
            return;
        } else {
            selectedServer = document.getElementById("server" + serverid);
            clearChannels();
        }
    } else {
        selectedServer = document.getElementById("server" + serverid);
        clearChannels();
    }
    
    let channel = {name: "bite", id:42 }
    let button = document.getElementById("channel" + channel.id);
    if (button == null) {
        button = document.createElement("button");
        button.className = "channel";
        button.textContent = channel.name;
        button.id = "channel" + channel.id;
        serverchannels.appendChild(button);
        button.addEventListener("click", async (e)=>{
            document.getElementById("convo").style.display = "flex";
            channelMembers.style.display = "flex";
            channelid = channel.id;
            await loadChannelMessages(e, channelid);
        }, false);
    }
    
    invoke("get_guild_channels", {guildId: serverid}).then((result)=>{
        let channelList = result.data;

        for (channel in channelList) {
            let button = document.getElementById("channel" + channel.id);
            if (button == null) {
                channel_id = 0;
                button = document.createElement("button");
                button.className = "channel";
                button.textContent = channel.name;
                button.id = "channel" + channel.id;
                serverchannels.appendChild(button);
                button.addEventListener("click", async (e)=>{
                    document.getElementById("convo").style.display = "flex";
                    channelid = channel_id;
                    if (selectedChannel != null) {
                        if (selectedChannel === button) {

                        }
                        await loadChannelMessages(e, channel_id);
                    } else {
                        selectedChannel = document.getElementById("channel" + channel.id);
                        await loadChannelMessages(e, channel_id);
                    }
                    }, false);
            } else {
                //channel was already loaded
                button.style.display = "block";
            }
        }


    }).catch(()=>{
        console.log("failed to get guild channels");
    });
}

async function loadChannelMessages(e, channelid) {
    if (selectedChannel!=null) {
        if (selectedChannel === document.getElementById("channel" + channelid)) {
            //channel was already selected, nothing to do here
            console.log("already selected");
            return;
        } else {
            selectedChannel = document.getElementById("channel" + channelid);
            clearMessages();
            clearChannelUsers();
        }
    } else {
        selectedChannel = document.getElementById("channel" + channelid);
        clearMessages();
        clearChannelUsers();
    }

    get_in_channel(e).then(async (response)=>{
        await loadChannelUsers(channelid);
        invoke("get_latest_messages", {channelId: channelid, amount: 30}).then((result)=>{
            for (message in result.data) {
                let author = message.author;
                let content = message.content;
                let messageBloc = new Message(author, content).display();
                messageBloc.id = "message" + message.id;
                chat.appendChild(messageBloc);
            }
        })
        let author = "user0";
        let content = "hello";
        let messageBloc = new Message(author, content).display();
        chat.appendChild(messageBloc);
    }).catch((response)=>console.log(response));
}


async function loadChannelUsers(channelid) {
    channelMembers.textContent = "- Channel Members -";
    invoke("get_channel_users", {channelId: channelid}).then((result)=>{
        for (user in result.data) {
            let userBlock = document.createElement("div");
            userBlock.textContent = user.name;
            channelMembers.appendChild(userBlock);
        }
    }).catch((response)=>{
        console.log(response);
        let userBlock = document.createElement("div");
        userBlock.textContent = "dummyUser";
        channelMembers.appendChild(userBlock);
    })
}

function clearChannels() {
    serverchannels.textContent = "";
}

function clearMessages() {
    chat.textContent = "";
}

function clearChannelUsers() {
    channelMembers.textContent = "- Channel Members -";
}