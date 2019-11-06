import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import GameF from "../fasade/gameF.js";
import Bus from "../event_bus.js";
import { QUESTION_WAS_CHOSEN, TIMER_STOPPED, TIMER_INTERRUPTION } from "../modules/events.js";
import { replaceTwoCssClasses } from "../modules/css_operations";


class GamePanelC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
        this.abilityToEnterAnswer = false;

        this.registerHandler("changing-button", "click", this._buttonPressed.bind(this));
        document.addEventListener("keyup", this._answerEntered.bind(this));
        Bus.on(QUESTION_WAS_CHOSEN, this._startListenQuestion.bind(this));
        Bus.on(TIMER_STOPPED, this._stopListenQuestion.bind(this));
        Bus.on(TIMER_INTERRUPTION, this._stopListenQuestion.bind(this));

    }

    start() {
        this.gameIface = GameF.getInterface(this)();
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }

    _buttonPressed(event) {
        if (this.abilityToEnterAnswer) {
            const answer = document.getElementById("input-answer");
            const answerValue = answer.value;
            this.gameIface.sendAnswer(answerValue);
            answer.value = "";
        }
    }

    _startListenQuestion() {
        this.abilityToEnterAnswer = true;

        const inputAnswer = document.getElementById("input-answer");
        inputAnswer.style.visibility = "visible";
        inputAnswer.focus();

        const changingButton = document.getElementById("changing-button");
        replaceTwoCssClasses(changingButton, "game-panel-button-without-hover", "game-panel-button");
        changingButton.innerHTML = "Ответить";


    }

    _stopListenQuestion() {
        this.abilityToEnterAnswer = false;

        const answer = document.getElementById("input-answer");
        answer.style.visibility = "hidden";
        answer.value = "";

        const changingButton = document.getElementById("changing-button");
        replaceTwoCssClasses(changingButton, "game-panel-button", "game-panel-button-without-hover");
        changingButton.innerHTML = "Выберите вопрос";
    }

    _answerEntered(event) {
        if (this.abilityToEnterAnswer) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById("changing-button").click();
            }
        }
    }
}

export default new GamePanelC();
