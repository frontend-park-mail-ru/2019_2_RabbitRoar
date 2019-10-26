import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import GameF from "../fasade/gameF.js";
import ContentF from "../fasade/contentF.js";
import { replaceTwoCssClasses } from "../modules/css_operations";


class QuestionTableC {
    constructor() {
        QuestionTableC.instance = this;
        Object.assign(this, DomEventsWrapperMixin);

        this.registerClassHandler(".question-container__cost", "click", this._choseQuestion.bind(this));
    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }

    _choseQuestion(event) {
        const barElement = document.getElementById("progress-bar")
        replaceTwoCssClasses(barElement, "progress-bar-hidden", "progress-bar");
        //const dynamic = document.getElementsByClassName("dynamic-bar");
        this._progressBarMoving()
            .then((data) => { alert(data) })
            .catch((error) => { });
        // replaceTwoCssClasses(barElement, "progress-bar", "progress-bar-hidden");

        const packId = event.target.parentNode.parentNode.id;
        const themeId = event.target.parentNode.id;
        const cellId = event.target.id;

        // GameF.choseQuestion(packId, themeId, cellId);
    }

    _progressBarMoving(period) {
        return new Promise((resolve, reject) => {
            const period = 10;
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
