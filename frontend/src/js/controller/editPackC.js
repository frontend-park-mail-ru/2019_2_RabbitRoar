import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import Bus from "../event_bus.js";
import { ROOT } from "../paths.js";
import { ROUTER_EVENT } from "../modules/events.js";
import ContentF from "../fasade/contentF";
import { replaceTwoCssClasses } from "../modules/css_operations";


class EditPackC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
        this.registerClassHandler(".question-container__cost", "click", this._choseQuestion);
        this.registerClassHandler(".question-container__cost", "click", this._choseQuestion);

        this.registerHandler("edit-description", "click", this._editDescription);

        this.registerClassHandler(".popup-button", "click", this._processPopUp);
        this.registerHandler("save-pack", "click", this._savePack);
        this.registerHandler("ok", "click", this._goToRoot);
        this.registerClassHandler(".question-container__theme-hover", "click", this._choseTheme);

        this.currentThemeName;
        this.currentThemeIndex;

        this.descriptionWasChanged = 0;

        this.currentQuestionId;
        this.packObj;
        this.themes = [];
        this.firstChosenItem = true;
    }
    _editDescription = () => {
        if (this.firstChosenItem) {
            this._setInitialDataFromPack();
        }
        this._showOrHidePopUpQuestion("description", "show");
    }

    _goToRoot = () => {
        Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
    }

    _choseTheme = (event) => {
        if (this.firstChosenItem) {
            this._setInitialDataFromPack();
        }
        this.currentThemeName = event.target.parentNode.id;
        this._showOrHidePopUpQuestion("theme", "show");
    }

    _setInitialDataFromPack = () => {
        this.packObj = ContentF.getCurrentPackForEditing();
        this.packId = ContentF.getCurrentPackIDForEditing();
        this._setThemesFromPack();
        this.firstChosenItem = false;
    }
    _choseQuestion = (event) => {
        if (this.firstChosenItem) {
            this._setInitialDataFromPack();
        }
        this.currentQuestionId = event.target.id;
        this._showOrHidePopUpQuestion("question", "show");
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
        const amountOfChangedQuestions = document.getElementsByClassName("question-container__cost_chosen").length;
        const amountOfChangedThemes = document.getElementsByClassName("question-container__theme-hover-chosen").length;
        if (amountOfChangedQuestions === 0 && amountOfChangedThemes === 0 && this.descriptionWasChanged === 0) {
            const errorElement = document.getElementById("error_invalid_pack");
            replaceTwoCssClasses(errorElement, "error-annotation", "error-visible");
        } else {
            const amountOfInvalidQuestions = document.getElementsByClassName("question-container__cost_error").length;
            if (amountOfInvalidQuestions !== 0) {
                const errorElement = document.getElementById("error_invalid_pack");
                errorElement.innerHTML = "Исправьте невалидный вопрос";
                replaceTwoCssClasses(errorElement, "error-annotation", "error-visible");
            } else {
                ContentF.updatePack(this.packObj, this.packId).then(
                    () => this._showSuccessPopup(true)
                ).catch(
                    () => this._showSuccessPopup(false)
                );
            }
        }
    }

    _setThemesFromPack = () => {
        let i = 0;
        while (i < 5) {
            this.themes.push(this.packObj.pack[i].name);
            i++;
        }
    }
    _getThemeByQuestionElem = (questionElement) => {
        const themeId = questionElement.parentNode.id;
        return themeId;
    }

    _getCostByQuestionElem = (questionElement) => {
        return questionElement.innerHTML;
    }

    _getQuestionIndexbyCost(cost) {
        return parseInt(cost) / 100 - 1;
    }

    _getInputAnswerAndQuestion = (questionCost, theme) => {
        const themeIndex = this.themes.indexOf(theme);
        const questionIndex = this._getQuestionIndexbyCost(questionCost);
        return [this.packObj.pack[themeIndex].questions[questionIndex].text,
        this.packObj.pack[themeIndex].questions[questionIndex].answer]
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
            this._showOrHidePopUpQuestion("question", "hide");
        } else if (event.target.id === "save-theme") {

            const currentThemeElem = document.getElementById(this.currentThemeName).children[0];

            const newTheme = document.getElementById("input-theme").value;
            if (newTheme !== this.currentThemeName) {
                const currentThemeElem = document.getElementById(this.currentThemeName);
                currentThemeElem.children[0].innerHTML = newTheme;
                currentThemeElem.id = newTheme;

                replaceTwoCssClasses(currentThemeElem.children[0], "question-container__theme-hover", "question-container__theme-hover-chosen");
                this.themes[this.currentThemeIndex] = newTheme;
                this.packObj.pack[this.currentThemeIndex].name = newTheme;
            } else {
                replaceTwoCssClasses(currentThemeElem.children[0], "question-container__theme-hover-chosen", "question-container__theme-hover");
            }
            this._showOrHidePopUpQuestion("theme", "hide");
        } else if (event.target.id === "save-description") {
            this.descriptionWasChanged = 1;
            const newDescription = document.getElementById("input-description").value;
            document.getElementById("description-on-page").innerHTML = "Описание пака: "+ newDescription;
            this.packObj.description = newDescription;
            this._showOrHidePopUpQuestion("description", "hide");
        }
        else if (event.target.id === "cansel-question") {
            this._showOrHidePopUpQuestion("question", "hide");
        } else if (event.target.id === "cansel-theme") {
            this._showOrHidePopUpQuestion("theme", "hide");
        } else if (event.target.id === "cansel-description") {
            this._showOrHidePopUpQuestion("description", "hide");
        }
    }

    _showOrHidePopUpQuestion = (popUpType, action) => {
        if (popUpType === "question") {
            if (action === "show") {
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
            }
            const popupQuestion = document.getElementById("popup-question");
            if (popupQuestion) {
                popupQuestion.classList.toggle("popup_show");
            }
        } else if (popUpType === "theme") {
            if (action === "show") {
                this.currentThemeIndex = this.themes.indexOf(this.currentThemeName);
                document.getElementById("input-theme").value = this.currentThemeName;
            }
            const popupTheme = document.getElementById("popup-theme");
            if (popupTheme) {
                popupTheme.classList.toggle("popup_show");
            }
        } else if (popUpType === "description") {
            if (action === "show") {
                document.getElementById("input-description").value = this.packObj.description;
            }
            const popupDescription = document.getElementById("popup-description");
            if (popupDescription) {
                popupDescription.classList.toggle("popup_show");
            }
        }

    }

    _goBack = () => {
        Bus.emit(ROUTER_EVENT.ROUTE_TO, ROOT);
    }

    startAllListeners = () => {
        this.enableAll();
    }

    disableAllListeners = () => {
        this.disableAll();
    }
}

export default new EditPackC();