import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import UserValidatorF from "../fasade/userValidatorF.js";


class NetworkWarningC {
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

export default new NetworkWarningC();