class Message {
    constructor(content, date, authorName, authorId) {
        this.content = content;
        this.authorName = authorName;
        this.date = date;
        this.authorId = authorId;
    }

    display() {
        let messageBox = document.createElement("div");
        messageBox.className = "message";


        let infoBox = document.createElement("div");
        infoBox.className = "messageMetadata";

        let username = document.createElement("div");
        username.className = "username";
        username.innerText = this.authorName;
        username.addEventListener("click", async ()=>await this.getAuthorInfo(), false);
        let date = document.createElement("small");
        date.className = "date";
        date.innerText = this.date;

        infoBox.appendChild(username);
        infoBox.appendChild(date);


        let content = document.createElement("p");
        content.className = "messageContent"
        content.textContent = this.content;

        return messageBox;
    }

    async getAuthorInfo() {

    }
}