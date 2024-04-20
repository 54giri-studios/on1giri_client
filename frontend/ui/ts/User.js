class UserBanner {
    constructor(name, connectionStatus, connectionMessage) {
        this.name = name;
        this.connectionStatus = connectionStatus;
        this.connectionMessage = connectionMessage;
    }

    display() {
        let bannerSuperWrapper = document.createElement("div");
        bannerSuperWrapper.className = "popupForm";
        bannerSuperWrapper.style.display = "flex";
        bannerSuperWrapper.addEventListener("click", async ()=>{
            bannerSuperWrapper.remove();
        });

        let bannerWrapper = document.createElement("div");
        bannerWrapper.className = "popupInnerWrapper";
        bannerWrapper.addEventListener("click", async (e)=>{
            e.stopPropagation();
        });
        bannerSuperWrapper.appendChild(bannerWrapper);

        let bannerTop = document.createElement("div");
        bannerTop.className = "bannerTop";
        let name = document.createElement("h2");
        name.innerText = this.name;
        let status = document.createElement("p");
        status.innerText = this.connectionMessage;
        bannerTop.appendChild(name);
        bannerTop.appendChild(status);

        bannerWrapper.appendChild(bannerTop);


        return bannerSuperWrapper;
    }
}

class UserButton {
    constructor(name, userId, connectionStatus, connectionMessage) {
        this.userId = userId;
        this.name = name;
        this.connectionStatus = connectionStatus;
        this.connectionMessage = connectionMessage;
    }

    display() {
        let button = document.createElement("div");
        button.className = "userButton";
        button.addEventListener("click", async ()=>this.displayBanner(this.name, this.connectionStatus, this.connectionMessage), false);

        let usernameWrapper = document.createElement("div");
        usernameWrapper.className = "usernameWrapper";
        let username = document.createElement("p");
        username.textContent = this.name;
        let connectionMsg = document.createElement("small");
        connectionMsg.textContent = this.connectionMessage;
        usernameWrapper.appendChild(username);
        usernameWrapper.appendChild(connectionMsg);

        button.appendChild(usernameWrapper);
        return button;
    }

    displayBanner(name, status, message) {
        let banner = new UserBanner(name, status, message);
        body.firstElementChild.appendChild(banner.display());
    }
}

