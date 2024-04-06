
function joinInit() {
    let popup = document.createElement("form");
    popup.id = "popup"
    body.appendChild(popup);
    let fill = document.createElement("input");
    fill.type = "text";
    fill.placeholder = "enter server id";
    popup.appendChild(fill);
    popup.addEventListener("submit", (e)=>joinServer(e), false);
}

function joinServer(e) {
    e.preventDefault();
    let id = document.getElementById("popup").firstElementChild.value;
    console.log(id);
    //call subscribe to server
    let popup = document.getElementById("popup");
    body.removeChild(popup);
}


