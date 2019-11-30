import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import GameF from "../fasade/gameF.js";
import Bus from "../event_bus.js";
import { GAME_PANEL_STATE_CHANGE } from "../modules/events.js";
import { replaceTwoCssClasses } from "../modules/css_operations";


class GamePanelC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.registerHandler("changing-button", "click", this._buttonPressed);
        document.addEventListener("keyup", this._answerEntered);
    }

    startAllListeners = () => {
        this.gameIface = GameF.getInterface(this)();
        this.enableAll();
    }

    disableAllListeners = () => {
        this.disableAll();
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