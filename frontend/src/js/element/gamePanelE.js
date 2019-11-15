import Template from "./templates/gamePanel.pug";
import GamePanelC from "../controller/gamePanelC.js";
import ValidatorF from "../fasade/userValidatorF.js";

class GamePanelE {
    constructor() {
        this.root = document.getElementById("application");
        this.controller = GamePanelC;
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
        
        this.root.insertAdjacentHTML("beforeend", Template({ userData: currentUserData}));
        this.controller.start();
    }

    destroy() {
        this.controller.drop();
        this.root.innerHTML = "";
    }
}

export default new GamePanelE();