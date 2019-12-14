import Template from "./templates/questionContainerT.pug";
import QuestionTableC from "../controller/questionsTableC.js";
import Bus from "../event_bus.js";
import GameF from "../fasade/gameF.js";
import { QUESTION_PANEL_UPDATE, TIMER_INTERRUPTION, TIMER_STOPPED } from "../modules/events.js";
import { replaceTwoCssClasses } from "../modules/css_operations";


class QuestionTableE {
    constructor() {
        this.root = document.getElementById("application");
        this.controller = QuestionTableC;
        this.progressBarInterrupt = false;
        this.timerIsWorking = false;

        Bus.on(TIMER_STOPPED, this._redraw);
        Bus.on(QUESTION_PANEL_UPDATE, this._redraw);
        Bus.on(TIMER_INTERRUPTION, this._interruptProgressBar);

    }

    _redraw = () => {
        this.destroy();
        this.create(this.root);
    }

    create = (root = document.getElementById("application")) => {
        this.gameIface = GameF.getInterface(this)();
        this.root = root;
        const state = this.gameIface.questionInfo();

        this.root.insertAdjacentHTML("beforeend", Template({ state }));
        this.controller.startAllListeners();


        for (const _id in state.chosedCells) {
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
                    this.timerIsWorking = false;
                })
                .catch((error) => { });
        } else {
            replaceTwoCssClasses(barElement, "progress-bar", "progress-bar-hidden");
        }
    }

    destroy = () => {
        if (this.timerIsWorking) {
            this.timerIsWorking = false;
            Bus.emit(TIMER_INTERRUPTION);
        }
        this.controller.disableAllListeners();
        this.root.innerHTML = "";
    }

    _interruptProgressBar = () => {
        this.progressBarInterrupt = true;
    }

    _progressBarMoving = () => {
        this.timerIsWorking = true;
        return new Promise((resolve, reject) => {
            const period = 4000;
            let width = 0;
            let barElem = document.getElementById("dynamic-bar");
            const interval = setInterval(() => {
                if (width >= 100) {
                    this.gameIface.sendAnswer();
                    this._interruptImmediatly(interval, resolve);
                } else if (this.progressBarInterrupt) {
                    console.log("interrupt in table");
                    this._interruptImmediatly(interval, resolve);
                } else {
                    width++;
                    barElem.style.width = width + "%";
                }
            }, period);
        });
    }

    _interruptImmediatly = (interval, resolve) => {
        this.progressBarInterrupt = false;
        clearInterval(interval);
        resolve("done");
    }
}

export default new QuestionTableE();