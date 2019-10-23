import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";

class GamePanelC {
    constructor() {
        if (!!GamePanelC.instance) {
            return GamePanelC.instance;
        }
        GamePanelC.instance = this;
        Object.assign(this, DomEventsWrapperMixin);

        this.registerClassHandler(".game-panel-button", "click", this._buttonPressed);

        return this;
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
