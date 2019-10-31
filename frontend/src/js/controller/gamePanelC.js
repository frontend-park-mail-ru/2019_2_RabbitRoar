import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import GameF from "../fasade/gameF.js";

class GamePanelC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
        this.iface = GameF.gamePanelCInterface;
        this.registerClassHandler(".game-panel-button", "click", this._buttonPressed.bind(this));
        document.addEventListener("keyup", this._answerEntered.bind(this));
       // this.registerClassHandler(".game-panel-button", "keyup", this._answerEntered.bind(this));
    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }

    _buttonPressed(event) {
        const answer = document.getElementById("answer");
        const answerValue = answer.value;
        this.iface.sendAnswer(answerValue);
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
