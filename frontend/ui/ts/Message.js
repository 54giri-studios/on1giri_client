class Message {
    constructor(content, date, author, id) {
        this.content = content;
        this.author = author; // struct user 
        this.date = date;
        this.author = author;
        this.id = id;
    }

    display() {
        let associatedMemberButton = document.getElementById("member" + this.author.id);
        
        let messageBox = document.createElement("div");
        messageBox.className = "message";
        messageBox.id = "message" + this.id;
        messageBox.setAttribute("date", this.date);
        messageBox.setAttribute("authorId", this.author.id);
        
        let rightWrapper = document.createElement("div"); // this section contains metadata (usrname, date) and content
        rightWrapper.className = "messageRWrapper";
        let leftWrapper = document.createElement("div"); //this section contains PP and simple time
        leftWrapper.className = "messageLWrapper";
        
        let infoBox = document.createElement("div");
        infoBox.className = "messageMetadata";
        
        let username = document.createElement("div");
        username.className = "username";
        username.style.color = associatedMemberButton.querySelector(".memberName").style.color;
        username.innerText = this.author.username;
        username.addEventListener("click", ()=> associatedMemberButton.click(), false);
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

        rightWrapper.appendChild(infoBox);
        rightWrapper.appendChild(content);

        
        let pp = document.createElement("button");
        pp.className = "profilePicture";
        if (this.author.picture.length>0){
            pp.style.backgroundImage = `url(${this.picture})`;
        } else {
            let p = document.createElement("h2");
            p.textContent = parseInitials(this.author.username);
            pp.appendChild(p);
        }
        pp.addEventListener("click", ()=> associatedMemberButton.click(), false);

        
        let simpleTime = document.createElement("small");
        simpleTime.className = "simpleDate";
        simpleTime.textContent = `${String(this.date.getHours()).padStart(2, 0)}:${String(this.date.getMinutes()).padStart(2, 0)}`;
        simpleTime.style.display = "none";
        
        leftWrapper.appendChild(pp);
        leftWrapper.appendChild(simpleTime);
        
        messageBox.appendChild(leftWrapper);
        messageBox.appendChild(rightWrapper);
        
        
        this.insertIntoConv(messageBox);
    }

    async getAuthorInfo(id) {
        invoke("get_user_info", {userId:id, token:getCookieValue("TOKEN")}).then(async (result)=>{
            let banner = new UserBanner(result.content.name, result.content.connectionStatus, result.content.connectionMessage);
            body.firstElementChild.appendChild(banner.display());
        }).catch(async (result)=>{
            console.log("could not get user info");
        })
    }


    insertIntoConv(messageBloc) {
        let current = chat.lastElementChild;
        while (current != undefined && this.isOlder(messageBloc, current)) {
            current = current.previousSibling;
        }
        if (current == undefined) {
            //we've reached the top of the page
            chat.prepend(messageBloc);
        } else {
            // we've found a place to insert it
            
            current.after(messageBloc);
        }
        if (messageBloc.nextSibling!=undefined && messageBloc.nextSibling.getAttribute("authorid") == messageBloc.getAttribute("authorid")) {
            messageBloc.nextSibling.querySelector(".messageRWrapper>.messageMetadata").style.display = "none";
            messageBloc.nextSibling.querySelector(".messageLWrapper>.profilePicture").style.display = "none";
            messageBloc.nextSibling.querySelector(".messageLWrapper>.simpleDate").style.display = "block";
        }
        if (messageBloc.previousSibling!=undefined && messageBloc.previousSibling.getAttribute("authorid") == messageBloc.getAttribute("authorid")) {
            messageBloc.querySelector(".messageRWrapper>.messageMetadata").style.display = "none";
            messageBloc.querySelector(".messageLWrapper>.profilePicture").style.display = "none";
            messageBloc.querySelector(".messageLWrapper>.simpleDate").style.display = "block";
        }
        
    }

    isOlder(node1, node2) {
        let date1 = new Date(node1.getAttribute("date"));
        let date2 = new Date(node2.getAttribute("date"));
        return date1<date2;
    }
}

async function fetchMoreMsg(channelid, msgDate) {
    // call to get_message
    invoke("get_latest_messages", {channelId:channelid, amount:30, before:msgDate, token:getCookieValue("TOKEN")}).then(async (result)=> {
        console.log("more!!!!", result)
        for (const message of result.content) {
            let author = new User(message.author.id,
                                 message.author.username,
                                 message.author.discriminator,
                                 message.author.last_check_in,
                                 message.author.picture,
                                 message.author.creation_date,
                                 message.author.description);
            let content = message.content;
            let date = new Date(message.creation_date);
            let id = message.id;
            if (document.getElementById("message"+id)!=undefined) {
                continue;
            }
            new Message(content, date, author, id).display();
            scrollDown();
        }
    }).catch((result)=>{
        console.log("failed to get more",result);
    })
}
