import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import GameF from "../fasade/gameF.js";
import Bus from "../event_bus.js";
import { QUESTION_WAS_CHOSEN, TIMER_STOPPED } from "../modules/events.js";


class GamePanelC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
        this.iface = GameF.gamePanelCInterface;
        this.abilityToEnterAnswer = false;
        this.registerClassHandler(".game-panel-button", "click", this._buttonPressed.bind(this));
        document.addEventListener("keyup", this._answerEntered.bind(this));
        Bus.on(QUESTION_WAS_CHOSEN, this._startListenQuestion.bind(this));
        Bus.on(TIMER_STOPPED, this._stopListenQuestion.bind(this));
    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }

    _buttonPressed(event) {
        if (this.abilityToEnterAnswer) {
            const answer = document.getElementById("answer");
            const answerValue = answer.value;
            this.iface.sendAnswer(answerValue);
            answer.value = "";
        }
    }

    _startListenQuestion() {
        this.abilityToEnterAnswer = true;
    }

    _stopListenQuestion() {
        this.abilityToEnterAnswer = false;
        const answer = document.getElementById("answer");
        // Вопрос не отправили, нужно снять очки
        //this.iface.sendAnswer("");
        answer.value = "";
    }

    _answerEntered(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("game-panel-button").click();
        }
    }
}

export default new GamePanelC();
