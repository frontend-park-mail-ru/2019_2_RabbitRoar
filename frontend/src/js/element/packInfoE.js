import Template from "./templates/packInfoT.pug";
import ValidatorF from "../fasade/userValidatorF.js";
import PackInfoC from "../controller/packInfoC.js";
import GameF from "../fasade/gameF.js";


class PackInfoE {
    constructor() {
        this.controller = PackInfoC;
    }

    async create(root = document.getElementById("application")) {
        
        this.root = root;
        const packName = GameF.getPackName();
        this.root.insertAdjacentHTML("beforeend", Template({packName: packName}));

        this.controller.startAllListeners();
    }

    _restartListener() {
        this.destroy();
        this.create(this.root);
    }

    destroy() {
        this.controller.disableAllListeners();
        this.root.innerHTML = "";
    }
}

export default new PackInfoE();