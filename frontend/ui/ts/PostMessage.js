const message_edit_section = document.getElementById("message-edit");

message_edit_section.addEventListener('submit', (e) => {
    let message = message_edit_section.firstElementChild.value;
    message_edit_section.firstElementChild.value = "";
    post_message(e, message);
}, false);

async function post_message(e, message) {
    e.preventDefault();
    invoke('post_message', {author: "me", content: message}).then(() => {
        let messageBloc = new Message("me", message).display();
        chat.appendChild(messageBloc);
    })
}