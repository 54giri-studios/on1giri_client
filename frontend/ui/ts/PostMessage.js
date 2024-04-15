async function postMessage(message) {
    
    let author = getCookieValue("username");
    invoke('send_message', {channelId: channelId, authorId: 0, content: message}).then(() => {
        let content = message;
        let messageBloc = document.createElement('div');
        messageBloc.innerText = author + ': ' + content;
        chat.appendChild(messageBloc);
        scrollDown();
    }).catch((result)=>{
        console.log(result);
    })
}


async function scrollDown() {
    let elem = document.getElementById("convo-chat-wrapper")
    elem.scrollTop = elem.scrollHeight;
}