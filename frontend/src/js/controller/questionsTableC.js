import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import GameF from "../fasade/gameF.js";
import ContentF from "../fasade/contentF.js";
import { replaceTwoCssClasses } from "../modules/css_operations";



class QuestionTableC {
    constructor() {
        QuestionTableC.instance = this;
        Object.assign(this, DomEventsWrapperMixin);
        this.chosedQuestionsId = [];

        this.registerClassHandler(".question-container__cost", "click", this._choseQuestion.bind(this));
    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }

    _choseQuestion(event) {
        if (this.chosedQuestionsId.includes(event.target.id)) {
            alert("Вы уже выбирали вопрос");
            return;
        }
        this.chosedQuestionsId.push(event.target.id);
        replaceTwoCssClasses(event.target, "question-container__cost", "question-container__cost_chosen");

        const barElement = document.getElementById("progress-bar")
        replaceTwoCssClasses(barElement, "progress-bar-hidden", "progress-bar");

        this._progressBarMoving()
            .then((data) => { })
            .catch((error) => { });

        const packId = event.target.parentNode.parentNode.id;
        const themeId = event.target.parentNode.id;
        const cellId = event.target.id;

        GameF.clickQuestion(packId, themeId, cellId);
    }

    _progressBarMoving(period) {
        return new Promise((resolve, reject) => {
            const period = 50;
            let width = 0;
            let barElem = document.getElementById("dynamic-bar");
            const interval = setInterval(() => {
                if (width >= 100) {
                    clearInterval(interval);
                    resolve("done");
                } else {
                    width++;
                    barElem.style.width = width + "%";
                }
            }, period);
        });
    }
}

export default new QuestionTableC();
