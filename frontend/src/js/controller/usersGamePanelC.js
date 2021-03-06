import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";

import Bus from "../event_bus.js";
import { ROUTER_EVENT } from "../modules/events.js";
import { ROOT } from "../paths";

class UsersGamePanelC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.registerHandler("button-ready", "click", this._sentUserReady);
        this.registerHandler("leave_logo", "click", this._leaveGame);

        this.registerClassHandler(".popup-button", "click", this._processPopup);
    }

    _showOrHidePopUp = (popupId = "popup") => {
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.classList.toggle("popup_show");
            return;
        }
    }

    _processPopup = (event) => {

        this._showOrHidePopUp("leave-popup");
        if (event.target.id === "continue") {
            Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
        }
    }

    _leaveGame = () => {
        console.log("in Leve id handler ");

        this._showOrHidePopUp("leave-popup");
    }
    
    startAllListeners = () => {
        this.enableAll();
    }

    disableAllListeners = () => {
        this.disableAll();
    }
}

export default new UsersGamePanelC();