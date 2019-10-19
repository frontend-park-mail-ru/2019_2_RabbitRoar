import Template from "./templates/registrationT.pug"; 
import Bus from "../event_bus.js";
import {ROUTE_TO_EVENT} from "../modules/events.js";
import {SIGN_IN, SIGN_UP, ROOT} from "../paths";
import {DomEventsWrapperMixin} from "../DomEventsWrapperMixin.js";

class RegistrationE {
    constructor() {
        if (!!RegistrationE.instance) {
            return RegistrationE.instance;
        }
        RegistrationE.instance = this;

        return this;
    }

    create(root = document.getElementById("application")) {
        this.root = root;
        this.root.insertAdjacentHTML("beforeend", Template());
        this.controller.start();
    }


    destroy() {
        this.controller.drop();
        this.root.innerHTML = "";
    }
}

export default new RegistrationE();