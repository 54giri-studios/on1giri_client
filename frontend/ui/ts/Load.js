let body;
let chat;
let join;
let servertab;
let serverchannels;
let message_edit_section;
let subscribe;

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

    subscribe = document.getElementById("subscribe");

    loadServerButtons();
  }
  
  window.addEventListener("load", () => onReady());