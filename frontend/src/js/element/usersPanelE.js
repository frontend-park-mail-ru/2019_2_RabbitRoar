import Template from "./templates/usersPanelT.pug";
import ValidatorF from "../fasade/userValidatorF.js";
import UsersPanelC from "../controller/usersPanelC.js";

import GameF from "../fasade/gameF.js";

import Bus from "../event_bus.js";
import { USERS_PANEL_UPDATE, USER_PANEL_NEW_USER, USER_PANEL_USER_READY } from "../modules/events.js";

class UsersPanelE {
    constructor() {
        this.controller = UsersPanelC;
        Bus.on(USERS_PANEL_UPDATE, this._update);
        Bus.on(USER_PANEL_NEW_USER, this._updatePlayers);
        Bus.on(USER_PANEL_USER_READY, this._readyChange);
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

    _updatePlayers = (message) => {
        const currentPlayers = document.querySelectorAll(".waiting-player");

        const currentPlayersMap = {}
        for (let i = 0; i < currentPlayers.length; i++) {
            const order = currentPlayers[i].getAttribute("order");
            currentPlayersMap[order] = currentPlayers[i];
        }

        let order = 0;
        for (const player of message.payload.players) {
            if (player.id === currentPlayersMap[order].id) {
            } else {
                insert(player, currentPlayersMap[order]);
            }
            order++;
        }
    }

	// "players": [
    //     {
    //         "id": "int",
    //         "username": "string",
    //         "avatar": "string",
    //         "score": "int",
    //         "ready": bool
    //     }
    // ]

    _insertCell(player, container) {
        container.id = player.id;
        for(let i = 0; i < container.children.length; i++) {
            if (container.children[i].getAttribute["name"] === "avatar") {
                container.children[i].src = player.avatar;
            } else if (container.children[i].getAttribute["name"] === "username") {
                container.children[i].innerHTML = player.username;
            }
        }
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