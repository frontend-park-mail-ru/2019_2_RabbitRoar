import Template from "./templates/usersGamePanelT.pug";
import UsersGamePanelC from "../controller/usersGamePanelC.js";
import GameF from "../fasade/gameF.js";
import Bus from "../event_bus.js";

import StaticManager from "../modules/staticManager.js";

import { USERS_PANEL_UPDATE } from "../modules/events.js";

const MOKiface = {
    getPlayers() {
        const capacity = 4;
        const players = new Array;

        for (let i = 0; i < capacity; i++) {
            players.push({
                id: i,
                username: "Empty" + i,
                avatar: StaticManager.getUserUrl(),
                score: 0,
                ready: false
            });
        }
        return players;
    },
    getHost() {
        return {
            id: 0,
            username: "Empty" + 0,
            avatar: StaticManager.getUserUrl(),
            score: 0,
            ready: false
        };
    },
};

class UsersGamePanelE {
    constructor() {
        Bus.on(USERS_PANEL_UPDATE, this._update);
        this.controller = UsersGamePanelC;
    }


    _update = (playersState) => {
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

            if ((currentPlayersMap[i].id === host.id.toString())
            && (currentPlayersMap[i].children[0].children.length === 0)) {
                const image = document.createElement("IMG");
                image.src =  StaticManager.hostIcon;
                image.alt = "User";
                image.id = "hostIcon";
                image.classList.add("users-panel__icon-img");
                currentPlayersMap[i].children[0].insertAdjacentElement("beforeend", image);
            }

            currentPlayersMap[i].children[3].innerHTML = playersState.players[i].score;
        }

    }


    create = (root = document.getElementById("application")) => {
        this.root = root;
        this.gameIface = GameF.getInterface(this)();
        //this.gameIface = MOKiface;

        const players = this.gameIface.getPlayers();
        const leaveLogo = StaticManager.leaveLogo;


        this.root.insertAdjacentHTML("beforeend", Template({
            players: players,
            leaveLogo: leaveLogo,
        }));

        // this._update({
        //     active: 0,
        //     players: players
        // });

        this.controller.startAllListeners();
    }


    destroy = () => {
        this.controller.disableAllListeners();
        this.root.innerHTML = "";
    }
}

export default new UsersGamePanelE();