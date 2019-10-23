import Template from "./templates/questionContainerT.pug";
import QuestionTableC from "../controller/questionsTableC.js";

class QuestionTableE {
    constructor() {
        if (!!QuestionTableE.instance) {
            return QuestionTableC.instance;
        }
        QuestionTableC.instance = this;
        this.controller = QuestionTableC;
        return this;
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