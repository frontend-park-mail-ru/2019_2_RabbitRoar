import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import Bus from "../event_bus.js";
import { ROOT } from "../paths.js";
import { ROUTER_EVENT } from "../modules/events.js";
import ContentF from "../fasade/contentF";
import { replaceTwoCssClasses } from "../modules/css_operations";


class EditPackC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
        this.registerHandler("back", "click", this._goBack.bind(this));
        this.registerClassHandler(".question-container__cost", "click", this._choseQuestion.bind(this));
        this.registerClassHandler(".popup-button", "click", this._processPopUp.bind(this));
        this.registerHandler("save-pack", "click", this._savePack.bind(this));
        this.registerHandler("ok", "click", this._goToRoot.bind(this));


        this.currentQuestionId;
        this.packObj;
        this.themes = [];
        this.firstQuestionWasChosen = true;
    }

    _goToRoot() {
        Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
    }

    _showSuccessPopup(success) {
        const finalPopup = document.getElementById("popup-final");
        if (!success) {
            document.getElementById("popup-final-text").innerHTML = "Пак не был сохранен, повторите позже.";
        }
        if (finalPopup) {
            finalPopup.classList.toggle("popup_show");
        }
    }

    async _savePack() {
        const amountOfChangedQuestions = document.getElementsByClassName("question-container__cost_chosen").length;
        console.log("Changed question amount", amountOfChangedQuestions);
        if (amountOfChangedQuestions === 0) {
            const errorElement = document.getElementById("error_invalid_pack");
            replaceTwoCssClasses(errorElement, "error-annotation", "error-visible");
        } else {
            const amountOfInvalidQuestions = document.getElementsByClassName("question-container__cost_error").length;
            if (amountOfInvalidQuestions !== 0) {
                console.log("ne valid");
                const errorElement = document.getElementById("error_invalid_pack");
                errorElement.innerHTML = "Исправьте невалидный вопрос";
                replaceTwoCssClasses(errorElement, "error-annotation", "error-visible");
            } else {
                console.log("valid");
                ContentF.updatePack(this.packObj, this.packId).then(
                    () => this._showSuccessPopup(true)
                ).catch(
                    () => this._showSuccessPopup(false)
                );
            }
        }
    }



    _setThemesFromPack() {
        let i = 0;
        while (i < 5) {
            this.themes.push(this.packObj.pack[i].name);
            i++;
        }
        console.log(this.themes);
    }
    _getThemeByQuestionElem(questionElement) {
        const themeId = questionElement.parentNode.id;
        return themeId;
    }

    _getCostByQuestionElem(questionElement) {
        return questionElement.innerHTML;
    }

    _getQuestionIndexbyCost(cost) {
        return parseInt(cost) / 100 - 1;
    }

    _getInputAnswerAndQuestion(questionCost, theme) {
        const themeIndex = this.themes.indexOf(theme);
        const questionIndex = this._getQuestionIndexbyCost(questionCost);
        return [this.packObj.pack[themeIndex].questions[questionIndex].text,
        this.packObj.pack[themeIndex].questions[questionIndex].answer]
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

            const currentQuestionElem = document.getElementById(this.currentQuestionId);
            const theme = this._getThemeByQuestionElem(currentQuestionElem);
            const questionCost = this._getCostByQuestionElem(currentQuestionElem);
            const questionIndex = this._getQuestionIndexbyCost(questionCost);
            const themeIndex = this.themes.indexOf(theme);

            if (validInput) {
                if (!((this.packObj.pack[themeIndex].questions[questionIndex].text === question) && (this.packObj.pack[themeIndex].questions[questionIndex].answer === answer))) {
                    this.packObj.pack[themeIndex].questions[questionIndex].text = question;
                    this.packObj.pack[themeIndex].questions[questionIndex].answer = answer;
                    replaceTwoCssClasses(currentQuestionElem, "question-container__cost", "question-container__cost_chosen");
                    replaceTwoCssClasses(currentQuestionElem, "question-container__cost_error", "question-container__cost_chosen");
                }
            } else {
                this.packObj.pack[themeIndex].questions[questionIndex].text = question;
                this.packObj.pack[themeIndex].questions[questionIndex].answer = answer;
                replaceTwoCssClasses(currentQuestionElem, "question-container__cost_chosen", "question-container__cost_error");
            }
        }
        this._showOrHidePopUpQuestion();
    }

    _showOrHidePopUpQuestion() {
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

    _choseQuestion(event) {
        if (this.firstQuestionWasChosen) {
            this.packObj = ContentF.getCurrentPackForEditing();
            this.packId = ContentF.getCurrentPackIDForEditing();
            console.log(this.packObj, this.packId);
            this._setThemesFromPack();
            this.firstQuestionWasChosen = false;
        }
        this.currentQuestionId = event.target.id;
        this._showOrHidePopUpQuestion();
    }

    _goBack() {
        Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
    }

    async start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }
}

export default new EditPackC();