class Message {

    constructor(author, content) {
        this.author = author;
        this.content = content;
    }

    display() {
        let messageBloc = document.createElement('div');
        messageBloc.innerText = this.author + ': ' + this.content;
        return messageBloc;
    }
}

const button = document.getElementById("submit");
var chat

button.addEventListener('click', (e) => display_message(e), false);

async function display_message(e) {
    e.preventDefault();
    invoke('get_message', {}).then((response) => {
        let author = response.author;
        let content = response.message;
        let messageBloc = new Message(author, content).display();
        chat.appendChild(messageBloc);
    })
}

function onReady() {
    chat = document.getElementById('convo-chat');
}

window.addEventListener("load", () => onReady())