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
        
        if (this.picture.length>0){
            button.style.backgroundImage = `url(${this.picture})`;
        } else {
            let p = document.createElement("h1");
            p.textContent = parseInitials(this.name);
            button.appendChild(p);
        }
        return button
    }

}

function parseInitials(name) {
    let res = "";
    let list = name.split(" ");
    for (const word of list) {
        res+=Array.from(word)[0];
    }
    return res;
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
    invoke("get_user_guilds", {userId: userId, token:getCookieValue("TOKEN")}).then((result)=>{
        for (const server of result.content) {
            let serverid = server.id;
            let button = new ServerButton(server.name, serverid, "");
            button = button.display();
            servertab.appendChild(button);
            button.addEventListener("click", ()=> loadServerChannels(serverid), false);
        }
    }).catch((response)=>{
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
    
    invoke("get_guild_channels", {guildId: serverid, token: getCookieValue("TOKEN")}).then((result)=>{
        let channelList = result.content;

        for (const channel of channelList) {
            let channelElement = new ChannelButton(channel.name, channel.id, channel.kind);
            serverchannels.appendChild(channelElement.display());
        }
    }).catch((response)=>{
        console.log("failed to get guild channels");
    });
}

async function loadChannelMessages(e, channelid) {
    channelId = channelid;
    if (selectedChannel!=null) {
        if (selectedChannel === document.getElementById("channel" + channelid)) {
            //channel was already selected, nothing to do here
            return;
        } else {
            selectedChannel.classList.remove("channel-selected");
            selectedChannel = document.getElementById("channel" + channelid);
            selectedChannel.classList.add("channel-selected");
            clearMessages();
            clearChannelUsers();
        }
    } else {
        selectedChannel = document.getElementById("channel" + channelid);
        selectedChannel.classList.add("channel-selected");
        clearMessages();
        clearChannelUsers();
    }

    get_in_channel(e).then(async (response)=>{
        await loadChannelUsers(channelid);
        invoke("get_latest_messages", {channelId: channelid, amount: 30, token: getCookieValue("TOKEN")}).then((result)=>{
            for (const message of result.content) {
                let author = new User(message.author.id, message.author.username, message.author.discriminator, message.author.last_check_in, message.author.picture, message.author.creation_date);
                let content = message.content;
                let date = new Date(message.creation_date);
                let id = message.id;
                let messageBloc = new Message(content, date, author, author, id).display();
                messageBloc.id = "message" + message.id;
                chat.appendChild(messageBloc);
                scrollDown();
            }
        }).catch((result)=>{
            console.log("failed to get guild latest messages");
        })
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