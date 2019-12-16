import Template from "./templates/gamePanel.pug";
import GamePanelC from "../controller/gamePanelC.js";
import ValidatorF from "../fasade/userValidatorF.js";
import GameF from "../fasade/gameF.js";

import Bus from "../event_bus.js";
import { GAME_PANEL_UPDATE } from "../modules/events.js";


class GamePanelE {
    constructor() {
        this.root = document.getElementById("application");
        this.controller = GamePanelC;

        Bus.on(GAME_PANEL_UPDATE, this._update);
    }

    _update = () => {
        ValidatorF.getUserData().then(
            (data) => {
                const score = this.gameIface.getScoreById(data.ID);
                const scoreElem = document.getElementById("score");
                if (scoreElem) {
                    scoreElem.innerHTML = score;
                }
            }
        ).catch(
            // (err) => console.log(err)
        );
    }

    create(root = document.getElementById("application")) {
        this.root = root;
        this.gameIface = GameF.getInterface(this)();

        ValidatorF.getUserData().then(
            (data) => {
                this.root.insertAdjacentHTML("beforeend", Template({ userData: data }));
                this.controller.startAllListeners();
            }
        ).catch(
            // (err) => console.log(err)
        );
    }


    destroy() {
        this.controller.disableAllListeners();
        this.root.innerHTML = "";
    }
}

export default new GamePanelE();