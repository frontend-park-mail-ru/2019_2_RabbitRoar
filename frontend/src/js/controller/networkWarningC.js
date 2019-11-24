import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";

import Bus from "../event_bus.js";

import { ROUTER_EVENT, WEBSOCKET_CONNECTION, WEBSOCKET_CLOSE, CRASH_EVENT, OFFLINE_GAME_END } from "../modules/events.js";
import { ROOT, WAITING } from "../paths";

class NetworkWarningC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.registerHandler("popup_connection_error_route", "click", this._processPopUp);
        this.registerHandler("popup_connection_http_error_route", "click", this._processPopUp);
        this.registerHandler("exit-offline-game", "click", this._goToRoot);


        Bus.on(WEBSOCKET_CONNECTION, this._wsConnect);
        Bus.on(WEBSOCKET_CLOSE, this._wsClose);
        Bus.on(CRASH_EVENT, this._crashConnection);
        Bus.on(OFFLINE_GAME_END, this._endGame);

    }
    _goToRoot = () => {
        Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
    }

    _endGame = () => {
        this._showOrHidePopUp("popup-end");
    }

    _crashConnection = () => {
        this._showOrHidePopUp("popup_http_error");
    }

    _wsConnect = (connect) => {
        if (connect) {
            Bus.emit(ROUTER_EVENT.ROUTE_TO, WAITING);
        } else {
            console.log("WS crashed");
        }
    }

    _wsClose = (close) => {
        if (close.code !== 1000) {
            if (close.lastState === "before_connection") {
                this._showOrHidePopUp("popup_connection_error");
            }
        }
    }

    _showOrHidePopUp = (popupId = "popup") => {
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.classList.toggle("popup_show");
            return;
        }
    }

    _processPopUp = (event) => {
        this._showOrHidePopUp(event.target.id);
        Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
    }


    startAllListeners = () => {
        this.enableAll();
    }

    disableAllListeners = () => {
        this.disableAll();
    }

}

export default new NetworkWarningC();