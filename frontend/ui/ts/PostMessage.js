async function postMessage(message) {
    let channelobj = document.getElementsByClassName("channel-selected")[0];
    let channelid = parseInt(channelobj.getAttribute("channelid"));
    invoke('send_message', {channelId:channelid, authorId: 0, content: message}).then(async (result) => {
    }).catch((result)=>{
        console.log("failed to post message");
    })
}


async function scrollDown() {
    let elem = document.getElementById("convo-chat-wrapper")
    elem.scrollTop = elem.scrollHeight;
}