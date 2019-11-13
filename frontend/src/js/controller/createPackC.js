import ValidatorF from "../fasade/userValidatorF.js";
import Bus from "../event_bus.js";
import { ROUTER_EVENT, FORM_CHANGED } from "../modules/events.js";
import { ROOT } from "../paths";
import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import { replaceTwoCssClasses } from "../modules/css_operations";
import { packCreationVaildationForm1 } from "../modules/form_validation";



class CreatePackC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
        this.currentFormPart = 1;
        this.currentQuestionId;
        this.packName;
        let themes = new Array();


        this.registerHandler("save-pack", "click", this._savePack.bind(this));
        this.registerHandler("back", "click", this._goToRoot.bind(this));
        this.registerClassHandler(".question-container__cost", "click", this._choseQuestion.bind(this));
        this.registerClassHandler(".question-container__theme-hover", "click", this._choseTheme.bind(this));
        this.registerClassHandler(".popup-button", "click", this._processPopUp.bind(this));
        this.registerHandler("further", "click", this._goFurther.bind(this));
        this.registerClassHandler(".back", "click", this._goBack.bind(this));
        Bus.on(FORM_CHANGED, this._processForm.bind(this));

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
            let validInput = true;
            const question = document.getElementById("input-question").value;
            if (!question) {
                validInput = false;
            }
            const answer = document.getElementById("input-answer").value;
            if (!answer) {
                validInput = false;
            }
            if (validInput) {
                replaceTwoCssClasses(document.getElementById(this.currentQuestionId), "question-container__cost", "question-container__cost_chosen");
            } else {
                replaceTwoCssClasses(document.getElementById(this.currentQuestionId), "question-container__cost_chosen", "question-container__cost");
            }
            this._showOrHidePopUpQuestion();

        } else if (event.target.id == "cansel-question") {
            this._showOrHidePopUpQuestion(event);
        } else if (event.target.id === "save-theme" || event.target.id == "cansel-theme") {
            this._showOrHidePopUpTheme(event);
        }
    }

    _processForm(form_number) {
        if (form_number === 2) {
            this.currentFormPart = 2;
            document.getElementById("form-part-2").style.display = "block";
            document.getElementById("form-part-1").style.display = "none";
            return;
        }
        this.currentFormPart = 1;
        document.getElementById("form-part-2").style.display = "none";
        document.getElementById("form-part-1").style.display = "block";
    }

    _goFurther() {
        // const error = roomCreatureVaildation();
        // if (error) {
        //     return;
        // }

        //.usersCount = parseInt(document.getElementById("users-number").value);

        //this.packName = document.getElementById("pack-name").value;
        const error = packCreationVaildationForm1();
        if (error) {
            alert("error");
        } else {
            Bus.emit(FORM_CHANGED, 2);
        }
    }

    _goBack() {
        this.usersCount = 0;
        this.packName = "";
        if (this.currentFormPart == 1) {
            Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
        } else if (this.currentFormPart == 2) {
            Bus.emit(FORM_CHANGED, 1);
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