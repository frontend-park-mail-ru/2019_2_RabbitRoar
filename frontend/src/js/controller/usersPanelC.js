import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import WebSocketIface from "../modules/webSocketIface.js"
import Bus from "../event_bus.js";
import { ROUTER_EVENT } from "../modules/events.js";
import { ROOT } from "../paths";




class UsersPanelC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
        this.registerHandler("button-ready", "click", this._sentUserReady);
        this.registerHandler("button-copy", "click", this._copyLink);
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


    _sentUserReady = (event) => {
        console.log("user ready sending");
        const body = JSON.stringify({
            "type": "player_ready_front",
        });
        WebSocketIface.sentMessage(body);

        event.target.className = "button-ready-click";
        setTimeout(() => event.target.className = "button-ready", 200);
    }

    _copyLink = (event) => {
        let tmp = document.createElement("INPUT");
        focus = document.activeElement;

        const btn = document.getElementById("button-copy");
        if (!btn) {
            console.log("Button not exist");
            return;
        }

        const url = btn.getAttribute("link");
        tmp.value = url;

        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand("copy");
        document.body.removeChild(tmp);
        focus.focus();

        event.target.className = "button-ready-click";
        setTimeout(() => event.target.className = "button-ready", 200);
        //event.target.classList.toggle("button-ready-click");


        // const link = document.getElementById("room_href");
        // const range = document.createRange();
        // range.selectNode(link);
        // window.getSelection().addRange(range);

        // try {
        //     debugger
        //     const successful = document.execCommand("copy");
        // } catch (err) {
        //     console.log("Oops, unable to copy");
        // }
        // //window.getSelection().removeAllRanges();

    }

    startAllListeners = () => {
        this.enableAll();
    }

    disableAllListeners = () => {
        this.disableAll();
    }
}

export default new UsersPanelC();