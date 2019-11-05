import Template from "./templates/usersPanelT.pug";
import Bus from "../event_bus.js";
import ValidatorF from "../fasade/userValidatorF.js";
import UsersPanelC from "../controller/usersPanelC.js";


class UsersPanelE {
    constructor() {
        if (!!UsersPanelE.instance) {
            return UsersPanelE.instance;
        }
        UsersPanelE.instance = this;
        this.controller = UsersPanelC;


        return this;
    }

    async create(root = document.getElementById("application")) {
        this.root = root;
        const currentUserData = await ValidatorF.getUserData();
        
        const authorized = ValidatorF.checkLocalstorageAutorization();

        console.log("СОЗДАНИЕ ПАНЕЛИ ЮЗЕРОВ", authorized);
        this.root.insertAdjacentHTML("beforeend", Template({userData: currentUserData, authorized: authorized}));
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

export default new UsersPanelE();