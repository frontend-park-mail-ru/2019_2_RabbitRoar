import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import Bus from "../event_bus.js";
import { ROOT } from "../paths.js";
import { ROUTER_EVENT } from "../modules/events.js";

class PackInfoC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.registerHandler("ready", "click", this._getReady);
        this.registerHandler("exit", "click", this._exitFromWaiting);
    }

    _getReady = () => {
        document.getElementById("main-user").style.borderColor = "#72f1b8";
    }

    _exitFromWaiting = () => {
        Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
    }

    startAllListeners = () => {
        this.enableAll();
    }

    disableAllListeners = () => {
        this.disableAll();
    }
}

export default new PackInfoC();