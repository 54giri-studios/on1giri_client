const subscribe = document.getElementById("subscribe");
let body = document.getElementById("body");

function subscribe_init() {
    let popup = document.createElement("form");
    popup.id = "popup"
    body.appendChild(popup);
    let fill = document.createElement("input");
    fill.type = "text";
    fill.placeholder = "enter channel id"
    fill.addEventListener("submit", subscribe_to_channel, false);
    popup.appendChild(fill);
}

function subscribe_to_channel() {
    let id = document.getElementById("popup").firstElementChild.value;
    invoke('susbcribe_to_channel', {channel_id:id});
    let popup = document.getElementById("popup");
    body.removeChild(popup);
}

subscribe.addEventListener("click", subscribe_init, false);