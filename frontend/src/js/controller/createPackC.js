import ValidatorF from "../fasade/userValidatorF.js";
import Bus from "../event_bus.js";
import { ROUTER_EVENT } from "../modules/events.js";
import { ROOT } from "../paths";
import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import { autorizationVaildation } from "../modules/form_validation.js";


class CreatePackC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
        this.registerHandler("save-pack", "click", this._savePack.bind(this));
        this.registerHandler("back", "click", this._goToRoot.bind(this));
    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }

    _savePack() {
        Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
    }

    _goToRoot() {
        Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
    }

}

export default new CreatePackC();