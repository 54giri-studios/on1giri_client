let selectedChannel = null;
let selectedServer = null;

class ServerButton {
    constructor(name, id, picture)  {
        this.name = name;
        this.id = id;
        this.picture  = picture;
    }

    display() {
        let button = document.createElement("div");

        button.classList.add("server", "tooltip");
        
        let innerToolTip = document.createElement("span");
        innerToolTip.className = "tooltiptext";
        innerToolTip.innerText = this.name
        button.appendChild(innerToolTip);
        
        button.id = "server" + this.id;
        
        button.addEventListener("click", async ()=> await loadServerChannels(this.id));
        
        button.style.backgroundImage = `url(${this.picture})`
        return button
    }
}

const ChannelType = {
    voice: "voice",
    text: "text"
}
class ChannelButton {
    constructor(name, id, channelType) {
        this.name = name;
        this.id = id;
        this.channelType = channelType;
    }

    display() {
        let button = document.createElement("div");

        let innerButton = document.createElement("button");
        innerButton.innerText = this.name;
        innerButton.addEventListener("click", async (e)=>{
            document.getElementById("convo").style.display = "flex";
            channelMembers.style.display = "flex";
            await loadChannelMessages(e, this.id);
        }, false);
        button.appendChild(innerButton);
        
        button.className = "channel";

        button.id = "channel" + this.id;

        serverchannels.appendChild(button);


        return button;
    }
}

async function loadServerButtons() {
    //should call get_servers from rust backend
    let serverid = 0; //dummy value
    let serverButton = new ServerButton("blanchard", 0, "./blanchard.png"); 
    servertab.appendChild(serverButton.display());
    

    invoke("get_user_guilds", {userId: userId}).then((result)=>{
        for (server in result.data) {
            let serverid = server.id; //dummy value
            let button = document.createElement("button");
            button.className = "server";
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
    let createChannelButton = document.createElement("button");
    createChannelButton.innerText = "New Channel";
    createChannelButton.addEventListener("click", async ()=>{
        channelCreateForm.style.display = "flex";
    })
    serverchannels.appendChild(createChannelButton);
    
    let channelButton = new ChannelButton("Le Cours", 0, ChannelType.text); 
    serverchannels.appendChild(channelButton.display());
    
    invoke("get_guild_channels", {guildId: serverid, token: getCookieValue("TOKEN")}).then((result)=>{
        let channelList = result.content;

        for (const channel of channelList) {
            let channelElement = new ChannelButton(channel.name, channel.id, channel.kind);
            serverchannels.appendChild(channelElement.display());
        }
    }).catch(()=>{
        console.log("failed to get guild channels");
    });
}

async function loadChannelMessages(e, channelid) {
    if (selectedChannel!=null) {
        if (selectedChannel === document.getElementById("channel" + channelid)) {
            //channel was already selected, nothing to do here
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
        invoke("get_latest_messages", {channelId: channelid, amount: 30, token: getCookieValue("TOKEN")}).then((result)=>{
            console.log(result.content);
            for (message in result.content) {
                let author = message.author;
                let content = message.content;
                let messageBloc = new Message(author, content).display();
                messageBloc.id = "message" + message.id;
                chat.appendChild(messageBloc);
            }
        }).catch((result)=>{
            console.log("failed to get guild latest messages");
        })
        let messageBloc = new Message("C'est dans le COUUUURS!!!", "14 juillet 1789", "Blanchard", 0); 
        chat.appendChild(messageBloc.display());
    }).catch((response)=>{
        console.log("failed to subscribe to channel");
    });
}


async function loadChannelUsers(channelid) {
    channelMembers.textContent = "- Channel Members -";
    invoke("get_channel_users", {channelId: channelid, token:getCookieValue("TOKEN")}).then((result)=>{
        for (user in result.content) {
            let userBlock = new UserButton(user.name, user.id, user.connectionStatus, user.connectionMessage);
            channelMembers.appendChild(userBlock.display());
        }
    }).catch((response)=>{
        let userBlock = new UserButton("Blanchard", 0, "online", "it's vaugeling time !!!!!!!!!!!!");
        channelMembers.appendChild(userBlock.display());
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