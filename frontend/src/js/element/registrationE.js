import Template from "./templates/registrationT.pug";
import RegistrationC from "../controller/registrationC.js";

class RegistrationE {
    constructor() {
        this.controller = RegistrationC;
        return this;
    }

    create = (root = document.getElementById("application")) => {
        this.root = root;
        this.root.insertAdjacentHTML("beforeend", Template());
        this.controller.start();
    }


    destroy = () => {
        this.controller.drop();
        this.root.innerHTML = "";
    }

    _restartListener = () => {
        this.destroy();
        this.create(this.root);
    }
}

export default new RegistrationE();