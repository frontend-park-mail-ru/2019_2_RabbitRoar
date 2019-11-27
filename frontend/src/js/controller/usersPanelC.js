import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import WebSocketIface from "../modules/webSocketIface.js"
import Bus from "../event_bus.js";
import { ROUTER_EVENT } from "../modules/events.js";
import { ROOT } from "../paths";


class UsersPanelC {
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
        this._showOrHidePopUp("leave-popup");
    }
    

    _sentUserReady = () => {
        console.log("user ready sending");
        const body = JSON.stringify({
            "type": "player_ready_front",
        });
        WebSocketIface.sentMessage(body);
    }
    
    startAllListeners = () => {
        this.enableAll();
    }

    disableAllListeners = () => {
        this.disableAll();
    }
}

export default new UsersPanelC();