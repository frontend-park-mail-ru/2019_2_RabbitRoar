import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import Bus from "../event_bus.js";
import { ROOT } from "../paths.js";
import { ROUTER_EVENT } from "../modules/events.js";
import ContentF from "../fasade/contentF";


class EditPackC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
        this.registerHandler("back", "click", this._goBack.bind(this));
        this.registerClassHandler(".question-container__cost", "click", this._choseQuestion.bind(this));
        this.registerClassHandler(".popup-button", "click", this._processPopUp.bind(this));
        this.currentQuestionId;
        this.packObj = ContentF.getCurrentPackForEditing();

       // this.themes = this._setThemesFromPack();
        console.log("pack", this.packObj);
    }

    _setThemesFromPack() {
        let i = 0;

/*        
        while(i<5){
            console.log(this.packObj.pack[0]);
            i++;
        }*/
    }
    _getThemeByQuestionElem(questionElement) {
        const themeId = questionElement.parentNode.id;
        //const children = questionParentElem.childNodes;
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
            if (validInput) {
                alert("chetkiy input");
      /*          const theme = this._getThemeByQuestionElem(currentQuestionElem);
                const questionCost = this._getCostByQuestionElem(currentQuestionElem);
                const questionIndex = this._getQuestionIndexbyCost(questionCost);
                const themeIndex = this.themes.indexOf(theme);
                this.packObj.pack[themeIndex].questions[questionIndex].text = question;
                this.packObj.pack[themeIndex].questions[questionIndex].answer = answer; */

                replaceTwoCssClasses(currentQuestionElem, "question-container__cost", "question-container__cost_chosen");
            } else {
                replaceTwoCssClasses(currentQuestionElem, "question-container__cost_chosen", "question-container__cost");
            }
        }
        this._showOrHidePopUpQuestion();
    }

    _showOrHidePopUpQuestion() {
        const currentQuestionElem = document.getElementById(this.currentQuestionId);
        const theme = this._getThemeByQuestionElem(currentQuestionElem);
        console.log(theme);

        const questionCost = this._getCostByQuestionElem(currentQuestionElem);
        console.log(questionCost);

        if (questionCost && theme) {
            document.getElementById("cost").innerHTML = "Стоимость: " + questionCost;
            document.getElementById("theme").innerHTML = "Teма: " + theme;

            const [question, answer] = this._getInputAnswerAndQuestion(questionCost, theme);
            console.log(question, answer);
            // document.getElementById("input-question").value = question;
            // document.getElementById("input-answer").value = answer;
        }
        const popupQuestion = document.getElementById("popup-question");
        if (popupQuestion) {
            popupQuestion.classList.toggle("popup_show");
        }
    }

    _choseQuestion(event) {
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