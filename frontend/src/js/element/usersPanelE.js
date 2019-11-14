import Template from "./templates/usersPanelT.pug";
import ValidatorF from "../fasade/userValidatorF.js";
import UsersPanelC from "../controller/usersPanelC.js";

import GameF from "../fasade/gameF.js";

class UsersPanelE {
    constructor() {
        this.controller = UsersPanelC;
        return this;
    }

    async create(root = document.getElementById("application")) {        
        this.root = root;
        let currentUserData;
        const authorized = ValidatorF.checkLocalstorageAutorization();
        
        if (authorized === true) {
            currentUserData = await ValidatorF.getUserData();
            currentUserData.avatar_url = ValidatorF.getFullImageUrl(currentUserData.avatar_url);
        } else {
            const defaultAvavtar = ValidatorF.getDefaultAvatar();
            currentUserData = {username: "Anon", avatar_url: defaultAvavtar};
        }
        console.log(currentUserData);

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

export default new UsersPanelE();