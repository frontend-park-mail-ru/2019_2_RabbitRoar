import Template from './navbarT.pug'
import Bus from '../event_bus.js'
import {NAVBAR_EVENT} from '../modules/events.js' 
import ValidatorF from '../fasade/userValidatorF.js'
import NavbarC from '../controller/navbarC.js'

class NavbarE {
    constructor() {
        if (!!NavbarE.instance) {
            return NavbarE.instance;
        }
        NavbarE.instance = this;
        this.controller = NavbarC;

        return this;
    }

    create(root = document.getElementById('application')) {
        this.root = root;

        const autorised = ValidatorF.getUserAutorise();

        this.root.insertAdjacentHTML('beforeend', Template({ autorised: autorised }));
        this.controller.start();
    }



    destroy() {
        this.controller.drop();
        this.root.innerHTML = '';
    }
}

export default new NavbarE();