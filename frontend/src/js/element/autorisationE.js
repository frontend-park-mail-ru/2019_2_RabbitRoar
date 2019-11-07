import Template from "./templates/autorisationT.pug"; 
import Bus from "../event_bus.js";
import {AUTORISATION_EVENT} from "../modules/events.js"; 
import {ROOT} from "../paths";
import {DomEventsWrapperMixin} from "../DomEventsWrapperMixin.js";
import AutorisationC from "../controller/autorisationC";


class AutorisationE {
    constructor() {
        this.controller = AutorisationC;
    }

    create(root = document.getElementById("application")) {
        this.root = root;
        this.root.insertAdjacentHTML("beforeend", Template());
        this.controller.start();
    }

    _signIn(autorised = false) {
        if (autorised) {
            Bus.emit(AUTORISATION_EVENT.ROUTE_TO, ROOT);
        } else {
            console.log("autorisationE._signIn: AUTORISE ERROR");
        }
    }

    _inputCollector() {
        const username = document.getElementById("login").value;
        const password = document.getElementById("password").value;
        const data = {
            username: username,
            password: password
        };
        return data;
    }


    destroy() {
        this.controller.drop();
        this.root.innerHTML = "";
    }
}

export default new AutorisationE();