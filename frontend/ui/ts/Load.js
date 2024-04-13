function getCookieValue(name) {
  // not my code 'cause i'm too lazy to write something like this (https://stackoverflow.com/questions/10730362/get-cookie-by-name)
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

let body;
let chat;
let join;
let servertab;
let serverchannels;
let message_edit_section;
let subscribe;
let currentChannelId = -1;
let userId = 42;
let channelId = 0;

function onReady() {
  chat = document.getElementById("convo-chat");

  join = document.getElementById("subscribe");
  join.addEventListener("click", joinInit, false);

  body = document.getElementById("body");

  servertab = document.getElementById("server-nav");

  serverchannels = document.getElementById("channel-list");
  
  message_edit_section = document.getElementById("message-edit");
  message_edit_section.addEventListener('submit', (e) => {
    let message = message_edit_section.firstElementChild.value;
    message_edit_section.firstElementChild.value = "";
    post_message(e, message);
    }, false);

  document.getElementById("login-form").firstChild.addEventListener("submit", async (e)=>login(e), false);
  
  subscribe = document.getElementById("subscribe");
  loadServerButtons();
}

async function login(e) {
  return;
  e.preventDefault();
  console.log("submitted");
  let form = document.getElementById("login-form");
  let usernameInput = form.firstChild.value;
  let passwordInput = form.lastChild.value;
  invoke("login", {username:usernameInput, password:passwordInput}).then((result)=>{
    document.cookie = "TOKEN="+result.data.token;
    userid = result.userId;
    form.style.display = "none";
    afterLogin();
  }).catch(()=>{
    form.style.display = "none";
    console.log(42)
    afterLogin();
    console.log("Failed to login");
  })
}

async function afterLogin() {
  await loadServerButtons();
}

window.addEventListener("load", onReady, false);