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

        ValidatorF.getUserData().then(
            (data) => {
                this.root.insertAdjacentHTML("beforeend", Template({ userData: data }));
                this.controller.start();
            }
        ).catch(
            (err) => console.log(err)
        );
    }


    destroy() {
        this.controller.drop();
        this.root.innerHTML = "";
    }
}

export default new GamePanelE();