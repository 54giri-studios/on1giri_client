async function postMessage(message) {
    
    invoke('send_message', {channelId: channelId, authorId: 0, content: message}).then(() => {
        let messageBloc = new Message(message, "14 juillet 1789", "Blanchard", 0); 
        chat.appendChild(messageBloc.display());
        scrollDown();
    }).catch((result)=>{
        console.log("failed to post message");
    })
}


async function scrollDown() {
    let elem = document.getElementById("convo-chat-wrapper")
    elem.scrollTop = elem.scrollHeight;
}