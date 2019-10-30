import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import GameF from "../fasade/gameF.js";

class GamePanelC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);
        this.iface = GameF.gamePanelCInterface;

        this.registerClassHandler(".game-panel-button", "click", this._buttonPressed.bind(this));

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
            this.iface.sendAnswer(answer);
        }
    }
}

export default new GamePanelC();
