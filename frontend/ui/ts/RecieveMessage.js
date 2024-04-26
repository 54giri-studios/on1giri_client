// Adding listening and auto trigger of callback when
// new message gets received
// You can uncomment this if you've added to your ui

// A button should permit to the user to subscribe to a particular channel
async function get_in_channel(e) {
  // The channel id should correspond to the target channel
  invoke("subscribe", { channelId: channelId }).catch(result=>console.log(result));
  listen("new_message", async (message) => {
    await display_message(message);
  });
}

// The endpoint trigger a new tauri event called new_message
// on all windows
// This is the callback function that should be triggered
// Modify it to the needs

async function display_message(received) {

  let msg = JSON.parse(received.payload);
  console.log(msg)
  invoke("get_user_info", {userId:msg.author_id, token:getCookieValue("TOKEN")}).then(async (result)=>{
    let author = new User(result.content.id, result.content.username, result.content.discriminator, result.content.last_check_in, result.content.picture, result.content.creation_date, result.description);
    let content = msg.content;
    let date = new Date(msg.creation_date);
    new Message(content, date, author, 0, 42).display();
    await scrollDown();
  }).catch(async (result)=>{
    console.log("could not get user info");
  })
}
