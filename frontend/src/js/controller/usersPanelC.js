import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import Bus from "../event_bus.js";


class UsersPanelC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }
}

export default new UsersPanelC();