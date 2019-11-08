import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import Bus from "../event_bus.js";
import { ROOT } from "../paths.js";
import { ROUTER_EVENT } from "../modules/events.js";

class PackInfoC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.registerHandler("ready", "click", this._getReady.bind(this));
        this.registerHandler("exit", "click", this._exitFromWaiting.bind(this));
    }

    _getReady() {
        document.getElementById("main-user").style.borderColor = "#72f1b8";
    }

    _exitFromWaiting() {
        Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }
}

export default new PackInfoC();