async function post_message(e, message) {
    e.preventDefault();
    let author = getCookieValue("username");
    invoke('post_message', {author: author, content: message}).then(() => {
        let content = message;
        let messageBloc = document.createElement('div');
        messageBloc.innerText = author + ': ' + content;
        chat.appendChild(messageBloc);
    })
}