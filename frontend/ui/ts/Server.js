async function createServer(e, name, description, authorid) {
    e.preventDefault();
    invoke("create_guild", {name: name, ownerId:authorid, description:description, token:getCookieValue("TOKEN")}).then(async (result)=> {
        loadServerButtons();
        console.log(result); 
    }).catch((result)=>{
        console.log("failed to create guild", result);
    })
}

async function createChannel(e,serverid, name) {
    e.preventDefault();
    invoke("create_channel", {guildId:serverid, name:name, kind:"text", token:getCookieValue("TOKEN")}).then(async (result)=> {
        document.querySelector(".server-selected").classList.remove("server-selected");
        document.getElementById("server"+serverid).click();
    }).catch((result)=>{
        console.log("failed to create guild", result);
    })
}

