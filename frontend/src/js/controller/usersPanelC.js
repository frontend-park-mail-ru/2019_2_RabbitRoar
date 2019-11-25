import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import WebSocketIface from "../modules/webSocketIface.js"
import Bus from "../event_bus.js";


class UsersPanelC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
        this.registerHandler("button-ready", "click", this._sentUserReady);
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