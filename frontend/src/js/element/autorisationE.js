import Template from './autorisationT.pug' 
import Bus from '../event_bus.js'
import {AUTORISATION_EVENT} from '../modules/events.js' 
import {SIGN_IN, SIGN_UP, ROOT} from '../paths';
import {DomEventsWrapperMixin} from '../DomEventsWrapperMixin.js'

class AutorisationE {
    constructor() {
        if (!!AutorisationE.instance) {
            return AutorisationE.instance;
        }
        AutorisationE.instance = this;
        Object.assign(this, DomEventsWrapperMixin);

        userInput = {login: 'Kekos', password: 'qwerty', callback: this._login.bind(this)};
        // TO_DO: Написать модуль, который предоставляет конструкторы для объектов и умеет с ними работать.
        this.registerDefaultEventListener('autorisation', 'click', AUTORISATION_EVENT.USER_SIGNIN, userInput);


        return this;
    }

    create(root = document.getElementById('application')) {
        this.root = root;
        this.root.insertAdjacentHTML('beforeend', Template());
    }

    _login(autorised = false) {
        if (autorised) {
            Bus.emit(ROUTE_TO_EVENT, ROOT);
        }
    }


    _exit_done() {}

    destroy() {}
}

export default new AutorisationE();