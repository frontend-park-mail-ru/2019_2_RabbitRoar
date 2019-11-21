import Template from "./templates/editPackT.pug";
import EditPackC from "../controller/editPackC.js";

class EditPackE {
    constructor() {
        this.root = document.getElementById("application");
        this.controller = EditPackC;
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

export default new EditPackE();