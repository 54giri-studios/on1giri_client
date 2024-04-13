async function post_message(e, message) {
    e.preventDefault();
    let author = getCookieValue("username");
    invoke('send_message', {channelId: channelId, messageContent: message}).then(() => {
        let content = message;
        let messageBloc = document.createElement('div');
        messageBloc.innerText = author + ': ' + content;
        chat.appendChild(messageBloc);
    }).catch((result)=>{
        console.log(result);
    })
}