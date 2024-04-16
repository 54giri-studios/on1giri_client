class UserBanner {
    constructor(name, connectionStatus, connectionMessage) {
        this.name = name;
        this.connectionStatus = connectionStatus;
        this.connectionMessage = connectionMessage;
    }

    display() {
        let bannerSuperWrapper = document.createElement("div");
        bannerSuperWrapper.className = "popupForm";

        let bannerWrapper = document.createElement("div");
        bannerWrapper.className = "popupInnerWrapper";

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
        button.addEventListener("click", this.displayBanner, false);
        return button;
    }

    displayBanner() {
        let banner = new UserBanner(this.name, this.connectionStatus, this.connectionMessage);
        document.appendChild(banner.display());
    }
}

