import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import Bus from "../event_bus.js";
import { ROOT } from "../paths.js";
import { ROUTER_EVENT } from "../modules/events.js";

class PackInfoC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.registerHandler("ready", "click", this._getReady);
    }

    _getReady = () => {
        document.getElementById("main-user").style.borderColor = "#72f1b8";
    }

    startAllListeners = () => {
        this.enableAll();
    }

    disableAllListeners = () => {
        this.disableAll();
    }
}

export default new PackInfoC();