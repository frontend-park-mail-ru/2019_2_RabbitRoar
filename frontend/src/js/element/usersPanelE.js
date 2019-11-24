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
        this.gameIface = GameF.getInterface(this)();
        const roomState = this.gameIface.getRoomState();
        //const players = this.gameIface.getPlayers();
        const roomInfo = this.gameIface.getRoomInfo();
        console.log(roomInfo);

        return;
    }

    _reRender = () => {
        this.destroy();
        this.create(this.root);
    }

    create = async (root = document.getElementById("application")) => {
        this.root = root;

        const currentUserData = await ValidatorF.getUserData();
        this.root.insertAdjacentHTML("beforeend", Template({
            userData: currentUserData,
        }));
        this.controller.startAllListeners();
    }

    _restartListener = () => {
        this.destroy();
        this.create(this.root);
    }

    destroy = () => {
        this.controller.disableAllListeners();
        this.root.innerHTML = "";
    }
}

export default new UsersPanelE();