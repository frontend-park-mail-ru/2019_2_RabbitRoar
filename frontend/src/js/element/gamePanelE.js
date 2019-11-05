import Template from "./templates/gamePanel.pug";
import GamePanelC from "../controller/gamePanelC.js";
import ValidatorF from "../fasade/userValidatorF.js";
import Bus from "../event_bus.js";
import GameF from "../fasade/gameF.js";

class GamePanelE {
    constructor() {
        this.root = document.getElementById("application");
        this.controller = GamePanelC;
    }


    async create(root = document.getElementById("application")) {
        this.root = root;
        const currentUserData = await ValidatorF.getUserData();
        const authorized = ValidatorF.checkLocalstorageAutorization();
        
        console.log("СОЗДАНИЕ ПАНЕЛИ ИГРЫ", authorized);
        this.root.insertAdjacentHTML("beforeend", Template({userData: currentUserData, authorized: authorized}));
        this.controller.start();
        GameF.reincarnate();
    }

    destroy() {
        this.controller.drop();
        this.root.innerHTML = "";
        GameF.annihilate();
    }
}

export default new GamePanelE();