import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import Bus from "../event_bus.js";


class PackInfoC {
    constructor() {
        if (!!PackInfoC.instance) {
            return PackInfoC.instance;
        }

        PackInfoC.instance = this;
        Object.assign(this, DomEventsWrapperMixin);
    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }
}

export default new PackInfoC();