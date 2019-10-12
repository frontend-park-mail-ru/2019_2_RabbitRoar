import Template from './registrationT.pug' 
import Bus from '../event_bus.js'
import {ROUTE_TO_EVENT} from '../modules/events.js' 
import {SIGN_IN, SIGN_UP, ROOT} from '../paths';
import {DomEventsWrapperMixin} from '../DomEventsWrapperMixin.js'

class RegistrationE {
    constructor() {
        if (!!RegistrationE.instance) {
            return RegistrationE.instance;
        }
        RegistrationE.instance = this;
        Object.assign(this, DomEventsWrapperMixin);

        return this;
    }

    create(root = document.getElementById('application')) {
        this.root = root;
        this.root.insertAdjacentHTML('beforeend', Template());
    }


    destroy() {}
}

export default new RegistrationE();