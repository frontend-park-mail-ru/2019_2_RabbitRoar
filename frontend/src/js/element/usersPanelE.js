import Template from "./templates/usersPanelT.pug";
import ValidatorF from "../fasade/userValidatorF.js";
import UsersPanelC from "../controller/usersPanelC.js";

import GameF from "../fasade/gameF.js";

import Bus from "../event_bus.js";
import { USERS_PANEL_UPDATE } from "../modules/events.js";

class UsersPanelE {
    constructor() {
        this.controller = UsersPanelC;
        Bus.on(USERS_PANEL_UPDATE, this._update);
    }

    _update = () => {
        const roomState = this.gameIface.getRoomState();

        if (roomState === "before_connection") {
            this._reRender();
            return;
        }
        console.log(roomInfo);

        return;
    }

    _reRender = () => {
        this.destroy();
        this.create(this.root);
    }


    create = (root = document.getElementById("application")) => {
        this.root = root;
        this.gameIface = GameF.getInterface(this)();

        const players = this.gameIface.getPlayers();
        const roomInfo = this.gameIface.getRoomInfo();
        
        this.root.insertAdjacentHTML("beforeend", Template({
            players: players,
            room: roomInfo
        }));
        this.controller.startAllListeners();
    }


    destroy = () => {
        this.controller.disableAllListeners();
        this.root.innerHTML = "";
    }
}

export default new UsersPanelE();