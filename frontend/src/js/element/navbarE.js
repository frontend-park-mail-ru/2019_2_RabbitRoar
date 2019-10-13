import Template from './navbarT.pug'
import Bus from '../event_bus.js'
import {NAVBAR_EVENT} from '../modules/events.js' 
import { SIGN_IN, SIGN_UP, ROOT } from '../paths';
import { DomEventsWrapperMixin } from '../DomEventsWrapperMixin.js'

class NavbarE {
    constructor() {
        if (!!NavbarE.instance) {
            return NavbarE.instance;
        }
        NavbarE.instance = this;
        Object.assign(this, DomEventsWrapperMixin);


        this.registerEventsChain('nav_exit', 'click', NAVBAR_EVENT.CLICK_EXIT, this._exit.bind(this));
        this.registerEventsChain('nav_logo', 'click', NAVBAR_EVENT.CLICK_MAIN_MENU, this._mainMenu.bind(this));
        this.registerCallback('nav_login', 'click', this._login.bind(this));
        this.registerCallback('nav_registration', 'click', this._registration.bind(this));

        return this;
    }

    create(root = document.getElementById('application')) {
        this.root = root;
        const data = {
            callback: this._render.bind(this)
        }
        Bus.emit(NAVBAR_EVENT.GET_AUTORISE, data);
    }


    _render(autorised = false) {
        this.disableAll();
        this.root.insertAdjacentHTML('beforeend', Template({ autorised: autorised }));
        this.enableAll();
    }

    _exit() {
        Bus.emit(NAVBAR_EVENT.ROUTE_TO, SIGN_IN);
    }

    _mainMenu() {
        Bus.emit(NAVBAR_EVENT.ROUTE_TO, ROOT);
    }

    _login() {
        Bus.emit(NAVBAR_EVENT.ROUTE_TO, SIGN_IN);
    }

    _registration() {
        Bus.emit(NAVBAR_EVENT.ROUTE_TO, SIGN_UP);
    }



    destroy() {
        this.disableAll();
    }
}

export default new NavbarE();