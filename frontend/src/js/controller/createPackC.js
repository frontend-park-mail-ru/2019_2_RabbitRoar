import Bus from "../event_bus.js";
import { ROUTER_EVENT, FORM_CHANGED, CHANGE_VIEW_PACK_CREATION } from "../modules/events.js";
import { ROOT } from "../paths";
import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import { replaceTwoCssClasses } from "../modules/css_operations";
import { packCreationVaildationForm1 } from "../modules/form_validation";
import ContentF from "../fasade/contentF";

class CreatePackC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
        this.currentFormPart = 1;
        this.currentQuestionId;
        this.themes = new Array();

        this.packObj = {
            "name": "",
            "pack": [],
        };

        this.registerHandler("save-pack", "click", this._savePack);
        this.registerHandler("back", "click", this._goBack);
        this.registerClassHandler(".question-container__cost", "click", this._choseQuestion);
        this.registerClassHandler(".popup-button", "click", this._processPopUp);
        this.registerHandler("further", "click", this._goFurther);
        this.registerHandler("ok", "click", this._goToRoot);
    }

    _goToRoot = () => {
        Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
    }

    _goBack = () => {
        this.usersCount = 0;
        if (this.currentFormPart == 1) {
            this.currentFormPart = 1;
            Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
        } else if (this.currentFormPart == 2) {
            this.currentFormPart = 1;
            Bus.emit(CHANGE_VIEW_PACK_CREATION);
        }

    }


    _processPopUp = (event) => {
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
            const currentQuestionElem = document.getElementById(this.currentQuestionId);
            if (validInput) {
                const theme = this._getThemeByQuestionElem(currentQuestionElem);
                const questionCost = this._getCostByQuestionElem(currentQuestionElem);
                const questionIndex = this._getQuestionIndexbyCost(questionCost);
                const themeIndex = this.themes.indexOf(theme);
                this.packObj.pack[themeIndex].questions[questionIndex].text = question;
                this.packObj.pack[themeIndex].questions[questionIndex].answer = answer;

                replaceTwoCssClasses(currentQuestionElem, "question-container__cost", "question-container__cost_chosen");
            } else {
                replaceTwoCssClasses(currentQuestionElem, "question-container__cost_chosen", "question-container__cost");
            }
        }
        this._showOrHidePopUpQuestion();
    }

    _getInputAnswerAndQuestion = (questionCost, theme) => {
        const themeIndex = this.themes.indexOf(theme);
        const questionIndex = this._getQuestionIndexbyCost(questionCost);
        return [this.packObj.pack[themeIndex].questions[questionIndex].text,
        this.packObj.pack[themeIndex].questions[questionIndex].answer]
    }

    _showOrHidePopUpQuestion = () => {
        const currentQuestionElem = document.getElementById(this.currentQuestionId);
        const theme = this._getThemeByQuestionElem(currentQuestionElem);
        const questionCost = this._getCostByQuestionElem(currentQuestionElem);

        if (questionCost && theme) {
            document.getElementById("cost").innerHTML = "Стоимость: " + questionCost;
            document.getElementById("theme").innerHTML = "Teма: " + theme;

            const [question, answer] = this._getInputAnswerAndQuestion(questionCost, theme);
            document.getElementById("input-question").value = question;
            document.getElementById("input-answer").value = answer;
        }
        const popupQuestion = document.getElementById("popup-question");
        if (popupQuestion) {
            popupQuestion.classList.toggle("popup_show");
        }
    }

    _getThemeByQuestionElem = (questionElement) => {
        const questionParentElem = questionElement.parentNode;
        const children = questionParentElem.childNodes;
        return children[0].innerHTML;
    }

    _getCostByQuestionElem = (questionElement) => {
        return questionElement.innerHTML;
    }

    _getQuestionIndexbyCost = (cost) => {
        return parseInt(cost) / 100 - 1;
    }

    _goFurther = () => {
        const [error, arrayThemes, packName] = packCreationVaildationForm1();

        if (!error) {
            this.themes = arrayThemes;

            this.packObj.name = packName;
            this.packObj.pack = [];

            let i = 0;
            while (i < 5) {
                this.packObj.pack.push({
                    "name": this.themes[i],
                    "questions": [],
                });
                let j = 0;
                while (j < 5) {
                    this.packObj.pack[i].questions.push({
                        "text": "",
                        "answer": "",
                    });
                    j++;
                }
                i++;
            }
            this.currentFormPart = 2;
            Bus.emit(CHANGE_VIEW_PACK_CREATION);
        }
    }


    startAllListeners = () => {
        this.enableAll();
    }

    disableAllListeners = () => {
        this.disableAll();
    }

    _showSuccessPopup = (success) => {
        const finalPopup = document.getElementById("popup-final");
        if (!success) {
            document.getElementById("popup-final-text").innerHTML = "Пак не был сохранен, повторите позже.";
        }
        if (finalPopup) {
            finalPopup.classList.toggle("popup_show");
        }
    }

    _savePack = async () => {
        const amountOfEmptyQuestions = document.getElementsByClassName("question-container__cost").length;
        if (amountOfEmptyQuestions === 0) {
            ContentF.savePack(this.packObj).then(
                () => this._showSuccessPopup(true)
            ).catch(
                () => this._showSuccessPopup(false)
            );
        } else {
            const errorElement = document.getElementById("error_invalid_pack");
            replaceTwoCssClasses(errorElement, "error-annotation", "error-visible");
        }
    }

    _choseQuestion = (event) => {
        this.currentQuestionId = event.target.id;
        this._showOrHidePopUpQuestion();
    }
}

export default new CreatePackC();