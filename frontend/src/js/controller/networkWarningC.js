import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";

import Bus from "../event_bus.js";

import { ROUTER_EVENT, WEBSOCKET_CONNECTION, WEBSOCKET_CLOSE } from "../modules/events.js";
import { ROOT, WAITING } from "../paths";

class NetworkWarningC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.registerHandler("popup_connection_error_route", "click", this._processPopUp.bind(this));

        Bus.on(WEBSOCKET_CONNECTION, this._wsConnect.bind(this));
        Bus.on(WEBSOCKET_CLOSE, this._wsClose.bind(this));
    }

    _wsConnect(connect) {
        if (connect) {
            Bus.emit(ROUTER_EVENT.ROUTE_TO, WAITING);
        } else {
            console.log("WS crashed");
        }
    }

    _wsClose(close) {
        if (close.code !== 1000) {
            if (close.lastState === "created") {
                this._showOrHidePopUp("popup_connection_error");
            }
        }
    }

    _showOrHidePopUp(popupId = "popup") {
        const popup = document.getElementById(popupId);
        if (popup) {
            popup.classList.toggle("popup_show");
            return;
        }
    }

    _processPopUp(event) {
        if (event.target.id == "popup_connection_error_route") {
            this._showOrHidePopUp("popup_connection_error");
            Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
        }
    }


    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }

}

export default new NetworkWarningC();