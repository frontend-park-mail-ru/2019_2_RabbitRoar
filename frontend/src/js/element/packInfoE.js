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
        
        // if (authorized === true) {
        //     currentUserData = await ValidatorF.getUserData();
        //     currentUserData.avatar_url = ValidatorF.getFullImageUrl(currentUserData.avatar_url);
        // } else {
        //     const defaultAvavtar = ValidatorF.getDefaultAvatar();
        //     currentUserData = {username: "Anon", avatar_url: defaultAvavtar};
        // }
        
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