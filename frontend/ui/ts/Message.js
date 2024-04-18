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
        let dateWrapper = document.createElement("div");
        dateWrapper.className = "dateWrapper";
        let date = document.createElement("small");
        date.className = "date";
        date.innerText = this.date;
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

    async getAuthorInfo() {
        
    }
}