import Template from "./templates/questionContainerT.pug";
import QuestionTableC from "../controller/questionsTableC.js";
import Bus from "../event_bus.js";
import GameF from "../fasade/gameF.js";
import { QUESTION_PANEL_UPDATE } from "../modules/events.js";

class QuestionTableE {
    constructor() {
        this.controller = QuestionTableC;

        Bus.on(QUESTION_PANEL_UPDATE, this._redraw.bind(this));
    }

    _redraw() {
        const info = GameF.getQuestionInfo();
        for (const key in info) {
            console.log(`${key}: ${info[key]}`);
        }
    }

    create(root = document.getElementById("application")) {
        this.root = root;

        this.root.insertAdjacentHTML("beforeend", Template());
        this.controller.start();
    }

    destroy() {
        this.controller.drop();
        this.root.innerHTML = "";
    }
}

export default new QuestionTableE();