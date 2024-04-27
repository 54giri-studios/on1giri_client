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
        innerToolTip.innerText = this.name;
        button.appendChild(innerToolTip);
        
        button.id = "server" + this.id;
        button.setAttribute("serverid", this.id); 
        button.addEventListener("click", async ()=> await loadServerChannels(this.id));
        
        if (this.picture.length>0){
            button.style.backgroundImage = `url(${this.picture})`;
        } else {
            let p = document.createElement("h1");
            p.textContent = parseInitials(this.name);
            button.appendChild(p);
        }
        return button;
    }

}

function parseInitials(name) {
    if (name=="" || name==undefined) {
        return "";
    }
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
            loadChannelMessages(e, this.id);
        }, false);
        button.appendChild(innerButton);
        
        button.className = "channel";

        button.id = "channel" + this.id;
        button.setAttribute("channelid", this.id);

        serverchannels.appendChild(button);


        return button;
    }
}

async function loadServerButtons() {
    invoke("get_user_guilds", {userId: userId, token:getCookieValue("TOKEN")}).then((result)=>{
        for (const server of result.content) {
            if (document.getElementById("server"+server.id)!= undefined) {
                continue;
            }
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
    let serverObj = document.getElementById("server"+serverid);
    if (serverObj.classList.contains("server-selected")) {
        return;
    } else {
        let otherserver = document.getElementsByClassName("server-selected");
        if (otherserver.length==0) {
            // nothing to do
        } else {
            otherserver[0].classList.remove("server-selected");
        }
        clearChannels();
        clearChannelUsers();
        clearMessages();
        serverObj.classList.add("server-selected");
    }
        let createChannelButton = document.createElement("button");
        createChannelButton.innerText = "New Channel";
        createChannelButton.addEventListener("click", async ()=>{
            channelCreateForm.style.display = "flex";
        })
        serverchannels.appendChild(createChannelButton);
    
    // load channels
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
    let channelObj = document.getElementById("channel"+channelid);
    if (channelObj.classList.contains("channel-selected")) {
        return;
    } else {
        let otherChannels = document.getElementsByClassName("channel-selected");
        if (otherChannels.length==0) {
            // nothing to do
        } else {
            otherChannels[0].classList.remove("channel-selected");
            clearChannelUsers();
            clearMessages();
        }
        channelObj.classList.add("channel-selected");
    }

    get_in_channel(e).then(async (response)=>{
        loadChannelUsers(channelid).then(async ()=>{
            invoke("get_latest_messages", {channelId: channelid, amount: 30, token: getCookieValue("TOKEN")}).then((result)=>{
                for (const message of result.content) {
                    let author = new User(message.author.id,
                        message.author.username,
                        message.author.discriminator,
                        message.author.last_check_in,
                        message.author.picture,
                        message.author.creation_date,
                        message.author.description);
                    let content = message.content;
                    let date = new Date(message.creation_date);
                    let id = message.id;
                    if (document.getElementById("message"+id)!=undefined) {
                        continue;
                    }
                    new Message(content, date, author, id).display();
                    scrollDown();
                }
            }).catch((result)=>{
                console.log("failed to get guild latest messages");
            })
        }).catch(()=>console.log("failed to load users"));
    }).catch((response)=>{
        console.log("failed to subscribe to channel");
    });
}


async function loadChannelUsers(channelid) {
    invoke("get_channel_users", {channelId: channelid, token:getCookieValue("TOKEN")}).then((result)=>{
        for (const user of result.content) {
            let userBlock = new User(user.id, user.username, user.discriminator, user.last_check_in, user.picture, user.creation_date, user.description);
            let member = new Member(userBlock, user.roles);
            channelMembers.appendChild(member.display(member));
        }
    }).catch((response)=>{
        console.log("failed to load users")
    })
}

function clearChannels() {
    serverchannels.textContent = "";
}

function clearMessages() {
    chat.textContent = "";
}

function clearChannelUsers() {
    channelMembers.textContent = "";
}