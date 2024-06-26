// Adding listening and auto trigger of callback when
// new message gets received
// You can uncomment this if you've added to your ui

// A button should permit to the user to subscribe to a particular channel
async function get_in_channel(e) {
  // The channel id should correspond to the target chann
  let channelObj = document.querySelector(".channel-selected");
  let channelid = parseInt(channelObj.getAttribute("channelid"));
  invoke("subscribe", { channelId: channelid}).catch(result=>console.log("subscribe to",result));
  listen(`new_message_${channelid}`, async (message) => {
    await display_message(message);
  });
}

async function leaveChannel() {
  let channelObj = document.querySelector(".channel-selected");
  if (channelObj==null) {
    return;
  }
  let channelid = parseInt(channelObj.getAttribute("channelid"));
  console.log("leaving channel",channelid)
  invoke("unsubscribe", {channelId:channelid}).catch(result=>console.log(result))
}

// The endpoint trigger a new tauri event called new_message
// on all windows
// This is the callback function that should be triggered
// Modify it to the needs

async function display_message(received) {

  let channelObj = document.querySelector(".channel-selected");
  let channelid = parseInt(channelObj.getAttribute("channelid"));

  let msg = JSON.parse(received.payload);
  if(msg.channel_id == channelid) {
  invoke("get_user_info", {userId:msg.author_id, token:getCookieValue("TOKEN")}).then(async (result)=>{
    console.log(msg);
    let author = new User(result.content.id, result.content.username, result.content.discriminator, result.content.last_check_in, result.content.picture, result.content.creation_date, result.description);
    let content = msg.content;
    let date = new Date(msg.creation_date);
    let msgObj = new Message(content, date, author, msg.id, 42);
    msgObj.display(msgObj);
    await scrollDown();
  }).catch(async (result)=>{
    console.log(result,"could not get user info");
  })
  }
}
