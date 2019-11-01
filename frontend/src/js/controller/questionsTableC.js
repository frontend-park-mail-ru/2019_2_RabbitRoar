import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import GameF from "../fasade/gameF.js";
import ContentF from "../fasade/contentF.js";
import { replaceTwoCssClasses } from "../modules/css_operations";


class QuestionTableC {
    constructor() {
        Object.assign(this, DomEventsWrapperMixin);

        this.registerClassHandler(".question-container__cost", "click", this._choseQuestion.bind(this));
    }

    start() {
        this.gameIface = GameF.getInterface(this)();

        this.enableAll();
    }

    drop() {
        this.disableAll();
    }

    _choseQuestion(event) {
        const packId = event.target.parentNode.parentNode.id;
        const cellId = event.target.id;
        this.gameIface.clickQuestion(packId, cellId);
    }


}

export default new QuestionTableC();
