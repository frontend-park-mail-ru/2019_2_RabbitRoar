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

        this.pointsTicker;

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

        console.log(state.correctAnswer);

        this.root.insertAdjacentHTML("beforeend", Template({ state }));
        this.controller.startAllListeners();

        this._checkWait();


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

    _checkWait = () => {
        const waitInput = document.getElementById("wait_input");
        if (waitInput) {
            const maxPoints = 3;
            const baseStr = waitInput.innerHTML;
            let addStr = "";
            this.pointsTicker = setInterval( () => {
                waitInput.innerHTML = baseStr.concat(addStr);
                if (addStr.length === maxPoints) {
                    addStr = "";
                } else {
                    addStr += ".";
                }
            }, 400);
        }
    }

    destroy = () => {
        clearInterval(this.pointsTicker);
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
        const answerTime = 15 * 1000;
        const period = 10;
        const stepAmount = answerTime / period;
        const step = 100 / stepAmount;       // % на 1 шаг

        let R1 = 0;
        let R2 = 255;
        let G1 = 255;
        let G2 = 0;
        let B1 = 49;
        let B2 = 0;

        const dR = -((R1 - R2) / stepAmount);
        const dG = -((G1 - G2) / stepAmount);
        const dB = -((B1 - B2) / stepAmount);

        this.timerIsWorking = true;
        return new Promise((resolve, reject) => {
            let width = 0;
            let barElem = document.getElementById("dynamic-bar");
            const interval = setInterval(() => {
                if (width >= 100) {
                    this.gameIface.sendAnswer();
                    this._interruptImmediatly(interval, resolve);
                } else if (this.progressBarInterrupt) {
                    this._interruptImmediatly(interval, resolve);
                } else {
                    width += step;
                    R1 += dR;
                    G1 += dG;
                    //B2 += dB;
                    barElem.style.width = width + "%";
                    barElem.style.backgroundColor = `rgba(${R1},${G1},${B1},${1})`;
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