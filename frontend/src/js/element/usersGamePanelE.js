import Template from "./templates/usersGamePanelT.pug";
import UsersGamePanelC from "../controller/usersGamePanelC.js";
import GameF from "../fasade/gameF.js";
import Bus from "../event_bus.js";

import StaticManager from "../modules/staticManager.js";


import { USERS_PANEL_UPDATE } from "../modules/events.js";

class UsersGamePanelE {
    constructor() {
        Bus.on(USERS_PANEL_UPDATE, this._update);
        this.controller = UsersGamePanelC;
    }


    _update = (playersState) => {
        console.log(playersState);
        const currentPlayers = document.querySelectorAll(".waiting-player-game");
        const amount = currentPlayers.length;

        const currentPlayersMap = {}
        for (let i = 0; i < amount; i++) {
            const order = currentPlayers[i].getAttribute("order");
            currentPlayersMap[order] = currentPlayers[i];
        }

        for (let i = 0; i < amount; i++) {
            console.log(`${currentPlayersMap[i].id} === ${playersState.active}`)
            if (currentPlayersMap[i].id === playersState.active.toString()) {
                currentPlayersMap[i].classList.add("waiting-player-game-active");
                currentPlayersMap[i].classList.remove("waiting-player-game-passive");
            } else {
                currentPlayersMap[i].classList.remove("waiting-player-game-active");
                currentPlayersMap[i].classList.add("waiting-player-game-passive");
            }
            currentPlayersMap[i].children[2].innerHTML = playersState.players[i].score;
        }

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