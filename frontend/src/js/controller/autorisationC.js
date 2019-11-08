import ValidatorF from "../fasade/userValidatorF.js";
import Bus from "../event_bus.js";
import { ROUTER_EVENT } from "../modules/events.js";
import { LOGIN, SIGN_UP } from "../paths";
import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import { autorizationVaildation } from "../modules/form_validation.js";


class AutorisationC {
    constructor() {
        if (!!AutorisationC.instance) {
            console.log("ERROR: AutorisationC must be import only ones");
            return AutorisationC.instance;
        }
        AutorisationC.instance = this;
        Object.assign(this, DomEventsWrapperMixin);

        this.registerHandler("autorisation", "click", this._autorise.bind(this));

        return this;
    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }


    _autorise() {
        const autorizationError = autorizationVaildation();
        if (autorizationError) {
            return;
        }
        const result = ValidatorF.doAutorise(document.getElementById("username").value, document.getElementById("password").value);
    }


}

export default new AutorisationC();