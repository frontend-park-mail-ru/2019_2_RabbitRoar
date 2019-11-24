import ValidatorF from "../fasade/userValidatorF.js";
import Bus from "../event_bus.js";
import { ROUTER_EVENT } from "../modules/events.js";
import { ROOT } from "../paths.js";
import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import { autorizationVaildation } from "../modules/form_validation.js";


class AutorisationC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.registerHandler("autorisation", "click", this._autorise);
        this.registerHandler("back", "click", this._goBack);
    }

    startAllListeners() {
        this.enableAll();
    }

    disableAllListeners() {
        this.disableAll();
    }


    _autorise = () => {
        const autorizationError = autorizationVaildation();
        if (autorizationError) {
            return;
        }
        const result = ValidatorF.doAutorise(document.getElementById("username").value, document.getElementById("password").value);
    }

    _goBack = () => {
        Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
    }
}

export default new AutorisationC();