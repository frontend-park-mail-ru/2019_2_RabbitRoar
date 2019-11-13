import ValidatorF from "../fasade/userValidatorF.js";
import Bus from "../event_bus.js";
import { ROUTER_EVENT } from "../modules/events.js";
import { ROOT } from "../paths";
import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import { replaceTwoCssClasses } from "../modules/css_operations";


class CreatePackC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
        this.currentQuestionId;
        this.registerHandler("save-pack", "click", this._savePack.bind(this));
        this.registerHandler("back", "click", this._goToRoot.bind(this));
        this.registerClassHandler(".question-container__cost", "click", this._choseQuestion.bind(this));
        this.registerClassHandler(".question-container__theme-hover", "click", this._choseTheme.bind(this));
        this.registerClassHandler(".popup-button", "click", this._processPopUp.bind(this));
    }

    _showOrHidePopUpQuestion(questionCost, theme) {
        if (questionCost && theme) {
            document.getElementById("cost").innerHTML = "Стоимость: " + questionCost;
            document.getElementById("theme").innerHTML = "Teма: " + theme;
        }
        const popupQuestion = document.getElementById("popup-question");
        if (popupQuestion) {
            popupQuestion.classList.toggle("popup_show");
        }
    }

    _showOrHidePopUpTheme(event) {
        const popupTheme = document.getElementById("popup-theme");
        if (popupTheme) {
            popupTheme.classList.toggle("popup_show");
        }
    }

    _processPopUp(event) {
        if (event.target.id === "save-question") {
            console.log("saving");
            replaceTwoCssClasses(document.getElementById(this.currentQuestionId), "question-container__cost", "question-container__cost_chosen");
            this._showOrHidePopUpQuestion();
        
        } else if (event.target.id == "cansel-question") {
            this._showOrHidePopUpQuestion(event);
        } else if (event.target.id === "save-theme" || event.target.id == "cansel-theme") {
            this._showOrHidePopUpTheme(event);
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

    _choseQuestion(event) {
        const questionCost = event.target.innerHTML;
        const theme = event.target.parentNode.id;
        this.currentQuestionId = event.target.id;
        this._showOrHidePopUpQuestion(questionCost, theme);

    }

    _choseTheme() {
        this._showOrHidePopUpTheme();
    }
}

export default new CreatePackC();