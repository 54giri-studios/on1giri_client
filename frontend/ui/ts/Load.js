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

    document.cookie = "username=user1";

    loadServerButtons();
  }
  
  window.addEventListener("load", () => onReady());