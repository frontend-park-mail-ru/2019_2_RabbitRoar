import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import GameF from "../fasade/gameF.js";
import Bus from "../event_bus.js";
import { ROUTER_EVENT } from "../modules/events.js";
import { ROOT } from "../paths";
import { GAME_PANEL_STATE_CHANGE, TIMER_STOPPED, TIMER_INTERRUPTION } from "../modules/events.js";
import { replaceTwoCssClasses } from "../modules/css_operations";


class GamePanelC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
        this.abilityToEnterAnswer = false;

        this.registerHandler("changing-button", "click", this._buttonPressed);
        document.addEventListener("keyup", this._answerEntered);
        Bus.on(GAME_PANEL_STATE_CHANGE, this._startListenQuestion);
        Bus.on(TIMER_STOPPED, this._stopListenQuestion);
        Bus.on(TIMER_INTERRUPTION, this._stopListenQuestion);

    }

    startAllListeners = () => {
        this.gameIface = GameF.getInterface(this)();
        this.enableAll();
    }

    disableAllListeners = () => {
        this.disableAll();
    }

    _buttonPressed = (event) => {
        if (this.abilityToEnterAnswer) {
            const answer = document.getElementById("input-answer");
            const answerValue = answer.value;
            this.gameIface.sendAnswer(answerValue);
            answer.value = "";
        }
    }

    _startListenQuestion = () => {
        this.abilityToEnterAnswer = true;

        const inputAnswer = document.getElementById("input-answer");
        inputAnswer.style.visibility = "visible";
        inputAnswer.focus();

        const changingButton = document.getElementById("changing-button");
        replaceTwoCssClasses(changingButton, "game-panel-button-without-hover", "game-panel-button");
        changingButton.innerHTML = "Ответить";


    }

    _stopListenQuestion = () => {
        this.abilityToEnterAnswer = false;

        const answer = document.getElementById("input-answer");
        answer.style.visibility = "hidden";
        answer.value = "";

        const changingButton = document.getElementById("changing-button");
        replaceTwoCssClasses(changingButton, "game-panel-button", "game-panel-button-without-hover");
        changingButton.innerHTML = "Выберите вопрос";
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
