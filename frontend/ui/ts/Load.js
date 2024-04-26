function getCookieValue(name) {
  // not my code 'cause i'm too lazy to write something like this (https://stackoverflow.com/questions/10730362/get-cookie-by-name)
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function clearCookieValue(name) {
  document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
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
let serverCreateForm;
let logoutBtn;

function onReady() {
  chat = document.getElementById("convo-chat");
  let convochat = document.getElementById("convo-chat-wrapper");
  convochat.addEventListener("scroll", async (e)=>{
    if (convochat.scrollTop==0) {
      if ( convochat.firstElementChild.firstElementChild==undefined) {
        fetchMoreMsg(channelId,undefined);
      } else {
        let msgDate = new Date(convochat.firstElementChild.firstElementChild.getAttribute("date"));
        fetchMoreMsg(channelId, msgDate);
      }
    }
  })
  channelMembers = document.getElementById("channel-members");

  join = document.getElementById("subscribe");
  join.addEventListener("click", joinServer, false);

  body = document.getElementById("body");

  servertab = document.getElementById("server-nav");

  serverchannels = document.getElementById("channel-list");
  
  message_edit_section = document.getElementById("message-edit");
  message_edit_section.addEventListener('submit', async (e) => {
    e.preventDefault();
    let messageText = document.getElementById("input-message").value;
    document.getElementById("input-message").value = "";
    if (messageText.length>0) {
      await postMessage(messageText);
    }
    }, false);
  document.getElementById("input-message").addEventListener("keydown", async (e)=>{
    let elem = document.getElementById("input-message");
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        elem.style.height = "30px";
        message_edit_section.requestSubmit();
        return;
    }
    setTimeout(()=>{
      if (convochat.scrollTop == convochat.scrollHeight - convochat.clientHeight) {
        // if the chat is scrolled down
        elem.style.height = "30px";
        elem.style.height = Math.min(elem.scrollHeight-4, 10 * 30) + "px";
        convochat.scrollTop = convochat.scrollHeight;
      } else {
        elem.style.height = "30px";
        elem.style.height = Math.min(elem.scrollHeight-4, 10 * 30) + "px";
      }
    }, 5)
  }, false)


  logoutBtn = document.getElementById("logout");
  logoutBtn.addEventListener("click", afterLogout);
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


  serverCreateForm = document.getElementById("server-create-form")
  document.getElementById("createServer").addEventListener("click", async ()=>{
    serverCreateForm.style.display = "flex";
    serverCreateForm.firstElementChild.addEventListener("click", async (e)=>{
      e.stopPropagation();
    })
    serverCreateForm.addEventListener("click", async ()=>serverCreateForm.style.display = "none")
  })
  serverCreateForm.addEventListener("submit", async (e)=>{
    e.preventDefault();
    let name = serverCreateForm.querySelector("form").firstElementChild.value;
    let description = serverCreateForm.querySelector("form").firstElementChild.nextElementSibling.value;
    await createServer(e, name, description, 0);
    serverCreateForm.firstElementChild.value = "";
    serverCreateForm.style.display = "none";
  })

  
  /*to be removed after rust login is fixed*/
  if (getCookieValue("TOKEN") != undefined) {
    // token presend, try loging in with token
    // should invoke login
    // loginForm.style.display = "none";
    // afterLogin();
  }
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
    document.cookie = "TOKEN="+result.content.token;
    userid = result.userId;
    form.style.display = "none";
    afterLogin();
  }).catch((response)=>{
    
    afterLogin();
    console.log("Failed to login");
  })
}

async function afterLogin() {
  await loadServerButtons();
}

async function afterLogout() {
  clearCookieValue("TOKEN");
  location.reload();
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