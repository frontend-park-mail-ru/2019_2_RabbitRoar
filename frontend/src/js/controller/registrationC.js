import userValidatorF from "../fasade/userValidatorF.js";
import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import { registrationValidation } from "../modules/form_validation.js";
import Bus from "../event_bus.js";
import { ROOT } from "../paths.js";
import { ROUTER_EVENT } from "../modules/events.js";



class RegistrationC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
        this.registerHandler("registration", "click", this._registration);
    }

    startAllListeners = () => {
        this.enableAll();
    }

    disableAllListeners = () => {
        this.disableAll();
    }

    _registration = () => {
        const registrationError = registrationValidation();
        if (registrationError) {
            return;
        }

        let user = {
            "username": document.getElementById("username").value,
            "password": document.getElementById("password").value,
            "email": document.getElementById("email").value,
        };
        userValidatorF.doRegistration(user);
    }
}

export default new RegistrationC();
