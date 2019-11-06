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
        let avatar;        
        const authorized = ValidatorF.checkLocalstorageAutorization();
        if (authorized === true) {
            currentUserData = await ValidatorF.getUserData();
            avatar = currentUserData.avatar_url;
        } else {
            avatar = ValidatorF.getDefaultAvatar();
        }
        this.root.insertAdjacentHTML("beforeend", Template({avatar: avatar, authorized: authorized}));
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