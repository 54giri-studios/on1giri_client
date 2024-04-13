
function joinServer(e) {
    e.preventDefault();
    let serverForm = document.getElementById("form-wrapper");
    serverForm.parentElement.style.display = "flex";
    serverForm.firstElementChild.firstElementChild.style.borderColor = "rgb(80, 80, 80)";
    serverForm.firstElementChild.firstElementChild.value = "";
    //call subscribe to server
    serverForm.firstElementChild.addEventListener("submit", async (e)=>await joinServerSubmit(e), false);
    serverForm.firstElementChild.addEventListener("click", async (e)=>e.stopPropagation(), false);
    serverForm.firstElementChild.firstElementChild.addEventListener("click", async (e)=>e.stopPropagation(), false);
    serverForm.firstElementChild.lastElementChild.addEventListener("click", async (e)=>e.stopPropagation(), false);
    serverForm.parentElement.addEventListener("click", (e)=>{
        e.preventDefault();
        serverForm.parentElement.style.display="none";
    }, false);
    serverForm.lastElementChild.firstElementChild.addEventListener("click", (e)=>e.stopPropagation(), false);
}

async function joinServerSubmit(e) {
    e.preventDefault();
    let serverForm = document.getElementById("form-wrapper");
    let id = parseInt(serverForm.firstElementChild.firstElementChild.value);
    if (isNaN(id)){
        console.log("invalid input");
        serverForm.firstElementChild.firstElementChild.style.borderColor = "red";
    } else {
        invoke("add_user_to_guild", {guildId: id, userId:0}).then((response) => {
            loadServerButtons();
        }).catch((response)=>{
            console.log(response)
        })
    }
    e.stopPropagation();
}
