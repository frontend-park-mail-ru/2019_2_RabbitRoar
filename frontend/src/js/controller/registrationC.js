import userValidatorF from '../fasade/userValidatorF.js'
import { DomEventsWrapperMixin } from '../DomEventsWrapperMixin.js'

class RegistrationC {
    constructor(){
        if (!!RegistrationC.instance) {
            return RegistrationC.instance;
        }

        RegistrationC.instance = this;
        Object.assign(this, DomEventsWrapperMixin);

        this.registerHandler('registration', 'click', this._registration);

    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }

    _registration(){
        let user = {
            username: document.getElementById('login').value,
            password: document.getElementById('password').value,
            email: document.getElementById('email').value,
        };
        userValidator.doRegistration(user);
    }
}