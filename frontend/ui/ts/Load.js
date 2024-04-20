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
let channelCreateForm;

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
    e.preventDefault();
    let messageText = document.getElementById("input-message").value;
    document.getElementById("input-message").value = "";
    postMessage(messageText);
    }, false);
  document.getElementById("input-message").addEventListener("keydown", (e)=>{
    let elem = document.getElementById("input-message");
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        elem.style.height = "28px";
        message_edit_section.requestSubmit();
        return;
    } 
    setTimeout(()=>{
      elem.style.height = "1em";
      elem.style.height = Math.min(elem.scrollHeight, 10 * 28) + "px";
    }, 10)
  }, false)


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


  let serverCreateForm = document.getElementById("server-create-form")
  document.getElementById("createServer").addEventListener("click", async ()=>{
    serverCreateForm.style.display = "flex";
    serverCreateForm.firstElementChild.addEventListener("click", async (e)=>{
      e.stopPropagation();
    })
    serverCreateForm.addEventListener("click", async ()=>serverCreateForm.style.display = "none")
  })
  serverCreateForm.addEventListener("submit", async (e)=>{
    let name = serverCreateForm.firstElementChild.value;
    await createServer(e, name);
    serverCreateForm.firstElementChild.value = "";
    serverCreateForm.style.display = "none";
  })

  channelCreateForm = document.getElementById("channel-create-form")
  channelCreateForm.firstElementChild.addEventListener("click", async (e)=>{
    e.stopPropagation();
  })
  channelCreateForm.addEventListener("click", async ()=>channelCreateForm.style.display = "none")
  channelCreateForm.addEventListener("submit", async (e)=>{
    let name = channelCreateForm.firstElementChild.value;
    await createChannel(e, name);
    channelCreateForm.firstElementChild.value = "";
    channelCreateForm.style.display = "none";
  })
  /*to be removed after rust login is fixed*/
}

async function login(e) {
  e.preventDefault();
  let form = loginForm;
  let usernameInput = form.firstElementChild.firstElementChild.value;
  let passwordInput = form.firstElementChild.firstElementChild.nextElementSibling.value;
  if (usernameInput == "" || passwordInput == "") {
    form.firstElementChild.firstElementChild.style.outline = "solid";
    
    form.firstElementChild.firstElementChild.nextElementSibling.style.outline = "solid";
    return;
  }
  invoke("login", {username:usernameInput, password:passwordInput}).then((result)=>{
    console.log(result)
    document.cookie = "TOKEN="+result.data.token;
    userid = result.userId;
    form.style.display = "none";
    afterLogin();
  }).catch((response)=>{
    document.cookie = "TOKEN=AUHIDUHEZ";
    form.style.display = "none";
    afterLogin();
    console.log(response);
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
    form.firstElementChild.firstElementChild.style.outline = "solid";
    
    form.firstElementChild.firstElementChild.nextElementSibling.style.outline = "solid";
    return;
  }
  invoke("create_user", {username:usernameInput, email:passwordInput, description:"haha", picture:"velipaka"}).then((result)=>{
  if (document.getElementById("error")!=undefined){
    document.getElementById("error").remove();
  }
  loginForm.style.display = "flex";
  createAccountForm.style.display = "none";
  }).catch(()=>{
    console.log("failed to create account");
    let errorMsg = document.createElement("small");
    errorMsg.id = "error";
    errorMsg.style.color = "red";
    errorMsg.textContent = "failed to create account";

    form.firstElementChild.appendChild(errorMsg);
  })
  
}

window.addEventListener("load", onReady, false);