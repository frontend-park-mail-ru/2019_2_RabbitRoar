import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import GameF from "../fasade/gameF.js";


class QuestionTableC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.registerClassHandler(".question-container__cost", "click", this._choseQuestion);
    }

    startAllListeners = () => {
        this.gameIface = GameF.getInterface(this)();

        this.enableAll();
    }

    disableAllListeners = () => {
        this.disableAll();
    }

    _choseQuestion = (event) => {
        const packId = event.target.parentNode.parentNode.id;
        const cellId = event.target.id;
        this.gameIface.clickQuestion(packId, cellId);
    }
}

export default new QuestionTableC();
