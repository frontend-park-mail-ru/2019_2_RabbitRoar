import Template from "./templates/questionContainerT.pug";
import QuestionTableC from "../controller/questionsTableC.js";
import Bus from "../event_bus.js";
import GameF from "../fasade/gameF.js";
import { QUESTION_PANEL_UPDATE } from "../modules/events.js";
import { replaceTwoCssClasses } from "../modules/css_operations";


class QuestionTableE {
    constructor() {
        this.controller = QuestionTableC;

        Bus.on(QUESTION_PANEL_UPDATE, this._redraw.bind(this));
    }

    _redraw() {
        this.destroy();
        this.create(this.root);
    }

    create(root = document.getElementById("application")) {
        this.root = root;

        const state = GameF.getQuestionInfo();

        this.root.insertAdjacentHTML("beforeend", Template({ state }));
        this.controller.start();


        const chosedId = GameF.getLastClickedCells();
        for (const _id in chosedId) {
            const lastClick = document.getElementById(_id);
            if (lastClick) {
                replaceTwoCssClasses(lastClick, "question-container__cost", "question-container__cost_chosen");
            }
        }
        

        const barElement = document.getElementById("progress-bar");
        if (state.mode === "selected") {
            replaceTwoCssClasses(barElement, "progress-bar-hidden", "progress-bar");

            this._progressBarMoving()
                .then((data) => { })
                .catch((error) => { });
        } else {
            replaceTwoCssClasses(barElement, "progress-bar", "progress-bar-hidden");
        }
    }

    destroy() {
        this.controller.drop();
        this.root.innerHTML = "";
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

export default new QuestionTableE();