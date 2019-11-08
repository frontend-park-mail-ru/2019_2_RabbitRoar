import Template from "./templates/navbarT.pug";
import ValidatorF from "../fasade/userValidatorF.js";
import NavbarC from "../controller/navbarC.js";

class NavbarE {
    constructor() {
        this.root = document.getElementById("application");
        NavbarE.instance = this;
        this.controller = NavbarC;
    }

    async create(root = document.getElementById("application")) {
        this.root = root;

        let avatar;
        const authorized = ValidatorF.checkLocalstorageAutorization();

        if (authorized === true) {
            const currentUserData = await ValidatorF.getUserData();
            avatar = ValidatorF.getFullImageUrl(currentUserData.avatar_url);
        }
        this.root.insertAdjacentHTML("beforeend", Template({ authorized: authorized, avatar: avatar }));
        this.controller.start();
    }



    destroy() {
        this.controller.drop();
        this.root.innerHTML = "";
    }
}

export default new NavbarE();