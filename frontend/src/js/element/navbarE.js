import Template from './navbarT.pug'
import Bus from '../event_bus.js'
import {
    GET_AUTORISE_EVENT,
    USER_EXIT_EVENT,
    ROUTE_TO_EVENT,
    USER_MAIN_MENU_EVENT,
    USER_LOGIN_EVENT,
    USER_REG_EVENT
}
    from '../modules/events.js'
import { SIGN_IN, SIGN_UP, ROOT } from '../paths';
import { DomEventsWrapperMixin } from '../DomEventsWrapperMixin.js'

class NavbarE {
    constructor() {
        if (!!NavbarE.instance) {
            return NavbarE.instance;
        }
        NavbarE.instance = this;
        Object.assign(this, DomEventsWrapperMixin);


        this.registerDefaultEventListener('nav_exit', 'click', USER_EXIT_EVENT, this._exit.bind(this));
        this.registerDefaultEventListener('nav_logo', 'click', USER_MAIN_MENU_EVENT, this._mainMenu.bind(this));
        this.registerDefaultEventListener('nav_login', 'click', USER_LOGIN_EVENT, this._login.bind(this));
        this.registerDefaultEventListener('nav_registration', 'click', USER_REG_EVENT, this._registration.bind(this));

        return this;
    }

    create(root = document.getElementById('application')) {
        this.root = root;
        Bus.emit(GET_AUTORISE_EVENT, this._render.bind(this));
    }


    _render(autorised = false) {
        this.disableAll();
        this.root.insertAdjacentHTML('beforeend', Template({ autorised: autorised }));
        this.enableAll();
    }

    _exit() {
        Bus.emit(ROUTE_TO_EVENT, SIGN_IN);
    }

    _mainMenu() {
        Bus.emit(ROUTE_TO_EVENT, ROOT);
    }

    _login() {
        Bus.emit(ROUTE_TO_EVENT, SIGN_IN);
    }

    _registration() {
        Bus.emit(ROUTE_TO_EVENT, SIGN_UP);
    }



    destroy() {
        this.disableAll();
    }
}

export default new NavbarE();