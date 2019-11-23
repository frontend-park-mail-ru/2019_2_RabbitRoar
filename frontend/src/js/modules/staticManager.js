class StaticManager {
    constructor() {
        this.base = window.location.origin;
        this.nginx = "https://svoyak.fun"
    }

    get chatAvatar() {
        return this.base + "/static/chat-logo.jpg";
    }

    get iframeUrl() {
        return this.nginx + "/chat";
    }

}

export default new StaticManager();