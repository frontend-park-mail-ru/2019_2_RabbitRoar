import Template from "./templates/gamePanel.pug";
import GamePanelC from "../controller/gamePanelC.js";
import Bus from "../event_bus.js";
import GameF from "../fasade/gameF.js";

class GamePanelE {
    constructor() {
        this.controller = GamePanelC;
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