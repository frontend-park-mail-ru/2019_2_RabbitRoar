class StaticManager {
    constructor() {
        this.base = window.location.origin;
        this.nginx = "https://svoyak.fun"
    }

    get chatAvatar() {
        return this.base + "/static/chat-logo.jpg";
    }

    getIframeUrl(opt = "nginx") {
        if (opt === "nginx") {
            return this.nginx + "/chat";
        } else {
            return "https://localhost:8081/chat";
        }
    }

}

export default new StaticManager();