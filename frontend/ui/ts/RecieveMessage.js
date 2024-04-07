// Adding listening and auto trigger of callback when
// new message gets received
// You can uncomment this if you've added to your ui

// A button should permit to the user to subscribe to a particular channel
async function get_in_channel(e) {
  e.preventDefault();
  console.log("Call to the subscribe_to_channel api endpoint");
  // The channel id should correspond to the target channel
  await invoke("subscribe", { channelId: 1 });
}

// The endpoint trigger a new tauri event called new_message
// on all windows
// This is the callback function that should be triggered
// Modify it to the needs
listen("new_message", (message) => {
  console.log("I received a message");
  console.log(message);
  display_message(msg);
});

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

async function display_message(msg) {
  let author = msg.author;
  let content = msg.message;
  let messageBloc = new Message(author, content).display();
  chat.appendChild(messageBloc);
}
