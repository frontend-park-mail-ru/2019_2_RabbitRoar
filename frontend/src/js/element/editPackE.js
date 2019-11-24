import Template from "./templates/editPackT.pug";
import EditPackC from "../controller/editPackC.js";
import ContentF from "../fasade/contentF.js";

class EditPackE {
    constructor() {
        this.root = document.getElementById("application");
        this.controller = EditPackC;
    }

    async create(root = document.getElementById("application")) {
        this.root = root;
        const packObj = ContentF.getCurrentPackForEditing();

        //const themesArray = [packObj.pack[0].name, packObj.pack[1].name, packObj.pack[2].name, packObj.pack[3].name, packObj.pack[4].name]
        this.root.insertAdjacentHTML("beforeend", Template({ packObj }));
        this.controller.startAllListeners();
    }

    destroy() {
        this.controller.disableAllListeners();
        this.root.innerHTML = "";
    }
}

export default new EditPackE();