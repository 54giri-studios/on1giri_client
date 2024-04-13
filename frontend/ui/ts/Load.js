function getCookieValue(name) {
  // not my code 'cause i'm too lazy to write something like this (https://stackoverflow.com/questions/10730362/get-cookie-by-name)
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

let body;
let chat;
let channelMembers;
let join;
let servertab;
let serverchannels;
let message_edit_section;
let subscribe;
let currentChannelId = -1;
let userId = 0;
let channelId = 0;
let loginForm;
let createAccountForm;

function onReady() {
  chat = document.getElementById("convo-chat");
  channelMembers = document.getElementById("channel-members");

  join = document.getElementById("subscribe");
  join.addEventListener("click", joinServer, false);

  body = document.getElementById("body");

  servertab = document.getElementById("server-nav");

  serverchannels = document.getElementById("channel-list");
  
  message_edit_section = document.getElementById("message-edit");
  message_edit_section.addEventListener('submit', (e) => {
    let message = message_edit_section.firstElementChild.value;
    message_edit_section.firstElementChild.value = "";
    post_message(e, message);
    }, false);

  loginForm = document.getElementById("login-form");
  createAccountForm = document.getElementById("create-account-form");
  loginForm.firstElementChild.addEventListener("submit",async (e)=>await login(e), false);
  loginForm.firstElementChild.lastElementChild.addEventListener("click", (e)=>{
    e.preventDefault();
    loginForm.style.display = "none";
    createAccountForm.style.display = "flex";
  })
  createAccountForm.firstElementChild.addEventListener("submit", async (e)=>{createAccount(e)}, false);
  createAccountForm.firstElementChild.lastElementChild.addEventListener("click", (e)=>{
    e.preventDefault();
    loginForm.style.display = "flex";
    createAccountForm.style.display = "none";
  })

  subscribe = document.getElementById("subscribe");
}

async function login(e) {
  e.preventDefault();
  let form = loginForm;
  let usernameInput = form.firstElementChild.firstElementChild.value;
  let passwordInput = form.firstElementChild.firstElementChild.nextElementSibling.value;
  console.log(usernameInput, passwordInput);
  if (usernameInput == "" || passwordInput == "") {
    form.firstElementChild.firstElementChild.style.borderColor = "red";
    
    form.firstElementChild.firstElementChild.nextElementSibling.style.borderColor = "red";
    return;
  }
  invoke("login", {username:usernameInput, password:passwordInput}).then((result)=>{
    document.cookie = "TOKEN="+result.data.token;
    userid = result.userId;
    form.style.display = "none";
    afterLogin();
  }).catch(()=>{
    form.style.display = "none";
    afterLogin();
    console.log("Failed to login");
  })
}

async function afterLogin() {
  await loadServerButtons();
}

async function createAccount(e) {
  e.preventDefault();
  let form = createAccountForm;
  let usernameInput = form.firstElementChild.firstElementChild.value;
  let passwordInput = form.firstElementChild.firstElementChild.nextElementSibling.value;
  if (usernameInput == "" || passwordInput == "") {
    form.firstElementChild.firstElementChild.style.borderColor = "red";
    
    form.firstElementChild.firstElementChild.nextElementSibling.style.borderColor = "red";
    return;
  }
  invoke("create_account", {username:usernameInput, password:passwordInput}).then((result)=>{
  }).catch(()=>{
  })
}

window.addEventListener("load", onReady, false);