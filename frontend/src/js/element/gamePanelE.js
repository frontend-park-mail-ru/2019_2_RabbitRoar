import Template from "./templates/gamePanel.pug";
import GamePanelC from "../controller/gamePanelC.js";
import ValidatorF from "../fasade/userValidatorF.js";

class GamePanelE {
    constructor() {
        this.root = document.getElementById("application");
        this.controller = GamePanelC;
    }


    create(root = document.getElementById("application")) {
        this.root = root;

        const defaultAvavtar = ValidatorF.getDefaultAvatar();
        let currentUserData = {username: "Anon", avatar_url: defaultAvavtar};
        
        const authorized = ValidatorF.checkLocalstorageAutorization();
        if (authorized === true) {
            ValidatorF.getUserData().then(
                (data) => {
                    currentUserData = data;
                    currentUserData.avatar_url = ValidatorF.getFullImageUrl(currentUserData.avatar_url);
                }
            ).finally(
                () => {
                    this.root.insertAdjacentHTML("beforeend", Template({ userData: currentUserData}));
                    this.controller.start();
                }
            );
        } else {
            this.root.insertAdjacentHTML("beforeend", Template({ userData: currentUserData}));
            this.controller.start();
        }
    }

    destroy() {
        this.controller.drop();
        this.root.innerHTML = "";
    }
}

export default new GamePanelE();