import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";

import Bus from "../event_bus.js";

import { ROUTER_EVENT, GAME_END, RECONNECT_EVENT, CONNECTION, WEBSOCKET_CLOSE, CRASH_EVENT, OFFLINE_GAME_END, SERVICE_WORKER_CMD } from "../modules/events.js";
import { ROOT, WAITING } from "../paths";

class NetworkWarningC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.registerHandler("popup_connection_error_route", "click", this._processPopUp);
        this.registerHandler("popup_connection_http_error_route", "click", this._processPopUp);
        this.registerHandler("popup_game_end_route", "click", this._processPopUp);
        this.registerHandler("game_disconnect_route", "click", this._processPopUp);
        this.registerHandler("wait_disconnect_route", "click", this._processPopUp);
        this.registerHandler("exit-offline-game", "click", this._goToRoot);


        Bus.on(CONNECTION, this._wsConnect);
        Bus.on(WEBSOCKET_CLOSE, this._wsClose);
        Bus.on(CRASH_EVENT, this._crashConnection);
        Bus.on(OFFLINE_GAME_END, this._endGame);
        Bus.on(GAME_END, this._OnlineEndGame);

        Bus.on(SERVICE_WORKER_CMD, this._checkSw);
    }


    _OnlineEndGame = () => {
        this._showOrHidePopUp("popup-end");
    }

    _checkSw = () => {
        if (this.sw) {
            return
        }
        if (window.navigator.serviceWorker.controller === null) {
            this.sw = true;
            alert("Чтобы приложение продолжило стабильно работать, необходимо перезагрузить страницу.");
            window.location.reload();
            return;
        }
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
        if (connect === "before") {
            Bus.emit(ROUTER_EVENT.ROUTE_TO, WAITING);
            this._showOrHidePopUp("popup_connect_timer");
        } else if (connect === "data_waiting") {
            this._showOrHidePopUp("popup_connect_timer");
            this._showOrHidePopUp("popup_load_timer");
        } else if (connect === "done") {
            this._showOrHidePopUp("popup_load_timer");
        } else {
        }
    }

    _wsClose = (close) => {
        if (close.code !== 1000) {
            if (close.lastState === "before_connection") {
                this._showOrHidePopUp("popup_connection_error");
            } else if (close.lastState === "game") {
                this._showOrHidePopUp("game_disconnect");
            } else if (close.lastState === "waiting") {
                this._showOrHidePopUp("wait_disconnect");
            }
        } else {
            this._showOrHidePopUp("popup_game_end");
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