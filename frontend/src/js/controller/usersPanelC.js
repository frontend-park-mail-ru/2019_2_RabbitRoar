import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import Bus from "../event_bus.js";


class UsersPanelC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
    }

    startAllListeners() {
        this.enableAll();
    }

    disableAllListeners() {
        this.disableAll();
    }
}

export default new UsersPanelC();