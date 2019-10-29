import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import gameF from "../fasade/gameF.js";

class GamePanelC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.registerClassHandler(".game-panel-button", "click", this._buttonPressed);

    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }

    _buttonPressed(event){
        const string = document.getElementById("answer");
        if (string) {
            const answer = string.value;
            gameF.sendAnswer(answer);
        }
    }
}

export default new GamePanelC();
