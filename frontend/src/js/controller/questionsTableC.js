import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import GameF from "../fasade/gameF.js";


class QuestionTableC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.registerClassHandler(".question-container__cost", "click", this._choseQuestion);
        this.registerClassHandler(".verdict-button", "click", this._sendVerdict);
    }

    _sendVerdict = (event) => {
        if (event.target.id === "verdict_false") {
            this.gameIface.sendVerdict(false);
        } else if (event.target.id === "verdict_true") {
            this.gameIface.sendVerdict(true);
        }
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
        const themeId = event.target.parentNode.id;
        this.gameIface.clickQuestion(packId, cellId, themeId);
    }
}

export default new QuestionTableC();
