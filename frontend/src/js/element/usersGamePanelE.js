import Template from "./templates/usersGamePanelT.pug";
import UsersGamePanelC from "../controller/usersGamePanelC.js";
import GameF from "../fasade/gameF.js";
import Bus from "../event_bus.js";

import StaticManager from "../modules/staticManager.js";

import { USERS_PANEL_UPDATE, USER_PANEL_NEW_USER } from "../modules/events.js";

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
        this.controller = UsersGamePanelC;
    }


    _insertCell(player, container) {
        container.id = player.id;

        container.children[1].src = player.avatar;
        container.children[2].innerHTML = player.username;
    }

    _updatePlayers = (players) => {
        const currentPlayers = document.querySelectorAll(".waiting-player-game");
        const host = this.gameIface.getHost();

        const currentPlayersMap = {}
        for (let i = 0; i < currentPlayers.length; i++) {
            const order = currentPlayers[i].getAttribute("order");
            currentPlayersMap[order] = currentPlayers[i];
        }

        const diff = currentPlayers.length - players.length;
        for (let i = 0; i < diff; i++) {
            players.push({
                id: -i,
                username: "Empty" + i,
                avatar: StaticManager.getUserUrl(),
                score: 0,
                ready: false
            });
        }


        let order = 0;
        debugger;
        for (const player of players) {
            if (player.id.toString() === currentPlayersMap[order].id) {
            } else {
                this._insertCell(player, currentPlayersMap[order]);
            }

            const iconContainer = currentPlayersMap[order].children[0];
            if (player.id === host.id) {
                if (iconContainer.children.length === 0) {
                    const image = document.createElement("IMG");
                    image.src = StaticManager.hostIcon;
                    image.alt = "User";
                    image.id = "hostIcon";
                    image.classList.add("users-panel__icon-img");
                    currentPlayersMap[order].children[0].insertAdjacentElement("beforeend", image);
                }
            } else {
                const img = document.getElementById("hostIcon");
                if (iconContainer.children.length > 0) {
                    for (const child of iconContainer.children) {
                        iconContainer.removeChild(child);
                    }
                }
            }
            order++;
        }
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
                image.src = StaticManager.hostIcon;
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
        Bus.on(USERS_PANEL_UPDATE, this._update);
        Bus.on(USER_PANEL_NEW_USER, this._updatePlayers);
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
        Bus.off(USERS_PANEL_UPDATE, this._update);
        Bus.off(USER_PANEL_NEW_USER, this._updatePlayers);
        this.controller.disableAllListeners();
        this.root.innerHTML = "";
    }
}

export default new UsersGamePanelE();