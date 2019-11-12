import Template from "./templates/createPackT.pug";
import ValidatorF from "../fasade/userValidatorF.js";
import CreatePackC from "../controller/createPackC.js";

class CreatePackE {
    constructor() {
        this.root = document.getElementById("application");
        this.controller = CreatePackC;
    }

    async create(root = document.getElementById("application")) {
        this.root = root;
        this.root.insertAdjacentHTML("beforeend", Template({}));
        this.controller.start();
    }

    destroy() {
        this.controller.drop();
        this.root.innerHTML = "";
    }
}

export default new CreatePackE();