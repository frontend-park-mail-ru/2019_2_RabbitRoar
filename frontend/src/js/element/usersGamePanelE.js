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
        const host = this.gameIface.getHost();
        const amount = currentPlayers.length;

        const currentPlayersMap = {}
        for (let i = 0; i < amount; i++) {
            const order = currentPlayers[i].getAttribute("order");
            currentPlayersMap[order] = currentPlayers[i];
        }

        for (let i = 0; i < amount; i++) {
            if (currentPlayersMap[i].id === playersState.active.toString()) {
                currentPlayersMap[i].classList.add("waiting-player-game-active");
                currentPlayersMap[i].classList.remove("waiting-player-game-passive");
            } else {
                currentPlayersMap[i].classList.remove("waiting-player-game-active");
                currentPlayersMap[i].classList.add("waiting-player-game-passive");
            }

            if (currentPlayersMap[i].id === host.id.toString()) {
                const image = document.createElement("IMG");
                image.src =  StaticManager.hostIcon;
                image.alt = "User";
                image.id = "hostIcon";
                image.classList.add("navbar__user-logo");
                currentPlayersMap[i].children[0].insertAdjacentElement("beforeend", image);
            }

            currentPlayersMap[i].children[3].innerHTML = playersState.players[i].score;
        }

    }


    create = (root = document.getElementById("application")) => {
        this.root = root;
        this.gameIface = GameF.getInterface(this)();

        const players = this.gameIface.getPlayers();
        const leaveLogo = StaticManager.leaveLogo;
        // const gameInfo = this.gameIface.getGameInfo();


        this.root.insertAdjacentHTML("beforeend", Template({
            players: players,
            leaveLogo: leaveLogo,
        }));
        this.controller.startAllListeners();
    }


    destroy = () => {
        this.controller.disableAllListeners();
        this.root.innerHTML = "";
    }
}

export default new UsersGamePanelE();