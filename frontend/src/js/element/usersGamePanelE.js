import Template from "./templates/usersGamePanelT.pug";
import UsersGamePanelC from "../controller/usersGamePanelC.js";
import GameF from "../fasade/gameF.js";
import Bus from "../event_bus.js";

import StaticManager from "../modules/staticManager.js";


import { USERS_PANEL_UPDATE, USER_PANEL_NEW_USER, USER_PANEL_USER_READY } from "../modules/events.js";

class UsersGamePanelE {
    constructor() {
        this.controller = UsersGamePanelC;
    }

    create = (root = document.getElementById("application")) => {
        this.root = root;
        this.gameIface = GameF.getInterface(this)();

        const players = this.gameIface.getPlayers();
        // const gameInfo = this.gameIface.getGameInfo();


        this.root.insertAdjacentHTML("beforeend", Template({
            players: players,
        }));
        this.controller.startAllListeners();
    }


    destroy = () => {
        this.controller.disableAllListeners();
        this.root.innerHTML = "";
    }
}

export default new UsersGamePanelE();