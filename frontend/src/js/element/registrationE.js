import Template from "./templates/registrationT.pug"; 
import Bus from "../event_bus.js";
import RegistrationC from "../controller/registrationC.js";
import {ROUTE_TO_EVENT, REGISTRATION} from "../modules/events.js";
import {SIGN_IN, SIGN_UP, ROOT} from "../paths";
import {DomEventsWrapperMixin} from "../DomEventsWrapperMixin.js";

class RegistrationE {
    constructor() {
        this.controller = RegistrationC;
        
        //Bus.on(REGISTRATION, this._restartListener.bind(this));
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

    _restartListener() {
        this.destroy();
        this.create(this.root);
    }
}

export default new RegistrationE();