// Adding listening and auto trigger of callback when
// new message gets received
// You can uncomment this if you've added to your ui

// A button should permit to the user to subscribe to a particular channel
// async function get_in_channel(e) {
//   e.preventDefault();
//   console.log("Call to the subscribe_to_channel api endpoint");
//   // The channel id should correspond to the target channel
//   invoke("susbcribe_to_channel", { channelId: 1 });
// }

// The endpoint trigger a new tauri event called new_message
// on all windows
// This is the callback function that should be triggered
// Modify it to the needs
// listen("new_message", (message) => {
//   console.log("I received a message");
//   console.log(message);
// });

class Message {
  constructor(author, content) {
    this.author = author;
    this.content = content;
  }

  display() {
    let messageBloc = document.createElement("div");
    messageBloc.innerText = this.author + ": " + this.content;
    return messageBloc;
  }
}

const button = document.getElementById("submit");
var chat;

button.addEventListener("click", (e) => display_message(e), false);

async function display_message(e) {
  e.preventDefault();
  invoke("get_message", {}).then((response) => {
    let author = response.author;
    let content = response.message;
    let messageBloc = new Message(author, content).display();
    chat.appendChild(messageBloc);
  });
}

function onReady() {
  chat = document.getElementById("convo-chat");
}

window.addEventListener("load", () => onReady());
