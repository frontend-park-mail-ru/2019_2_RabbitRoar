import { HttpsOrigin } from "../paths.js"

class StaticManager {
    constructor() {
        this.base = window.location.origin;
        this.nginx = HttpsOrigin;

        this.userDefaultAvatar = "/static/default-logo.png";

        this.ranks = [
            {
                name: "Новичок",
                score: 0,
                file: "novichok-rank.jpg"
            },
            {
                name: "Любитель",
                score: 2000,
                file: "lubitel-rank.jpg"
            },
            {
                name: "Бывалый",
                score: 5000,
                file: "bivaliy-rank.jpg"
            },
            {
                name: "Знаток",
                score: 10000,
                file: "znatok-rank.jpg"
            },
            {
                name: "Гений",
                score: 20000,
                file: "genius-rank.jpg"
            },
            {
                name: "Сверхразум",
                score: 50000,
                file: "sverhrazum-rank.jpg"
            },
            {
                name: "Вассерман",
                score: 100000,
                file: "vasserman-rank.png"
            },
        ]
    }

    get chatAvatar() {
        return this.base + "/static/chat-logo.png";
    }

    get leaveLogo() {
        return this.base + "/static/leave.svg";
    }

    get exitLogo() {
        return this.base + "/static/exit.svg";
    }

    get hostIcon() {
        return this.base + "/static/host-icon.png";
    }

    getIframeUrl() {
        if (this.base === this.nginx) {
            return this.nginx + "/chat";
        } else {
            return "https://svoyak.fun/chat";
        }
    }

    getRank(score) {
        let userRank = Object.assign({}, this.ranks[0]);

        for (const rank of this.ranks) {
            if (score >= rank.score) {
                userRank = Object.assign({}, rank);
            }
        }

        if (this.base === this.nginx) {
            userRank.file = this.nginx + "/static/" + userRank.file;
        } else {
            userRank.file = this.base + "/static/" + userRank.file;
        }
        return userRank;
    }

    getUserUrl(url = "") {
        if (url === "") {
            if (this.base === this.nginx) {
                return this.nginx + this.userDefaultAvatar;
            } else {
                return this.base + this.userDefaultAvatar;
            }
        } else {
            return this.nginx + url;
        }
    }

}

export default new StaticManager();