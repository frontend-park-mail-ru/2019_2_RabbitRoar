import Template from "./templates/navbarT.pug";
import ValidatorF from "../fasade/userValidatorF.js";
import NavbarC from "../controller/navbarC.js";

class NavbarE {
    constructor() {
        this.root = document.getElementById("application");
        NavbarE.instance = this;
        this.controller = NavbarC;
    }

    create(root = document.getElementById("application")) {
        this.root = root;

        const autorised = ValidatorF.getUserAutorise();

        this.root.insertAdjacentHTML("beforeend", Template({ autorised: autorised }));
        this.controller.start();
    }



    destroy() {
        this.controller.drop();
        this.root.innerHTML = "";
    }
}

export default new NavbarE();