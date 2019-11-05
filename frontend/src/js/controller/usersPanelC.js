import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import Bus from "../event_bus.js";


class UsersPanelC {
    constructor() {
        if (!!UsersPanelC.instance) {
            return UsersPanelC.instance;
        }

        UsersPanelC.instance = this;
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