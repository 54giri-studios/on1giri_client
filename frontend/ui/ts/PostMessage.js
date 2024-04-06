async function post_message(e, message) {
    e.preventDefault();
    invoke('post_message', {author: "me", content: message}).then(() => {
        let author = "me";
        let content = message;
        let messageBloc = document.createElement('div');
        messageBloc.innerText = author + ': ' + content;
        chat.appendChild(messageBloc);
    })
}