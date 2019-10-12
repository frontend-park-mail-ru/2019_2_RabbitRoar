import Template from './navbarT.pug' 
import Bus from '../event_bus.js'
import {
    GET_AUTORISE_EVENT,
    AUTORISE_DONE_EVENT,
    USER_EXIT_EVENT,
    EXIT_DONE_EVENT,
    ROUTE_TO_EVENT}
from '../modules/events.js' 
import {SIGN_IN, SIGN_UP, ROOT} from '../paths';
import {DomEventsWrapperMixin} from '../DomEventsWrapperMixin.js'

class NavbarE {
    constructor() {
        if (!!NavbarE.instance) {
            return NavbarE.instance;
        }
        NavbarE.instance = this;
        Object.assign(this, DomEventsWrapperMixin);

        
        this.registerDefaultEventListener('nav_exit', 'click', USER_EXIT_EVENT);
        this.registerDefaultEventListener('nav_logo', 'click', ROUTE_TO_EVENT, ROOT);
        // this.DomEventManager.registerDefaultEventListener('nav_login', 'click', USER_EXIT_EVENT);
        // this.DomEventManager.registerDefaultEventListener('nav_registration', 'click', USER_EXIT_EVENT);

        Bus.on(AUTORISE_DONE_EVENT, this._render.bind(this));
        Bus.on(EXIT_DONE_EVENT, this._exit_done.bind(this));
        return this;
    }

    create(root = document.getElementById('application')) {
        this.root = root;
        Bus.emit(GET_AUTORISE_EVENT);
    }


    //AUTORISE_DONE_EVENT
    _render(data = {autorised: false}) {
        this.disableAll();
        this.root.insertAdjacentHTML('beforeend', Template({autorised: data.autorised}));
        this.enableAll();
    }

    //EXIT_DONE_EVENT
    _exit_done() {
        Bus.emit(ROUTE_TO_EVENT, SIGN_IN);
    }




    destroy() {
        this.disableAll();
        Bus.off(AUTORISE_DONE_EVENT, this._render.bind(this));
        Bus.off(EXIT_DONE_EVENT, this._render.bind(this));
    }
}

export default new NavbarE();