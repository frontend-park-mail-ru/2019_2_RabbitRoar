import { DomEventsWrapperMixin } from "../DomEventsWrapperMixin.js";

class QuestionTableC {
    constructor() {
        if (!!QuestionTableC.instance) {
            return QuestionTableC.instance;
        }
        QuestionTableC.instance = this;
        Object.assign(this, DomEventsWrapperMixin);

        this.registerClassHandler("question_container__cost", "click", this._choseQuestion);

        return this;
    }

    start() {
        this.enableAll();
    }

    drop() {
        this.disableAll();
    }

    _choseQuestion(){
        alert("Вопрос был выбран");
    }
}

export default new QuestionTableC();
