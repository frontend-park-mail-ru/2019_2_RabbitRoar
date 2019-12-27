import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import GameF from "../fasade/gameF.js";
import Bus from "../event_bus.js";
import { GAME_PANEL_STATE_CHANGE, TIMER_STOPPED, TIMER_INTERRUPTION } from "../modules/events.js";
import { replaceTwoCssClasses } from "../modules/css_operations";


class GamePanelC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
        this.abilityToEnterAnswer = false;

        this.registerHandler("changing-button", "click", this._buttonPressed);
    }

    startAllListeners = () => {
        this.gameIface = GameF.getInterface(this)();
        this.enableAll();
        document.addEventListener("keyup", this._answerEntered);
        Bus.on(GAME_PANEL_STATE_CHANGE, this._startListenQuestion);
        Bus.on(TIMER_STOPPED, this._stopListenQuestion);
        Bus.on(TIMER_INTERRUPTION, this._stopListenQuestion);
    }

    disableAllListeners = () => {
        this.disableAll();
        document.removeEventListener("keyup", this._answerEntered);
        Bus.off(GAME_PANEL_STATE_CHANGE, this._startListenQuestion);
        Bus.off(TIMER_STOPPED, this._stopListenQuestion);
        Bus.off(TIMER_INTERRUPTION, this._stopListenQuestion);
    }

    _buttonPressed = (event) => {
        if (this.abilityToEnterAnswer) {
            const answer = document.getElementById("input-answer");
            const answerValue = answer.value;
            this.gameIface.sendAnswer(answerValue);
            answer.value = "";
        }
    }

    _startListenQuestion = (state) => {
        this.abilityToEnterAnswer = true;

        if (state === "selected") {
            const inputAnswer = document.getElementById("input-answer");
            inputAnswer.style.visibility = "visible";
            inputAnswer.focus();
        } else {
            const inputAnswer = document.getElementById("input-answer");
            inputAnswer.style.visibility = "hidden";
        }


        const changingButton = document.getElementById("changing-button");
        replaceTwoCssClasses(changingButton, "game-panel-button-without-hover", "game-panel-button");
        changingButton.value = "Ответить";
    }

    _stopListenQuestion = () => {
        this.abilityToEnterAnswer = false;

        const answer = document.getElementById("input-answer");
        answer.style.visibility = "hidden";
        answer.value = "";

        const changingButton = document.getElementById("changing-button");
        replaceTwoCssClasses(changingButton, "game-panel-button", "game-panel-button-without-hover");
        changingButton.value = "Выберите вопрос";
    }

    _answerEntered = (event) => {
        if (this.abilityToEnterAnswer) {
            if (event.keyCode === 13) {
                event.preventDefault();
                document.getElementById("changing-button").click();
            }
        }
    }
}

export default new GamePanelC();
