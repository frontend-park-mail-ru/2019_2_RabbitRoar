import ValidatorF from '../fasade/userValidatorF.js'
import Bus from '../event_bus.js'
import {ROUTER_EVENT} from '../modules/events.js' 
import { LOGIN, SIGN_UP } from '../paths';
import { DomEventsWrapperMixin } from '../DomEventsWrapperMixin.js'


class AutorisationC {
    constructor() {
        if (!!AutorisationC.instance) {
            console.log("ERROR: AutorisationC must be import only ones");
            return AutorisationC.instance;
        }
        AutorisationC.instance = this;
        Object.assign(this, DomEventsWrapperMixin);

        this.registerHandler('autorisation', 'click', _autorise);

        return this;
    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }


    _autorise() {
        const username = document.getElementById('login').value;
        const password = document.getElementById('password').value;
        ValidatorF.doAutorise(username, password);
    }


}

export default new AutorisationC();