class Message {
    constructor(content, date, author, id) {
        this.content = content;
        this.author = author; // struct user
        this.date = date;
        this.author = author;
        this.id = id;
    }

    display() {
        let messageBox = document.createElement("div");
        messageBox.className = "message";
        messageBox.id = "message" + this.id;


        let infoBox = document.createElement("div");
        infoBox.className = "messageMetadata";

        let username = document.createElement("div");
        username.className = "username";
        username.innerText = this.author.username;
        username.addEventListener("click", async ()=>await this.author.display(this.author), false);
        let dateWrapper = document.createElement("div");
        dateWrapper.className = "dateWrapper";
        let date = document.createElement("small");
        date.className = "date";
        if (this.date.getDay()==new Date(Date.now()).getDay()){

            date.innerText = this.date.toLocaleTimeString();
        } else {
            date.innerText = this.date.toLocaleDateString();
        }
        dateWrapper.appendChild(date);

        infoBox.appendChild(username);
        infoBox.appendChild(dateWrapper);


        let content = document.createElement("p");
        content.className = "messageContent"
        content.textContent = this.content;

        messageBox.appendChild(infoBox);
        messageBox.appendChild(content);
        

        return messageBox;
    }

    async getAuthorInfo(id) {
        invoke("get_user_info", {userId:id, token:getCookieValue("TOKEN")}).then(async (result)=>{
            console.log(result);
            let banner = new UserBanner(result.content.name, result.content.connectionStatus, result.content.connectionMessage);
            body.firstElementChild.appendChild(banner.display());
        }).catch(async (result)=>{
            console.log(result);
        })
    }
}