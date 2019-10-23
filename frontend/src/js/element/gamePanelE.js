import Template from "./templates/gamePanel.pug";
import GamePanelC from "../controller/gamePanelC.js";

class GamePanelE {
    constructor() {
        if (!!GamePanelE.instance) {
            return GamePanelE.instance;
        }
        GamePanelE.instance = this;
        this.controller = GamePanelC;
        return this;
    }

    create(root = document.getElementById("application")) {
        this.root = root;

        this.root.insertAdjacentHTML("beforeend", Template());
        this.controller.start();
    }

    destroy() {
        this.controller.drop();
        this.root.innerHTML = "";
    }
}

export default new GamePanelE();