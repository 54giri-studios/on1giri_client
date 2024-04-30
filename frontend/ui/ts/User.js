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
    constructor(name, color, id) {
        this.name = name;
        this.color = color;
    }

    display() {
        let badge = document.createElement("div");
        badge.className = "roleBadge";
        

        let color = document.createElement("span");
        color.className = "roleColor";
        color.style.background = this.color;

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
        if (this.roles.length>0) {
            username.style.color = this.roles[0].color;
        } else {
            username.style.color = "white";
        }
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
        if (this.roles.length>0) {
            name.style.color = this.roles[0].color;
        } else {
            name.style.color = "white";
        }
        let status = document.createElement("p");
        status.innerText = member.user.description;
        bannerTop.appendChild(name);
        bannerTop.appendChild(status);

        let bannerRoles = document.createElement("div");
        bannerRoles.className = "rolePool";
        for (const role of member.roles) {
            let Role = new roleBadge(role.name, role.color);
            bannerRoles.appendChild(Role.display());
        }
        let newRoleButton = document.createElement("button");
        newRoleButton.textContent = "add role";
        newRoleButton.addEventListener("click", async (e)=>{
            bannerSuperWrapper.style.display = "none";
            await createRole(e);
        })
        bannerRoles.appendChild(newRoleButton);


        bannerWrapper.appendChild(bannerTop);
        bannerWrapper.appendChild(bannerRoles);

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

async function createRole(e) {
    e.preventDefault();
    let formWrapper = document.getElementById("role-create-form");
    formWrapper.style.display = "flex";
    formWrapper.addEventListener("click", ()=>formWrapper.style.display = "none");
    formWrapper.firstElementChild.addEventListener("click", (e)=>e.stopPropagation());
    let form = formWrapper.firstElementChild.firstElementChild.nextElementSibling;
    form.addEventListener("submit", async (e)=>{
        e.preventDefault();
        let name = form.querySelector("#name").value;
        let color = form.querySelector("#color").value;
        if (color=="" || name=="") {
            form.style.border = "2px solid red";
            return;
        }
        form.querySelector("#name").value = "";
        form.querySelector("#color").value = "";
        let canRead = form.querySelector("#can-read").checked;
        
        let canWrite = form.querySelector("#can-write").checked;
        console.log(canRead, canWrite)
        let channelid = parseInt(document.getElementsByClassName("channel-selected")[0].getAttribute("channelid"));
        let serverid = parseInt(document.getElementsByClassName("server-selected")[0].getAttribute("serverid"));
        await createRoleSubmit(name, color, channelid, serverid, canRead, canWrite);
        formWrapper.style.display = "none";
    })
}

async function createRoleSubmit(name, color, channelid, serverid, canRead, canWrite) {
    //should invoke rust command
}
