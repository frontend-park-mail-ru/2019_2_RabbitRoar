import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import Bus from "../event_bus.js";
import { ROOT } from "../paths.js";
import { ROUTER_EVENT } from "../modules/events.js";

class EditPackC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
        this.registerHandler("back", "click", this._goBack.bind(this));
    }

    _goBack() {
        Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }
}

export default new EditPackC();