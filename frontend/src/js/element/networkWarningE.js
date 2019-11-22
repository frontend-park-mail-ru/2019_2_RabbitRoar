import Template from "./templates/networkWarningT.pug";
import NetworkWarningC from "../controller/networkWarningC.js";
import ValidatorF from "../fasade/userValidatorF.js";

class NetworkWarningE {
    constructor() {
        this.root = document.getElementById("application");
        this.controller = NetworkWarningC;
        this.networkState = window.navigator.onLine;
    }


    create(root = document.getElementById("application")) {
        this.root = root;

        this.root.insertAdjacentHTML("beforeend", Template({ online: window.navigator.onLine }));
        this.controller.start();

        this.timerId = setInterval(this._checkNetwork, 1000);
    }

    _checkNetwork = () => {
        if (this.networkState !== window.navigator.onLine) {
            this.networkState = window.navigator.onLine;
            const warning = document.getElementById("warning");
            if (warning) {
                warning.classList.toggle("warning_show");
            }
        }
    }

    destroy = () => {
        clearInterval(this.timerId);
        this.controller.drop();
        this.root.innerHTML = "";
    }
}

export default new NetworkWarningE();