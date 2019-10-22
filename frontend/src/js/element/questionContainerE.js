import Template from "./templates/questionContainerT.pug";
import QuestionContainerC from "../controller/navbarC.js";

class QuestionContainerE {
    constructor() {
        this.controller = QuestionContainerC;
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

export default new QuestionContainerE();