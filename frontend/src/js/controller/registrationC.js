import userValidatorF from "../fasade/userValidatorF.js";
import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import { registrationValidation } from "../modules/form_validation.js";


class RegistrationC {
    constructor() {
        if (!!RegistrationC.instance) {
            return RegistrationC.instance;
        }

        RegistrationC.instance = this;
        Object.assign(this, DomEventsWrapperMixin);
        this.registerHandler("registration", "click", this._registration.bind(this));
    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }

    _registration() {
        const errorPasswordElement = document.getElementById("error_password");
        const errorUsernameElement = document.getElementById("error_username");
        const errorEmailElement = document.getElementById("error_email");

        let registrationError = registrationValidation(errorPasswordElement, errorUsernameElement, errorEmailElement);

        if (registrationError) {
            return;
        }

        let user = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
            email: document.getElementById("email").value,
        };
        userValidator.doRegistration(user);
    }
}

export default new RegistrationC();
