import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import GameF from "../fasade/gameF.js";


class GamePanelC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.registerHandler("changing-button", "click", this._buttonPressed);
    }

    startAllListeners = () => {
        this.gameIface = GameF.getInterface(this)();
        this.enableAll();
        document.addEventListener("keyup", this._answerEntered);
    }

    disableAllListeners = () => {
        this.disableAll();
        document.removeEventListener("keyup", this._answerEntered);
    }

    _buttonPressed = (event) => {
        if (event.target.getAttribute("state") === "answer_race") {
            this.gameIface.race();
        } else if (event.target.getAttribute("state") === "selected") {
            const answer = document.getElementById("input-answer");
            const answerValue = answer.value;
            this.gameIface.sendAnswer(answerValue);
            answer.value = "";
        }
    }


    _answerEntered = (event) => {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("changing-button").click();
        }
    }
}

export default new GamePanelC();