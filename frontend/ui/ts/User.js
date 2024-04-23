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
    constructor(name, userId, connectionStatus, description) {
        this.userId = userId;
        this.name = name;
        this.connectionStatus = connectionStatus;
        this.description = description;
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

class roleBadge {
    constructor(name, color) {
        this.name = name;
        this.color = "red";
    }

    display() {
        let badge = document.createElement("div");
        badge.className = "roleBadge";

        let color = document.createElement("div");
        color.className = "roleColor";

        let name = document.createElement("p");
        name.classList = "roleName";
        name.textContent = this.name;

        badge.appendChild(color)
        badge.appendChild(name);

        return badge;
    }
}

class Member {
    constructor(user, roles) {
        this.user = user;
        this.roles = roles;
    }

    display(member) {
        let button = document.createElement("div");
        button.className = "memberButton";
        button.id = "member" + member.user.id;
        
        let lwrapper = document.createElement("div");
        lwrapper.className = "lwrapper";
        let rwrapper = document.createElement("div");
        rwrapper.className = "rwrapper";

        let pp = document.createElement("button");
        pp.className = "profilePicture";
        if (member.user.picture.length>0){
            pp.style.backgroundImage = `url(${member.user.picture})`;
        } else {
            let p = document.createElement("h2");
            p.textContent = parseInitials(member.user.username);
            pp.appendChild(p);
        }

        lwrapper.appendChild(pp);

        let username = document.createElement("p");
        username.className = "memberName";
        username.textContent = member.user.username
        username.style.color = "red" // should get color of first role
        rwrapper.appendChild(username)
        if (member.user.description.length>0) {
            let description = document.createElement("small");
            description.className = "connexionMessage"
            description.textContent = member.user.description;
            rwrapper.appendChild(description);
        }

        button.appendChild(lwrapper);
        button.appendChild(rwrapper);

        button.addEventListener("click", async (e)=>{
            await body.firstElementChild.appendChild(this.displayBanner(member));
        })

        return button;
    }

    displayBanner(member) {
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
        name.innerText = member.user.username;
        let status = document.createElement("p");
        status.innerText = member.user.description;
        bannerTop.appendChild(name);
        bannerTop.appendChild(status);

        bannerWrapper.appendChild(bannerTop);


        return bannerSuperWrapper;
    }
}

class User {
    constructor(id, username, discriminator, last_check_in, picture, creation_date, description) {
        this.id = id;
        this.username = username;
        this.discriminator = discriminator;
        this.last_check_in = last_check_in;
        this.picture = picture;
        this.creation_date = creation_date;
        this.description = description;
    }

    display(user) {
        let res = new UserBanner(user.username, "online", "kill me");
        body.firstElementChild.appendChild(res.display());
    }

    displayButton(user) {

    }
}
