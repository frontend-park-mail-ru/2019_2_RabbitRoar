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
        this.registerClassHandler(".question-container__cost", "click", this._choseQuestion.bind(this));
        this.registerClassHandler(".question-container__theme-hover", "click", this._choseTheme.bind(this));
        this.registerClassHandler(".popup-button", "click", this._processPopUp.bind(this));
    }

    _showOrHidePopUp() {
        const popup = document.getElementById("popup");
        if (popup) {
            popup.classList.toggle("popup_show");
            return;
        }
    }

    _processPopUp(event) {
        if (event.target.id === "save") {
            this._showOrHidePopUp();
        } else if (event.target.id == "cansel") {
            this._showOrHidePopUp();
        }
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

    _choseQuestion() {
        document.getElementById("popup-elem-top").innerHTML = "Введите вопрос";
        this._showOrHidePopUp();
    }

    _choseTheme() {
        document.getElementById("popup-elem-top").innerHTML = "Введите тему";
        this._showOrHidePopUp();
    }
}

export default new CreatePackC();