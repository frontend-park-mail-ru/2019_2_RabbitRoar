import Template from "./templates/packInfoT.pug";
import ValidatorF from "../fasade/userValidatorF.js";
import PackInfoC from "../controller/packInfoC.js";


class PackInfoE {
    constructor() {
        if (!!PackInfoE.instance) {
            return PackInfoE.instance;
        }
        PackInfoE.instance = this;
        this.controller = PackInfoC;


        return this;
    }

    async create(root = document.getElementById("application")) {
        
        this.root = root;
        let currentUserData;
                
        this.root.insertAdjacentHTML("beforeend", Template({ userData: currentUserData}));

        this.controller.start();
    }

    _restartListener() {
        this.destroy();
        this.create(this.root);
    }

    destroy() {
        this.controller.drop();
        this.root.innerHTML = "";
    }
}

export default new PackInfoE();