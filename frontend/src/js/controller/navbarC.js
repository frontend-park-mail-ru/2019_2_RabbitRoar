import ValidatorF from "../fasade/userValidatorF.js";
import Bus from "../event_bus.js";
import { ROUTER_EVENT } from "../modules/events.js";
import { LOGIN, SIGN_UP, ROOT, PROFILE } from "../paths";
import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";

import StaticManager from "../modules/staticManager.js";


class NavbarC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.chat = false;

        this.registerHandler("nav_exit", "click", ValidatorF.doExit);
        this.registerHandler("nav_logo", "click", this._routeToMainMenu);
        this.registerHandler("nav_login", "click", this._routeToLogin);
        this.registerHandler("nav_registration", "click", this._routeToSignUp);
        this.registerHandler("nav_profile", "click", this._routeToProfile);



        this.registerHandler("chat_bar", "mouseover", this._chatFocus);
        this.registerHandler("chat_bar", "mouseout", this._chatFocus);
        this.registerHandler("chat_bar", "click", this._chatClick);

        this.registerHandler("application", "click", this._chatOff, false);


        this.registerHandler("help_bar", "mouseover", this._helpFocus);
        this.registerHandler("help_bar", "mouseout", this._helpFocus);
        this.registerHandler("help_bar", "click", this._showOrHidePopUpInfo);

        this.registerHandler("info-ok", "click", this._showOrHidePopUpInfo);


        this.registerHandler("back", "click", this._goToRoot);
    }

    _chatOff = () => {
        if (this.chat) {
            const iframe = document.getElementById("chat_iframe");
            iframe.className = "iframe";
            this.chat = false;
        }
    }


    _showOrHidePopUpInfo = () => {
        const popupInfo = document.getElementById("info-popup");
        if (popupInfo) {
            popupInfo.classList.toggle("popup_show");
            return;
        }
    }

    _goToRoot = () => {
        const createRoomE = document.getElementById("CreateRoomE");
        const createPackE = document.getElementById("CreatePackE");

        if (!createRoomE && !createPackE) {
            Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
        }
    }

    _helpFocus = () => {
        const helpBar = document.getElementById("help_bar");
        if (helpBar) {
            helpBar.classList.toggle("help__help-bar-show");
        }
    }


    _chatFocus = () => {
        const chatBar = document.getElementById("chat_bar");
        if (chatBar) {
            chatBar.classList.toggle("chat-bar-show");
        }
    }

    _chatClick = (event) => {
        const iframe = document.getElementById("chat_iframe");
        if (iframe.src === "") {
            iframe.src = StaticManager.getIframeUrl();
        }
        iframe.classList.toggle("iframe_show");

        if (this.chat) {
            this.chat = false;
        } else {
            this.chat = true;
        }

        event.stopPropagation();
    }

    startAllListeners() {
        this.enableAll();
    }

    disableAllListeners() {
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