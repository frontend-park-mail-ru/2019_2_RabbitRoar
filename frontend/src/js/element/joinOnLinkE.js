import Template from "./templates/joinOnLinkT.pug";
import JoinOnLinkC from "../controller/joinOnLinkC.js";

class JoinOnLinkE {
    constructor() {
        this.root = document.getElementById("application");
        this.controller = JoinOnLinkC;
        this.networkState = window.navigator.onLine;

    }

    _showOrHidePopUp = (popupId = "popup") => {
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.classList.toggle("popup_show");
            return;
        }
    }

    create(root = document.getElementById("application")) {
        this.root = root;

        const params = window.location.search.replace("?", "").split("&").reduce(
            (accum, current) => {
                const keyVal = current.split("=");
                accum[keyVal[0]] = keyVal[1];
                return accum;
            },
            {}
        );        

        this.root.insertAdjacentHTML("beforeend", Template());
        this.controller.startAllListeners();

        if (!params.UUID) {
            this._showOrHidePopUp("popup_not_exist_join_link");
            return;
        }

        const joinBtn = document.getElementById("link_join");
        if (joinBtn) {
            joinBtn.setAttribute("link", params.UUID);
        }
    }


    destroy = () => {
        this.controller.disableAllListeners();
        this.root.innerHTML = "";
    }
}

export default new JoinOnLinkE();