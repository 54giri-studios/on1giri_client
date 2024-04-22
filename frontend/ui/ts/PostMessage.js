async function postMessage(message) {
    
    invoke('send_message', {channelId: channelId, authorId: 0, content: message}).then(async (result) => {
        let messageBloc = new Message(message, "14 juillet 1789", "Blanchard", 0); 
    }).catch((result)=>{
        console.log("failed to post message");
    })
}


async function scrollDown() {
    let elem = document.getElementById("convo-chat-wrapper")
    elem.scrollTop = elem.scrollHeight;
}