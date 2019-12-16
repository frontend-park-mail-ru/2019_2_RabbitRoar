import Template from "./templates/usersPanelT.pug";
import ValidatorF from "../fasade/userValidatorF.js";
import UsersPanelC from "../controller/usersPanelC.js";
import GameF from "../fasade/gameF.js";
import Bus from "../event_bus.js";

import { USER_PANEL_NEW_USER, USER_PANEL_USER_READY } from "../modules/events.js";
import { LINK_JOIN, HttpsOriginNoApi } from "../paths";
import { replaceTwoCssClasses } from "../modules/css_operations";

import StaticManager from "../modules/staticManager.js"

const MOKiface = {
    getPlayers() {
        const capacity = 4;
        const players = new Array;

        for (let i = 0; i < capacity; i++) {
            players.push({
                id: -i,
                username: "Empty" + i,
                avatar: StaticManager.getUserUrl(),
                score: 0,
                ready: false
            });
        }
        return players;
    },

    getRoomInfo() {
        return {};
    },
}

class UsersPanelE {
    constructor() {
        this.controller = UsersPanelC;

    }

    _changeUserIndicator = (userId, ready) => {
        const userElem = document.getElementById(userId);
        const indicatorElem = userElem.children[2];
        if (ready) {
            replaceTwoCssClasses(indicatorElem, "users-panel__ready-indicator__false", "users-panel__ready-indicator__true");
        } else {
            replaceTwoCssClasses(indicatorElem, "users-panel__ready-indicator__true", "users-panel__ready-indicator__false");
        }
    }

    _readyChange = (players) => {
        players.forEach(player => {
            this._changeUserIndicator(player.id, player.ready);
        });

    }

    _updatePlayers = (players) => {
        const currentPlayers = document.querySelectorAll(".waiting-player");
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


    _insertCell(player, container) {
        container.id = player.id;

        container.children[1].children[0].children[0].src = player.avatar;
        container.children[1].children[1].innerHTML = player.username;
        this._changeUserIndicator(player.id, player.ready);
    }


    _reRender = () => {
        this.destroy();
        this.create(this.root);
    }




    create = (root = document.getElementById("application")) => {
        this.root = root;
        this.gameIface = GameF.getInterface(this)();
        Bus.on(USER_PANEL_NEW_USER, this._updatePlayers);
        Bus.on(USER_PANEL_USER_READY, this._readyChange);
        //this.gameIface = MOKiface;

        const players = this.gameIface.getPlayers();
        const leaveLogo = StaticManager.leaveLogo;
        const roomInfo = this.gameIface.getRoomInfo();
        const userName = ValidatorF.getCurrentUsername();

        this.root.insertAdjacentHTML("beforeend", Template({
            players: players,
            leaveLogo: leaveLogo,
            roomName: roomInfo.name,
            userName: userName,
            roomURL: window.location.origin + LINK_JOIN + "?UUID=" + roomInfo.UUID // Заменить origin
        }));
        this.controller.startAllListeners();
    }


    destroy = () => {
        Bus.off(USER_PANEL_NEW_USER, this._updatePlayers);
        Bus.off(USER_PANEL_USER_READY, this._readyChange);
        this.controller.disableAllListeners();
        this.root.innerHTML = "";
    }
}

export default new UsersPanelE();