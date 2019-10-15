import ValidatorF from '../fasade/validatorF.js'
import { DomEventsWrapperMixin } from '../DomEventsWrapperMixin.js'


class NavbarC {
    constructor() {
        if (!!navbarC.instance) {
            console.log("ERROR: NavbarC must be import only ones");
            return navbarC.instance;
        }
        navbarC.instance = this;
        Object.assign(this, DomEventsWrapperMixin);

        this.registerHandler('nav_exit', 'click', this._exit.bind(this));
        this.registerHandler('nav_logo', 'click', this._mainMenu.bind(this));
        this.registerHandler('nav_login', 'click', this._login.bind(this));
        this.registerHandler('nav_registration', 'click', this._registration.bind(this));

        return this;
    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }


    _exit() {
        ValidatorF.setExit();
    }

    _mainMenu() {
        ValidatorF.setMainMenu();
    }

    _login() {
        ValidatorF.setLogin();
    }

    _registration() {
        ValidatorF.setRegistration();
    }

}

export default new NavbarC();