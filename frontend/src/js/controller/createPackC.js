import ValidatorF from "../fasade/userValidatorF.js";
import Bus from "../event_bus.js";
import { ROUTER_EVENT } from "../modules/events.js";
import { LOGIN, SIGN_UP } from "../paths";
import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import { autorizationVaildation } from "../modules/form_validation.js";


class CreatePackC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
        //this.registerHandler("CreatePack", "click", this._autorise.bind(this));
    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }

}

export default new CreatePackC();