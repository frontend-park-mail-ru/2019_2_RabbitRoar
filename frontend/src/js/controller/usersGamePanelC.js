import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";

class UsersGamePanelC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
    }
    
    startAllListeners = () => {
        this.enableAll();
    }

    disableAllListeners = () => {
        this.disableAll();
    }
}

export default new UsersGamePanelC();