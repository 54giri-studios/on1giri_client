// Adding listening and auto trigger of callback when
// new message gets received
// You can uncomment this if you've added to your ui

// A button should permit to the user to subscribe to a particular channel
async function get_in_channel(e) {
  e.preventDefault();
  console.log("Call to the subscribe_to_channel api endpoint: ", channelId);
  // The channel id should correspond to the target channel
  invoke("subscribe", { channelId: channelId });
  listen("new_message", async (message) => {
    await display_message(message);
  });
}

// The endpoint trigger a new tauri event called new_message
// on all windows
// This is the callback function that should be triggered
// Modify it to the needs

async function display_message(received) {
  console.log(received);
  let msg = JSON.parse(received.payload);
  console.log(msg);
  let author = msg.author_id;
  let content = msg.content;
  let date = "14 juillet 1789";
  let messageBloc = new Message(content, date, author, 0).display();
  chat.appendChild(messageBloc);
}
