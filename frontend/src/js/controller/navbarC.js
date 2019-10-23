import ValidatorF from "../fasade/userValidatorF.js";
import Bus from "../event_bus.js";
import { ROUTER_EVENT } from "../modules/events.js";
import { LOGIN, SIGN_UP, ROOT, PROFILE } from "../paths";
import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";


class NavbarC {
    constructor() {
        if (!!NavbarC.instance) {
            console.log("ERROR: NavbarC must be import only ones");
            return NavbarC.instance;
        }
        NavbarC.instance = this;
        Object.assign(this, DomEventsWrapperMixin);

        this.registerHandler("nav_exit", "click", ValidatorF.doExit);
        this.registerHandler("nav_logo", "click", this._routeToMainMenu);
        this.registerHandler("nav_login", "click", this._routeToLogin);
        this.registerHandler("nav_registration", "click", this._routeToSignUp);
        this.registerHandler("nav_profile", "click", this._routeToProfile);

        return this;
    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }


    _routeToLogin() {
        Bus.emit(ROUTER_EVENT.ROUTE_TO, LOGIN);
    }

    _routeToSignUp() {
        Bus.emit(ROUTER_EVENT.ROUTE_TO, SIGN_UP);
    }

    _routeToMainMenu() {
        Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
    }

    _routeToProfile() {
        if (ValidatorF.getUserAutorise()) {
            Bus.emit(ROUTER_EVENT.ROUTE_TO, PROFILE);
        }
    }

}

export default new NavbarC();