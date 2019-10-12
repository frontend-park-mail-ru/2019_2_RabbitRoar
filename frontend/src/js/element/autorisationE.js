import Template from './autorisationT.pug' 
import Bus from '../event_bus.js'
import {ROUTE_TO_EVENT} from '../modules/events.js' 
import {SIGN_IN, SIGN_UP, ROOT} from '../paths';
import {DomEventsWrapperMixin} from '../DomEventsWrapperMixin.js'

class AutorisationE {
    constructor() {
        if (!!AutorisationE.instance) {
            return AutorisationE.instance;
        }
        AutorisationE.instance = this;
        Object.assign(this, DomEventsWrapperMixin);

        return this;
    }

    create(root = document.getElementById('application')) {
        this.root = root;
        this.root.insertAdjacentHTML('beforeend', Template());
    }



    _exit_done() {}

    destroy() {}
}

export default new AutorisationE();