import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";

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

    _buttonPressed(){
        alert("Кнопка");
    }
}

export default new GamePanelC();
