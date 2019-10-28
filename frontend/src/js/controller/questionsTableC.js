import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";
import GameF from "../fasade/gameF.js";



class QuestionTableC {
    constructor() {
        QuestionTableC.instance = this;
        Object.assign(this, DomEventsWrapperMixin);

        this.registerClassHandler(".question_container__cost", "click", this._choseQuestion);
    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }

    _choseQuestion(event) {
        const packId = event.target.parentNode.parentNode.id;
        const themeId = event.target.parentNode.id;
        const cellId = event.target.id;

        // GameF.clickQuestion(packId, themeId, cellId);
    }
}

export default new QuestionTableC();
