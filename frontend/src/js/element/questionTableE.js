import Template from "./templates/questionContainerT.pug";
import QuestionTableC from "../controller/questionsTableC.js";
import Bus from "../event_bus.js";
import GameF from "../fasade/gameF.js";
import { QUESTION_PANEL_UPDATE, TIMER_INTERRUPTION, TIMER_STOPPED } from "../modules/events.js";
import { replaceTwoCssClasses } from "../modules/css_operations";
import gameF from "../fasade/gameF.js";


class QuestionTableE {
    constructor() {
        this.root = document.getElementById("application");
        this.controller = QuestionTableC;
        this.progressBarInterrupt = false;
        Bus.on(TIMER_STOPPED, this._redraw.bind(this));
        Bus.on(QUESTION_PANEL_UPDATE, this._redraw.bind(this));
        Bus.on(TIMER_INTERRUPTION, this._interruptProgressBar.bind(this));

    }

    _redraw() {
        this.destroy();
        this.create(this.root);
    }

    create(root = document.getElementById("application")) {
        this.gameIface = GameF.getInterface(this)();
        this.root = root;
        const state = this.gameIface.questionInfo();

        this.root.insertAdjacentHTML("beforeend", Template({ state }));
        this.controller.start();

        const chosedId = this.gameIface.lastClickedCells();
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
                .then((data) => {
                })
                .catch((error) => { });
        } else {
            replaceTwoCssClasses(barElement, "progress-bar", "progress-bar-hidden");
        }
        GameF.reincarnate();
    }

    destroy() {
        this.controller.drop();
        this.root.innerHTML = "";
        GameF.annihilate();
    }

    _interruptProgressBar() {
        this.progressBarInterrupt = true;
    }

    _progressBarMoving(period) {
        return new Promise((resolve, reject) => {
            const period = 200;
            let width = 0;
            let barElem = document.getElementById("dynamic-bar");
            const interval = setInterval(() => {
                if (width >= 100) {
                    this.gameIface.stopTimer();
                    clearInterval(interval);
                    resolve("done");
                } else if (this.progressBarInterrupt) {
                    this.progressBarInterrupt = false;
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