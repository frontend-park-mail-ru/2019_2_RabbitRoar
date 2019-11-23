import ValidatorF from "../fasade/userValidatorF.js";
import Bus from "../event_bus.js";
import { ROUTER_EVENT } from "../modules/events.js";
import { LOGIN, SIGN_UP, ROOT, PROFILE } from "../paths";
import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";

import StaticManager from "../modules/staticManager.js";


class NavbarC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.registerHandler("nav_exit", "click", ValidatorF.doExit);
        this.registerHandler("nav_logo", "click", this._routeToMainMenu);
        this.registerHandler("nav_login", "click", this._routeToLogin);
        this.registerHandler("nav_registration", "click", this._routeToSignUp);
        this.registerHandler("nav_profile", "click", this._routeToProfile);

        this.registerHandler("chat_bar", "mouseover", this._chatFocus);
        this.registerHandler("chat_bar", "mouseout", this._chatFocus);

        this.registerHandler("chat_icon", "click", this._chatClick);
        return this;
    }

    _chatFocus = () => {
        const chatBar = document.getElementById("chat_bar");
        if (chatBar) {
            chatBar.classList.toggle("chat-bar-show");
        }
    }

    _chatClick = () => {
        const iframe = document.getElementById("chat_iframe");
        if (iframe.src === "") {
            iframe.src = StaticManager.iframeUrl;
        }
        iframe.classList.toggle("iframe_show");
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
        if (ValidatorF.checkLocalstorageAutorization()) {
            Bus.emit(ROUTER_EVENT.ROUTE_TO, PROFILE);
        }
    }

}

export default new NavbarC();